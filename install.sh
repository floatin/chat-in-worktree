#!/usr/bin/env bash
set -euo pipefail

EXT_DIR="${HOME}/.pi/agent/extensions/chat-in-worktree"
SKILLS_DIR="${HOME}/.pi/agent/skills"

echo "Installing chat-in-worktree extension..."

mkdir -p "$EXT_DIR"
mkdir -p "$SKILLS_DIR"/{mode-discuss,mode-design,mode-experiment,mode-produce,mode-maintain,artifact-sync}

cp dist/extension.js "$EXT_DIR/"
cp settings.json "$EXT_DIR/"

for skill in mode-discuss mode-design mode-experiment mode-produce mode-maintain artifact-sync; do
  cp "skills/${skill}/SKILL.md" "$SKILLS_DIR/${skill}/"
done

echo "Installed. Restart Pi Agent to load."
