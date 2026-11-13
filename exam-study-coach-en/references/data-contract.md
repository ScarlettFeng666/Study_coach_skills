# Offline study-pack data contract (schema_version = 1)

Read this file when writing questions. Use UTF-8 JSON without comments. Supply every required field; unused lists are `[]` and unused strings are `""`. A complete working example is in `examples/swe113-demo.json`. All text is displayed as plain text; formulas can use Unicode or readable text notation.

## Top-level fields

| Field | Type | Meaning |
| --- | --- | --- |
| schema_version | Integer | Always 1 |
| pack_id | String | Stable course/exam identity, such as `swe113-exam1-en-v1`; a data fingerprint also isolates previous progress after questions change |
| title / subtitle | Strings | Page title and exam scope |
| language | String | For example, `en`; questions can retain the official exam language |
| notice | String | Material gaps, inferences, shared question pools, and other disclosures |
| plan | Object | Time allocation; see below |
| sources | Array of objects | At least one; source inventory |
| topics | Array of objects | At least one; topics and review cards |
| questions | Array of objects | May be empty for recap-only review; normally contains practice and mock questions |

Every `id` and `pack_id` uses 1–96 ASCII letters, digits, periods, hyphens, or underscores, starting with a letter or digit. IDs must be unique within each array. Display names can use any supported language.

For `plan`, `total_minutes` is positive; `practice_minutes`, `mock_minutes`, and `review_minutes` are nonnegative and their sum cannot exceed the total. `rationale` explains assumptions, question counts, per-question answer and explanation times, post-mock review, and the final recap allocation. `estimated_seconds` means independent answer time only, not total work including feedback. AI checks the feasibility of question counts and time; the builder only validates structure and total time. Use 0 for mock time when there is no mock.

## sources

Each item is `{id, label, status, detail}`.

- `verified`: material actually read and located. Give the filename and page, chapter, or question number in `detail`.
- `unverified`: a user's account, a reference in an old webpage, or inaccessible original text. Do not relabel it as verified.
- `general`: explicitly labeled general-knowledge practice when course materials are unavailable. Do not claim that it matches the instructor's conventions.

Each question/topic has a nonempty `source_ids` string array referencing these IDs. Sources may identify a specific page or question. A student's old answers and another AI's answers are not verified answer keys. Reading an old HTML file does not verify the slides it cites.

## topics

Every item must contain:

```json
{
  "id": "topic-1",
  "title": "Topic name",
  "summary": "A concise, self-contained explanation in about one to three sentences.",
  "pitfalls": ["A commonly confused distinction or mistake"],
  "recall_prompt": "An active-recall question to answer in one sentence before revealing the explanation.",
  "quick_tip": "A brief decision rule for the final recap, without substituting keywords for understanding.",
  "source_ids": ["source-1"]
}
```

Write review cards in advance. The webpage reorders them using actual mistakes; it does not call AI to write answers. If there are many cards, the five-minute page shows a prioritized excerpt and identifies it as such.

## questions

Every item must contain:

```json
{
  "id": "q-001",
  "topic_id": "topic-1",
  "type": "single",
  "prompt": "Which statement is correct?",
  "options": ["Option A", "Option B"],
  "answer": [0],
  "explanation": "Why the answer is correct, its conditions, and relevant concept boundaries.",
  "option_explanations": ["Why A is correct", "The misconception behind B"],
  "reference_answer": "",
  "rubric": [],
  "difficulty": "medium",
  "estimated_seconds": 75,
  "source_ids": ["source-1"],
  "origin": "generated",
  "pool": "practice"
}
```

- `single`: at least two distinct options; `answer` contains exactly one zero-based index.
- `multiple`: at least two options; `answer` contains all correct option indexes, at least one, with no duplicates. The webpage scores exact matches, without partial credit.
- `short`: `options`, `answer`, and `option_explanations` are all `[]`; `reference_answer` supplies the reference response and `rubric` contains at least one scoring point. Students self-assess against these criteria. Self-assessment is reported separately from objective accuracy.
- For choice questions, `option_explanations` matches the number of options and every item gives an actual reason; `reference_answer` is `""` and `rubric` is `[]`.
- `difficulty` is `easy`, `medium`, or `hard`; `estimated_seconds` is a finite number at least 1.
- `origin` is `provided` for an unchanged supplied question, `adapted` for an adaptation, or `generated` for a new question. Origin does not establish authoritative answer verification.
- `pool` is `practice`, `mock`, or `both`. If any question is `mock` or `both`, `plan.mock_minutes` must exceed 0. Without a mock, all questions use `practice`. Prefer independent practice and mock pools. `both` means the student may have seen mock questions; disclose this in `notice` and do not describe it as an independent assessment.
- Assign each question one primary topic for statistics. Explanations may mention related topics in integrated questions.

## Build and acceptance

Run from the skill directory; elsewhere, use resolved absolute paths:

```text
python scripts/build_study_pack.py --data my-pack.json --validate-only
python scripts/build_study_pack.py --data my-pack.json --output study.html
```

Only the Python standard library is required; no API key is needed. The builder checks fields, IDs, indexes, references, duplicate prompts, time totals, and related constraints, then safely embeds the data. It cannot verify subject-matter correctness. Open the generated result in a browser to check answering, the mistake notebook, mock submission, persistence across refresh, report export, and recap. If execution is unavailable, state that it has not run. Generated code is not proof of testing.

Browser progress JSON and study reports are not question-bank JSON and cannot be passed to the builder. Use them to restore the same bank's progress or return to AI for analysis.
