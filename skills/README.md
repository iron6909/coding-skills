# Coding Skills 体系

本地化开发的极简 coding agent 技能集,专注清晰流程和精确衔接。

## 核心概念

### `.cartoons/` 工作目录
设计和计划的工作空间。每个 semantic-name 对应一个功能:

```
.cartoons/
├── <semantic-name>/
│   ├── design.md          # 批准的设计文档
│   ├── plan.md            # 实现计划索引
│   └── impl/
│       ├── progress.md    # 执行账本
│       ├── step-1.md      # 任务详细说明
│       └── step-2.md
└── initiative/
    └── <initiative-name>/ # 多会话大型工作
```

**semantic-name 命名**: 小写 kebab-case,简短描述功能(如 `user-auth`, `cart-checkout`)。

### 设计流程术语

- **design**: 批准的功能设计文档,定义问题、目标、范围、方案、约束、验收条件。
- **plan**: 逐步实现计划,将 design 拆分为有序的可测试任务。
- **task/step**: plan 中的独立可测试单元,每个都有:
  - 明确的交付物
  - 专属的验证命令
  - 依赖声明
  - 文件清单
- **step** 也指 task 内的原子动作(如"写测试"、"运行测试"、"实现代码")。
- **execution brief**: task 的详细说明文件(`impl/step-N.md`),包含步骤、文件、接口、检查命令。
- **ledger**: `progress.md` 执行账本,记录每个 task 的开始、裁决、完成状态。

### 与 `AGENTS.md` 的关系

- **AGENTS.md**: 项目级事实和规则(栈、命令、约定、禁区),由 `init` 创建/更新。
- **GLOSSARY.md**: 项目术语表,共享语言,减少冗余解释(见下方 P0-2)。
- **ADRs**: 架构决策记录,重要选择及其原因(见下方 P0-2)。
- `.cartoons/`: 功能级工作产物,临时使用,完成后可归档或删除。

## 技能流程

### 主流程(单功能开发)

```
用户请求
   ↓
guide → 路由到合适技能
   ↓
init (可选) → 初始化 AGENTS.md
   ↓
clarify → 确认设计 → design.md
   ↓
plan → 拆分任务 → plan.md + step-*.md
   ↓
execute → 实现 + 审查 + 提交 → commits + progress.md
   ↓
完成
```

### 故障修复分支

```
用户报告故障
   ↓
debug → Phase 1-3 诊断 → Phase 4 修复
   ↓
  小 bug: 直接 fix + test + commit
  大 bug: clarify → plan → execute
```

### 多会话大型工作

```
用户说"工作太大"
   ↓
wayfinder → 创建 initiative + feature stubs
   ↓
用户选择 feature-N
   ↓
clarify feature-N → plan → execute
   ↓
重复,直到所有 features 完成
```

### 独立代码审查

```
用户说"审查这个分支/PR"
   ↓
review → Standards 轴 + Spec 轴 → 发现 + 修复
```

## 何时用 subagent

以下情况派遣 read-only subagent(用 `acp_delegate` + `agent: "researcher"`):

### 触发条件(任一满足)

1. **跨越多个独立模块/包** — 需要分别探查前端 app、后端 API、共享库。
2. **需要检查大量文件** — 如所有 callers、所有 tests、多个 config 文件。
3. **跨技术栈边界** — 前端 + 后端 + 数据层 + 基础设施都相关。
4. **主进程会溢出** — 如果保留所有文件列表或报告会导致主 context 过载。

### 拆分原则

按清晰边界拆分,每个 subagent 窄任务:

- **模块 + 调用者**: 探查某模块及其所有依赖方。
- **测试 + 约定**: 检查相关测试及测试命令/helper。
- **接口 + 配置**: 探查接口、schema、build 规则、生成路径。

### subagent 约束

- **Read-only**: 不问用户、不做产品决策、不写 `.cartoons`、不编辑代码、不创建分支、不派遣其他 agent。
- **只报告**: 返回边界、文件、行为、约束、测试方法、证据路径、未知项、冲突。
- **主进程拥有所有写操作**: 所有 design、plan、code、commit 由主进程完成。

### 合并 subagent 发现

- **仓库事实** — 保留。
- **用户决策** — 保留。
- **Agent 建议** — 总结,不复制完整报告。
- **未解决问题** — 标记。
- **冲突** — 标记为未解决,直到证据或用户决定。

不要将完整 subagent 报告复制到主 context。只总结与 plan 相关的发现。

## 技能职责

### 路由和初始化

- **guide**: 路由到最小合适技能,然后立即执行该技能。
- **init**: 检查工作区,创建或更新 `AGENTS.md`(项目事实和规则)。

### 设计和计划

- **clarify**: 澄清请求,确认设计,保存到 `.cartoons/<name>/design.md`。
- **plan**: 将批准的 design 拆分为小任务,保存 `plan.md` + `impl/step-*.md`。

### 实现和测试

- **execute**: 实现 plan 或小改动,每个 task 后审查,通过后提交。
- **tdd**: TDD 纪律(红-绿循环),在 `execute` 内加载。
- **debug**: 重现、诊断、修复、回归测试故障。

### 审查和规划

- **review**: 两轴审查(Standards + Spec)分支或 PR。
- **wayfinder**: 多会话大型工作,创建 initiative 和 feature stubs。

## 示例场景

### 场景 1: 简单功能

```
用户: "添加用户头像上传"
  → guide 路由到 clarify
  → clarify 问 2-3 个问题,呈现简短设计
  → 用户批准
  → 保存 .cartoons/avatar-upload/design.md
  → 自动转到 plan
  → plan 拆分为 3 个 task
  → 保存 plan.md + impl/step-1.md ~ step-3.md
  → 自动转到 execute
  → execute 依次完成 3 个 task,每个 review + commit
  → 完成,报告证据
```

### 场景 2: Bug 修复

```
用户: "购物车总价计算错了"
  → guide 路由到 debug
  → debug Phase 1: 重现,找到 cart-total.ts:45 的逻辑错误
  → Phase 2: 对比正确示例
  → Phase 3: 形成假设
  → Phase 4: 写失败测试,修复,测试通过,提交
  → 不调用 execute(小 bug 直接修)
```

### 场景 3: 大型跨模块工作

```
用户: "这个工作太大,跨前端、后端、CI"
  → guide 路由到 wayfinder
  → wayfinder 识别边界: frontend app, backend API, CI pipeline
  → 定义 3 个 features,创建 initiative + stubs
  → 用户选 feature-1: frontend
  → 读 feature-1 stub,调用 clarify 创建完整 design
  → 然后 plan → execute
  → 重复,直到 3 个 features 都完成
```

## 文件路径规则

所有路径在提及时保持完整,不省略目录前缀:

- ✅ `src/utils/cart-total.ts:45`
- ✅ `.cartoons/avatar-upload/design.md`
- ❌ `cart-total.ts` (无法定位)
- ❌ `design.md` (模糊)

## 版本和更新

本技能集基于两个参考体系提炼:

- **Superpowers**: 完整流程管理(brainstorming → worktrees → subagent-driven-development)。
- **Matt Pocock Skills**: 语言对齐(grilling + domain modeling + GLOSSARY.md)。

当前版本专注本地化开发,极简流程,直线推进。

## 待扩展(P1/P2)

当前体系覆盖核心流程。以下增强在 P1/P2 优先级:

- **探索式对话**(类似 grill-me): 模糊需求时的深度追问。
- **prototype**: 抛弃式原型验证设计假设。
- **research**: 外部知识调研(库对比、最佳实践)。
- **retro**: 会话后改进开发环境。
- **worktree 管理**(可选): 隔离工作区,完成后清理。

这些待用户需求验证后再添加。
