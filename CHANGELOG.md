# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.1] - 2026-10-15

### Fixed

- **共享引用与提交边界**：修复 simplify 的过期共享副本和未登记副本漏检，遇到无关暂存或无法分离的混合改动时停止询问，不再代办合并、推送或发布。
- **执行与设计批准**：在可能产生不可逆副作用的动作前取得授权，新增设计决定先批准再保存，UI 修复先验证再提交，验证不可用时明确保留未验证状态。
- **需求追溯**：统一 spec、计划与提交中的稳定需求引用及 Testing Boundary 用词，无 spec 的小改动不再编造 REQ-N。
- **技能交接与恢复**：仅在界面决策未定时建议 UI 设计，ideate 不再自动调用下一技能，handoff 保留未保存且未批准的 spec 草稿但不绕过 Brief 档边界。
- **UI 无障碍检查**：修正大字阈值、对比度示例及原生控件判定，区分有效可访问名称、角色键盘行为与具体写法，也不再将触摸设计目标误判为 AA 要求。
- **UI 设计与证据**：按界面模式、字体角色和已有系统应用设计规则，按实际影响分级，并区分源码、渲染和交互证据，避免凭字体、间距数列或 CSS 写法直接判错。
- **文档与代码评审**：统一 lens 配置位置和报告规范，各维度保留完整严重度范围，无法验证或未满足的验收条件不再因模板而被降级。
- **清理范围与报告保留**：simplify 使用实际本地基线并覆盖请求范围内的未提交改动，UI 评审和优化实验遇到同名路径时保留旧报告，后续引用沿用实际新路径。
- **ideate 候选与证据**：按筛选后的实际数量汇报方案，搜索不可用时使用本地及用户材料继续，并标出未经验证的外部判断。

## [2.0.0] - 2026-10-15

### Breaking Changes

- **[autoflow] 自动化收敛为三个阶段**
  - 仅从已批准的 spec 执行 `plan` → `execute` → `code-review`；需求澄清和 UI 决策须事先完成，计划与限定范围的修复权限仍需批准
  - 不再自动推断或批准需求，也不负责合并、推送或部署
- **[autoflow] 配置与恢复约定调整**
  - 移除 TOML 配置及伪参数约定，统一四种调用模式与三阶段状态结构
  - 旧状态保留但不自动迁移，也不能作为执行授权；恢复前须核验规格、计划、分支、提交与审批证据

### Fixed

- **文档保留与学习归档**：清理、回退和丢弃分支时保留文档；learning 仅在满足生命周期门槛后移入 `docs/learnings/_archived/`，不删除或覆盖归档副本
- **learning 文档一致性**：统一 `capture`、`learning-refresh` 及消费方的格式、激活范围、晋升与归档条件，并保留旧格式的兼容处理
- **评审基准与提交边界**：固定功能分支的评审基准，修正任务评审范围与宽泛暂存指令，避免漏审或提交无关改动
- **[debug] 验证要求冲突**：缺少可行测试入口时允许说明理由并使用可复现的替代检查，完成条件与报告不再将其误称为自动回归测试
- **[optimize] 迭代与停止条件**：保留可调整的收益和预算阈值，达到目标即停止；逐个提交有效变体，不再自行合并或删除分支
- **[simplify] SQL 抽象示例**：移除动态拼接表名的通用查询示例，保留固定标识符、参数绑定与领域边界

### Changed

- 统一 task/step、审查维度、输出路径和交接章节，清理失效路由、重复描述及模板残留；共享规则仅维护源文件并同步到消费技能

## [1.3.3] - 2026-10-14

### Fixed

- **[doc-review] `severity.md` 与共享源不同步**
  - 该文件带着 `do not edit` 头，内容却是过期的文档版；且 `doc-review` 不在 `MAP` 里，`--check` 永远看不见它
  - 加入 `MAP` 并重新同步，四个技能共用同一份三级定级说明
  - 顺带删除共享源里手写的 `Copied into: ...` 过期头（它列着并不存在的 `research`），同步后 40 多份副本一起变干净
  - 详见：commit ea53493
- **提交前检查的 `../` grep 误报**
  - `docs/features/...` 这类省略号被判为上级路径，3 条假命中
  - 改为排除 `...`
  - 详见：commit 47d3202

### Changed

- **`AGENTS.md` 只保留开发规则**（221 → 113 行）
  - 删除两张会漂移的清单表（共享文件归属、各技能自有 reference），清单只保留在 `scripts/sync-references.mjs` 的 `MAP` 和目录本身
  - 输出路径清单、提交归属表、面向用户的术语移入 `README.md`；通用 semver 科普删除，`Quick Reference` 合并进发布步骤
- **`README.md` 承接移出的项目事实**
  - 文档结构树补上 `ui-spec.md`、`DESIGN.md`、`.cartoons/ui-review/`
  - `提交责任` 由一句话改为表格；删除过时的 `spike` 说明（`clarify` 明确不写 `spike.md`）
  - 详见：commit 47d3202

### Added

- **`--check` 扩展为全套 reference 检查**
  - 除共享副本同步外，新增两项：每个 `references/*.md` 都被本技能 `SKILL.md` 提到；每个被提到的 `./references/<file>` 都存在
  - 详见：commit ea53493

## [1.3.2] - 2026-10-14

### Fixed

- **`README.md` 快速开始** 示例补上 `/guide`,与"由 `guide` 路由"的说明一致

### Changed

- **`README.md` 移除过时章节**
  - 删除"与参考材料的差异"对比表,参考体系已变化,表格不再准确
  - 删除"design 还是 spec?"问答,术语已统一为 spec
- **`README.md` "版本和更新" → "参考项目"**
  - 标题与内容不符,改为参考项目
  - 补齐 `refer/` 下全部 11 个参考项目(submodule),并注明只读、不随技能安装、不被技能依赖
- **清理范围口径修正(`README.md` / `AGENTS.md`)**
  - 删掉废弃技能残留的"项目外的抛弃式原型"与 `prototype/<name>` 一次性分支描述
  - 保留调试探针日志与"用户明确要求丢弃的分支",后者对应 `execute/references/finish.md` 的 Discard 选项
  - 详见:commit 6cfaa0e, 1d23370

## [1.3.1] - 2026-10-14

### Fixed

- **[ui-design] / [ui-review] 自包含性修复**
  - 移除 `ui-review` 对 `ui-design` 的跨技能引用
  - 移除两个技能中对体系外工具的署名,技能不再指向自己目录之外的任何东西
  - reference 引用统一为 `./references/<name>.md` 写法,提交前检查可识别
  - 详见:commit b6a2b18

### Changed

- **[ui-design] / [ui-review] 技能瘦身**
  - 两个 SKILL.md 分别从 349/433 行降到 137/109 行,原先比 `plan`、`execute` 还长
  - 检查项、模板、状态清单只留在 references,SKILL.md 不再重复(单一事实来源)
  - 移除 `ui-design` 中"自动路由到 plan"的表述,改用告知下一步
  - 详见:commit 4960568, b6a2b18
- **[plan] 读取 `ui-spec.md`**
  - spec 同目录存在 `ui-spec.md` 时一并读取,界面决策不再在交接处丢失
  - 详见:commit 09cddc5
- **`README.md` 流程图** 补充 `ui-design`、`ui-review` 节点
  - 详见:commit 7d56015

### Added

- **`refer/impeccable`** 作为第三个只读参考来源纳入 submodule
  - `.gitmodules` 条目在 1.3.0 已加入,本次补上 gitlink
  - 详见:commit c8a9fed

## [1.3.0] - 2026-10-14

### Added

- **[ui-design] 前端界面设计规划技能**
  - 位于 `clarify` 与 `plan` 之间,为涉及前端界面的 spec 产出设计规格
  - 产物:`DESIGN.md`(设计系统,缺失时创建)、`docs/features/YYYYMMDD-<name>/ui-spec.md`(界面规格)
  - 自带 references:`design-principles.md`、`wcag-checklist.md`、`component-states.md`
- **[ui-review] 前端界面审查技能**
  - 审查已实现的前端界面,覆盖一致性、可用性、可访问性、响应式、性能五个维度
  - 产物:`.cartoons/ui-review/YYYYMMDD-HHMM.md`;修复需用户同意后按 finding 逐个提交
  - 自带 references:`ui-review-checklist.md`、`common-ui-mistakes.md`

### Changed

- **[guide] 新增 ui-design / ui-review 路由规则**,路由序号顺延
- **`README.md` 技能表与 `AGENTS.md`** 同步补充两个技能的 references 所有者、输出路径和提交归属

## [1.2.2] - 2026-10-14

### Changed

- **[plan] 简化档位系统**
  - 移除 Direct 档，合并到 Brief 档
  - 从三档（Direct/Brief/Full）简化为两档（Brief/Full）
  - Brief 判据：≤5 文件、单模块、不触及 hard floors
  - 移除了"无行为变更"和"遵循已有模式"等模糊判据
  - 影响文件：`skills/plan/SKILL.md`, `skills/plan/references/output-tier.md`, `skills/guide/SKILL.md`, `skills/execute/SKILL.md`, `README.md`
  - 详见：commit 49e341f, 4831530

## [1.2.0] - 2026-10-14

### Changed

- **[重大重构] 文档命名规范完整统一**
  - 时间戳格式：统一为 `YYYYMMDD`（8位紧凑格式）
  - 目录结构：`.cartoons/` 按技能组织子目录，避免根目录混乱
  - 命名顺序：统一为日期在前，语义在后（如 `20261014-1530-auth-flow.md`）
  - 影响：所有技能的输出路径和文档命名
  - 优势：自然时间排序、快速定位、完全一致
  - 详见：commit 9982cd4, 4ba4816, 9b6a3af

### Added

- **版本管理规范** 添加到 `AGENTS.md`
  - 语义化版本规则（patch/minor/major）
  - `npm version` 工作流程
  - Git tag 自动创建和同步

### 路径映射对照

新旧路径对比，帮助用户迁移：

| 旧路径 | 新路径 |
|--------|--------|
| `docs/features/2025-01-15-user-auth/` | `docs/features/20250115-user-auth/` |
| `docs/learnings/2025-01-15-topic.md` | `docs/learnings/20250115-topic.md` |
| `.cartoons/2025-01-15-user-auth/impl/` | `.cartoons/features/20250115-user-auth/impl/` |
| `.cartoons/handoff-20250115-1430.md` | `.cartoons/handoff/20250115-1430.md` |
| `.cartoons/optimize-20250115-1430/` | `.cartoons/optimize/20250115-1430/` |
| `.cartoons/ideation/auth-flow-20250115-1530.md` | `.cartoons/ideation/20250115-1530-auth-flow.md` |
| `.cartoons/refactor/refactor-2025-01-15-scope.md` | `.cartoons/refactor/20250115-scope.md` |

## [1.1.0] - 2026-10-14

### Fixed
- 修复发布配置中的仓库名称和用户名

## [1.0.0] - 2026-10-13

### Added
- 初始发布：18 个核心技能
- 完整的工作流：survey → clarify → plan → execute
- 支持 TDD、代码审查、重构、性能优化
- 本地化开发，无需外部 issue tracker

[Unreleased]: https://github.com/iron6909/coding-skills/compare/v2.0.1...HEAD
[2.0.1]: https://github.com/iron6909/coding-skills/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/iron6909/coding-skills/compare/v1.3.3...v2.0.0
[1.3.3]: https://github.com/iron6909/coding-skills/compare/v1.3.2...v1.3.3
[1.3.2]: https://github.com/iron6909/coding-skills/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/iron6909/coding-skills/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/iron6909/coding-skills/compare/v1.2.2...v1.3.0
[1.2.2]: https://github.com/iron6909/coding-skills/compare/v1.2.0...v1.2.2
[1.2.0]: https://github.com/iron6909/coding-skills/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/iron6909/coding-skills/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/iron6909/coding-skills/releases/tag/v1.0.0
