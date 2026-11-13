# English edition validation

Validated on November 12, 2026 (America/Los_Angeles).

This edition translates the complete coaching workflow, supporting references, user documentation, offline interface, reports, and demonstration explanations into English. The original Chinese edition remains available separately.

## Checks completed

- Skill structure validation passed with the name `exam-study-coach-en`, valid frontmatter, and no unfinished entrypoint scaffolding.
- All 11 existing builder behavioral checks passed against the English builder: question formats, answer indexes, source references, duplicates, time budgets, zero-question recap, safe JSON embedding, and template marker handling.
- All 9 existing webpage state checks passed after adapting their labels to English: choice scoring, duplicate-submit protection, separate short-answer self-assessment, mistake resolution and reopening, fixed mock deadlines, backup merge and round trip, invalid-backup rejection, complete reports, and zero-question recap.
- All 30 demo question stems, options, answer keys, IDs, scoring fields, timing estimates, pool assignments, and source statuses match the Chinese edition. Explanations, option feedback, and all 10 review cards are translated.
- The demo was rebuilt from its English JSON and English template. The executable JavaScript passed syntax checking. The template and generated demo contain no external scripts, stylesheets, embedded frames, or network-request APIs.
- All files in the English distribution were scanned for Chinese text, and local documentation links and packaged file contents were checked before upload.

The text limits for English recap cards are expanded to keep comparable content readable. Topic ranking, the six-topic maximum, scoring, and progress formats are unchanged. The English demo uses its own pack ID so that it cannot accidentally restore a Chinese demo backup.

## Reproduce the behavioral checks

From the repository root:

```text
python qa/test_builder_en.py
node qa/test_app_en.cjs
python exam-study-coach-en/scripts/build_study_pack.py --data exam-study-coach-en/examples/swe113-demo.json --validate-only
```

The two regression suites live in the repository's `qa/` directory and are not required to use the downloadable skill ZIP. Python 3 and Node.js are sufficient; those suites use their standard libraries only.

## Limits

The webpage tests run actual application functions and event handlers inside a Node VM with simulated DOM and storage. They verify state behavior, not real-browser layout, printing, download prompts, or every browser's handling of local HTML files. Real-browser visual and interaction verification was unavailable in this session; it is not claimed as completed.

The original lecture slides, Study Guide, and Canvas quizzes were not supplied. Demo slide references and course-specific conclusions remain unverified. Translation and structural validation do not independently establish the correctness of subject answers. Practice and mock exams share the demo's 30 questions, so its scores are not an assessment on unseen questions or a prediction of real exam performance.

The offline HTML does not call an AI service. Coaching quality and file-handling capabilities depend on the AI platform used to generate a new pack. More detailed personalized analysis requires returning a study report to an AI with the relevant materials.
