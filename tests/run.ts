import { test } from "./assert.js";
import { parseMarker, classifyArtifacts, renderSyncPlan } from "../src/sync.js";
import { MODES, getMode } from "../src/modes.js";

test("parseMarker: no frontmatter => discard", () => {
  const m = parseMarker("hello world");
  if (m.sync !== false || m.target !== "discard") throw new Error("expected discard");
});

test("parseMarker: sync true memory", () => {
  const m = parseMarker("---\nsync: true\ntarget: memory\n---\nbody");
  if (!m.sync || m.target !== "memory") throw new Error("expected memory");
});

test("parseMarker: sync false => discard", () => {
  const m = parseMarker("---\nsync: false\ntarget: core-file\n---\nbody");
  if (m.sync !== false || m.target !== "discard") throw new Error("expected discard");
});

test("classifyArtifacts: routes by marker", () => {
  const plan = classifyArtifacts([
    { path: "a.md", content: "---\nsync: true\ntarget: memory\n---\n" },
    { path: "b.md", content: "---\nsync: true\ntarget: core-file\n---\n" },
    { path: "c.md", content: "no marker" },
  ]);
  if (plan.memory.length !== 1) throw new Error("memory count");
  if (plan.coreFiles.length !== 1) throw new Error("coreFiles count");
  if (plan.discard.length !== 1) throw new Error("discard count");
});

test("renderSyncPlan: includes all sections", () => {
  const plan = classifyArtifacts([
    { path: "a.md", content: "---\nsync: true\ntarget: memory\n---\n" },
    { path: "b.md", content: "x" },
  ]);
  const out = renderSyncPlan(plan);
  if (!out.includes("Memory (1)")) throw new Error("memory header");
  if (!out.includes("Discard (1)")) throw new Error("discard header");
});

test("getMode: known modes", () => {
  const d = getMode("discuss");
  if (!d || d.skill !== "mode-discuss" || d.lease !== false) throw new Error("discuss");
  const p = getMode("produce");
  if (!p || p.lease !== true) throw new Error("produce lease");
});

test("getMode: unknown => undefined", () => {
  if (getMode("nonexistent") !== undefined) throw new Error("should be undefined");
});

test("MODES has 5 entries", () => {
  if (Object.keys(MODES).length !== 5) throw new Error("expected 5 modes");
});

console.log("\nAll tests passed.");
