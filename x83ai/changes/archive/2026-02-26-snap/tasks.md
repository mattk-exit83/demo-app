## 1. Project Setup

- [x] 1.1 Create `package.json` with name, version, bin entry (`"snap": "./cli.js"`), and `clipboardy` dependency
- [x] 1.2 Install dependencies with `npm install`

## 2. Store Module

- [x] 2.1 Implement `store.js` with `ensureStore()` to auto-create `~/.snap/` directory and `history.json`
- [x] 2.2 Implement `save()` — read clipboard, assign next ID, append entry, enforce 50-entry cap, write file
- [x] 2.3 Implement `list()` — read history, return entries in reverse chronological order with truncated previews
- [x] 2.4 Implement `search(query)` — case-insensitive substring filter, return matches reverse-chronological
- [x] 2.5 Implement `get(id)` — find entry by ID, copy content to clipboard, handle not-found

## 3. CLI Entry Point

- [x] 3.1 Create `cli.js` with shebang, parse `process.argv` to determine command (default: save)
- [x] 3.2 Wire up `list`, `search`, `get`, `help`, and unknown-command handlers
- [x] 3.3 Add `--help` / `help` output showing usage for all commands

## 4. Smoke Test

- [x] 4.1 Run `snap` to save, `snap list` to verify, `snap get <id>` to recall — confirm full round-trip works
