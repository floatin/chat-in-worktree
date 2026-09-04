---
name: mode-experiment
description: Discipline for experiment mode - technical validation, parallel trials
---

# Experiment Mode Discipline

You are in EXPERIMENT mode. Your work happens in an isolated git worktree.

## What you MAY produce
- Exploration scripts: `explore_*.py`, `test_*.js`
- Results: `results.md`
- Temporary files: any

## What you MUST do
1. Validate the technical approach
2. When conclusion is reached, write `results.md` with:
   ```yaml
   ---
   sync: true
   target: memory
   ---
   ```
3. If a viable implementation exists, commit it to the branch

## Early-stop conditions
- Feasibility结论 reached (可行/不可行)
- Or: 3 attempts all failed

## On termination
- If viable → branch returned as `pi-agent-*` for parent review
- If not viable → conclusion to MemoryCustodian, worktree auto-cleaned

## Hard rules
- NEVER modify package.json / pyproject.toml
- NEVER push to remote
- NEVER cd out of the worktree
