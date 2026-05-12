# Icons

Drop the following PNG icons into this directory:

- `icon-16.png` (16×16) — toolbar
- `icon-32.png` (32×32) — Windows
- `icon-48.png` (48×48) — extensions page
- `icon-128.png` (128×128) — Chrome Web Store

**Quick way:** export a single 128×128 design from Figma / Sketch as PNG, then run:

```bash
brew install imagemagick
cd public/icons
for size in 16 32 48 128; do
  convert icon-128.png -resize ${size}x${size} icon-${size}.png
done
```

The design brief: a magnifying glass over a `{ }` curly brace pair, in the brand blue (`#2563eb`).
