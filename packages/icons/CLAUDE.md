# @kalads/icons — Rules for AI Agents

## How Icons Work

Icons are Lit web components **auto-generated** from SVG files in `src/svgs/`.

Filename → element name mapping:
- `src/svgs/arrow-left.svg` → element `<kds-icon-arrow-left>`
- `src/svgs/chevron-down.svg` → element `<kds-icon-chevron-down>`

**NEVER manually edit `src/components/` or `src/index.ts`** — they are overwritten on every build.

## Adding Icons

1. Place an SVG file in `src/svgs/<name>.svg`
   - Filename must use kebab-case
   - Do NOT include `fill`, `stroke`, `width`, or `height` attributes (SVGO removes them)
   - Must include `viewBox` attribute
2. Run `pnpm build`
3. The element is available immediately

## Using Icons

```html
<!-- Basic -->
<kds-icon-arrow-left label="Go back"></kds-icon-arrow-left>

<!-- Custom size via CSS var -->
<kds-icon-search style="--kds-icon-size: 1rem;"></kds-icon-search>

<!-- Inside button (color inherits from button text color) -->
<kds-button variant="primary">
  <kds-icon-plus slot="start" label="Add"></kds-icon-plus>
  Add item
</kds-button>
```

## Sizing & Color

- Default size: `1.5rem` (set via `--kds-icon-size` CSS custom property on the element)
- Color: inherits `currentColor` from parent — never set color directly on icons

## Build

```bash
pnpm build    # runs build-icons.mjs (generates TS) then tsc
pnpm dev      # watch mode (chokidar watches src/svgs/*.svg)
```
