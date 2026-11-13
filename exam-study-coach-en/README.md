# Exam Study Coach — English edition

Let's get ready for your exam! 📚 This guided preparation conversation takes you from gathering materials to practice and review, one step at a time.

**Upload the skill package, send the starting prompt, and stay in the same chat to answer the AI's questions.** It will ask what exam you are preparing for, what course materials and examples you have, and how much time you can study this session. It then builds a downloadable practice webpage. Open the file in a browser to practice, review mistakes, take a mock exam, revisit weak areas, and read a final five-minute recap.

**[Download the complete English skill package](https://github.com/ScarlettFeng666/Study_coach_skills/raw/refs/heads/main/downloads/exam-study-coach-en.zip)** · **[First-time user guide](USER_GUIDE.md)** · **[Full starting prompt](START_PROMPT.txt)** · **[Chinese edition](https://github.com/ScarlettFeng666/Study_coach_skills)**

Want to try the practice tools first? [Download the English SWE113 demonstration](https://github.com/ScarlettFeng666/Study_coach_skills/raw/refs/heads/main/exam-study-coach-en/examples/SWE113-study-demo-en.html) and open it in your browser. It uses an existing question bank; it will not automatically become a bank for your own course.

## Start in four steps

1. **Download the skill package.** Use the complete ZIP link above. Gather any exam scope or study guide, slides or notes, past tests, and class quizzes. Missing materials are fine; tell the AI.
2. **Give it to AI.** Choose an AI that can read attachments and produce downloadable files. Open a new chat, upload the entire `exam-study-coach-en.zip`, and send the prompt below.
3. **Answer in the same chat.** The AI first explains the conversation, then asks progressively about scope, materials, examples, and total session study time. Upload materials in batches when asked. You do not need to extract the concepts yourself or fill in a full questionnaire at once.
4. **Download your study webpage.** Once available materials and gaps are recorded, the AI plans the question count and delivers `study.html`. Download it to your computer and open it in a browser. An attachment preview inside a chat may not support all interactions.

After uploading the ZIP, send:

```text
Read SKILL.md in the attached skill package and its supporting files as needed. Act as my exam study coach.

For the first greeting, explain that I will stay in this chat and answer your questions step by step, supplying exam scope, course materials, examples, and total available study time, to receive a downloadable practice webpage.
After the introduction, ask only the first missing question. Do not ask again for information already provided. I can upload materials in batches; record and disclose gaps.

Include answering, explanations, and mistake review in my time budget. Use the bundled template to generate a downloadable offline study.html with practice, a mistake notebook, a timed mock, weak areas, and a final five-minute recap.
If you cannot read files or generate attachments, state the specific limitation rather than claiming completion. If I already have a report or only five minutes remain, resume review directly.
```

A normal first turn explains how to participate, then asks something like "Which exam are you preparing for?" Continue answering in the same chat. Time means **total available study time this session**, including answering, explanations, and review. Question counts vary with time and format; they are not always 30.

If the AI cannot read ZIP files, [follow step 2 of the user guide](USER_GUIDE.md#2-give-the-skill-to-ai-and-send-the-starting-prompt) to extract and supply the necessary files. Pasting a GitHub link alone does not guarantee the AI can read the complete package.

## Study with your generated webpage

Start with `06 Sources & plan` to check scope and source disclosures, then:

| Goal | Action |
| --- | --- |
| Practice and read explanations | Answer in `01 Practice`, then choose `Check answer`; choose `Try again` to repeat |
| Work through mistakes | In `02 Mistake notebook`, choose `Retry this question`; two consecutive correct retries resolve an item while preserving history |
| Take a timed check | In `03 Timed mock exam`, choose the question count and start; after submission, open the attempt's review |
| Find what needs review | Read coverage, error records, and recall prompts in `04 Weak areas`; untested content does not establish mastery |
| Review before the exam | In `05 Final 5 minutes`, recall first, then read rules and confusing distinctions; up to six prioritized topics form an excerpt |

Mock duration is preset by the pack and cannot be paused. Refreshing or closing the webpage does not stop the timer. If you switch to another learning mode inside the page during a mock and confirm leaving, the mock submits immediately; unanswered items are incorrect. Short answers require **self-assessment** against reference criteria and are reported separately from objective accuracy.

The offline webpage organizes records and review cards. For deeper explanations, new variants, or a refreshed recap, export `Study report .md` or `Study report .json`, send it back to AI, and say how much time remains. For example:

```text
Here is my study report. I have 20 minutes left. Identify the topics most in need of review using actual mistakes and question IDs, explain the concept boundaries, and provide a few targeted practice items.
Distinguish wrong objective answers, unsuccessful short-answer self-assessments, and untested content. State uncertainty about the cause of a mistake.
```

## Reports and progress backups have different purposes

| Export | Purpose |
| --- | --- |
| `Study report .md` / `Study report .json` | Give AI the questions, attempts, reference answers, and source status for analysis and explanations |
| `Back up progress JSON` | Save answers, mistake history, and practice drafts; use `Restore progress` with the **same pack and content version** |
| `Export this recap` | Save the final five-minute review separately |

After each session, save **both the original HTML and a progress backup**. Local storage is not cloud sync. Switching devices or browsers, moving the file, or clearing browser data can affect persistence. If AI modifies or regenerates the bank, old backups may be incompatible. Reports cannot substitute for backups.

## Try the existing SWE113 demonstration

[Download SWE113-study-demo-en.html](https://github.com/ScarlettFeng666/Study_coach_skills/raw/refs/heads/main/exam-study-coach-en/examples/SWE113-study-demo-en.html), or open `examples/SWE113-study-demo-en.html` in the extracted package.

**GitHub's HTML file view displays source code.** Download the finished file and open it in a browser. The demonstration works offline without dependencies and contains 30 SWE113 questions for trying practice, mistakes, mocks, weak areas, and recap cards.

For an initial check: deliberately answer one question incorrectly → open the mistake notebook → retry correctly twice → take and submit a one-question mock → export progress and a report separately. This checks the webpage experience. To try the full preparation conversation, follow the four steps above and generate a pack for your own exam.

## Sources and limitations

The workflow comes from a real preparation session. It generalizes the method of defining scope, providing materials, budgeting time, practicing, and reviewing mistakes; it is not restricted to one course, question count, or single-choice format.

The demonstration reuses 30 example questions from that SWE113 session. Original slides are not included, so slide references and page numbers are **unverified**. Practice and mocks share the demonstration's question bank; results after seeing the questions are not unseen-question assessment. Prefer independent pools for your own course.

Check questions and reference answers against course materials. The webpage does not automatically verify subject knowledge. With missing materials, AI should identify general practice and claims that remain unverified.

Generated webpages run locally, make no AI or external API calls, and do not upload study materials. How your AI platform handles uploaded course materials and reports depends on that platform. Attachment reading, file generation, and execution capabilities vary; native skill support and identical results across AI systems are not guaranteed.

The English edition provides English instructions, documentation, builder messages, interface text, and demonstration explanations. Coaching, explanations, and review cards default to English unless you request another language; question wording follows the official exam language.

## Share feedback

[Open an issue](https://github.com/ScarlettFeng666/Study_coach_skills/issues) with the AI you used, the step where you got stuck, the message you saw, and relevant question IDs or screenshots. A relevant source excerpt helps verify disputed answers. Remove personal information before posting.

## Modify or build a pack yourself

Everyday use does not require installing Python first. The following is for maintaining the bank, editing the template, or building manually.

### Package contents

| File | Purpose |
| --- | --- |
| [USER_GUIDE.md](USER_GUIDE.md) | Complete instructions and troubleshooting |
| [START_PROMPT.txt](START_PROMPT.txt) | Full copyable AI starting prompt |
| [SKILL.md](SKILL.md) | AI entrypoint and workflow |
| [references/learning-workflow.md](references/learning-workflow.md) | Intake, time estimates, question-writing, and review rules |
| [references/data-contract.md](references/data-contract.md) | Question-bank fields, sources, and scoring conventions |
| [assets/study-template.html](assets/study-template.html) | Interactive template without external dependencies; not a ready-to-use study pack |
| [scripts/build_study_pack.py](scripts/build_study_pack.py) | Validate data and build a single HTML file |
| [examples/swe113-demo.json](examples/swe113-demo.json) | Thirty-question demonstration data |
| [examples/SWE113-study-demo-en.html](examples/SWE113-study-demo-en.html) | Built English demonstration |
| [agents/openai.yaml](agents/openai.yaml) | Display metadata for platforms that support it |
| [ACCEPTANCE.md](ACCEPTANCE.md) | English edition validation record and limitations |

### Manual build

Python 3 is required; the builder uses only the standard library. From the extracted skill directory:

```text
python scripts/build_study_pack.py --data examples/swe113-demo.json --validate-only
python scripts/build_study_pack.py --data examples/swe113-demo.json --output examples/SWE113-study-demo-en.html
```

For another exam, ask AI for new JSON following `references/data-contract.md`, then point `--data` to it. Structural validation checks the contract, not subject-matter answers. Verify questions against course materials separately.

### Platform compatibility and alternative delivery

If a platform natively supports Agent Skills, load the entire folder using its normal method. Copying only `SKILL.md` loses the template, contract, and builder. Otherwise, provide the package as workflow instructions and templates.

If AI cannot unzip the archive, extract it locally and supply `SKILL.md`, `references/learning-workflow.md`, `references/data-contract.md`, `assets/study-template.html`, and `scripts/build_study_pack.py`. Include original paths when attachments do not preserve folders.

With text-only AI, ask for contract-compliant JSON and build the HTML yourself. Alternatively, have it replace the template's unique marker with safely escaped JSON and provide the complete HTML, then [save it manually](USER_GUIDE.md#troubleshooting). This alternative has no automatic validation and needs your own browser check. If reading, building, or attachments are unavailable, the AI should say so rather than claiming generation or testing succeeded.
