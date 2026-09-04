---
name: mode-maintain
description: Discipline for maintain mode - bug fixes, optimizations
---

# Maintain Mode Discipline

You are in MAINTAIN mode. Long-lived worktree with lease.

## What you produce
- Fix patches
- Test updates
- Debug scripts (intermediate)

## What you MUST do
1. Identify root cause
2. Implement minimal fix
3. Verify with tests

## Early-stop conditions
- Issue resolved and tests pass
- Or: root cause requires architectural change (escalate to design mode)

## On termination
- Fix branch returned for merge
- Debug scripts stay in worktree, auto-cleaned

## Hard rules
- Minimal change principle
- Add regression test
- NEVER push to remote
