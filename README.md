# Coding Skills

[![skills.sh](https://skills.sh/b/iron6909/coding-skills)](https://skills.sh/iron6909/coding-skills)

coding agent 编码技能集，专注清晰流程和本地化开发。需求、计划和工作记录都使用本地文件，不依赖 issue tracker。

## 安装

推荐通过 skills.sh 安装：

```bash
npx skills@latest add iron6909/coding-skills
```

也可以手动克隆仓库，将需要的完整技能目录复制到项目的 `.agents/skills/`。

## 快速开始

安装后，在 coding agent 的项目会话中逐项调用：

```text
/survey                         # 首次使用，或项目事实过期时
/clarify 添加用户头像上传          # 澄清需求，审阅并制定规格
/plan                           # 审阅并制定计划
/execute
/code-review                    # 需要整体独立审查时另行调用
```

若界面决策尚未确定，先通过 `/ui-design` 或其他明确批准的设计解决，再制定计划。已知范围与验收条件的小改动可以直接用 `/execute`。

技能需要显式调用，不会自动触发。不知道选哪个时，可使用 `guide`，运行 `/guide 添加用户头像上传`，由它选择入口；目标缺装时会提示，不会自动安装。

## 技能速查

### 核心技能

以下五个技能整体安装，不要求每次全部调用。

| 技能 | 何时使用 |
|------|----------|
| [survey](skills/survey/SKILL.md) | 首次接入项目，或需要更新项目事实与术语 |
| [clarify](skills/clarify/SKILL.md) | 澄清需求并形成规格；大型跨模块工作先拆分能力 |
| [plan](skills/plan/SKILL.md) | 规格已批准，需要拆分可验证的任务 |
| [execute](skills/execute/SKILL.md) | 执行已批准的计划，或实现范围明确的小改动 |
| [code-review](skills/code-review/SKILL.md) | 对本地分支改动做整体独立审查 |

### 辅助技能

| 技能 | 何时使用 |
|------|----------|
| [guide](skills/guide/SKILL.md) | 不确定该从哪个技能开始 |
| [ideate](skills/ideate/SKILL.md) | 需要比较技术方案，再决定方向 |
| [ui-design](skills/ui-design/SKILL.md) | 规格已批准，界面与交互设计尚未确定 |
| [ui-review](skills/ui-review/SKILL.md) | 审查已实现的前端界面 |
| [debug](skills/debug/SKILL.md) | 定位并修复故障 |
| [optimize](skills/optimize/SKILL.md) | 根据测量结果优化性能 |
| [commit](skills/commit/SKILL.md) | 提交指定的临时改动 |
| [autoflow](skills/autoflow/SKILL.md) | 从已批准的规格编排计划、实现与审查 |
| [refactor](skills/refactor/SKILL.md) | 代码结构拖累修改，需要找出重构候选 |
| [capture](skills/capture/SKILL.md) | 保存功能或修复中值得保留的推理与经验 |
| [learning-refresh](skills/learning-refresh/SKILL.md) | 已记录的经验与代码现状不一致 |
| [doc-review](skills/doc-review/SKILL.md) | 检查规格、计划或能力拆分文档 |
| [simplify](skills/simplify/SKILL.md) | 代码已能运行，需要简化与清理 |
| [handoff](skills/handoff/SKILL.md) | 暂停工作，留待其他会话继续 |

## 使用示例

### 修复故障

```text
/debug 购物车总价计算错误，使用优惠券后金额没有变化
```

定位原因、补充回归验证并提交修复。小修复不必再走一遍需求与计划流程。

### 从规格自动交付

```text
/autoflow 根据已批准的用户头像上传规格完成开发
```

需先安装 `autoflow`，准备好已批准的规格，并确定界面决策。它只编排 `plan → execute → code-review`：计划仍需批准，同时授权后续执行与范围内的 Blocking/Important 修复，不代做需求澄清或界面设计。

## 关键概念

**spec** 定义做什么与如何验收，**plan** 组织任务，**task** 是独立可测试的交付单元。小计划可留在当前会话，完整计划会保存文档与任务说明。

### 文档结构

功能规格与计划永久保存在 `docs/features/`，经验保存在 `docs/learnings/`；`.coding/` 存放工作记录、报告和用户配置。项目根目录的 `AGENTS.md`、`GLOSSARY.md`、`DESIGN.md` 分别记录项目事实、术语和设计系统，按需创建。

<details>
<summary>查看具体输出路径</summary>

`YYYYMMDD-<name>` 使用日期与 2～4 个 kebab-case 单词命名；时间戳使用 `YYYYMMDD-HHMM`。

```text
/
├── docs/
│   ├── features/YYYYMMDD-<name>/
│   │   ├── spec.md                     # 批准的规格
│   │   ├── plan.md                     # 任务索引
│   │   ├── ui-spec.md                  # 界面规格（有界面设计时）
│   │   └── capability-map.md           # 能力拆分（大型工作按需产出）
│   ├── learnings/
│   │   ├── YYYYMMDD-<topic>.md         # 经验文档
│   │   └── _archived/                  # 旧经验归档，保留原文
│   └── adr/                            # 架构决策记录
└── .coding/
    ├── features/YYYYMMDD-<name>/
    │   ├── impl/
    │   │   ├── progress.md             # 执行账本
    │   │   └── task-<N>.md              # 任务说明
    │   └── review-YYYYMMDD-HHMM.md      # 功能内代码审查
    ├── handoff/YYYYMMDD-HHMM[-<topic>].md
    ├── ideation/YYYYMMDD-HHMM-<topic>.md
    ├── optimize/YYYYMMDD-HHMM/          # baseline.md、variant-<N>.md、summary.md
    ├── refactor/YYYYMMDD-<scope>.md
    ├── review/YYYYMMDD-HHMM-<topic>.md  # 独立代码审查
    ├── ui-review/YYYYMMDD-HHMM.md
    ├── autoflow-state.json             # 旧运行可保留为 autoflow-state-YYYYMMDD-HHMM.json
    ├── review-lenses.toml              # 审查镜头配置
    └── review-lenses.md                # 同一配置的另一形式，二选一
```

</details>

### 使用约定

- 规格和计划需要批准。`execute` 按测试驱动方式持续完成已批准任务，逐任务自查、验证与提交，最后进行最终验证；遇到范围变化、未解决的失败、歧义或高风险决策会停下。
- 任务自查不等于整体独立审查。`code-review`、`ui-review` 先出报告，修复需要授权；必要验证无法完成时，须明确接受边界并保留未验证标记。
- 技能不自动合并、推送或发布，也不删除文档，包括工作记录和审查报告。旧经验满足归档条件时可归档，临时探针和日志仍可清理。
- `.coding/` 是否忽略或自行提交由用户决定，技能不改变忽略或跟踪规则。

### 提交责任

只暂存各技能负责的文件；工作状态、任务说明和报告不自动提交。

| 技能 | 提交内容 |
|------|----------|
| survey、clarify、plan、capture、learning-refresh、ui-design | 自己产出或更新的项目文档 |
| execute、debug | 每个任务或每次修复的代码 |
| simplify、optimize | 简化或优化后的代码 |
| doc-review | 用户确认后的非语义修正；语义改动交回 clarify/plan 重新批准 |
| code-review、ui-review | 经授权的修复单独提交，遵守上述验证约定，不包含被审查的原始改动；报告不提交 |
| autoflow | 编排 plan、execute、code-review 各自的提交 |
| commit | 用户指定的临时改动 |
| refactor、handoff、ideate | 不提交，只留下报告或交接记录 |

## 参考与许可

主要借鉴 [Superpowers](https://github.com/obra/superpowers) 与 [Matt Pocock Skills](https://github.com/mattpocock/skills)。`refer/` 中的项目仅供参考，不随技能安装，也不是运行依赖。

采用 [MIT License](LICENSE)。
