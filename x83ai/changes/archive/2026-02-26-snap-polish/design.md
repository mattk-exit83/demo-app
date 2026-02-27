## Context

Snap is a working CLI with save/list/search/get commands. The codebase is two files (`cli.js`, `store.js`) with one dependency (`clipboardy`). We're adding four independent features that each touch both files but don't interact with each other, making them ideal for parallel implementation.

## Goals / Non-Goals

**Goals:**
- Add clear, stats, export, and tag features without breaking existing commands
- Keep all features independent so they can be implemented in parallel
- Maintain backwards compatibility with existing history data

**Non-Goals:**
- Batch tagging of existing entries
- Tag management (rename, delete tags)
- Export formats other than JSON
- Force-clear flag (always prompt)

## Decisions

### 1. Confirmation prompt for clear: `node:readline`

Use Node's built-in `readline` module to prompt "Are you sure? (y/N)" before clearing. No new dependency needed.

**Why not a `--force` flag**: Explicit confirmation is safer for a destructive operation. Keeping it interactive is intentional.

### 2. Tags as optional array on existing data model

Extend entries with an optional `tags` field:

```json
{ "id": 1, "content": "...", "timestamp": "...", "tags": ["work", "url"] }
```

Entries without `tags` (or with `tags: undefined`) are treated as untagged. Existing history files work without migration.

**Why not a separate tags index**: At 50 entries max, scanning the array is instant. A separate index adds complexity for zero performance benefit.

### 3. Tag parsing: positional `--tag` flag

Parse `--tag <name>` from `process.argv` manually, consistent with our no-library approach. Multiple tags via multiple `--tag` flags: `snap --tag work --tag url`.

For save: `snap --tag work` (tags go before implicit save)
For list: `snap list --tag work` (filter list by tag)

### 4. Export writes to stdout only

`snap export` writes the full JSON array to `process.stdout`. No file output option — users pipe to a file if needed: `snap export > backup.json`.

**Why stdout**: Composable with Unix pipes. Keeps the implementation trivial.

### 5. Stats reads file metadata

`snap stats` uses `fs.stat()` for file size and reads the history array for count/oldest/newest. Pure read-only operation.

## Risks / Trade-offs

- **Tag flag parsing complexity**: Manual argv parsing with `--tag` across multiple commands could get messy. → Mitigated by keeping it to exactly two commands (save, list).
- **Clear is destructive**: Accidental "y" could wipe history. → Mitigated by defaulting to "N" on empty input.
- **No tag validation**: Tags are free-form strings. → Acceptable — users can tag however they want.
