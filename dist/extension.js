import { getMode } from "./modes.js";
import { buildSpawnRequest, emitSpawn } from "./harness.js";
import { randomUUID } from "crypto";
export default function (pi) {
    pi.registerCommand("mode", {
        description: "Switch to a mode (discuss|design|experiment|produce|maintain) <task>",
        handler: async (args, ctx) => {
            const parts = args.trim().split(/\s+/);
            if (parts.length < 2) {
                ctx.ui.notify("Usage: /mode <discuss|design|experiment|produce|maintain> <task>", "error");
                return;
            }
            const [modeName, ...rest] = parts;
            const task = rest.join(" ");
            const cfg = getMode(modeName);
            if (!cfg) {
                ctx.ui.notify(`Unknown mode: ${modeName}`, "error");
                return;
            }
            const requestId = randomUUID();
            ctx.ui.notify(`Spawning ${modeName} agent for: ${task}...`, "info");
            const req = buildSpawnRequest(cfg, task, requestId);
            const result = await emitSpawn(pi, req);
            if (!result.success) {
                ctx.ui.notify(`Mode switch failed: ${result.error}`, "error");
                return;
            }
            ctx.ui.notify(`Entered ${modeName} mode (agent ${result.data?.id ?? "unknown"})`, "info");
        },
    });
    pi.registerTool({
        name: "chat_in_worktree",
        label: "Chat in Worktree",
        description: "Spawn an isolated sub-agent in a git worktree for the given task and mode",
        parameters: {
            type: "object",
            properties: {
                mode: { type: "string", description: "discuss|design|experiment|produce|maintain" },
                task: { type: "string", description: "What to work on" },
            },
            required: ["mode", "task"],
        },
        async execute(toolCallId, params, signal, onUpdate, ctx) {
            const cfg = getMode(params.mode);
            if (!cfg)
                return { content: [{ type: "text", text: `Unknown mode: ${params.mode}` }] };
            const requestId = randomUUID();
            const req = buildSpawnRequest(cfg, params.task, requestId);
            const result = await emitSpawn(pi, req);
            if (!result.success) {
                return { content: [{ type: "text", text: `Failed: ${result.error}` }] };
            }
            return {
                content: [{
                        type: "text",
                        text: `Spawned ${params.mode} agent in worktree. Agent ID: ${result.data?.id ?? "unknown"}`,
                    }],
            };
        },
    });
}
