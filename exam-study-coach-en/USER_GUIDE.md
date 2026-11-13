# Exam Study Coach: first-time user guide

Let's get ready for your exam! 📚 This guided preparation conversation helps you prepare for your own exam one step at a time.

**Upload the skill package, send the starting prompt, and stay in the same chat to answer the AI's questions.** It will ask about your exam, available course materials and examples, and session study time. Once available materials and gaps are recorded, it creates a downloadable practice webpage, an HTML file. Open it in a browser to practice, review mistakes, take a mock, revisit weak areas, and read a final five-minute recap.

Gather any exam scope or study guide, slides or notes, past papers, and class quizzes so they are easy to upload. Upload in batches when asked; tell the AI if something is unavailable.

Coaching, explanations, and review cards use English by default unless you request another language. Questions keep the official exam language.

**The route: download skill → give it to AI → answer questions and upload materials → download study webpage → practice and mock → return a report to AI.**

## Choose your starting point

| What you want | What to open/provide |
| --- | --- |
| Generate a pack for your course and try the full workflow | Give AI the complete skill ZIP and follow the steps below |
| First see practice, mistakes, and mocks | Extract the package and open `examples/SWE113-study-demo-en.html` in a browser |

The demonstration already contains 30 SWE113 questions. It will not automatically become another course's question bank. `assets/study-template.html` is the blank template used by AI, not the student's practice entrypoint.

## 1. Download the complete skill package

Use the author's `exam-study-coach-en.zip`, or [download it from GitHub](https://github.com/ScarlettFeng666/Study_coach_skills/raw/refs/heads/main/downloads/exam-study-coach-en.zip). You can also download the whole repository through **Code → Download ZIP**.

If you only have a GitHub link, download the files first. Pasting the link into AI does not guarantee access to the skill and every supporting file.

After extraction, find the folder containing `SKILL.md`, `assets/`, `references/`, and `scripts/`. Keep its directory structure. A GitHub repository download may have an additional outer folder; locate the English skill folder inside it.

## 2. Give the skill to AI and send the starting prompt

Start a new conversation with an AI that can read attachments and produce downloadable files. **Prefer uploading the complete skill ZIP**, then copy and send this prompt. You can also copy `START_PROMPT.txt` from the package.

```text
Read SKILL.md in the attached skill package and the supporting files it references as needed.

For the first greeting, introduce this guided preparation conversation in a friendly, upbeat tone. Explain that I should stay in this chat and answer your questions step by step. Remind me to gather exam scope, course materials, and examples, upload in batches when prompted, and tell you if something is missing. Briefly outline the information you will collect and the downloadable HTML practice webpage you will create. After the introduction, ask only the first missing question.

Act as my exam study coach and guide me in order:
1. Establish the subject, scope / study guide, official formats, and question language.
2. Collect my slides, handouts, or notes.
3. Collect past tests, quizzes, examples, and answers. My previous answers may be wrong; verify them.
4. Confirm the total minutes I can study this session. Budget question count for answering, explanations, and review together.
5. Use the bundled template to generate downloadable offline study.html with practice, mistakes, a timed mock, weak areas, and a final five-minute recap.
6. After I upload a study report, explain and summarize using actual mistakes.

Ask only one or two currently missing questions each turn. Do not ask again for information already provided.
First confirm that you can read the skill and supporting files, then introduce the process and ask progressively. State specific limitations if reading, execution, or attachments are unavailable.
If I already uploaded a report, am continuing study, or have only five minutes left, continue directly without repeating the full introduction.
```

Normally, AI first explains how the conversation works, what to gather, and the final deliverable, then asks only the first missing question, such as "Which exam are you preparing for?" Keep answering and uploading in the same chat. It should not turn all four information categories into a full questionnaire at once or generate a large bank before collecting materials and time.

**If AI cannot read ZIP files:** extract locally and provide these five files together. If attachments lose folders, send this table too so the AI can recover original paths.

| Original path | Purpose |
| --- | --- |
| `SKILL.md` | Workflow entrypoint |
| `references/learning-workflow.md` | Source checking, question planning, and feedback rules |
| `references/data-contract.md` | Question-bank data format |
| `assets/study-template.html` | Interactive webpage template |
| `scripts/build_study_pack.py` | Data validation and HTML generation |

An AI without file-generation capabilities can help organize content but cannot guarantee a downloadable webpage. Use an AI with the required tools or the manual saving method below. Everyday use does not require installing Python or studying code first.

## 3. Supply exam materials when asked

Gather available materials, then follow the AI's order. You do not need to extract the concepts yourself; state any missing materials.

| What AI asks about | What to provide |
| --- | --- |
| The exam | Subject, scope or study guide, date, official formats, and preferred explanation language |
| Course materials | Slides, PDFs, handouts, notes, or assigned textbook chapters; upload in batches if needed |
| Examples | Past tests, class quizzes, samples, and answers; distinguish instructor keys from your own ungraded answers |
| Available time | **Total session study time**, including answering, explanations, and review; provide real exam duration separately if useful |

For example, replace this with your situation:

```text
I am preparing for SWE113 Exam 1, covering Lectures 1–6 in the study guide.
The official exam uses English single-choice questions. Please explain in English too.
I have 90 minutes in total to study now; this is not the official exam duration.
I will upload slides and class quizzes in batches. Some quiz answers are my own and may be wrong.
Select focused questions within scope and include explanations and mistake review in the 90 minutes.
```

When finished uploading, say: "I have sent all available materials. Please summarize the scope and question-count plan." If slides or examples are unavailable, tell AI. It may continue but should identify general practice and unverified content.

Once materials and gaps are recorded, expect a short plan with topics covered, practice and mock counts, estimated phase times, and source gaps. Counts vary by time and formats; they are not always 30.

## 4. Download and open your study webpage

AI should deliver a complete `.html` file, such as `study.html`. Download it and open in a browser; chat attachment previews may not support all interactions.

The page should include `01 Practice`, `02 Mistake notebook`, `03 Timed mock exam`, `04 Weak areas`, `05 Final 5 minutes`, and `06 Sources & plan`. Check scope and sources in the last section before studying.

With only minutes left, AI may give an immediate recap in chat. A zero-question review pack disables practice and mock entrypoints; this is expected.

If you receive only a plan, JSON, or incomplete code, send:

```text
Please continue and deliver complete, downloadable study.html using the bundled template, with the checks your environment can run.
If attachments are unavailable, say so clearly and provide complete savable HTML or another feasible delivery method.
```

## 5. Practice, review mistakes, take a mock, and reflect

| Feature | How to use it | How to interpret results |
| --- | --- | --- |
| Practice | Choose an answer, then `Check answer`; use `Try again` to repeat | Selection alone is not submission; multiple choice needs every correct option and no wrong options |
| Mistake notebook | Wrong answers are collected; choose `Retry this question` | Two consecutive correct retries resolve an item; history remains, and another error reopens it |
| Timed mock exam | Set this attempt's question count and start; submit when finished | Duration is preset by the pack. Review the submitted attempt to see explanations; unanswered items are incorrect |
| Weak areas | Read coverage, error records, and review cards | Untested does not mean unable or mastered; familiar-question performance does not establish ability on unseen questions |
| Final 5 minutes | Answer recall prompts mentally before checking rules and distinctions | Unresolved errors come first; at most six topics form a prioritized excerpt |

**The mock timer does not pause.** Refreshing, closing, and reopening preserves the original deadline. Timeout submits automatically. Switching to another learning mode inside the page asks for confirmation; confirming submits immediately, while canceling continues the mock. Submitted answers cannot be changed. Open the attempt review to see item-by-item answers and explanations.

For short answers, write independently first, then compare the reference answer and rubric and select the appropriate understood/not-yet-understood self-assessment. Mock short answers are self-assessed after submission in the attempt review. The page does not call AI to grade responses. Self-assessment is separate from objective accuracy.

## 6. Return a study report to AI for personalized review

The webpage organizes records and review cards offline. Export a report for deeper explanations or new variants. The original chat is easiest; in a new chat, provide the skill package too and original materials if needed.

Export `Study report .md` or `Study report .json`, upload either, and send:

```text
Here is my practice report. Use actual records and question IDs to identify the topics most in need of review.
For each, explain what I may have confused, the correct rule, and how to decide next time. State uncertainty about mistake causes.
Separate wrong objective answers, unsuccessful short-answer self-assessments, and untested content. Do not predict my exam score.
I have 20 minutes left. Fit a few targeted items and review within that budget.
```

Close to the exam, use:

```text
I have only five minutes left. Do not add new questions.
Use this report for a recap I can read in about five minutes, prioritizing unresolved errors, confusing concepts, and decision steps.
Identify insufficient evidence and untested content separately. Do not pretend my ability has already been established.
```

## 7. Save progress: the two JSON exports differ

| Export/file | Purpose | Next use |
| --- | --- | --- |
| `Back up progress JSON` → `study-progress-….json` | Save answers, mistakes, practice drafts, and mock state | Open HTML with the **same content version**, choose `Restore progress`, and select the backup |
| `Study report .md` / `.json` → `study-report-…` | Give AI questions, attempts, reference answers, and source status | Upload for analysis; it cannot restore progress |
| `Export this recap` → `five-minute-….md` | Save final review points separately | Read with a text or Markdown viewer |

After every session, save **the original HTML and a progress backup**. Local records are not cloud sync. Switching devices or browsers, moving files, or clearing browser data can affect persistence. Old backups may be incompatible after AI changes the question bank.

Restore merges existing history and uses the backup's practice drafts. If a mock is active, restoration asks for confirmation and submits it first. Report export and printing are disabled during a mock; progress backups remain available.

## Troubleshooting

| Problem | What to do |
| --- | --- |
| AI cannot read attachments | Extract and supply the five files in step 2; ask which files it actually read |
| AI skips the process explanation or immediately produces many questions | Ask it to explain the preparation conversation, required materials, and final deliverable, then fill gaps progressively and determine a question count |
| The webpage says data is incomplete | Open generated `study.html` or the built demonstration, rather than `assets/study-template.html`; send persistent errors to AI for repair |
| You only receive complete HTML code | Save the complete code as UTF-8 text named `study.html`, without code fences and without a trailing `.txt`, then open in a browser |
| You doubt an answer | Send the question ID, your answer, and matching materials back to AI for source checking and correction; keep the original pack and do not memorize a disputed answer |
| Progress restoration fails | Check that this is a `study-progress` backup and the HTML version is unchanged; send the exact error to AI and do not reset data as a restoration attempt |

For an initial demonstration check: deliberately answer incorrectly → inspect mistakes → retry correctly twice → submit a one-question mock → export progress and report separately. This tries webpage functions; trying the complete skill also requires generating a pack for your own exam.

For author feedback, provide the AI used, where you got stuck, the message, and relevant question IDs or screenshots.
