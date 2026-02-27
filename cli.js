#!/usr/bin/env node

import { save, list, search, get, clear, exportHistory, stats } from './store.js';

const USAGE = `Usage: snap [command] [options]

Commands:
  (none)            Save current clipboard to history
  list              Show all saved entries
  search <query>    Find entries matching a substring
  get <id>          Copy a saved entry back to clipboard
  clear             Clear all saved entries
  export            Export history as JSON to stdout
  stats             Show history statistics
  help              Show this help message

Options:
  --tag <name>      Tag an entry on save, or filter list by tag
                    (can be used multiple times for save)`;

// Parse --tag flags from argv
function parseTags(argv) {
  const tags = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--tag' && i + 1 < argv.length) {
      tags.push(argv[i + 1]);
      i++;
    }
  }
  return tags;
}

const allArgs = process.argv.slice(2);
const tags = parseTags(allArgs);
// Determine command: first arg that isn't --tag or a tag value
let command;
for (let i = 0; i < allArgs.length; i++) {
  if (allArgs[i] === '--tag') { i++; continue; }
  command = allArgs[i];
  break;
}
const args = allArgs.filter(a => a !== command && a !== '--tag' && !tags.includes(a));

switch (command) {
  case undefined:
    await save(tags.length > 0 ? tags : undefined);
    break;
  case 'list':
    await list(tags[0]);
    break;
  case 'search':
    await search(args[0]);
    break;
  case 'get':
    await get(args[0]);
    break;
  case 'clear':
    await clear();
    break;
  case 'export':
    await exportHistory();
    break;
  case 'stats':
    await stats();
    break;
  case 'help':
  case '--help':
    console.log(USAGE);
    break;
  default:
    console.error(`Unknown command: ${command}\n`);
    console.log(USAGE);
    process.exitCode = 1;
    break;
}
