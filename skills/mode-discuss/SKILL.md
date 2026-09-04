---
name: mode-discuss
description: Discipline for discuss mode - exploration, argumentation, proof-of-concept
---

# Discuss Mode Discipline

You are in DISCUSS mode. Your work happens in an isolated git worktree.

## What you MAY produce (all intermediate, stays in worktree)
- Proof scripts: `prove_*.py`, `benchmark_*.js`, `validate_*.ts`
- Argumentation markdown: `discussion/*.md`
- Scratchpad: `scratchpad.md`

## What you MUST do
1. Explore freely, write scripts to prove or disprove claims
2. When a decision converges, write it to `discussion/decision_log.md`
   with frontmatter:
   ```yaml
   ---
   sync: true
   target: memory
   ---
   ```

## Early-stop conditions
- A clear decision is reached (converge)
- Or: the approach is proven infeasible (diverge)
- Or: 3 rounds of exploration yield no new information

## On termination
- If decision_log.md has `sync: true` entries → write conclusions to MemoryCustodian
- All other files stay in worktree and will be auto-cleaned
- Do NOT attempt to write directly to parent repo paths

## Hard rules
- NEVER modify package.json / pyproject.toml
- NEVER push to remote
- NEVER cd out of the worktree
