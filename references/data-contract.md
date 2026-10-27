# 离线学习包数据约定（schema_version = 1）

出题时读取本文件。JSON 用 UTF-8，不含注释。所有字段都必须提供；未使用的列表用 `[]`，未使用的字符串用 `""`。完整可运行例子见 `examples/swe113-demo.json`。所有文字均按纯文本显示；公式可用 Unicode 或可读文本。

## 顶层字段

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| schema_version | 整数 | 固定 1 |
| pack_id | 字符串 | 课程与考试的稳定标识，如 `swe113-exam1-v1`；改题后数据指纹也会隔离旧进度 |
| title / subtitle | 字符串 | 页面标题与考试范围 |
| language | 字符串 | 如 `zh-CN`；题干可保留正式考试语言 |
| notice | 字符串 | 资料缺口、推断、题池重用等需向学生说明的信息 |
| plan | 对象 | 时间分配，见下 |
| sources | 对象数组 | 至少一项；资料来源目录 |
| topics | 对象数组 | 至少一项；知识点与复习卡 |
| questions | 对象数组 | 可为空（仅速通复习）；通常至少有练习题和模考题 |

所有 `id` 及 `pack_id` 使用 1–96 个 ASCII 字母、数字、点、短横线或下划线，首字符为字母或数字。各数组内 ID 唯一。显示名称支持中文。

`plan`：`total_minutes` 为大于 0 的数；`practice_minutes`、`mock_minutes`、`review_minutes` 为非负数，三者之和不超过总时间。`rationale` 说明估算、题量、每题做题及解析耗时、模考后的复盘及最后复习如何分配。`estimated_seconds` 只表示独立作答时间，不能误当作包含解析的总工作量。题量与时间可行性由 AI 核算，构建器只核验结构与总时长。无模考用 0。

## sources：资料来源

每项：`{id, label, status, detail}`。

- `verified`：已经实际读取并定位的材料；`detail` 填文件名与页码/章节/题号。
- `unverified`：只有转述、旧网页引用或不可读取的原文；不得改写成已核验来源。
- `general`：无课程材料时明确标注的通用知识练习，不能声称符合老师口径。

每道题/知识点的 `source_ids` 是非空字符串数组，指向这里的 ID，可精确到某页或某题。学生旧答案与另一 AI 的答案不是已核验答案键；“读到了旧 HTML”不等于“核验了旧 HTML 引用的 PPT”。

## topics：知识点

每项必须有：

```json
{
  "id": "topic-1",
  "title": "知识点名称",
  "summary": "简短、可自足的概念解释，约 1–3 句。",
  "pitfalls": ["容易混淆的区别或常见错误"],
  "recall_prompt": "先遮住答案，尝试用一句话回答的主动回忆问题。",
  "quick_tip": "考前速记的一句判断规则，不以关键词代替理解。",
  "source_ids": ["source-1"]
}
```

复习卡应预先写好，网页按实际错题重排，不调用 AI 临时编写答案。总卡片过多时，5 分钟页面只展示优先内容并标明这是节选。

## questions：题目

每项必须有：

```json
{
  "id": "q-001",
  "topic_id": "topic-1",
  "type": "single",
  "prompt": "Which statement is correct?",
  "options": ["Option A", "Option B"],
  "answer": [0],
  "explanation": "正确答案的理由、适用条件及概念边界。",
  "option_explanations": ["A 为什么正确", "B 错在什么概念"],
  "reference_answer": "",
  "rubric": [],
  "difficulty": "medium",
  "estimated_seconds": 75,
  "source_ids": ["source-1"],
  "origin": "generated",
  "pool": "practice"
}
```

- `single`：至少两个不重复选项；`answer` 恰好一个从 0 开始的索引。
- `multiple`：至少两个选项；`answer` 为所有正确选项索引，至少一个且无重复。网页采用全选对得分，不擅自部分给分。
- `short`：`options`、`answer`、`option_explanations` 均为 `[]`；`reference_answer` 为参考答案，`rubric` 至少一个评分要点。网页由学生对照自评，单列自评结果，不混入客观题准确率。
- 选择题 `option_explanations` 与选项数相同且每项有实际理由；`reference_answer` 为 `""`，`rubric` 为 `[]`。
- `difficulty`：`easy` / `medium` / `hard`；`estimated_seconds` 为大于等于 1 的有限数。
- `origin`：`provided` 原样提供的题、`adapted` 改编、`generated` 新题；来源标注不等于已获答案权威核验。
- `pool`：`practice` / `mock` / `both`。存在 `mock` 或 `both` 题时，`plan.mock_minutes` 必须大于 0；没有模考时全部用 `practice`。优先独立练习与模考题池。`both` 会导致模考见过题，应在 `notice` 明说；不能宣传为独立测评。
- 一题归一个主要知识点便于统计；综合题可在解析中注明关联知识点。

## 构建与验收

从技能目录运行（其他目录请使用解析后的绝对路径）：

```text
python scripts/build_study_pack.py --data my-pack.json --validate-only
python scripts/build_study_pack.py --data my-pack.json --output study.html
```

标准库即可运行，无需 API 密钥。构建器检查字段、ID、索引、引用、重复题干、时间总和等并安全嵌入数据；它不能验证课程知识正确性。生成后用浏览器打开实际检查答题、错题本、模考交卷、刷新保留、报告导出及速通页面。不能运行时说明未运行，不把生成代码等同于已测试。

浏览器进度 JSON 和学习报告不是题库 JSON，不能传给构建器；它们供同一题库恢复进度或发回 AI 分析使用。
