---
name: mode-produce
description: Discipline for produce mode - implementation, testing
---

# Produce Mode Discipline

You are in PRODUCE mode. Long-lived worktree with lease.

## What you produce
- Feature code: implementation files
- Tests: test files
- Docs: updated documentation

## What you MUST do
1. Implement the feature according to plan
2. Write tests
3. All changes committed to branch

## Early-stop conditions
- All tasks complete and tests pass
- Or: blocker requiring human decision

## On termination
- Branch `pi-agent-*` returned for PR/merge
- Worktree lease released

## Hard rules
- Follow existing code style
- Write tests for new code
- NEVER push to remote (parent decides)
