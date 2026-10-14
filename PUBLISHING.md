# 发布到 skills.sh 指南

本文档说明如何将此技能集发布到 skills.sh 注册中心。

## 前提条件

- [x] GitHub 仓库已公开
- [x] 技能结构符合规范（`skills/` 目录，每个技能有 `SKILL.md`）
- [x] 有完整的 `README.md`
- [x] 已添加 `package.json` 用于版本管理

## 发布步骤

### 1. 在 skills.sh 注册

1. 访问 https://skills.sh/
2. 使用 GitHub 账号登录
3. 点击 "Submit a skill" 或类似按钮
4. 提交你的仓库信息：
   - 仓库 URL: `https://github.com/iron6909/Skills`
   - 用户名: `iron6909`
   - 技能包名: `skills`

### 2. 等待审核

skills.sh 团队会审核你的提交，确保：
- 仓库结构符合规范
- 技能定义完整（每个 `SKILL.md` 有必需的 frontmatter）
- README 说明清晰

### 3. 测试安装

审核通过后，测试安装命令：

```bash
# 在测试项目中运行
npx skills@latest add iron6909/skills
```

选择要安装的技能，确认它们正确复制到 `.claude/skills/`。

### 4. 更新版本

后续更新时：

1. 修改 `package.json` 中的 `version`（遵循[语义化版本](https://semver.org/lang/zh-CN/)）
2. 更新 `CHANGELOG.md`（如果有）
3. 提交并推送到 GitHub
4. skills.sh 会自动同步最新版本

用户可以通过以下命令更新：

```bash
npx skills@latest update tszhang/skills
```

## 版本管理建议

- **补丁版本** (1.0.x): 修复 bug、文档更新
- **次要版本** (1.x.0): 添加新技能、向后兼容的功能增强
- **主要版本** (x.0.0): 破坏性变更、重大重构

## 推广

发布后，可以：

1. 在 README 中展示 skills.sh 徽章（已添加）
2. 在社交媒体分享
3. 在相关社区（如 Claude 中文社区）介绍
4. 编写博客文章说明技能集的设计理念

## 维护

- 定期检查 GitHub Issues 中的用户反馈
- 根据用户需求迭代改进技能
- 保持与 Claude Code 最新版本的兼容性
- 更新参考材料（`refer/` 子模块）

## 许可证

本项目使用 MIT 许可证，用户可以自由使用、修改和分发。

## 联系方式

- GitHub Issues: https://github.com/iron6909/Skills/issues
- 邮件: [你的邮箱]
