"""Behavioral checks for the distributable pack builder (no external dependencies)."""
import copy
import importlib.util
import json
import math
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("builder", ROOT / "exam-study-coach-en/scripts/build_study_pack.py")
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


def minimal():
    return {
        "schema_version": 1, "pack_id": "unit-test", "title": "Test", "subtitle": "",
        "language": "zh-CN", "notice": "", "plan": {"total_minutes": 10,
        "practice_minutes": 5, "mock_minutes": 3, "review_minutes": 2, "rationale": "Test"},
        "sources": [{"id": "s", "label": "Fixture", "status": "general", "detail": "Test data"}],
        "topics": [{"id": "t", "title": "Topic", "summary": "Summary", "pitfalls": ["Trap"],
                    "recall_prompt": "Recall?", "quick_tip": "Tip", "source_ids": ["s"]}],
        "questions": [{"id": "q", "topic_id": "t", "type": "single", "prompt": "Which?",
        "options": ["A", "B"], "answer": [0], "explanation": "Because", "option_explanations":
        ["Correct", "Wrong"], "reference_answer": "", "rubric": [], "difficulty": "easy",
        "estimated_seconds": 60, "source_ids": ["s"], "origin": "generated", "pool": "both"}]}


class BuilderTests(unittest.TestCase):
    def invalid(self, mutate):
        pack = minimal()
        mutate(pack)
        with self.assertRaises(builder.PackError):
            builder.validate_pack(pack)

    def test_single_and_multiple(self):
        pack = minimal()
        builder.validate_pack(pack)
        pack["questions"][0].update(type="multiple", answer=[0, 1])
        builder.validate_pack(pack)

    def test_short_is_self_grading_compatible(self):
        pack = minimal()
        pack["questions"][0].update(type="short", options=[], answer=[], option_explanations=[],
                                    reference_answer="Expected", rubric=["Main criterion"])
        builder.validate_pack(pack)
        self.invalid(lambda p: p["questions"][0].update(type="short"))

    def test_cram_only_valid(self):
        pack = minimal()
        pack["questions"] = []
        pack["plan"].update(total_minutes=4, practice_minutes=0, mock_minutes=0, review_minutes=4)
        warnings = builder.validate_pack(pack)
        self.assertTrue(any("no questions" in w for w in warnings))

    def test_rejects_invalid_scoring(self):
        for answer in ([2], [-1], [True], [0, 0], [], [0, 1]):
            with self.subTest(answer=answer):
                self.invalid(lambda p: p["questions"][0].update(answer=answer))

    def test_rejects_broken_sources_and_topics(self):
        self.invalid(lambda p: p["questions"][0].update(source_ids=["missing"]))
        self.invalid(lambda p: p["questions"][0].update(source_ids=[]))
        self.invalid(lambda p: p["questions"][0].update(topic_id="missing"))

    def test_duplicates_rejected(self):
        self.invalid(lambda p: p["questions"].append(copy.deepcopy(p["questions"][0])))
        self.invalid(lambda p: p["sources"].append(copy.deepcopy(p["sources"][0])))
        def duplicate_stem(pack):
            q = copy.deepcopy(pack["questions"][0])
            q.update(id="q2", prompt="  WHICH? ")
            pack["questions"].append(q)
        self.invalid(duplicate_stem)

    def test_time_is_finite_nonnegative_and_in_budget(self):
        self.invalid(lambda p: p["plan"].update(total_minutes=9))
        self.invalid(lambda p: p["plan"].update(mock_minutes=-1))
        self.invalid(lambda p: p["plan"].update(total_minutes=math.inf))
        self.invalid(lambda p: p["questions"][0].update(estimated_seconds=math.nan))

    def test_mock_pool_requires_positive_deadline(self):
        self.invalid(lambda p: p["plan"].update(mock_minutes=0))
        pack = minimal()
        pack["plan"]["mock_minutes"] = 0
        pack["questions"][0]["pool"] = "practice"
        builder.validate_pack(pack)

    def test_question_feedback_must_be_complete(self):
        self.invalid(lambda p: p["questions"][0].update(option_explanations=["Only one"]))
        self.invalid(lambda p: p["questions"][0].update(options=["same", "same"]))

    def test_embedding_neutralizes_script_terminator_and_preserves_text(self):
        pack = minimal()
        pack["title"] = '</script><script>alert("x")</script> & \u2028 学习'
        html = builder.build_html(pack, '<script type="application/json">__STUDY_PACK_JSON__</script>')
        payload = html.split(">", 1)[1].rsplit("<", 1)[0]
        self.assertNotIn("</script>", payload)
        self.assertNotIn("<", payload)
        self.assertEqual(json.loads(payload), pack)

    def test_template_contract(self):
        for template in ("missing", "__STUDY_PACK_JSON____STUDY_PACK_JSON__"):
            with self.assertRaises(builder.PackError):
                builder.build_html(minimal(), template)


if __name__ == "__main__":
    unittest.main()
