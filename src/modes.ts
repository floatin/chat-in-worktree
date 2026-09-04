import type { ModeConfig, ModeName } from "./types.js";

export const MODES: Record<ModeName, ModeConfig> = {
  discuss: {
    name: "discuss",
    skill: "mode-discuss",
    lease: false,
    syncTarget: "memory",
    defaultEarlyStop: "Decision converged or approach proven infeasible",
  },
  design: {
    name: "design",
    skill: "mode-design",
    lease: false,
    syncTarget: "core-files",
    defaultEarlyStop: "DESIGN.md approved",
  },
  experiment: {
    name: "experiment",
    skill: "mode-experiment",
    lease: false,
    syncTarget: "branch-or-memory",
    defaultEarlyStop: "Feasibility结论 reached",
  },
  produce: {
    name: "produce",
    skill: "mode-produce",
    lease: true,
    syncTarget: "branch",
    defaultEarlyStop: "All tasks complete and tests pass",
  },
  maintain: {
    name: "maintain",
    skill: "mode-maintain",
    lease: true,
    syncTarget: "branch",
    defaultEarlyStop: "Issue resolved",
  },
};

export function getMode(name: string): ModeConfig | undefined {
  return MODES[name as ModeName];
}
