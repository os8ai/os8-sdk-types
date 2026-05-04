# Changelog

## 1.0.0 — initial release

- TypeScript declarations for `window.os8` SDK shape, byte-for-byte
  identical to the canonical `os8ai/os8` `src/templates/os8-sdk.d.ts`
  (the file PR 1.21 drops into each installed external app's folder
  for IDE autocomplete without an npm install).
- Coverage matches `os8ai/os8` `src/preload-external-app.js` at the
  time of cut: `blob`, `db`, `imagegen`, `speak`, `youtube`, `x`,
  `telegram`, `googleCalendar`, `googleDrive`, `googleGmail`, `mcp`.
- MCP wildcard semantics documented (`mcp.<server>.*` grants current AND
  future tools per OS8 spec §6.3.2).

Helper for future syncs: `tools/sync-from-os8.sh` clones os8 (or
takes an explicit path) and copies the canonical `.d.ts` in,
printing a diff. Use it before every `vX.Y.Z` tag so the published
package's types match what the desktop's `tools/check-sdk-drift.js
--include-published` (Phase 5 PR 5.2) expects.

Released as part of OS8 Phase 4 (PR 4.9, repo + workflow scaffold)
+ Phase 5 (PR 5.2, npm publish operationalized + drift-check
tightening).
