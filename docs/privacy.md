---
layout: default
title: Privacy Policy — Decode
permalink: /privacy/
---

# Privacy Policy — Decode

**Last updated:** 2026-05-12

Decode is a browser extension that lets you highlight code on any webpage and get a plain-English explanation, powered by a Large Language Model (LLM) of your choice.

This privacy policy explains exactly what data Decode handles and where it goes. We have written it in plain English on purpose — same spirit as the product itself.

---

## TL;DR

- We do **not** have a server. We do **not** collect, store, sell, or share any data about you.
- The code you highlight is sent **directly** from your browser to the LLM provider you chose (Anthropic or Groq), using **your own** API key.
- Your API key, your settings, and your saved explanations live in your browser's local storage. They never leave your device except to authenticate against your chosen LLM provider.

---

## What data does Decode handle?

### 1. Code snippets you highlight
When you trigger "Decode this code" on a selection, the text is sent over HTTPS directly to the LLM provider configured in your settings:

- **Anthropic Claude** — sent to `api.anthropic.com`
- **Groq Llama** — sent to `api.groq.com`

The author of Decode receives **no copy** of this text.

The LLM provider's own privacy and data-retention policies apply to anything you send through their API. Links:

- Anthropic API privacy policy: <https://www.anthropic.com/legal/privacy>
- Groq privacy policy: <https://groq.com/privacy-policy/>

### 2. Your API key
You paste your own Anthropic or Groq API key into Decode's settings. The key is stored in `chrome.storage.local` on your device. It is never transmitted anywhere except as the `Authorization` header on requests you initiate to the LLM provider.

### 3. Your preferences
The model you picked, the default explanation mode, and which provider you use are stored locally in `chrome.storage.local`. They never leave your device.

### 4. The page URL where you triggered Decode
Included in the request to the LLM provider as part of the prompt context (e.g. "Source: https://stackoverflow.com/..."), so the model can give better context-aware explanations. Same destinations as #1.

---

## What does Decode *not* do?

- No analytics, no tracking, no telemetry
- No "phone home" — we have no servers to phone
- No advertising or third-party advertising SDKs
- No selling, renting, or sharing of your data to anyone
- No background activity when you're not actively using it
- No reading of page content unless you explicitly select text and trigger the extension

---

## Permissions explained

| Permission | What it's for |
|---|---|
| `contextMenus` | To register the "Decode this code" right-click menu item. |
| `storage` | To save your API key, preferences, and explanation history locally on your device. |
| `sidePanel` | To open the side panel where the explanation is displayed. |
| `activeTab` | To read your text selection when you trigger the extension on the current tab. |
| `scripting` | Used by the content script to detect the programming language from page markup. |
| Host permission for `<all_urls>` | Required because confusing code can appear on any website — GitHub, Stack Overflow, MDN, blogs, docs. We only act on text you explicitly highlight; we do not read or modify page content otherwise. |

---

## Data retention

We do not retain any data — we never receive any to begin with.

Your locally stored settings and explanation history persist until you:

- Uninstall the extension (clears storage automatically), or
- Clear browser data for the extension, or
- Delete entries manually from inside Decode

Data sent to Anthropic or Groq is subject to **their** retention policies, linked above.

---

## Children's privacy

Decode is not directed at children under 13. It requires an LLM API key, which both Anthropic and Groq require account holders to be 18+ (or 13+ with parental consent) to obtain.

---

## Changes to this policy

If we change how Decode handles data, we will update this page and bump the "Last updated" date at the top.

---

## Contact

For questions, open an issue at <https://github.com/makdia/Decode/issues>.

Decode is open source under the MIT license. The source code is the source of truth — you can verify everything in this policy by reading the code at <https://github.com/makdia/Decode>.
