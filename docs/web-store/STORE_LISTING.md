# Edge Add-ons Store Listing — Decode

Copy-paste this into the submission form at https://partner.microsoft.com/dashboard/microsoftedge/

---

## Basic info

- **Name:** Decode
- **Author/Publisher:** makdia
- **Category:** Developer Tools (primary) · Productivity (secondary)
- **Language:** English (US)

## Short description (≤132 chars)

> Highlight any code on the web → get a plain-English explanation. Powered by Claude or Llama. Bring your own API key.

(126 chars — within limit.)

## Detailed description

```
Decode is a browser extension built for people learning to code.

Highlight a confusing snippet on GitHub, Stack Overflow, MDN, a blog —
anywhere — right-click, and a side panel slides in with a plain-English
explanation streamed from your favourite LLM.

WHAT IT DOES

• Highlight code → right-click → "Decode this code" → instant streaming explanation
• Keyboard shortcut: Cmd+Shift+E (Mac) or Ctrl+Shift+E (Windows)
• Two explanation modes: Normal (technical but plain-English) and ELI5 (everyday analogies)
• Auto-detects the programming language from page markup (GitHub, Stack Overflow, MDN, Prism, highlight.js)
• Streaming responses — no waiting for a wall of text

PICK YOUR PROVIDER

Decode supports two LLM providers — switch in settings:

• Anthropic Claude (paid, ~$0.001 per explanation on Haiku)
• Groq Llama 3.3 70B (free tier — no credit card needed)

You bring your own API key. Decode does not charge you anything.
Get a free Groq key at https://console.groq.com/keys to start at zero cost.

PRIVACY

• Your API key stays on your device (chrome.storage.local)
• No analytics, no tracking, no telemetry
• No servers — we have nothing to phone home to
• Code you highlight goes only to the LLM provider you chose (Anthropic or Groq), nowhere else
• Open source under MIT: https://github.com/makdia/Decode

WHO IT'S FOR

• Bootcamp grads decoding tutorial code
• Self-taught developers reading open-source projects
• CS students stuck on textbook examples
• Anyone who hits "I have no idea what this does" and doesn't want to break their flow

Decode is open source. Read the code, file an issue, or contribute at
https://github.com/makdia/Decode.
```

## Permission justifications

The Edge submission form asks for a one-sentence justification per permission:

| Permission | Justification text |
|---|---|
| `contextMenus` | Used to register the "Decode this code" item in the right-click menu when text is selected. |
| `storage` | Used to save the user's API key, model preference, and saved explanations locally on the device. Nothing is transmitted to our servers (we have no servers). |
| `sidePanel` | Used to display the streaming explanation in the browser's built-in side panel. |
| `activeTab` | Used to read the user's text selection on the active tab when they trigger the extension. |
| `scripting` | Used by the content script to inspect DOM class names so we can auto-detect the programming language. |
| `<all_urls>` host permission | Required because the user can highlight code on any website (GitHub, Stack Overflow, MDN, blogs, internal company docs, etc.). The extension only reads explicitly-selected text on user action — it does not read or modify page content otherwise. |

## Privacy policy URL

`https://makdia.github.io/Decode/privacy/`

(Setup steps below — once GitHub Pages is enabled, the PRIVACY.md publishes at this URL automatically.)

## Single-purpose description

"Decode lets users highlight code on a webpage and get a plain-English explanation from a Large Language Model (Anthropic Claude or Groq Llama). It does only this — no other features."

## What's new in this version

```
v0.1.0 — first public release
• Right-click any selected code → "Decode this code"
• Keyboard shortcut: Cmd/Ctrl + Shift + E
• Streaming explanations via Claude (Anthropic) or Llama (Groq free tier)
• Auto language detection from page markup
• ELI5 mode for beginners
```

---

## Screenshots needed (you take these)

Edge accepts 3-10 screenshots at **1280×800** or **640×400**.

Suggested shots (use real public code — Stack Overflow questions, MDN docs, open-source repos):

1. **The right-click flow** — show the context menu open over a highlighted snippet with the "Decode this code" item visible
2. **The side panel with a streaming explanation** — capture mid-stream for the "feels alive" effect
3. **The ELI5 mode** — same snippet, ELI5 toggled on, showing an everyday analogy
4. **The options page** — provider picker visible, "Groq" selected to show the free path
5. **A second site** — use Stack Overflow or MDN to prove it works everywhere

Tips for clean screenshots:
- Use a real but visually clean code snippet (~10 lines, syntax-highlighted)
- Crop tight on the relevant UI — don't include browser chrome unless intentional
- Use a fresh Chrome/Edge profile so there's no clutter
- Set your display zoom so 1280×800 captures look crisp

Save them to `docs/web-store/screenshots/` and name them `01-context-menu.png`, `02-streaming.png`, etc.

---

## Setup checklist

Before submitting:

- [ ] GitHub Pages enabled for the repo (Settings → Pages → Source: Deploy from a branch → `main` / `/docs` folder)
- [ ] Verify privacy policy URL works: https://makdia.github.io/Decode/privacy/
- [ ] 3+ screenshots taken at 1280×800
- [ ] Fresh build (`npm run build`) and updated zip (`pnpm run zip` or manual `cd dist && zip -r ../decode-v0.1.0.zip .`)
- [ ] Tested on a fresh browser profile so you know the first-install flow is clean
- [ ] Created an Edge developer account at https://partner.microsoft.com/dashboard/microsoftedge/

## Submission flow

1. Sign in at https://partner.microsoft.com/dashboard/microsoftedge/
2. Click **Create new extension** → upload `decode-v0.1.0.zip`
3. Fill the listing fields by copy-pasting from this file
4. Upload screenshots
5. Click **Submit for certification**
6. Review takes 1-3 business days typically (Edge is faster than Chrome)
