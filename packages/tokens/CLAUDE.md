# @kalads/tokens — Rules for AI Agents

## Token Architecture (3 layers — never skip layers)

```
Layer 1 → Core (primitive, raw values, no references)
  src/core/colors.json       — color palettes (primary, secondary, neutral, danger, warning, success, data1-10)
  src/core/typography.json   — font families, weights, line-heights, sizes
  src/core/size.json         — size scale (size.0 through size.900); every step has .rem and .px values

Layer 2 → Semantic (references Core only)
  src/semantic/color.json    — bg/text/border/status semantic aliases
  src/semantic/typography.json
  src/semantic/spacing.json  — spacing.none/xs/sm/md/lg/xl/2xl
  src/semantic/radius.json   — radius.none/sm/md/lg/full
  src/semantic/padding.json  — padding.xs/sm/md/lg/xl
  src/semantic/border-width.json — border-width.default/focus (uses the size .px values)
  src/semantic/shadow.json   — shadow.crisp.1-3 (offset, no blur: card/paper/notification), shadow.soft.1-3 (blurred: popups, dialogs)

Layer 3 → Component (references Semantic only, never Core directly)
  src/component/button.json
  src/component/input.json
  src/component/card.json
  src/component/badge.json
```

## Token File Format

All tokens use DTCG spec with `$type` and `$value`:
```json
{
  "color": {
    "primary": {
      "500": { "$type": "color", "$value": "#2563eb" }
    }
  }
}
```

References use dot notation in curly braces:
```json
{ "$type": "color", "$value": "{color.primary.500}" }
```

## Token Naming Rules

- Component tokens MUST reference semantic tokens, NOT core tokens
  - Exception: data colors may reference core directly
- Every component token file MUST define all interactive states:
  - default, `-hover`, `-active`, `-disabled`, `-focus`, `-ring-focus`

## CSS Custom Property Names

Style Dictionary generates: `--kds-{path}-{name}`

Examples:
- `--kds-color-primary-500`              (core)
- `--kds-semantic-text-brand`            (semantic)
- `--kds-component-button-primary-bg`    (component default)
- `--kds-component-button-primary-bg-hover` (component hover state)

All three layers are output into a single `dist/css/variables.css` file.
All CSS vars are available in `:root` by default.

## Build

```bash
pnpm build    # generate dist/ from src/ — always run after modifying tokens
pnpm dev      # watch mode (chokidar-based, restarts on any src/**/*.json change)
```

Never edit `dist/` directly — it is auto-generated.
