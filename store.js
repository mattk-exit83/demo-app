import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
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

export async function save() {
  const content = await clipboard.read();
  if (!content.trim()) {
    console.error('Clipboard is empty. Nothing to save.');
    process.exitCode = 1;
    return;
  }

  const history = await readHistory();
  const nextId = history.length > 0 ? Math.max(...history.map(e => e.id)) + 1 : 1;

  history.push({
    id: nextId,
    content,
    timestamp: new Date().toISOString(),
  });

  // Enforce cap — drop oldest entries
  while (history.length > MAX_ENTRIES) {
    history.shift();
  }

  await writeHistory(history);
  const preview = content.length > 80 ? content.slice(0, 80) + '...' : content;
  console.log(`Saved #${nextId}: ${preview}`);
}

export async function list() {
  const history = await readHistory();
  if (history.length === 0) {
    console.log('No entries saved. Use `snap` to save clipboard contents.');
    return;
  }

  const reversed = [...history].reverse();
  for (const entry of reversed) {
    const preview = entry.content.length > 80 ? entry.content.slice(0, 80) + '...' : entry.content;
    const ago = timeAgo(new Date(entry.timestamp));
    console.log(`  #${entry.id}  ${preview}  (${ago})`);
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
