// 零依赖类型声明：让项目在无需安装 @types/node 和 @mariozechner/pi-coding-agent 时也能编译。
// 在真实 Pi Agent 环境中，若已安装官方包，其类型会覆盖此处声明（declare 可重复）。

// --- Node 全局函数 ---
declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;
declare function clearTimeout(timeoutId: any): void;

declare var console: {
  log(...args: any[]): void;
  error(...args: any[]): void;
  warn(...args: any[]): void;
};

declare var process: {
  exitCode: number | undefined;
  exit(code?: number): never;
  env: Record<string, string | undefined>;
};

// --- node 内置模块最小类型 ---
declare module "fs" {
  export function mkdirSync(p: string, opts?: { recursive?: boolean }): void;
  export function writeFileSync(p: string, data: string | Uint8Array, opts?: { flag?: string }): void;
  export function existsSync(p: string): boolean;
  export function readFileSync(p: string, enc?: string): string;
}
declare module "path" {
  export function join(...paths: string[]): string;
  export function dirname(p: string): string;
  export function basename(p: string): string;
}
declare module "crypto" {
  export function randomUUID(): string;
}

// --- Pi Agent 扩展 API ---
declare module "@mariozechner/pi-coding-agent" {
  export interface ExtensionAPI {
    registerCommand(name: string, def: {
      description?: string;
      handler: (args: string, ctx: any) => void | Promise<void>;
    }): void;
    registerTool(def: {
      name: string;
      label?: string;
      description?: string;
      parameters?: any;
      execute: (
        toolCallId: string,
        params: any,
        signal: AbortSignal,
        onUpdate: (u: any) => void,
        ctx: any,
      ) => Promise<any>;
    }): void;
    events: {
      on(event: string, listener: (payload: any) => void): () => void;
      emit(event: string, payload: any): void;
    };
    ui: {
      notify(msg: string, level?: "info" | "error" | "warn"): void;
    };
  }
  const _default: any;
  export default _default;
}
