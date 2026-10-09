# Domain Modeling

主动建立和锐化项目领域模型。挑战术语,用场景压测,内联更新 `GLOSSARY.md` 和 ADRs。

这是**改变**模型的主动纪律。单纯读取 `GLOSSARY.md` 使用术语是任何技能的一行习惯。

## 文件结构

**单上下文(大多数仓库)**:

```
/
├── GLOSSARY.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

**多上下文(monorepos)**:

```
/
├── GLOSSARY-MAP.md
├── docs/
│   └── adr/                          ← 系统级决策
├── src/
│   ├── ordering/
│   │   ├── GLOSSARY.md
│   │   └── docs/adr/                 ← 上下文级决策
│   └── billing/
│       ├── GLOSSARY.md
│       └── docs/adr/
```

惰性创建:仅当有内容写入时。

## 会话中行为

### 对照术语表挑战

用户使用的术语与 `GLOSSARY.md` 冲突时,立即指出:"你的术语表定义 'cancellation' 是 X,但你似乎指 Y。是哪个?"

### 锐化模糊语言

用户使用模糊或多义术语时,提出精确规范术语:"你说 'account':是指 Customer 还是 User?它们是不同的。"

### 讨论具体场景

讨论领域关系时,用具体场景压测。发明探测边界的边缘案例,强制用户精确说明概念间边界。

### 与代码交叉对照

用户陈述某事如何运作时,检查代码是否同意。暴露矛盾:"你的代码取消整个 Order,但你刚说支持部分取消。是哪个?"

### 内联更新 GLOSSARY.md

术语确定后,立即更新 `GLOSSARY.md`。不要批量处理。使用 `glossary-format.md` 格式。

`GLOSSARY.md` 不含实现细节。不要把它当作 spec、草稿本或实现决策仓库。它只是术语表。

### 谨慎提供 ADR

**仅当三条全满足**时才提供创建 ADR:

1. **难以逆转**: 改变主意的成本显著
2. **无上下文令人意外**: 未来读者会疑惑"为什么这样做?"
3. **真实权衡的结果**: 有多个可行方案,因特定原因选了一个

任一条不满足,跳过 ADR。使用 `adr-format.md` 格式。
