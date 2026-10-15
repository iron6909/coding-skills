# Coding Skills

[![skills.sh](https://skills.sh/b/iron6909/coding-skills)](https://skills.sh/iron6909/coding-skills)

极简 coding agent 技能集,专注清晰流程和本地化开发。基于 Superpowers 和 Matt Pocock Skills 提炼。

**核心原则**: 完全本地化开发,不依赖 issue tracker (GitHub/Linear/Jira)。所有设计、计划、任务管理使用本地文件。

## 安装

### 通过 skills.sh 安装（推荐）

```bash
npx skills@latest add iron6909/coding-skills
```

选择你需要的技能，安装器会将它们复制到项目的 `.claude/skills/` 目录。

### 手动安装

克隆此仓库，将 `skills/` 目录下的技能复制到你的项目 `.claude/skills/` 目录。

## 快速开始

安装后,在项目中执行:

```bash
# 1. 勘察项目(首次使用,或项目事实过期时)
/survey

# 2. 开始第一个功能
/guide 让我们添加用户登录功能
```

`guide` 把请求路由到合适的技能;通常每个技能产出文档或代码后停下,等你确认再进入下一步:

1. `clarify` 澄清需求，批准后保存并提交 `spec.md`；仍有界面决策时推荐 `ui-design`，否则可进入 `plan`
2. `plan` 拆分任务,呈现草稿,批准后保存并提交 `plan.md`
3. `execute` 按 TDD 逐个任务实现、评审、提交
4. `code-review` 独立审查整体改动,报告后由你决定修复或集成

已有批准的 spec 且需求、界面决策已确定时,可用 `autoflow` 自动编排第 2–4 阶段,不代做需求澄清或界面设计。

## 核心流程

```mermaid
graph TD
    A[用户请求] --> B[guide 路由]
    B --> C{类型?}
    C -->|首次使用| D[survey]
    C -->|需求不明| E[clarify]
    C -->|spec 已批准且设计已定| F[plan]
    C -->|已有计划| G[execute]
    C -->|故障| H[debug]
    C -->|审查他人改动| I[code-review]
    C -->|代码结构问题| M[refactor]
    C -->|沉淀推理| N[capture]
    C -->|learnings 陈旧| O[learning-refresh]
    C -->|审查文档| P[doc-review]
    C -->|清理代码| Q[simplify]
    C -->|审查界面| S[ui-review]
    C -->|已批准 spec，自动交付| T[autoflow: plan → execute → code-review]
    T --> J

    D --> E
    E -->|界面决策未定| R[ui-design]
    E -->|否则| F
    R --> F
    F --> G
    G --> J[完成]
    H --> J
    I --> J
    M -->|选定候选| E
    H -->|大型修复| E
    G -->|可选| N
    H -->|可选| N
    G -->|可选| Q
    G -->|可选| S
    O --> J
    P --> J
    Q --> J
    S --> J

    style B fill:#e1f5ff
    style G fill:#d4edda
    style H fill:#fff3cd
```

## 技能速查

| 技能 | 触发时机 | 产物 | 示例 |
|------|---------|------|------|
| **guide** | 未指名技能的开发请求 | 路由后交给对应技能 | "添加登录" → clarify |
| **survey** | 首次使用,或项目事实过期 | AGENTS.md、GLOSSARY.md | 项目事实:栈/命令/约定 |
| **ideate** | 不确定如何实现,需对比技术方案 | `.cartoons/ideation/YYYYMMDD-HHMM-<topic>.md` | 生成2-3个方案,压力测试,推荐 |
| **clarify** | 需求不明 | spec.md/capability-map.md | 两路径:Bounded/Architectural;自动检测分解;Phase 1 可选 research/spike |
| **ui-design** | spec 已批准，界面决策未定 | 缺失时创建 DESIGN.md；产出 ui-spec.md | 按界面确定模式，设计草案批准后才保存、提交 |
| **plan** | spec 已批准 | 分两档:Brief 只留在会话,Full 产出 plan.md + task briefs | 拆分为 tracer bullet 任务 |
| **execute** | 计划就绪,或小改动范围与验收已明确 | commits + Full 档 progress.md | RED→GREEN→REFACTOR 循环;传 `auto` 则单次批准跑完所有任务 |
| **ui-review** | 审查已实现的前端界面 | `.cartoons/ui-review/YYYYMMDD-HHMM.md` | 5 维度:一致性/可用性/可访问性/响应式/性能 |
| **debug** | 报告故障 | 诊断 + 回归测试 + 修复提交 | 4 阶段:根因调查→模式分析→假设验证→实施 |
| **optimize** | 系统性性能优化 | 优化代码提交 + `.cartoons/optimize/YYYYMMDD-HHMM/` | Profile→归因→测试变体→停止标准 |
| **code-review** | 分支审查（本地） | Standards + Spec + Learnings 三轴报告(`.cartoons/review/`) | Fowler smells + spec 对照 + 已记录陷阱;修复需你同意 |
| **commit** | 临时改动需提交 | 单次提交（不 push） | 检测约定,暂存指定文件,写优质提交信息 |
| **autoflow** | spec 已批准,需自动交付 | plan.md、代码提交、审查报告与授权修复 | 仅 plan → execute → code-review；计划批准后自动执行,不代做 clarify |
| **refactor** | 代码结构拖累修改、模块过浅、难测试、已选定目标 | 改进候选清单(`.cartoons/refactor/YYYYMMDD-<scope>.md`) | 删除测试判断深/浅模块 |
| **capture** | 功能/修复刚结束,推理过程会被丢掉 | `docs/learnings/YYYYMMDD-<topic>.md` | 反事实门槛筛掉可推断的内容 |
| **learning-refresh** | learnings 与代码库漂移 | 更新/合并/归档 learnings,提交改动 | 审计 `docs/learnings/` 陈旧条目,不删除文档 |
| **doc-review** | 审查规划文档 | 原地编辑 + 报告,提交修复 | spec/plan/capability-map 完整性/可行性检查 |
| **simplify** | 代码能跑但该清理 | 提交简化后代码 | 提取重复逻辑、改进命名、优化效率 |
| **handoff** | 暂停工作,跨会话继续 | `.cartoons/handoff/YYYYMMDD-HHMM.md` | 记录阶段/已完成/阻塞点/下一步 |

## 关键概念

### 文档结构

每个功能使用日期前缀的目录名:

```
/
├── docs/
│   ├── features/                        # 功能规格与计划（永久）
│   │   ├── 20250115-user-auth/
│   │   │   ├── spec.md                 # 批准的规格
│   │   │   ├── plan.md                 # 任务索引
│   │   │   └── ui-spec.md              # 界面规格（ui-design 产出）
│   │   ├── 20250120-cart-checkout/
│   │   │   ├── spec.md
│   │   │   └── plan.md
│   │   └── 20250125-platform-refactor/
│   │       └── capability-map.md       # 多模块拆分（clarify 自动检测生成）
│   ├── learnings/                       # 会话推理沉淀（永久，capture 产出）
│   │   ├── 20250115-jwt-security.md    # 单主题学习文档
│   │   └── _archived/                  # 满足归档条件的旧 learning，保留原文
│   └── adr/                             # 架构决策记录（惰性创建）
├── .cartoons/                           # 临时，不提交（按技能组织）
│   ├── autoflow-state.json              # 三阶段进度；旧运行可保留为 autoflow-state-YYYYMMDD-HHMM.json
│   ├── features/                        # feature 相关
│   │   └── 20250115-user-auth/
│   │       ├── impl/
│   │       │   ├── progress.md         # 执行账本
│   │       │   ├── task-1.md           # 任务详细说明
│   │       │   └── task-2.md
│   │       └── review-20250115-1430.md # feature 内的 code-review
│   ├── handoff/                         # 会话交接
│   │   ├── 20250115-1430.md            # 通用交接
│   │   └── 20250115-1430-user-auth.md  # 带主题的交接
│   ├── ideation/                        # 想法生成
│   │   └── 20250120-1530-realtime-sync.md
│   ├── optimize/                        # 性能优化实验
│   │   └── 20250115-1430/
│   │       ├── baseline.md             # 基线 profile
│   │       ├── variant-1.md            # 变体测试结果
│   │       └── summary.md              # 最终报告
│   ├── refactor/                        # 重构报告
│   │   └── 20250115-billing.md
│   ├── review/                          # 独立 code-review
│   │   └── 20250115-1430-security.md
│   └── ui-review/                       # UI 评审报告（ui-review 产出）
│       └── 20250115-1430.md
├── GLOSSARY.md                          # 术语表（惰性创建）
├── DESIGN.md                            # 设计系统（ui-design 惰性创建）
└── AGENTS.md                            # 项目事实
```

`ui-review` 的默认报告名与 `optimize` 的默认实验目录遇到同名项时，依次加 `-2`、`-3` 等后缀，不覆盖旧报告。`optimize` 为整次新实验选一个目录，baseline、变体、summary、链接和提交说明都沿用实际路径。

### 三层结构

1. **spec** — 问题/目标/范围/方案/约束/验收条件/测试入口
2. **plan** — 有序任务列表,每个任务有依赖声明
3. **task** — 独立可测试单元,有:
   - 明确交付物
   - 验证命令
   - Produces/Consumes 接口声明
   - 文件清单

### TDD 红-绿-重构循环

`execute`、`debug`、`code-review` 共用一份 `tdd.md`:
1. **RED** — 写失败测试
2. **GREEN** — 最小代码通过
3. **REFACTOR** — 清理重复

有 spec 时只通过批准的测试入口(test entry point)测试;无 spec 的小改动或修复先说明入口。回归测试要验证"还原修复后必须变红";无法建立测试时说明替代检查与覆盖缺口。

### Tracer bullet 任务

垂直切片优先于水平分层:
- ✅ "用户点登录 → JWT 签发 → 仪表板渲染"
- ❌ "实现所有 models" + "写所有 routes"

### Domain Modeling

- **GLOSSARY.md** — 术语表,共享语言
- **ADR** — 架构决策记录(难逆转 + 令人意外 + 有权衡)
- 内联更新 — 术语确定时立即写入

### 提交责任

写文档的技能自己提交，只 stage 自己的文件，都不 push:

| 技能 | 提交什么 |
|------|---------|
| survey、clarify、plan、capture、learning-refresh、ui-design | 自己产出的文档:`AGENTS.md`/`GLOSSARY.md`、spec 或 `capability-map.md`、`plan.md`、learnings、`DESIGN.md` + `ui-spec.md` |
| execute、debug | 每个任务或每次修复一次代码提交 |
| simplify、optimize | 简化、优化后的代码 |
| doc-review | 用户确认后提交已修改的原文档；只直接改 Minor,Blocking/Important 等你决定 |
| autoflow | 编排 plan、execute、code-review 各自的提交；spec 是已批准的输入,状态/briefs/报告不提交 |
| commit | 你指定的临时改动（不 push） |
| code-review | 报告不提交；经你授权的修复单独提交,不包含被审查的原始改动 |
| ui-review | 报告不提交；授权修复先验证再单独提交，不包含被审查的原改动。必要验证不可用时须明确接受边界，仍标为未验证 |
| refactor、handoff、ideate | 不提交；报告与临时文件留在 `.cartoons/` |

## 何时用什么

```
简单改动(已知范围)
  → execute

需求不明
  → clarify (Bounded/Architectural)
    → Bounded: 局部小改
    → Architectural: 跨模块/接口
    → research/spike: 路径内按需验证,不是第三条路径

多步骤工作
  → plan (按体量选输出档)
    → Brief: ≤5 文件、单模块 → 任务列表写在会话里,同一会话内接 execute
    → Full: 其它 → plan.md + task briefs
  → execute (逐任务停下确认)
    → 传 auto: 单次批准跑完所有任务(遇测试失败/规格歧义/高风险仍自动停下)

已有批准的 spec,希望自动交付
  → autoflow (plan → execute → code-review)
    → 批准计划,同时授权自动执行和范围内的 Blocking/Important 修复
    → 逐任务测试/评审/提交仍不可跳过,最后由你决定集成

有 bug
  → debug (4 阶段循环)

需要审查他人改动
  → code-review (Standards + Spec + Learnings)

多模块大型工作
  → clarify (自动检测并生成 capability-map.md)

代码结构拖累修改
  → refactor (改进候选)

改动完成
  → execute 读取 finish 参考，报告保留分支或由你另行执行本地合并的选项；技能不 merge、push 或发布
    → 仅明确要求丢弃时移除分支,文档仍保留

改动结束后,想留下推理过程
  → capture (docs/learnings/,可选)

learnings 与代码库漂移
  → learning-refresh (审计并刷新 docs/learnings/)

审查规划文档
  → doc-review (spec/plan/capability-map 完整性检查)

代码能跑但该清理
  → simplify (提取重复、改进命名、优化效率)
```

## 示例场景

### 场景 1: 添加简单功能

```
用户: "添加用户头像上传"

→ guide 路由到 clarify
→ clarify 问 2-3 个问题(格式?存储?尺寸限制?)
→ 呈现 spec,用户批准
→ 保存并提交 docs/features/20250120-avatar-upload/spec.md,停下
→ 用户确认后调用 plan
→ 拆分为 3 个 task:
  1. 上传 API endpoint
  2. 图片处理和存储
  3. 前端表单集成
→ 呈现计划草稿,用户批准
→ 保存并提交 plan.md,task briefs 写入 .cartoons/features/20250120-avatar-upload/impl/(不提交),停下
→ 用户确认后调用 execute
→ 依次完成 3 个 task,每个 TDD + 内置任务评审 + commit
→ 完成，报告证据；你可保留分支或另行执行本地合并，技能不代办
```

### 场景 2: Bug 修复

```
用户: "购物车总价计算错了"

→ guide 路由到 debug
→ Phase 1: 根因调查(建一条秒级、确定、可无人值守的复现命令)
→ Phase 2: 模式分析(对比同类正常代码,列出全部差异)
→ Phase 3: 假设验证("若 X 是原因,改 Y 会让 bug 消失",先排序再验)
→ Phase 4: 实施
  - 按 tdd.md 写失败测试
  - 最小修复
  - 通过后临时还原修复,确认测试变红,再恢复
  - 只暂存本次文件后提交
→ 小修复到此为止,不进入 plan/execute
```

### 场景 3: 大型跨模块工作

```
用户: "这个工作太大,跨前端、后端、CI"

→ guide 路由到 clarify (Bounded/Architectural 中选一个)
→ 选 Architectural（跨多模块）
→ Phase 1 Step 1: 读代码、read GLOSSARY/AGENTS
→ Phase 1 Step 1.5 [自动检测]: 发现需要拆分成 3 个独立能力
  - frontend app
  - backend API  
  - CI pipeline
→ 生成 capability-map.md,用户批准
→ 用户选第一个模块: frontend
→ 为该模块调用 clarify (Bounded 或 Architectural),保存 docs/features/YYYYMMDD-<module-name>/spec.md
→ 然后 plan → execute → code-review
→ 重复,直到所有模块都完成
```

## 故障排查

### 技能没触发

技能都需要用户显式调用(`/技能名`)。没有指名技能时,调用 `guide` 由它路由;路由规则见 `skills/guide/SKILL.md`。

### subagent 不可用

subagent 仅用于只读调研。运行环境没有委派机制时,技能会退化为在主进程内联探索,不影响结果。

### 术语不一致

运行 `survey`,创建 `GLOSSARY.md`。在 clarify 阶段主动建模。

### plan 任务顺序错

检查 `plan.md` 的任务列表和每个 task brief 的 `Depends on` / `Interfaces`(Consumes/Produces)声明。

### task brief 丢了(`.cartoons/` 被清掉)

`execute` 会按 spec.md 和 plan.md 就地重建 brief,并在账本里写 `brief rebuilt from plan.md`;plan 太薄重建不出来时会停下来让你重跑 `plan`。

### execute 跳过 TDD

检查项目是否有测试工具。`execute` 引用 `tdd.md` 执行 RED-GREEN-REFACTOR,配置/文档文件用最强可用检查。

### 会不会自动删东西?

**文档一律不删**:`spec.md`、`plan.md`、`AGENTS.md`、`GLOSSARY.md`、ADR、`.cartoons/` 里的账本和 task brief、review 报告,看起来过期也是留下(或由新文档取代),由你决定它离不离开磁盘。

**learning 可以归档,不能删除**:满足共享生命周期规则时移入 `docs/learnings/_archived/`,保留原因与引用关系；条件不明就留在原位并标记待核实。

**不是文档的临时物照常清理**:调试探针和日志,以及你明确要求丢弃的分支。

## 参考项目

本技能集基于两个参考体系提炼:

- **Superpowers** (obra/superpowers) — 完整流程管理,subagent 驱动开发
- **Matt Pocock Skills** (mattpocock/skills) — 工程基础,语言对齐(domain modeling + GLOSSARY.md)

其余项目以只读 submodule 挂在 `refer/` 下,只作参考,不随技能安装,也不被任何技能依赖:

- **Spec Kit** (github/spec-kit) — 规格驱动开发的工具包
- **OpenSpec** (Fission-AI/OpenSpec) — spec 框架
- **BMAD-METHOD** (bmad-code-org/BMAD-METHOD) — Agile AI Driven Development 方法论
- **ECC** (affaan-m/ECC) — agent harness 编排系统
- **gstack** (garrytan/gstack) — 个人 agent 开发栈
- **oh-my-claudecode** (Yeachan-Heo/oh-my-claudecode) — Claude Code 编排插件
- **Compound Engineering** (EveryInc/compound-engineering-plugin) — 36 个技能,围绕 brainstorm → plan → build → review → capture 循环
- **Impeccable** (pbakaus/impeccable) — 前端界面设计指导
- **Agent Skills** (addyosmani/agent-skills) — 生产级工程技能集

当前版本专注本地化开发,极简流程,直线推进。

## 许可

MIT License
