import type { MessageFromContent } from '../shared/types';

chrome.runtime.onMessage.addListener((message: MessageFromContent, _sender, sendResponse) => {
  if (message.type !== 'PING') return;

  const selection = window.getSelection();
  const code = selection?.toString().trim() ?? '';

  if (!code) {
    sendResponse({ ok: false, reason: 'no-selection' });
    return true;
  }

  const language = detectLanguageFromSelection(selection);

  chrome.runtime.sendMessage({
    type: 'DECODE_SELECTION',
    payload: {
      code,
      language,
      sourceUrl: window.location.href,
    },
  } satisfies MessageFromContent);

  sendResponse({ ok: true });
  return true;
});

function detectLanguageFromSelection(selection: Selection | null): string | null {
  if (!selection || selection.rangeCount === 0) return null;

  const node = selection.anchorNode;
  if (!node) return null;

  let el: HTMLElement | null =
    node.nodeType === Node.ELEMENT_NODE
      ? (node as HTMLElement)
      : node.parentElement;

  while (el && el !== document.body) {
    const cls = el.className;
    if (typeof cls === 'string') {
      const match = cls.match(/(?:language|lang|highlight-source)-([a-z0-9+#-]+)/i);
      if (match) return match[1].toLowerCase();
    }
    const dataLang = el.getAttribute?.('data-lang') ?? el.getAttribute?.('data-language');
    if (dataLang) return dataLang.toLowerCase();
    el = el.parentElement;
  }

  return null;
}
