declare const browser: typeof chrome | undefined;

export const isFirefox: boolean =
  typeof globalThis !== 'undefined' &&
  typeof (globalThis as { browser?: unknown }).browser !== 'undefined' &&
  typeof chrome !== 'undefined' &&
  // sidePanel is the Chrome/Edge marker — Firefox doesn't ship it
  typeof (chrome as unknown as { sidePanel?: unknown }).sidePanel === 'undefined';

export async function openSidePanel(tabId: number): Promise<void> {
  if (isFirefox) {
    const ff = (globalThis as unknown as {
      browser: { sidebarAction: { open: () => Promise<void> } };
    }).browser;
    await ff.sidebarAction.open();
    return;
  }

  await chrome.sidePanel.open({ tabId });
}
