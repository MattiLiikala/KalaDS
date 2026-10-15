# @kalads/tokens

The KalaDS design tokens, in a light and a dark theme: every colour, size, font and shadow.

```sh
pnpm add @kalads/tokens
```

| Import | What it is |
| --- | --- |
| `@kalads/tokens/css` | CSS custom properties (`--kds-semantic-*`), with the dark theme under `data-kds-theme="dark"` |
| `@kalads/tokens/vars` | The semantic tokens as typed `var(--…)` references, for React style objects |
| `@kalads/tokens/native` | Resolved values for React Native (`tokens`, `themes.light`, `themes.dark`) |
| `@kalads/tokens/js`, `/json` | Flat JS constants and nested JSON (light; `/js/dark` and `/json/dark` for dark) |

```ts
import '@kalads/tokens/css';
```

```css
.sidebar {
  padding: var(--kds-semantic-padding-lg);
  background-color: var(--kds-semantic-bg-subtle);
}
```

```tsx
import { vars } from '@kalads/tokens/vars';

<div style={{ gap: vars.spacing.md, color: vars.text.subtle }} />;
```

Use only the semantic tokens in your code: they keep their meaning in both themes. Set
`data-kds-theme="dark"` (or `"auto"`) on `<html>` for dark mode.

## Documentation

KalaDS is a design system with one set of tokens and component libraries for multiple platforms. Read the
documentation at [kalads.netlify.app](https://kalads.netlify.app), and see the
[KalaDS repository](https://github.com/MattiLiikala/KalaDS) for all packages.

## License

MIT
