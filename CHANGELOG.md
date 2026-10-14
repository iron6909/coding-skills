# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **[重大重构] 文档命名规范完整统一** (2026-10-14)
  - 时间戳格式：统一为 `YYYYMMDD`（8位紧凑格式）
  - 目录结构：`.cartoons/` 按技能组织子目录，避免根目录混乱
  - 命名顺序：统一为日期在前，语义在后（如 `20261014-1530-auth-flow.md`）
  - 影响：所有技能的输出路径和文档命名
  - 优势：自然时间排序、快速定位、完全一致
  - 详见：commit 9982cd4, 4ba4816, 9b6a3af

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

[Unreleased]: https://github.com/iron6909/coding-skills/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/iron6909/coding-skills/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/iron6909/coding-skills/releases/tag/v1.0.0
