# Coding Skills

[![skills.sh](https://skills.sh/b/iron6909/coding-skills)](https://skills.sh/iron6909/coding-skills)

coding agent 编码技能集，专注清晰流程和本地化开发。需求、计划和工作记录都使用本地文件，不依赖 issue tracker。可作为 Pi 原生包加载，也保留 skills.sh 安装方式。

## 安装

### Pi Coding Agent

先安装 Pi，使用 Node >=22.19。npm 版本发布后，在要使用技能的项目目录执行：

```bash
pi install npm:@iron6909/coding-skills
pi
```

默认使用 Pi 的个人安装位置；仅在当前项目启用时加 `--local`，包声明会写入项目的 `.pi/settings.json`。按 Pi 提示确认项目资源信任，已有交互会话可用 `/reload` 重载资源。

发布前或本地开发时，仍可用 `pi install "/path/to/coding-skills" --local` 加载本地副本，路径替换为克隆目录。`v5.0.1` 标签不含此入口。其他包源与资源筛选见 [Pi Packages](https://pi.dev/docs/latest/packages)。

### 其他宿主

通过 skills.sh 安装便携技能：

```bash
npx skills@latest add iron6909/coding-skills
```

也可以手动克隆仓库，将需要的完整技能目录复制到项目的 `.agents/skills/`。

## 快速开始

完整功能可在 Pi 的项目会话中按需调用以下阶段，不要求每次全部走完：

```text
/coding survey                         # 需要记录或刷新项目事实时
/coding spike 验证候选方案的关键假设       # 仅设计阶段需要证据时，结果交回 ideate
/coding spec 添加用户头像上传             # 澄清需求，批准整体规格
/coding plan                           # 审阅并制定计划
/coding execute
/coding code-review                    # 需要整体独立审查时另行调用
```

也可用 Pi 原生的 `/skill:spec 添加用户头像上传` 等写法。其他宿主按各自语法调用同名技能，比如 `/spec`；本包不为 Pi 注册这些短别名。`clarify` 已拆为 `spec` 与 `spike`，不保留旧入口；已有规格、计划和历史记录继续保留。

方案尚未收敛时用 `ideate`；候选方案有决定选型的关键未知时，用 `spike` 取得证据，再由 `ideate` 更新候选、取舍和选择。验证对象不等于最终选型，不要求逐一实验所有候选。已定且有充分依据的方案可直接用 `spec`，不强制先运行 `ideate` 或 `spike`。外部设计由所属技能完整内化：仍需方案决策的进入 `ideate`，已经就绪的进入 `spec`；`spike` 只保存实验相关输入与证据。若界面决策尚未确定，先通过 `/coding ui-design` 或其他明确批准的设计解决，再制定计划。已知范围与验收条件的小改动直接用 `/coding execute`，不要求先建项目文档。局部需求只缺少一个行为决定时，`spec` 使用短规格一次确认，不另做产品审批。

技能需要显式调用，不会自动触发。不知道选哪个时，可使用 `guide`，运行 `/coding guide 添加用户头像上传`，由它选择入口；目标缺装时会提示，不会自动安装。

## 技能速查

### 核心技能

以下六个技能整体安装，不要求每次全部调用；`spike` 是设计阶段的可选验证入口，不是写规格前的必经阶段。需要形成或调整方案时使用辅助技能 `ideate`。

| 技能 | 何时使用 |
|------|----------|
| [survey](skills/survey/SKILL.md) | 需要记录或更新项目事实与术语 |
| [spike](skills/spike/SKILL.md) | 验证候选方案的关键假设，保存证据并交回方案设计 |
| [spec](skills/spec/SKILL.md) | 澄清需求，内化已有设计，形成整体正式规格；不拆开发批次 |
| [plan](skills/plan/SKILL.md) | 规格已批准，需要拆分可验证的任务 |
| [execute](skills/execute/SKILL.md) | 执行已批准的计划，或实现范围明确的小改动 |
| [code-review](skills/code-review/SKILL.md) | 对本地分支改动做整体独立审查 |

### 辅助技能

| 技能 | 何时使用 |
|------|----------|
| [guide](skills/guide/SKILL.md) | 不确定该从哪个技能开始 |
| [ideate](skills/ideate/SKILL.md) | 形成和收敛方案，依据验证证据更新候选、取舍和选择 |
| [ui-design](skills/ui-design/SKILL.md) | 规格已批准，界面与交互设计尚未确定 |
| [ui-review](skills/ui-review/SKILL.md) | 审查已实现的前端界面 |
| [debug](skills/debug/SKILL.md) | 定位并修复故障 |
| [optimize](skills/optimize/SKILL.md) | 根据测量结果优化性能 |
| [commit](skills/commit/SKILL.md) | 提交指定的临时改动 |
| [autoflow](skills/autoflow/SKILL.md) | 从已批准的规格编排计划、实现与审查 |
| [refactor](skills/refactor/SKILL.md) | 代码结构拖累修改，需要找出重构候选 |
| [capture](skills/capture/SKILL.md) | 保存功能或修复中值得保留的推理与经验 |
| [learning-refresh](skills/learning-refresh/SKILL.md) | 已记录的经验与代码现状不一致 |
| [doc-review](skills/doc-review/SKILL.md) | 检查方案、验证报告、规格、计划或历史能力拆分文档 |
| [simplify](skills/simplify/SKILL.md) | 代码已能运行，需要简化与清理 |
| [handoff](skills/handoff/SKILL.md) | 暂停工作，留待其他会话继续 |

## 使用示例

### 修复故障

```text
/coding debug 购物车总价计算错误，使用优惠券后金额没有变化
```

定位原因、补充回归验证并提交修复。小修复不必再走一遍需求与计划流程。

### 从规格自动交付

```text
/coding autoflow 根据已批准的用户头像上传规格完成开发
```

需先安装 `autoflow`，准备好已批准的规格，并确定界面决策。它只编排 `plan → execute → code-review`：计划仍需批准，同时授权后续执行与范围内的 Blocking/Important 修复，不代做需求澄清或界面设计。

## 关键概念

**proposal** 是候选方案，**spike** 是验证证据，**spec** 是正式设计与验收契约，**plan** 是实施任务安排。只有 `plan` 拆解开发工作；模块职责属于规格，开发批次属于计划，大型系统不要求逐模块建立子规格。

`ideate` 负责方案设计与选择，`spike` 只回答其中需要证据的可行性问题，所有结果都交回 `ideate`，不直接推进到规格、计划或实施。候选全部被否定时，重新设计或请用户决定是否调整约束；证据不足不等于方案不可行，也不能默认通过。规格可以定义尚待实现的验收目标，但不能把未经验证的猜测写成已成立的事实。

`spec`、`plan`、`execute` 不组织可行性探索。若后续发现设计前提失效，停止受影响工作，退回 `ideate` 重新处理设计；必要的验证仍属于设计阶段。设计变化经规格及计划的相应审批后才能继续。普通实现错误、回归检查和产品验收留在原有实施或调试流程。

**task** 是独立可测试的交付单元。计划可留在当前会话，也可为跨会话使用保存为一份包含任务细节的 `plan.md`；两者保留相同的需求覆盖、依赖、接口和验证信息，只有任务说明很长时才另拆 brief。阶段只是同一计划的任务分组。文件数、行数或跨模块本身不决定流程重量，风险授权和验证要求仍保留。

已有行为无需修改时，计划记录既有实现与测试证据及最终复核项，不虚构开发任务或完成历史。执行时可按仓库证据校正路径、名称和等价检查命令，并在工作记录中说明；交付物、任务边界、需求覆盖、依赖、共享契约或验证保证的变化仍须通过计划修订审批。

### 文档结构

同一交付范围的方案、验证报告、规格与计划永久保存在 `docs/features/`，按需生成，不要求四份齐全。外部设计的所有实施所需内容必须进入内部文档；原路径和 URL 仅作溯源。正式规格批准后，规划与开发不再依赖原件、候选方案或会话；必要的内部附录与规格一同保存、提交并明确列为必读。

经验保存在 `docs/learnings/`；`.coding/` 存放工作记录、报告和用户配置。项目根目录的 `AGENTS.md`、`GLOSSARY.md`、`DESIGN.md` 分别记录项目事实、术语和设计系统，按需创建。

<details>
<summary>查看具体输出路径</summary>

`YYYYMMDD-<name>` 使用日期与 2～4 个 kebab-case 单词命名；时间戳使用 `YYYYMMDD-HHMM`。

```text
/
├── docs/
│   ├── features/YYYYMMDD-<name>/
│   │   ├── proposal.md                 # 可选：候选方案或待验证外部设计的内部版本
│   │   ├── spike.md                    # 可选：设计验证证据、结论与边界；后续实验追加
│   │   ├── spec.md                     # 批准的整体规格
│   │   ├── plan.md                     # 任务及验证细节，可按阶段分组
│   │   ├── ui-spec.md                  # 界面规格（有界面设计时）
│   │   └── <appendix>.md               # 必要时的内部附录，由所属文档明确引用
│   ├── learnings/
│   │   ├── YYYYMMDD-<topic>.md         # 经验文档
│   │   └── _archived/                  # 旧经验归档，保留原文
│   └── adr/                            # 架构决策记录
└── .coding/
    ├── features/YYYYMMDD-<name>/
    │   ├── impl/
    │   │   ├── progress.md             # 执行账本
    │   │   └── task-<N>.md              # 可选的补充任务说明
    │   └── review-YYYYMMDD-HHMM.md      # 功能内代码审查
    ├── handoff/YYYYMMDD-HHMM[-<topic>].md
    ├── optimize/YYYYMMDD-HHMM/          # baseline.md、variant-<N>.md、summary.md
    ├── refactor/YYYYMMDD-<scope>.md
    ├── review/YYYYMMDD-HHMM-<topic>.md  # 独立代码审查
    ├── ui-review/YYYYMMDD-HHMM.md
    ├── autoflow-state.json             # 旧运行可保留为 autoflow-state-YYYYMMDD-HHMM.json
    ├── review-lenses.toml              # 审查镜头配置
    └── review-lenses.md                # 同一配置的另一形式，二选一
```

</details>

旧 `.coding/ideation/` 报告和 `capability-map.md` 保留为历史资料，不再默认生成，也不自动迁移或删除。

### 使用约定

- 候选方案不等于规格，验证结论不等于选型或实施授权。`spike` 先明确候选、问题、判据和安全边界，再如实保存结果；不额外要求批准实验事实。具体高风险操作仍需专项授权。
- 规格和计划需要批准。`execute` 按测试驱动方式持续完成已批准任务，逐任务自查、验证与提交，最后进行最终验证；遇到范围变化、未解决的失败、歧义或高风险决策会停下。
- 任务自查不等于整体独立审查。`code-review`、`ui-review` 先出报告，修复需要授权；必要验证无法完成时，须明确接受边界并保留未验证标记。
- 技能不自动合并、推送或发布，也不删除文档，包括工作记录和审查报告。旧经验满足归档条件时可归档，临时探针和日志仍可清理。
- `.coding/` 是否忽略或自行提交由用户决定，技能不改变忽略或跟踪规则。

### 提交责任

只暂存各技能负责的文件；工作状态、任务说明和报告不自动提交。

| 技能 | 提交内容 |
|------|----------|
| survey、ideate、spike、spec、plan、capture、learning-refresh、ui-design | 自己产出或更新的项目文档与必要内部附录 |
| execute、debug | 每个任务或每次修复的代码 |
| simplify、optimize | 简化或优化后的代码 |
| doc-review | 用户确认后的非语义修正；语义改动交回 ideate/spike/spec/plan 各自处理，不改写实验事实 |
| code-review、ui-review | 经授权的修复单独提交，遵守上述验证约定，不包含被审查的原始改动；报告不提交 |
| autoflow | 编排 plan、execute、code-review 各自的提交 |
| commit | 用户指定的临时改动 |
| refactor、handoff | 不提交，只留下报告或交接记录 |

## Pi 入口与边界

- `/coding` 显示本包当前加载且无歧义的技能，不启动模型。`/coding <skill> [arguments]` 只调用选定技能，参数交给 Pi 原生技能展开。
- 技能缺失、被筛选或来源冲突时拒绝启动，不回退到同名外部技能。停用扩展但保留技能时仍可使用 `/skill:<skill>`，原生同名资源的选择由 Pi 负责，使用前核对来源。
- 忙碌时拒绝新任务，不插队也不排队，帮助仍可查看。交互界面和 RPC 使用通知；`--print` 的帮助与错误写入 stderr，JSON 模式使用原生消息记录。非交互调用会等待本次模型轮次完成。

扩展不提供子代理、浏览器或 Web 检索工具，也不编排后续阶段。宿主缺少能力时按技能说明降级或报告无法验证，不能把自查冒充独立审查。审批、验证、提交和恢复规则仍由技能指导模型执行，不是代码级强制门控。扩展和代理使用 Pi 宿主的权限，不构成沙箱；项目信任和工具权限按 Pi 配置决定。

## 验证

在仓库克隆中执行，维护脚本不随包安装：

```bash
node scripts/pi-extension.test.mjs
npm pack --dry-run --json --offline
```

便携包保留原有 Node >=18 声明；Pi 及上述扩展自检使用 Node >=22.19，无需另加构建步骤。

已在 Windows、Node 24.10.0、Pi 1.3.0 上验证本地安装、SDK 原生展开、资源筛选与重载、来源冲突，以及 CLI 打印、JSON 和 RPC 协议。集成检查使用本地固定响应桩，不证明模型遵守技能指令。TUI 只验证了命令绑定，未做真实终端交互；其他版本与平台未验证。

此前使用 `openai/gpt-6.1-sol` 在独立本地仓库验证了 spike 安全边界、优化检查阻塞和历史区间审查，共五个变体，每个变体的新旧版各运行一次。此前轻量路径调整另对六类场景的七个变体完成新旧版各一次实跑，观察到重复审批、空记录和强制任务简报减少；部分检查两版均通过，另有一次环境相关账本写入失败。这些历史结果不证明本次技能拆分后的行为。

本次拆分后，使用同一模型在独立本地夹具完成十类场景的十四次执行，每变体一次，保留实际工具轨迹、审批交互、产物和初末 Git/文件状态。观察到已定设计直接进入规格、spike 区分支持/否定/证据不足、整系统单计划、设计前提失效时定向停止，以及四种必读附录批准失效时拒绝续跑。独立断源会话只收到批准的内部合成 SQLite 规格，仍生成覆盖三十条验收条件的完整计划，并在另一次计划批准后仅提交计划；这不证明真实知识库的 PostgreSQL、向量检索或生产性能。

首轮夹具的唯一答复输出配置覆盖了技能文档路径，干扰了 `ideate` 默认提议路径及提交门槛，两条断言保留为夹具阻塞，不能归因于技能失败。经授权关闭输出覆盖、在实际选择门槛完整回复预设内容后，使用同一技能快照另完成一次独立补测：未选择提议先保存并提交，用户选择后保留候选、追加理由并再次提交，只改同一份提议，不自动启动实验、规格或实现。补测未修改技能，也未改写首轮结果。

本次 `spike` 边界修订使用同一模型在独立本地夹具实跑六类场景的七个变体，每个变体一次，另用全新会话仅凭报告重建并运行探针。24 项预声明检查与独立复现均通过，覆盖就地补问判据、源码取证、报告可重建、三类结论、普通验收拒绝，以及外部效果与用户改动保全，不代表其他问题或生产环境已验证。

本轮没有新旧版对照，单次观察不等于通用遵循率。完整执行与审查闭环、真实并行镜头传递及其他模型、平台仍未实跑。场景定义见 `scripts/workflow-cases.json`，结构检查通过不等于代理行为通过。

## 参考与许可

主要借鉴 [Superpowers](https://github.com/obra/superpowers) 与 [Matt Pocock Skills](https://github.com/mattpocock/skills)。`refer/` 中的项目仅供参考，不随技能安装，也不是运行依赖。

采用 [MIT License](LICENSE)。
