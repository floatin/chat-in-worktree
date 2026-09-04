import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import type { ModeConfig } from "./types.js";

const RPC_REQUEST_EVENT = "subagents:rpc:v1:request";
const RPC_REPLY_PREFIX = "subagents:rpc:v1:reply:";
const RPC_PROTOCOL_VERSION = 1;

// ponytail: all modes use the generic implementation agent; map modes to named
// pi-subagents agents only if a mode needs special runtime behavior.
const DEFAULT_AGENT = "worker";

export interface SpawnRequest {
  requestId: string;
  method: "spawn";
  params: {
    agent: string;
    task: string;
    isolation?: "worktree";
    skills?: string[];
    memory?: "project" | "local" | "user";
  };
}

export function buildSpawnRequest(
  cfg: ModeConfig,
  task: string,
  requestId: string,
): SpawnRequest {
  return {
    requestId,
    method: "spawn",
    params: {
      agent: DEFAULT_AGENT,
      task: `Enter ${cfg.name} mode. Task: ${task}\n\nYou are working in an isolated git worktree. All files stay inside this worktree unless explicitly synced via artifact-sync rules.`,
      isolation: "worktree",
      skills: [cfg.skill, "artifact-sync"],
      memory: "project",
    },
  };
}

export function emitSpawn(
  pi: ExtensionAPI,
  req: SpawnRequest,
): Promise<{ success: boolean; data?: any; error?: string }> {
  return new Promise((resolve) => {
    const replyEvent = `${RPC_REPLY_PREFIX}${req.requestId}`;
    const timeout = setTimeout(() => {
      unsub();
      resolve({ success: false, error: "spawn timeout (no reply from subagent RPC)" });
    }, 30000);

    const unsub = pi.events.on(replyEvent, (reply: any) => {
      clearTimeout(timeout);
      unsub();
      if (!reply || reply.success === false) {
        resolve({ success: false, error: reply?.error?.message ?? "spawn failed" });
        return;
      }
      resolve({ success: true, data: reply.data });
    });

    pi.events.emit(RPC_REQUEST_EVENT, {
      version: RPC_PROTOCOL_VERSION,
      requestId: req.requestId,
      method: "spawn",
      params: req.params,
    });
  });
}
