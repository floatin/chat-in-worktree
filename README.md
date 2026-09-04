# chat-in-worktree

Pi Agent 扩展：为「chat with doc」工作流提供多模式 worktree 隔离。

## 理念

所有模式（discuss / design / experiment / produce / maintain）都在独立的 git worktree 中工作，
中间产物留在隔离环境中，仅通过显式标记 (`sync: true`) 的核心产物才会同步回父仓库。

## 快速开始

```bash
bash install.sh my-project    # 生成项目（或在一个已有目录里运行）
cd my-project
npm install
npm run build
npm test
```

## 使用

在 Pi Agent 中：

```
/mode discuss 我们来讨论一下认证方案
/mode design 设计新的 API 层
/mode experiment 验证 WebSocket 方案是否可行
/mode produce 实现用户注册功能
/mode maintain 修复登录页的并发 bug
```

## 产物标记协议

在 worktree 内创建的文件，通过 frontmatter 声明同步意图：

```yaml
---
sync: true
target: memory | core-file | branch
---
```

| Marker | 行为 |
|---|---|
| 无标记 / `sync: false` | 中间产物，随 worktree 自动清理 |
| `target: memory` | 写入 `docs/memory/`（决策/约束/反模式） |
| `target: core-file` | 核心产物，通过分支合并回父仓库 |
| `target: branch` | 整个 worktree 的改动保留在 `pi-agent-*` 分支 |

## 架构

```
Extension (/mode 命令 + chat_in_worktree 工具)
    ↓ 派生子 Agent
pi-subagents (isolation: "worktree" 硬保证)
    ↓ 模式纪律
Skills (每模式的 SKILL.md)
    ↓ 产物同步
MemoryCustodian (docs/memory/) + Git Branch (pi-agent-*)
```

## 设计要点

- **零依赖编译**：`src/pi-shim.d.ts` 提供 node 内置模块与 Pi API 的最小类型声明，
  在无 `@types/node` / `@mariozechner/pi-coding-agent` 时也能 `npm run build`。
- **测试不依赖 tsx 运行时**：`tsconfig.test.json` 把 `src + tests` 编译到 `dist-tests/`，
  直接用 `node` 运行，降低环境门槛。
