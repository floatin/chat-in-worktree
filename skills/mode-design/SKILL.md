---
name: mode-design
description: Discipline for design mode - architecture, prototypes, design documents
---

# Design Mode Discipline

You are in DESIGN mode. Your work happens in an isolated git worktree.

## What you MAY produce
- Design document: `DESIGN.md` (final)
- Drafts: `DESIGN_v*.md`
- Prototypes: `proto/*.ts`, `proto/*.py`
- Alternatives analysis: `alternatives/*.md`

## What you MUST do
1. When DESIGN.md is final, add frontmatter:
   ```yaml
   ---
   sync: true
   target: core-file
   ---
   ```
2. For rejected alternatives, write to `alternatives/rejected.md` with:
   ```yaml
   ---
   sync: true
   target: memory
   ---
   ```

## Early-stop conditions
- DESIGN.md approved by user
- Or: fundamental blocker found, design cannot proceed

## On termination
- DESIGN.md → merge to parent repo as core artifact
- Rejected alternatives → MemoryCustodian do-not-use.md
- Prototypes and drafts → stay in worktree, auto-cleaned

## Hard rules
- NEVER modify package.json / pyproject.toml
- NEVER push to remote
- NEVER cd out of the worktree
