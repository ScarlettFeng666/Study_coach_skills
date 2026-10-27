#!/usr/bin/env python3
"""Validate a study-pack JSON and embed it in the offline HTML template. Stdlib only."""

import argparse
import json
import math
import re
import sys
from pathlib import Path

TOKEN = "__STUDY_PACK_JSON__"
IDENTIFIER = re.compile(r"[A-Za-z0-9][A-Za-z0-9_.-]{0,95}\Z")


class PackError(ValueError):
    pass


def require(condition, message):
    if not condition:
        raise PackError(message)


def obj(value, path):
    require(isinstance(value, dict), f"{path}: expected an object")
    return value


def string(value, path, empty=False):
    require(isinstance(value, str) and (empty or bool(value.strip())),
            f"{path}: expected {'a' if empty else 'a nonempty'} string")
    return value


def identifier(value, path):
    string(value, path)
    require(IDENTIFIER.fullmatch(value) is not None,
            f"{path}: use 1-96 ASCII letters, digits, dots, hyphens or underscores")
    return value


def number(value, path, minimum=0):
    require(type(value) in (int, float) and math.isfinite(value) and value >= minimum,
            f"{path}: expected a finite number >= {minimum}")
    return value


def sequence(value, path, nonempty=False):
    require(isinstance(value, list) and (not nonempty or bool(value)),
            f"{path}: expected {'a nonempty' if nonempty else 'an'} array")
    return value


def strings(value, path, nonempty=False):
    sequence(value, path, nonempty)
    for i, item in enumerate(value):
        string(item, f"{path}[{i}]")
    return value


def unique_records(records, path):
    sequence(records, path, nonempty=True)
    found = set()
    for i, record in enumerate(records):
        obj(record, f"{path}[{i}]")
        value = identifier(record.get("id"), f"{path}[{i}].id")
        require(value not in found, f"{path}: duplicate id {value}")
        found.add(value)
    return found


def source_refs(record, path, known):
    refs = strings(record.get("source_ids"), f"{path}.source_ids", nonempty=True)
    require(len(refs) == len(set(refs)), f"{path}.source_ids: duplicate reference")
    require(set(refs) <= known, f"{path}.source_ids: unknown source")


def validate_pack(pack):
    """Return nonfatal authoring warnings; raise PackError for invalid input."""
    obj(pack, "pack")
    require(type(pack.get("schema_version")) is int and pack["schema_version"] == 1,
            "schema_version: expected integer 1")
    identifier(pack.get("pack_id"), "pack_id")
    for key in ("title", "language"):
        string(pack.get(key), key)
    for key in ("subtitle", "notice"):
        string(pack.get(key), key, empty=True)
    plan = obj(pack.get("plan"), "plan")
    number(plan.get("total_minutes"), "plan.total_minutes", minimum=0.01)
    for key in ("practice_minutes", "mock_minutes", "review_minutes"):
        number(plan.get(key), f"plan.{key}")
    require(sum(plan[key] for key in ("practice_minutes", "mock_minutes", "review_minutes"))
            <= plan["total_minutes"] + 0.001,
            "plan: practice + mock + review exceeds total_minutes")
    string(plan.get("rationale"), "plan.rationale")

    sources = pack.get("sources")
    source_ids = unique_records(sources, "sources")
    for i, source in enumerate(sources):
        path = f"sources[{i}]"
        string(source.get("label"), f"{path}.label")
        string(source.get("detail"), f"{path}.detail")
        require(source.get("status") in ("verified", "unverified", "general"),
                f"{path}.status: expected verified, unverified or general")
    topics = pack.get("topics")
    topic_ids = unique_records(topics, "topics")
    for i, topic in enumerate(topics):
        path = f"topics[{i}]"
        for key in ("title", "summary", "recall_prompt", "quick_tip"):
            string(topic.get(key), f"{path}.{key}")
        strings(topic.get("pitfalls"), f"{path}.pitfalls", nonempty=True)
        source_refs(topic, path, source_ids)

    questions = sequence(pack.get("questions"), "questions")
    question_ids = set()
    stems = set()
    warnings = []
    for i, question in enumerate(questions):
        path = f"questions[{i}]"
        obj(question, path)
        qid = identifier(question.get("id"), f"{path}.id")
        require(qid not in question_ids, f"{path}.id: duplicate id {qid}")
        question_ids.add(qid)
        require(question.get("topic_id") in topic_ids, f"{path}.topic_id: unknown topic")
        string(question.get("prompt"), f"{path}.prompt")
        stem = " ".join(question["prompt"].lower().split())
        require(stem not in stems, f"{path}.prompt: duplicate question stem")
        stems.add(stem)
        require(question.get("type") in ("single", "multiple", "short"),
                f"{path}.type: expected single, multiple or short")
        options = strings(question.get("options"), f"{path}.options")
        answer = sequence(question.get("answer"), f"{path}.answer")
        explanations = strings(question.get("option_explanations"),
                               f"{path}.option_explanations")
        string(question.get("explanation"), f"{path}.explanation")
        string(question.get("reference_answer"), f"{path}.reference_answer", empty=True)
        rubric = strings(question.get("rubric"), f"{path}.rubric")
        if question["type"] == "short":
            require(not options and not answer and not explanations,
                    f"{path}: short question requires empty options, answer and option_explanations")
            require(bool(question["reference_answer"].strip()) and bool(rubric),
                    f"{path}: short question needs reference_answer and rubric")
        else:
            require(len(options) >= 2, f"{path}.options: need at least two options")
            require(len(set(options)) == len(options), f"{path}.options: duplicate options")
            require(len(explanations) == len(options),
                    f"{path}.option_explanations: one explanation per option required")
            require(all(type(a) is int and 0 <= a < len(options) for a in answer),
                    f"{path}.answer: indices must be zero-based integers within options")
            require(len(set(answer)) == len(answer), f"{path}.answer: duplicate index")
            require(len(answer) == 1 if question["type"] == "single" else bool(answer),
                    f"{path}.answer: single needs exactly one; multiple needs at least one")
            require(not question["reference_answer"] and not rubric,
                    f"{path}: choice questions require empty reference_answer and rubric")
        require(question.get("difficulty") in ("easy", "medium", "hard"),
                f"{path}.difficulty: expected easy, medium or hard")
        number(question.get("estimated_seconds"), f"{path}.estimated_seconds", minimum=1)
        require(question.get("origin") in ("adapted", "generated", "provided"),
                f"{path}.origin: expected adapted, generated or provided")
        require(question.get("pool") in ("practice", "mock", "both"),
                f"{path}.pool: expected practice, mock or both")
        source_refs(question, path, source_ids)
    require(plan["mock_minutes"] > 0 or not any(q["pool"] in ("mock", "both") for q in questions),
            "plan.mock_minutes: mock/both question pools require a positive mock time")
    if any(source["status"] == "unverified" for source in sources):
        warnings.append("Some source claims are unverified; keep that visible to students.")
    if any(q["pool"] == "both" for q in questions):
        warnings.append("Practice and mock share questions; mock is not an unseen assessment.")
    if plan["mock_minutes"] > 0 and not any(q["pool"] in ("mock", "both") for q in questions):
        warnings.append("Mock time reserved but no mock questions exist.")
    untested = topic_ids - {q["topic_id"] for q in questions}
    if untested:
        warnings.append(f"{len(untested)} topic(s) have review cards but no questions; report as untested.")
    return warnings


def build_html(pack, template):
    validate_pack(pack)
    require(template.count(TOKEN) == 1, f"template: expected exactly one {TOKEN}")
    payload = json.dumps(pack, ensure_ascii=False, allow_nan=False, separators=(",", ":"))
    # Escape HTML-sensitive characters even inside application/json to prevent closing script tags.
    for char, escaped in (("&", "\\u0026"), ("<", "\\u003c"), (">", "\\u003e"),
                          ("\u2028", "\\u2028"), ("\u2029", "\\u2029")):
        payload = payload.replace(char, escaped)
    return template.replace(TOKEN, payload)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", required=True, type=Path, help="UTF-8 study pack JSON")
    parser.add_argument("--output", type=Path, help="Output single HTML file")
    parser.add_argument("--validate-only", action="store_true")
    parser.add_argument("--template", type=Path,
                        default=Path(__file__).resolve().parents[1] / "assets" / "study-template.html")
    args = parser.parse_args()
    try:
        pack = json.loads(args.data.read_text(encoding="utf-8-sig"))
        warnings = validate_pack(pack)
        for warning in warnings:
            print(f"NOTE: {warning}")
        if not args.validate_only:
            require(args.output is not None, "--output is required unless --validate-only is used")
            require(args.output.resolve() not in (args.data.resolve(), args.template.resolve()),
                    "--output must not overwrite the input data or template")
            html = build_html(pack, args.template.read_text(encoding="utf-8"))
            args.output.parent.mkdir(parents=True, exist_ok=True)
            args.output.write_text(html, encoding="utf-8")
            print(f"BUILT: {args.output.resolve()}")
        print(f"VALID: {len(pack['questions'])} questions, {len(pack['topics'])} topics")
    except (OSError, ValueError, TypeError, KeyError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
