// Phase 4 PR 4.9 — TypeScript type definitions for the OS8 window.os8 SDK.
//
// External-app authors install this package to get IDE autocomplete:
//
//   npm install -D @os8/sdk-types
//
// Then add to tsconfig.json:
//
//   { "compilerOptions": { "types": ["@os8/sdk-types"] } }
//
// The SDK shape is derived from src/preload-external-app.js in the
// os8ai/os8 repo. A drift-check CI in that repo guards against the
// preload's runtime shape diverging from these types.

declare global {
  interface Window {
    os8?: Os8Sdk;
  }
}

export interface Os8Sdk {
  blob?: BlobApi;
  db?: DbApi;
  imagegen?: RestWrapper;
  speak?: RestWrapper;
  youtube?: RestWrapper;
  x?: RestWrapper;
  telegram?: TelegramApi;
  googleCalendar?: RestWrapper;
  googleDrive?: RestWrapper;
  googleGmail?: RestWrapper;
  mcp?: McpCall;
}

// -----------------------------------------------------------------------------
// Blob storage. blob.readonly grants read+list; blob.readwrite adds write+delete.
// -----------------------------------------------------------------------------
export interface BlobApi {
  read(key: string): Promise<Blob>;
  list(prefix?: string): Promise<{ key: string; size: number; modified: string }[]>;
  write?(key: string, data: Blob | ArrayBuffer | string): Promise<void>;
  delete?(key: string): Promise<void>;
}

// -----------------------------------------------------------------------------
// Per-app SQLite. db.readonly grants query; db.readwrite adds execute.
// -----------------------------------------------------------------------------
export interface DbApi {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<{ rows: T[]; columns: string[] }>;
  execute?(sql: string, params?: unknown[]): Promise<{ changes: number; lastInsertRowid: number }>;
}

// -----------------------------------------------------------------------------
// Generic REST wrapper used by imagegen / speak / youtube / x /
// google{Calendar,Drive,Gmail}. Each capability is a `{ get, post }` pair
// against /_os8/api/<service>; the server-side route handler validates
// the body. See route docs in os8ai/os8 for per-service shapes.
// -----------------------------------------------------------------------------
export interface RestWrapper {
  get<T = unknown>(subpath?: string, query?: Record<string, string | number | boolean>): Promise<T>;
  post<T = unknown, B = unknown>(subpath: string, body?: B): Promise<T>;
}

// -----------------------------------------------------------------------------
// Telegram bot helper.
// -----------------------------------------------------------------------------
export interface TelegramApi {
  send(opts: { text: string; chatId?: string; photo?: string }): Promise<{ ok: boolean; messageId?: number }>;
}

// -----------------------------------------------------------------------------
// MCP tool call.
//
// Wildcard semantics (PR 4.7): a manifest declaring `mcp.<server>.*` grants
// access to ALL current AND future tools registered by that MCP server.
// Specific tools `mcp.<server>.<tool>` grant only that tool.
//
// At runtime the SDK is a single function — pass server, tool, body. The
// server enforces the capability check; an undeclared call rejects 403.
// -----------------------------------------------------------------------------
export type McpCall = <TBody = unknown, TResult = unknown>(
  server: string,
  tool: string,
  body?: TBody
) => Promise<TResult>;

export {};
