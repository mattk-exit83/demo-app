## 1. Clear History

- [x] 1.1 Add `clear()` function to `store.js` — prompt with readline, truncate history.json to `[]` on "y"/"Y", abort on anything else, handle empty history
- [x] 1.2 Add `clear` case to `cli.js` switch and update help text with `clear` command

## 2. Stats

- [x] 2.1 Add `stats()` function to `store.js` — read history for count/oldest/newest, use `fs.stat()` for file size, handle empty history
- [x] 2.2 Add `stats` case to `cli.js` switch and update help text with `stats` command

## 3. Export

- [x] 3.1 Add `exportHistory()` function to `store.js` — read history, write formatted JSON to stdout
- [x] 3.2 Add `export` case to `cli.js` switch and update help text with `export` command

## 4. Tags

- [x] 4.1 Modify `save()` in `store.js` to accept optional `tags` array parameter, store tags on entry when provided
- [x] 4.2 Modify `list()` in `store.js` to accept optional `tag` filter parameter, display tags on entries, filter when tag provided
- [x] 4.3 Add `--tag` flag parsing to `cli.js` for save and list commands, pass tags to store functions
- [x] 4.4 Update help text in `cli.js` with `--tag` flag usage
