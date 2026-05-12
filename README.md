# Decode

> Highlight any code on the web → get a plain-English explanation. Powered by Claude.

Decode is a Chrome extension built for people learning to code. Highlight a confusing snippet on GitHub, Stack Overflow, MDN, a blog — anywhere — right-click, and a side panel slides in with a plain-English explanation streamed from Claude.

## Features

- **Right-click any selected code** → "Decode this code"
- **Keyboard shortcut**: <kbd>⌘⇧E</kbd> (Mac) / <kbd>Ctrl+⇧+E</kbd> (Windows)
- **Streaming responses** — no waiting for a wall of text
- **ELI5 mode** — explanations using everyday analogies
- **Language auto-detection** from page markup (works on GitHub, Stack Overflow, MDN, Prism, highlight.js)
- **Your API key, your bill** — stored locally, never sent anywhere except Anthropic
- **Tiny cost** — ~$0.001 per explanation on Haiku 4.5

## Install (development)

You'll need [Node.js](https://nodejs.org) 20+ and [pnpm](https://pnpm.io).

```bash
git clone https://github.com/makdia/Decode.git
cd Decode
pnpm install
pnpm build
```

Then in Chrome:

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** → select the `dist/` folder
4. The Decode options page opens automatically — paste your [Anthropic API key](https://console.anthropic.com/settings/keys)

## Usage

1. Highlight a code snippet anywhere on the web
2. Right-click → **Decode this code**
3. The side panel opens with a plain-English explanation

Or press <kbd>⌘⇧E</kbd> with text selected.

## Project structure

```
src/
├── background/      Service worker — Claude API, context menu, storage
├── content/         Selection capture + language detection
├── sidepanel/       React UI that displays the explanation
├── options/         API key + model setup page
└── shared/          Types and prompt templates
```

## Tech stack

- **Manifest V3** Chrome extension
- **TypeScript** end-to-end
- **React 18** for the UI
- **Tailwind CSS** for styling
- **Vite** + `@crxjs/vite-plugin` for dev/build
- **Anthropic SDK** with streaming + prompt caching

## Roadmap

**v0.1** (current)
- [x] Right-click → explain via streaming
- [x] Side panel UI with markdown rendering
- [x] Options page for API key and model
- [x] Language detection from page markup

**v0.2**
- [ ] Re-trigger when ELI5 toggle changes
- [ ] Follow-up chat ("what's a closure?")
- [ ] Save explanations to a personal notebook
- [ ] "Explain this line" sub-selection

**v0.3**
- [ ] Export notebook to Anki / markdown
- [ ] Quiz mode from saved snippets
- [ ] Firefox build

## License

MIT
