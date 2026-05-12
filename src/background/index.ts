import type {
  DecodeRequest,
  MessageFromBackground,
  MessageFromContent,
} from '../shared/types';
import { streamExplanation } from './claude';
import { getSettings } from './storage';

const CONTEXT_MENU_ID = 'decode-explain-selection';

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: 'Decode this code',
    contexts: ['selection'],
  });

  const settings = await getSettings();
  if (!settings.apiKey) {
    chrome.runtime.openOptionsPage();
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID || !tab?.id) return;

  const code = info.selectionText?.trim() ?? '';
  if (!code) return;

  await triggerDecode(tab.id, {
    code,
    language: null,
    sourceUrl: info.pageUrl ?? '',
    mode: (await getSettings()).defaultMode,
  });
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command !== 'decode-selection' || !tab?.id) return;

  const response = await chrome.tabs
    .sendMessage(tab.id, { type: 'PING' } satisfies MessageFromContent)
    .catch(() => null);

  if (!response) return;
});

chrome.runtime.onMessage.addListener((message: MessageFromContent, sender) => {
  if (message.type !== 'DECODE_SELECTION') return;
  if (!sender.tab?.id) return;

  void triggerDecode(sender.tab.id, message.payload);
});

async function triggerDecode(tabId: number, payload: DecodeRequest): Promise<void> {
  const settings = await getSettings();

  if (!settings.apiKey) {
    chrome.runtime.openOptionsPage();
    return;
  }

  await chrome.sidePanel.open({ tabId });

  await sendToPanel({ type: 'DECODE_START', payload });

  await streamExplanation({
    apiKey: settings.apiKey,
    model: settings.model,
    mode: payload.mode,
    code: payload.code,
    language: payload.language,
    sourceUrl: payload.sourceUrl,
    onChunk: (text) => void sendToPanel({ type: 'DECODE_CHUNK', payload: { text } }),
    onDone: () => void sendToPanel({ type: 'DECODE_DONE' }),
    onError: (message) =>
      void sendToPanel({ type: 'DECODE_ERROR', payload: { message } }),
  });
}

async function sendToPanel(message: MessageFromBackground): Promise<void> {
  await chrome.runtime.sendMessage(message).catch(() => {
    // panel may not be ready yet — fail silently
  });
}
