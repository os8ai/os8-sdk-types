# @os8/sdk-types

TypeScript type definitions for the **OS8** `window.os8` SDK exposed to apps
installed via the [OS8 App Store](https://os8.ai/apps).

## Installation

```bash
npm install -D @os8/sdk-types
```

Then add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@os8/sdk-types"]
  }
}
```

That's it. `window.os8.*` is now strongly typed in your editor.

## What's exposed

The SDK shape is determined at runtime by the manifest's
`permissions.os8_capabilities`. Every property on `window.os8` is **optional
at the type level** — if your manifest doesn't declare a capability, the
corresponding SDK method won't exist at runtime. The IDE shows everything;
runtime presence follows the manifest.

| Capability | SDK property |
|------------|--------------|
| `blob.readonly` / `blob.readwrite` | `window.os8.blob.{read,list,write,delete}` |
| `db.readonly` / `db.readwrite` | `window.os8.db.{query,execute}` |
| `imagegen` | `window.os8.imagegen.{get,post}` |
| `speak` | `window.os8.speak.{get,post}` |
| `youtube` | `window.os8.youtube.{get,post}` |
| `x` | `window.os8.x.{get,post}` |
| `telegram.send` | `window.os8.telegram.send` |
| `google.calendar.{readonly,readwrite}` | `window.os8.googleCalendar.{get,post}` |
| `google.drive.readonly` | `window.os8.googleDrive.{get,post}` |
| `google.gmail.readonly` | `window.os8.googleGmail.{get,post}` |
| `mcp.<server>.<tool>` or `mcp.<server>.*` | `window.os8.mcp(server, tool, body)` |

## Versioning

`@os8/sdk-types` follows independent semver. The OS8 desktop's own
`peerDependencies` constraint pins a major. Adding a method is a
**minor** bump; changing a signature is a **major** bump.

## MCP wildcard semantics

Manifests can declare `mcp.<server>.*` to grant access to all current AND
future tools registered by that MCP server. The SDK exposes `window.os8.mcp`
as a single function whether the manifest declares specific tools or a
wildcard — the server-side `scopedApiMiddleware` enforces the per-tool
gate. See the [OS8 spec §6.3.2](https://github.com/os8ai/os8/blob/main/docs/app-store-spec.md)
for the trust model.

## Module augmentation for known MCP servers

If you know which MCP tools you'll use, augment the SDK with strong types:

```ts
declare module '@os8/sdk-types' {
  interface Os8Sdk {
    mcp?: <
      TBody = unknown,
      TResult = unknown
    >(
      server: 'gh' | 'tavily',
      tool: 'list_pulls' | 'search',
      body?: TBody
    ) => Promise<TResult>;
  }
}
```

## Related

- [`os8ai/os8`](https://github.com/os8ai/os8) — the desktop application that exposes the SDK.
- [App Store spec](https://github.com/os8ai/os8/blob/main/docs/app-store-spec.md) — manifest schema, capability list, trust model.
