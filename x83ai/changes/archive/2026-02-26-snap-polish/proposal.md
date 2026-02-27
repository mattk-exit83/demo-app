## Why

Snap's core save/list/search/get workflow is solid, but it's missing everyday usability features. Users can't clear old history, see usage stats, export data for scripting, or organize entries with tags. These are the obvious "day two" features that make the tool feel complete.

## What Changes

- Add `snap clear` command to wipe history with confirmation prompt
- Add `snap stats` command to show entry count, oldest/newest timestamps, and storage size
- Add `snap export` command to dump history as JSON to stdout for piping
- Add `--tag` flag to `snap` (save) and `snap list` for tagging and filtering entries
- Extend entry data model with optional `tags` array field (backwards-compatible)
- Update help text with all new commands

## Capabilities

### New Capabilities
- `history-management`: Clear history and view usage statistics
- `history-export`: Export history as JSON to stdout for scripting and piping

### Modified Capabilities
- `clipboard-store`: Add optional `tags` array to entry data model, modify `save()` to accept tags, modify `list()` to filter by tag
- `snap-cli`: Add `clear`, `stats`, `export` command cases, parse `--tag` flag for save and list

## Impact

- Modified files: `store.js` (new functions + tag support), `cli.js` (new commands + flag parsing)
- Data model: entries gain optional `tags` field — existing untagged entries remain valid
- New dependency: `node:readline` (built-in, for clear confirmation prompt)
- No breaking changes to existing commands or stored data
