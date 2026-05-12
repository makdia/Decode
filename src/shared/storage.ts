import type { DecodeSettings, NotebookEntry } from '../shared/types';
import { DEFAULT_SETTINGS } from '../shared/types';

const SETTINGS_KEY = 'decode.settings';
const NOTEBOOK_KEY = 'decode.notebook';

export async function getSettings(): Promise<DecodeSettings> {
  const result = await chrome.storage.local.get(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...(result[SETTINGS_KEY] ?? {}) };
}

export async function saveSettings(patch: Partial<DecodeSettings>): Promise<void> {
  const current = await getSettings();
  const next = { ...current, ...patch };
  await chrome.storage.local.set({ [SETTINGS_KEY]: next });
}

export async function getNotebook(): Promise<NotebookEntry[]> {
  const result = await chrome.storage.local.get(NOTEBOOK_KEY);
  return result[NOTEBOOK_KEY] ?? [];
}

export async function addNotebookEntry(entry: NotebookEntry): Promise<void> {
  const current = await getNotebook();
  await chrome.storage.local.set({ [NOTEBOOK_KEY]: [entry, ...current] });
}

export async function removeNotebookEntry(id: string): Promise<void> {
  const current = await getNotebook();
  await chrome.storage.local.set({
    [NOTEBOOK_KEY]: current.filter((e) => e.id !== id),
  });
}
