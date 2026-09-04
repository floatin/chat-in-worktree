import type { ArtifactMarker, ClassifiedArtifact, SyncPlan, SyncTarget } from "./types.js";
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const MEMORY_DIR = "docs/memory";

export function parseMarker(content: string): ArtifactMarker {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return { sync: false, target: "discard" };

  const fm = fmMatch[1];
  const syncMatch = fm.match(/^sync:\s*(true|false)/m);
  if (!syncMatch || syncMatch[1] !== "true") return { sync: false, target: "discard" };

  const targetMatch = fm.match(/^target:\s*(memory|core-file|branch)/m);
  const target: SyncTarget = targetMatch ? (targetMatch[1] as SyncTarget) : "discard";

  return { sync: true, target, description: fm.match(/^description:\s*(.+)/m)?.[1] };
}

export function classifyArtifacts(artifacts: Array<{ path: string; content: string }>): SyncPlan {
  const plan: SyncPlan = { memory: [], coreFiles: [], branch: [], discard: [] };

  for (const a of artifacts) {
    const marker = parseMarker(a.content);
    const classified: ClassifiedArtifact = { path: a.path, marker, content: a.content };
    if (marker.sync) {
      if (marker.target === "memory") plan.memory.push(classified);
      else if (marker.target === "core-file") plan.coreFiles.push(classified);
      else if (marker.target === "branch") plan.branch.push(classified);
    } else {
      plan.discard.push(classified);
    }
  }
  return plan;
}

export function applyMemorySync(plan: SyncPlan, repoRoot: string): string[] {
  const memDir = join(repoRoot, MEMORY_DIR);
  if (!existsSync(memDir)) mkdirSync(memDir, { recursive: true });

  const written: string[] = [];
  for (const a of plan.memory) {
    const targetFile = join(memDir, "decisions.md");
    const entry = `\n\n## ${a.path}\n\n${a.content}\n`;
    writeFileSync(targetFile, entry, { flag: "a" });
    written.push(targetFile);
  }
  return written;
}

export function renderSyncPlan(plan: SyncPlan): string {
  let out = "## Sync Plan\n\n";
  if (plan.memory.length) out += `**Memory (${plan.memory.length}):**\n` + plan.memory.map(a => `  - ${a.path}`).join("\n") + "\n\n";
  if (plan.coreFiles.length) out += `**Core Files (${plan.coreFiles.length}):**\n` + plan.coreFiles.map(a => `  - ${a.path}`).join("\n") + "\n\n";
  if (plan.branch.length) out += `**Branch (${plan.branch.length}):**\n` + plan.branch.map(a => `  - ${a.path}`).join("\n") + "\n\n";
  if (plan.discard.length) out += `**Discard (${plan.discard.length}):**\n` + plan.discard.map(a => `  - ${a.path}`).join("\n") + "\n\n";
  return out;
}
