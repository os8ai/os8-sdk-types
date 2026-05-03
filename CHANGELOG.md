# Changelog

## 1.0.0 — initial release

- TypeScript declarations for `window.os8` SDK shape.
- Coverage matches `os8ai/os8` `src/preload-external-app.js` at the time
  of cut: `blob`, `db`, `imagegen`, `speak`, `youtube`, `x`, `telegram`,
  `googleCalendar`, `googleDrive`, `googleGmail`, `mcp`.
- MCP wildcard semantics documented (`mcp.<server>.*` grants current AND
  future tools per OS8 spec §6.3.2).

Released as part of OS8 Phase 4 (PR 4.9).
