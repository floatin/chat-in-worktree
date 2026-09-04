export function buildSpawnRequest(cfg, task, requestId) {
    return {
        requestId,
        type: "general-purpose",
        prompt: `Enter ${cfg.name} mode. Task: ${task}\n\nYou are working in an isolated git worktree. All files stay inside this worktree unless explicitly synced via artifact-sync rules.`,
        options: {
            description: `${cfg.name}: ${task}`,
            isolation: "worktree",
            skills: [cfg.skill, "artifact-sync"],
            memory: "project",
            ...(cfg.lease ? { lease_holder: `pi-${cfg.name}-${Date.now()}` } : {}),
        },
    };
}
export function emitSpawn(pi, req) {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            unsub();
            resolve({ success: false, error: "spawn timeout" });
        }, 30000);
        const unsub = pi.events.on(`subagents:rpc:spawn:reply:${req.requestId}`, (reply) => {
            clearTimeout(timeout);
            unsub();
            if (!reply.success) {
                resolve({ success: false, error: reply.error });
                return;
            }
            resolve({ success: true, data: reply.data });
        });
        pi.events.emit("subagents:rpc:spawn", req);
    });
}
