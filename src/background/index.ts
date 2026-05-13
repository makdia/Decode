import type { DecodeRequest, MessageFromContent } from '../shared/types';
import { PENDING_REQUEST_KEY, getActiveApiKey } from '../shared/types';
import { getSettings } from '../shared/storage';
import { openSidePanel } from '../shared/browser';

const CONTEXT_MENU_ID = 'decode-explain-selection';

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: 'Decode this code',
    contexts: ['selection'],
  });

  const settings = await getSettings();
  if (!getActiveApiKey(settings)) {
    chrome.runtime.openOptionsPage();
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID || !tab?.id) return;

  const code = info.selectionText?.trim() ?? '';
  if (!code) return;

  void handleTrigger(tab.id, {
    code,
    language: null,
    sourceUrl: info.pageUrl ?? '',
  });
});

chrome.commands.onCommand.addListener((command, tab) => {
  if (command !== 'decode-selection' || !tab?.id) return;
  void chrome.tabs.sendMessage(tab.id, { type: 'PING' } satisfies MessageFromContent).catch(() => null);
});

chrome.runtime.onMessage.addListener((message: MessageFromContent, sender) => {
  if (message.type !== 'DECODE_SELECTION') return;
  if (!sender.tab?.id) return;

  void handleTrigger(sender.tab.id, {
    code: message.payload.code,
    language: message.payload.language,
    sourceUrl: message.payload.sourceUrl,
  });
});

function handleTrigger(
  tabId: number,
  partial: { code: string; language: string | null; sourceUrl: string }
): Promise<void> {
  openSidePanel(tabId).catch((err) => {
    console.error('[Decode] openSidePanel failed', err);
  });

  return stashPendingRequest(partial);
}

async function stashPendingRequest(partial: {
  code: string;
  language: string | null;
  sourceUrl: string;
}): Promise<void> {
  const settings = await getSettings();

  if (!getActiveApiKey(settings)) {
    chrome.runtime.openOptionsPage();
    return;
  }

  const request: DecodeRequest = {
    requestId: crypto.randomUUID(),
    code: partial.code,
    language: partial.language,
    sourceUrl: partial.sourceUrl,
    mode: settings.defaultMode,
  };

  await chrome.storage.session.set({ [PENDING_REQUEST_KEY]: request });
}
