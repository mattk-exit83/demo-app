import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import clipboard from 'clipboardy';

const SNAP_DIR = join(homedir(), '.snap');
const HISTORY_FILE = join(SNAP_DIR, 'history.json');
const MAX_ENTRIES = 50;

async function ensureStore() {
  if (!existsSync(SNAP_DIR)) {
    await mkdir(SNAP_DIR, { recursive: true });
  }
  if (!existsSync(HISTORY_FILE)) {
    await writeFile(HISTORY_FILE, '[]');
  }
}

async function readHistory() {
  await ensureStore();
  const data = await readFile(HISTORY_FILE, 'utf8');
  return JSON.parse(data);
}

async function writeHistory(entries) {
  await writeFile(HISTORY_FILE, JSON.stringify(entries, null, 2));
}

export async function save(tags) {
  const content = await clipboard.read();
  if (!content.trim()) {
    console.error('Clipboard is empty. Nothing to save.');
    process.exitCode = 1;
    return;
  }

  const history = await readHistory();
  const nextId = history.length > 0 ? Math.max(...history.map(e => e.id)) + 1 : 1;

  const entry = {
    id: nextId,
    content,
    timestamp: new Date().toISOString(),
  };
  if (tags && tags.length > 0) {
    entry.tags = tags;
  }

  history.push(entry);

  // Enforce cap — drop oldest entries
  while (history.length > MAX_ENTRIES) {
    history.shift();
  }

  await writeHistory(history);
  const preview = content.length > 80 ? content.slice(0, 80) + '...' : content;
  const tagStr = entry.tags ? ` [${entry.tags.join(', ')}]` : '';
  console.log(`Saved #${nextId}: ${preview}${tagStr}`);
}

export async function list(tag) {
  const history = await readHistory();
  let entries = history;

  if (tag) {
    entries = entries.filter(e => e.tags && e.tags.includes(tag));
    if (entries.length === 0) {
      console.log(`No entries found with tag "${tag}".`);
      return;
    }
  } else if (entries.length === 0) {
    console.log('No entries saved. Use `snap` to save clipboard contents.');
    return;
  }

  const reversed = [...entries].reverse();
  for (const entry of reversed) {
    const preview = entry.content.length > 80 ? entry.content.slice(0, 80) + '...' : entry.content;
    const ago = timeAgo(new Date(entry.timestamp));
    const tagStr = entry.tags ? ` [${entry.tags.join(', ')}]` : '';
    console.log(`  #${entry.id}  ${preview}${tagStr}  (${ago})`);
  }
}

export async function search(query) {
  if (!query) {
    console.error('Usage: snap search <query>');
    process.exitCode = 1;
    return;
  }

  const history = await readHistory();
  const lower = query.toLowerCase();
  const matches = history.filter(e => e.content.toLowerCase().includes(lower));

  if (matches.length === 0) {
    console.log(`No entries matching "${query}".`);
    return;
  }

  const reversed = [...matches].reverse();
  for (const entry of reversed) {
    const preview = entry.content.length > 80 ? entry.content.slice(0, 80) + '...' : entry.content;
    const ago = timeAgo(new Date(entry.timestamp));
    console.log(`  #${entry.id}  ${preview}  (${ago})`);
  }
}

export async function get(id) {
  if (id === undefined) {
    console.error('Usage: snap get <id>');
    process.exitCode = 1;
    return;
  }

  const numId = Number(id);
  if (Number.isNaN(numId)) {
    console.error(`Invalid id: ${id}`);
    process.exitCode = 1;
    return;
  }

  const history = await readHistory();
  const entry = history.find(e => e.id === numId);

  if (!entry) {
    console.error(`Entry #${numId} not found.`);
    process.exitCode = 1;
    return;
  }

  await clipboard.write(entry.content);
  const preview = entry.content.length > 80 ? entry.content.slice(0, 80) + '...' : entry.content;
  console.log(`Copied #${numId} to clipboard: ${preview}`);
}

export async function exportHistory() {
  const history = await readHistory();
  console.log(JSON.stringify(history, null, 2));
}

export async function clear() {
  const history = await readHistory();
  if (history.length === 0) {
    console.log('Nothing to clear.');
    return;
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => {
    rl.question('Clear all history? (y/N) ', resolve);
  });
  rl.close();

  if (answer === 'y' || answer === 'Y') {
    await writeHistory([]);
    console.log('History cleared.');
  } else {
    console.log('Aborted.');
  }
}

export async function stats() {
  const history = await readHistory();
  if (history.length === 0) {
    console.log('No entries saved.');
    console.log('Entries: 0');
    return;
  }

  const count = history.length;
  const oldest = history[0].timestamp;
  const newest = history[history.length - 1].timestamp;
  const fileInfo = await stat(HISTORY_FILE);

  console.log(`Entries: ${count}`);
  console.log(`Oldest:  ${oldest}`);
  console.log(`Newest:  ${newest}`);
  console.log(`Size:    ${fileInfo.size} bytes`);
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
