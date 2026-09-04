---
name: artifact-sync
description: Universal rules for syncing artifacts from worktree to parent
---

# Artifact Sync Rules (all modes)

## Marker protocol
Every file you create should have frontmatter:
```yaml
---
sync: true|false
target: memory|core-file|branch
---
```

## Classification
| Marker | Behavior |
|---|---|
| `sync: false` or no marker | Intermediate artifact → stays in worktree → auto-cleaned |
| `sync: true, target: memory` | Write to MemoryCustodian (docs/memory/) |
| `sync: true, target: core-file` | Core artifact → return branch for parent merge |
| `sync: true, target: branch` | Entire worktree changes → return branch |

## Parent-side flow
1. Sub-agent finishes → emits completion with branch name
2. Parent reviews diff summary
3. User approves: merge / keep-as-branch / discard
4. Memory entries written to docs/memory/

## Safety
- Never auto-merge without human confirmation
- Never write directly to parent repo paths
- When in doubt, discard
