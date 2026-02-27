## Context

This is a greenfield Node.js CLI tool. There's no existing codebase to integrate with — we're building from scratch in an empty repo. The tool needs to work cross-platform (macOS, Linux, Windows) for clipboard access.

## Goals / Non-Goals

**Goals:**
- Simple, zero-config CLI that works immediately after `npm install -g`
- Persistent clipboard history stored as plain JSON
- Fast startup — no heavy frameworks, minimal dependencies

**Non-Goals:**
- Background daemon or clipboard watching (explicit save only)
- Encryption or sensitive data handling
- Sync across machines
- Plugin system or extensibility

## Decisions

### 1. Storage format: flat JSON file

Store history as a JSON array in `~/.snap/history.json`.

```json
[
  { "id": 1, "content": "hello world", "timestamp": "2026-02-26T10:00:00.000Z" },
  { "id": 2, "content": "https://example.com", "timestamp": "2026-02-26T10:05:00.000Z" }
]
```

**Why over SQLite**: No native compilation, no extra dependency, trivially inspectable. At 50 entries max, JSON parse/stringify performance is irrelevant.

**Why `~/.snap/`**: Follows the convention of `~/.config/` adjacent dotfile directories. Simple, predictable, discoverable.

### 2. Clipboard access: `clipboardy`

Use `clipboardy` as the sole external dependency. It handles macOS (`pbcopy`/`pbpaste`), Linux (`xclip`/`xsel`), and Windows (`clip`) transparently.

**Why not `child_process` directly**: Cross-platform clipboard commands differ. `clipboardy` abstracts this reliably.

### 3. Argument parsing: manual

Parse `process.argv` directly. Four commands with simple signatures don't justify an arg-parsing library.

**Why not `commander`/`yargs`**: Adds a dependency for no real benefit at this scale.

### 4. Auto-incrementing IDs

Each entry gets a monotonically increasing integer `id`. The next ID is `max(existing ids) + 1`, or `1` if the history is empty. This gives users a stable reference for `snap get <id>`.

### 5. Module structure

```
cli.js          ← entry point, arg parsing, dispatch
store.js        ← all data operations (save/list/search/get)
package.json    ← bin entry, dependency
```

`cli.js` imports `store.js`. Store functions are pure-ish (read/write file, read/write clipboard). No shared state.

## Risks / Trade-offs

- **Concurrent writes**: Two `snap` commands at the same time could race on `history.json`. → Acceptable for a single-user CLI tool. Not worth adding file locking.
- **Large clipboard contents**: A user could snap a 10MB paste. → We store it as-is. The 50-entry cap limits total size naturally.
- **No encryption**: Clipboard contents are stored in plaintext. → Documented non-goal. Users should not snap sensitive data.
