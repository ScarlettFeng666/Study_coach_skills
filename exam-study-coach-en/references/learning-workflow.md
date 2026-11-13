# Study workflow and quality rules

Use this reference to collect materials, allocate time, write question banks, and analyze returned reports. [data-contract.md](data-contract.md) defines data structure and building; field definitions are not repeated here.

## 1. Establish traceable inputs

First distinguish exam preparation from work on the skill itself. For a first full preparation conversation, use the greeting in SKILL.md to explain the process, materials to gather, and final practice webpage. Then fill gaps in the order scope → course materials → examples → session study time. Ask only one or two missing questions each turn and extract information already provided. For returned reports, continued study, or the final five minutes, continue directly without repeating the full opening.

Create a short source inventory recording at least each source's name, type, portion actually read, location method, and limitations. Internal notes may be detailed; keep student-facing disclosures concise.

| Source status | Supported use | Required disclosure |
| --- | --- | --- |
| Read and verifiable | Cite sections actually read to support topics, answers, and explanations | Filename and real page/chapter; use only locatable references |
| User account or unverified | Provisional scope, preferences, or claims needing confirmation | "According to your description" or "Answer pending verification"; never present it as the original text |
| General background | Explain concepts and create clearly labeled general practice | Identify it as supplementary, rather than the instructor's confirmed scope |
| Inaccessible or not provided | Record the gap and ask once about an alternative format | Do not infer missing text or claim a link/attachment was read |

Distinguish physical PDF page numbers from printed page numbers. If page numbers are unknown, cite a heading or chapter. An example question establishes that a concept was tested, not that its answer is correct. Student-selected options, handwritten answers, and previous mistake records are not answer keys. Check course materials or official answers. Independently derive answers to past tests without keys and label that derivation. If an original answer is wrong, clearly explain the correction rather than preserving it to agree with the student.

With missing materials, describe the output as general practice with a provisional scope and prioritize topics the user explicitly named. One available chapter does not establish coverage of the whole course. When sources conflict, record both locations and ask one focused question if needed. Unresolved points must not become scored questions with supposedly certain answers.

## 2. Extract a blueprint

List topics and connect each to sources, required abilities, and suitable formats. Abilities may include recall, understanding, tracing execution, applying, explaining, and deriving. Preserve course notation and conventions; do not replace an instructor's explicit definition with a generic one.

An explicit study guide defines scope. Past tests/quizzes calibrate style, emphasis, and difficulty; appearance on an old paper does not automatically add a topic to current scope. Respect an explicit request for only the intersection of guide and quiz. Without that restriction, guide topics absent from old papers may still need coverage. Excluding administrative information or course procedures depends on current scope; do not impose a universal "never examined" rule.

Prioritize explicit exam scope/instructor guidance, representative example distribution, emphasis in materials, and the student's reported difficulties, in that order. Without evidence for weights, use balanced coverage and mark it as a planning assumption. A few past questions do not establish what is certain to appear this time.

Match official formats. If a programming exam includes reading code, writing code, and short answers, do not turn everything into conceptual single choice merely because it is easier to score. If the official exam is exclusively single choice, adapt past-quiz short answers with sufficient conditions while preserving their concepts. Questions use the exam language; explanations may use the student's preferred language. Short-answer inputs support text or code and student self-assessment against criteria. For complex diagrams or proofs unsuitable for the page, allow paper work and self-assessment.

## 3. Let study time determine volume

Total time available this session includes answering, reading explanations, reviewing mistakes, and the final recap. Real exam duration is separate and only sets simulated pacing. Respect a specified question count first and estimate its time. If count and time conflict, offer a feasible core batch plus optional extensions without silently reducing explanation quality.

Without actual student timing, use these **initial estimates** and adjust after observed attempts. These are not predictions of speed or mastery.

| Format | Medium-difficulty answer time s (minutes) | Feedback/checking r (minutes) |
| --- | ---: | ---: |
| Conceptual single choice | 1.0 | 0.75 |
| Multiple choice | 1.5 | 1.0 |
| Short trace, calculation, or code reading | 2.5 | 1.5 |
| Short answer/code with self-assessment | 4.0 | 2.0 |

For easy questions, s may be multiplied by 0.75; for hard questions, by 1.5. Adjust r for actual explanation/rubric length, rather than budgeting only clicks. Estimate long proofs, calculations, and full programming tasks separately; do not assume "four minutes per short answer." Prefer the student's real pace or exam timing when available.

Let total time be T, final recap C, and other time E = T − C. Use these adjustable defaults:

- T ≤ 5: go directly to diagnosis/recap of known weak areas. One oral check may fit, but do not subtract five minutes to leave zero and then force questions.
- 5 < T < 45: C = min(3, 0.1 × T). Use remaining time for a few diagnostic questions and review, depending on topic count. A mini mock is optional when suitable; disclose limited coverage.
- T ≥ 45: C = 5. Allocate E by default to practice 55%, mock 25%, and mistake review 20%.

Each batch costs approximately Σ(sᵢ + rᵢ). Select by format and blueprint until the next question would exceed the batch budget, or estimate n = floor(batch budget ÷ average(s + r)) and then recalculate using actual formats. Establish total volume before allocating across topics and weights. Do not assign ten questions to every topic or fix "30 questions" first and attach an arbitrary duration afterward.

During a mock, the timer counts answering only. Set the deadline using Σsᵢ or the student's specified real exam duration. Deliver Σrᵢ after submission but still include it in total study time. The separate mistake-review budget covers diagnosing errors and retrying; do not double-count the same first explanation.

For example, T = 90 minutes with medium single-choice items gives a five-minute recap, about 46.75 minutes practice, 21.25 minutes mock, and 17 minutes review. At 1.75 minutes per question, the initial estimate is 26 practice and 12 mock questions, adjusted for coverage and difficulty. The mock answer timer is about 12 minutes, leaving about nine minutes for post-submission explanations. This is a budget example, not a recommended count for all courses.

Before writing, give a brief plan: "For your 60 minutes and code-reading scope, I expect X practice questions, Y mini-mock questions, and Z minutes of review; skip extensions if your actual pace is slower." An ordinary plan needs no extra approval.

If time cannot cover all topics, prioritize explicit high priorities and known errors, then list uncovered items. For large banks, build batches with independent IDs and a shared blueprint. Do not call a first-batch-only pack complete. More questions cannot replace representative coverage and useful explanations.

## 4. Write questions and explanations

Check each item: what it measures, what supports it, whether it fits the time budget, whether the answer is unique or scoring conditions are clear, and whether feedback corrects a misconception.

- Single choice: give sufficient conditions and an independently derivable correct answer. Keep option structure comparable and avoid answer cues from length or grammar.
- Multiple choice: state selection rules. Follow the contract's exact-match scoring, or explicitly explain partial credit only when the implementation supports it.
- Tracing/calculation: explain key intermediate steps and respect the course's language version. State assumptions for undefined, implementation-dependent, or underspecified behavior.
- Short answer: give point-by-point reference content, required elements, and common errors. Self-assessment choices must match the criteria. Explain self-assessment separately from objective scores.
- Explanation: give the reason, then major distractor misconceptions. Do not merely repeat the correct option or hide reasoning behind "obviously" or "just memorize it."

Associate every question with locatable sources. Integrated questions may reference several without fabricated citations. AI-derived reference answers must be internally consistent and explicitly distinguished from official instructor answers.

Independently check important formulas, code, numbers, and conclusions by recalculation, tracing, or source comparison. If verification is impossible, mark pending verification and exclude from definite scoring. Do not add ambiguous items to reach a mock question quota.

Write a small review card per topic: one core rule, a common misconception, necessary formula/code, and a self-check question. These cards supply offline weak-area and recap content. The webpage cannot call a model to create explanations.

## 5. Practice and mock pools

Prefer independent questions in `practice` and `mock`. Use `both` only when sharing is necessary and disclose repetition. Results on familiar mock items are not independent unseen assessment.

Preserve common question-family identities/relationships for variants using the available data conventions and authoring records. Changing numbers, variable names, or option order does not demonstrate new transfer. Split pools by family rather than individual ID to avoid leakage. If the contract or sources cannot express a family relation directly, enforce grouping during authoring and record the limitation in pack notes.

Sample mocks by scope and official formats. If the bank is too small, provide a small diagnostic and explain coverage and independence limits. Do not invent unsupported knowledge to imitate a full exam.

## 6. The local learning loop

Practice shows explanations and sources after submission; repeated attempts preserve history. The mistake notebook records wrong, unanswered, and uncertain self-assessment states according to the implementation. "Resolved" means two consecutive correct retries under the page's rule, not scientifically established long-term mastery. Another error reopens the item.

Fix question selection and the deadline at mock start. Hide explanations until submission, then reveal feedback together. Refreshing, switching tabs, or reopening cannot add time; expiration depends on the fixed deadline. Show actual question count and timing before start and identify shared questions.

Store progress locally in the browser. Provide JSON export as a portable backup. Validate pack/version, question IDs, and record format on import; never silently bind incompatible history to new questions. Tell students to export before changing browsers, clearing storage, or moving files.

Offline reports summarize topic coverage, errors/attempts, unresolved items, recent errors, and review rules using records and prewritten cards. With little data, say "Provisional weak area / insufficient evidence." Do not use arbitrary thresholds to claim "90% mastered." Identify self-assessment and distinguish first attempts from repeated familiar-question performance.

Prioritize unresolved mistakes in a recap readable in about five minutes. Focus on rules, commonly confused distinctions, key formulas, and checking actions. With no mistakes, recap core concepts within scope and explain that no error evidence exists yet. In short sessions, the recap can be the main deliverable rather than a mandatory extra five-minute task. In the final five minutes, or when asked for no more questions, stop adding items. Use recall rule → compare confusing distinctions → review decision steps; recall prompts are not another scored exam.

## 7. Returned reports and continued study

When a student returns Markdown reports or progress JSON, first confirm pack identity, material version, and missing history. Analyze existing records without restarting the full questionnaire.

For each prioritized weak area, provide evidence IDs/records → specific misconception → correct rule → one corrective action. A wrong answer alone may not establish its cause; use one short question to distinguish concept confusion, calculation mistakes, or misreading. Avoid labeling the student's ability.

If time remains and the student wants practice, target observed misconceptions with at least a changed context or reasoning step; label variants as usual. Do not reveal answers before the student attempts new questions. Only transfer-question results support updated judgments about transfer, and still require sample-size and uncertainty disclosures. Use the final five minutes for explanations of existing errors, confusing distinctions, and exam decision logic, rather than adding questions.

Finish with two short outputs: a prioritized list of what still needs work and a pre-exam recap readable in about five minutes. Separate course claims needing verification. Do not convert pack performance into unsupported exam-score predictions. If a final-minutes report lacks question IDs or topic detail, immediately give an actionable review order of objective errors → unsuccessful self-assessments → untested scope and state the information gap. Deliver the immediate recap in chat; create a zero-question review-card HTML only if a downloadable copy is needed.
