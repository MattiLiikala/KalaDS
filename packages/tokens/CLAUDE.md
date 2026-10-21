# @kalads/tokens — Rules for AI Agents

## Token Architecture (3 layers — never skip layers)

```
Layer 1 → Core (primitive, raw values, no references)
  src/core/colors.json       — color palettes (primary, secondary, neutral, danger, warning, success, data1-10)
  src/core/typography.json   — font families, weights, line-heights, sizes
  src/core/size.json         — size scale (size.0 through size.900); every step has .rem and .px values

Layer 2 → Semantic (references Core only)
  src/semantic/color.json    — bg/text/border/ring semantic colours (light theme)
  src/semantic/dark/color.json — the dark theme: every semantic colour (incl. shadow colours), same names,
                               other core references. Nothing else differs between themes.
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

## Themes

Light is `:root`; dark applies inside `[data-kds-theme="dark"]` (and `"auto"` with a dark OS setting).
Themes switch at the semantic layer only, so:

- Component colour tokens MUST reference semantic tokens, never core (`{color.*}`) or literal colours
  (`transparent` is fine), and the semantic token must be for the same property: a fill → `bg.*`, a
  label or icon → `text.*` (on an interactive fill: `text.on-interactive*`), a border → `border.*`, a
  focus ring → `ring.*`.
- Semantic colour names are **property-concept-variant-state-mode**: `bg-interactive-secondary-hover`,
  `border-status-danger`, `ring-interactive-focus-on-inverse` (property `bg` / `text` / `border` / `ring`;
  concept `interactive` / `status` / none; no variant for the brand colour). Name new tokens by their job,
  not by what they happen to equal today. Where one colour serves two properties, add a token per
  property (`bg.interactive` and `border.interactive`).
- Semantic colour keys sit flat in their property group (`"bg": { "interactive-hover": … }`), giving
  `--kds-semantic-bg-interactive-hover`.
- `scripts/check-sources.mjs` runs before every build and fails it when a dark colour is missing or
  extra, a component colour references core, or a reference has the wrong role.
- `test/contrast.test.mjs` (`pnpm test`) checks the text, fill, border and focus pairs in both themes.
- Add a core colour only when no palette step meets contrast in one of the themes, with a
  `$description` saying why (`neutral.750`, `neutral.950`, `neutral-alpha.400/500`).

## Token Naming Rules

- Component tokens reference semantic tokens only (see Themes); data colors may reference core directly
- Every component token file MUST define all interactive states:
  - default, `-hover`, `-active`, `-disabled`, `-focus`, `-ring-focus`

## CSS Custom Property Names

Style Dictionary generates: `--kds-{path}-{name}`

Examples:
- `--kds-color-primary-500`              (core)
- `--kds-semantic-text-brand`            (semantic)
- `--kds-component-button-primary-bg`    (component default)
- `--kds-component-button-primary-bg-hover` (component hover state)

All three layers are output into a single `dist/css/variables.css` file: `:root` (light), then the
`[data-kds-theme]` blocks, which re-declare every token whose value differs in the other theme (semantic
colours and the component tokens built on them, so a themed subtree resolves them again).

## Outputs

| Export | File | Used by |
|---|---|---|
| `@kalads/tokens/css` | `dist/css/variables.css` | Web components, React components, apps |
| `@kalads/tokens/js`, `/js/dark` | `dist/js/tokens.js`, `dark.js` | Storybook interface theme (flat `ComponentButtonPrimaryBg` constants, same names per theme) |
| `@kalads/tokens/vars` | `dist/vars/vars.js` + `.d.ts` | React apps: the semantic tokens as typed `var(--kds-semantic-…)` references (`vars.spacing.md`, camelCase keys like native) |
| `@kalads/tokens/json`, `/json/dark` | `dist/json/tokens.json`, `dark.json` | Docs token tables, the skills' tokens page |
| `@kalads/tokens/native` | `dist/native/tokens.js` + `.d.ts` | React Native: `tokens` (light) and `themes.light` / `themes.dark` |

The native output (`kds/native/*` in `sd.config.mjs`) is a typed nested object with camelCase keys
(`tokens.component.button.primary.bgHover`). Dimensions are numbers (px as is, rem × 16), `em` values
(letter spacing) stay multipliers, font families are the bare family name, and shadows are React Native
`boxShadow` arrays. New token types need a case in the `kds/native/value` transform.

## Build

```bash
pnpm build    # generate dist/ from src/ — always run after modifying tokens
pnpm test     # contrast of the component colour pairs (light and dark), and the vars export
pnpm dev      # watch mode (chokidar-based, restarts on any src/**/*.json change)
```

Never edit `dist/` directly — it is auto-generated.
