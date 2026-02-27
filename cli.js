#!/usr/bin/env node

import { save, list, search, get } from './store.js';

const USAGE = `Usage: snap [command]

Commands:
  (none)            Save current clipboard to history
  list              Show all saved entries
  search <query>    Find entries matching a substring
  get <id>          Copy a saved entry back to clipboard
  help              Show this help message`;

const [,, command, ...args] = process.argv;

switch (command) {
  case undefined:
    await save();
    break;
  case 'list':
    await list();
    break;
  case 'search':
    await search(args[0]);
    break;
  case 'get':
    await get(args[0]);
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
