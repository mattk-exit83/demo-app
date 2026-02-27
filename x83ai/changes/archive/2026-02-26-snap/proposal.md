## Why

Developers frequently copy things to the clipboard and lose them — a URL, a snippet, a command. There's no simple CLI tool to save and recall clipboard history without running a background daemon. `snap` solves this with an explicit save-and-recall model: you decide what's worth keeping.

## What Changes

- Add a new `snap` CLI tool that saves, lists, searches, and recalls clipboard entries
- Entries are persisted to `~/.snap/history.json` as a simple JSON array
- History is capped at 50 entries (FIFO — oldest entries are dropped)
- Single external dependency: `clipboardy` for cross-platform clipboard access

## Capabilities

### New Capabilities
- `clipboard-store`: Save, list, search, and retrieve clipboard entries from a persistent JSON store
- `snap-cli`: Command-line interface that parses arguments and dispatches to store operations

### Modified Capabilities
<!-- None — this is a greenfield project -->

## Impact

- New files: `cli.js` (entry point), `store.js` (data operations)
- New directory: `~/.snap/` created on first use
- New dependency: `clipboardy` (npm)
- `package.json` will be created with a `bin` entry for the `snap` command
