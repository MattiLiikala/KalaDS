# KalaDS

A design system with one set of design tokens and three component libraries built on them: web
components, React and React Native. The three libraries have the same components, props, variants and
defaults, and come in a light and a dark theme. A test checks the contrast of the colour pairs the
components use, in both themes.

## Packages

| Package                                                               | What it is                                                                         |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`@kalads/tokens`](packages/tokens)                                   | Design tokens (Style Dictionary): CSS custom properties, JS, JSON and React Native |
| [`@kalads/icons`](packages/icons)                                     | Icons as `<kds-icon-*>` elements, plus React and React Native components           |
| [`@kalads/web-components`](packages/web-components)                   | `<kds-*>` web components (Lit) for any web page or framework                       |
| [`@kalads/react-components`](packages/react-components)               | The same components in React 19, styled with CSS modules on the tokens             |
| [`@kalads/react-native-components`](packages/react-native-components) | The same components in React Native (New Architecture, RN 0.76+ / Expo SDK 52+)    |
| [`@kalads/spec`](packages/spec)                                       | The shared component API (prop types, defaults), generated from the web components |

Apps and tools:

- [`apps/storybook`](apps/storybook): the documentation. It has one page per component, with code for
  all three libraries, plus the token pages (Foundations) and Guidelines.
- [`apps/react-playground`](apps/react-playground): every React component next to its web component,
  for checking that they look the same.
- [`apps/native-playground`](apps/native-playground): an Expo app with every React Native component.
- [`tools/skills`](tools/skills): generates the agent skills that ship inside the component packages.

## Components

Accordion, Autocomplete, Backdrop, Badge, Box, Breadcrumbs, Button, Card, Checkbox, Chip, Container,
Dialog, Divider, Drawer, Grid, Icon, IconButton, Input, Link, List, Menu, Notification, Paper, Radio,
Select, Skeleton, Stack, Tabs, Toggle, Tooltip and Typography.

## Usage

### Web components

```ts
import '@kalads/tokens/css';
import '@kalads/web-components';
```

```html
<kds-stack gap="md">
  <kds-input label="Email" type="email" required></kds-input>
  <kds-button variant="primary">Subscribe</kds-button>
</kds-stack>
```

### React

```tsx
import '@kalads/tokens/css';
import '@kalads/react-components/styles.css';
import { Button, Input, Stack } from '@kalads/react-components';

export function Subscribe() {
  return (
    <Stack gap="md">
      <Input label="Email" type="email" required />
      <Button variant="primary">Subscribe</Button>
    </Stack>
  );
}
```

### React Native

```tsx
import {
  Button,
  Input,
  KalaThemeProvider,
  Stack,
  useKalaFonts,
} from '@kalads/react-native-components';

export default function App() {
  const [loaded] = useKalaFonts();
  if (!loaded) return null;
  return (
    <KalaThemeProvider scheme="auto">
      <Stack gap="md">
        <Input label="Email" type="email" required />
        <Button variant="primary" onPress={() => {}}>
          Subscribe
        </Button>
      </Stack>
    </KalaThemeProvider>
  );
}
```

The fonts (Overlock and Parkinsans), the React Native peer dependencies and how the APIs map between
platforms are covered in Storybook's **Getting Started** page.

### Dark mode

- **Web and React:** set `data-kds-theme="dark"` on `<html>` or on any element, or `"auto"` to follow
  the device setting. Light is the default.
- **React Native:** wrap the app in `<KalaThemeProvider scheme="dark" | "auto">`, and read colours in
  your own components from `useTokens()`.

### Tokens in your own CSS

Use semantic tokens. They describe what a value is for, so they follow the theme:

```css
.sidebar {
  padding: var(--kds-semantic-padding-lg);
  background-color: var(--kds-semantic-bg-subtle);
  color: var(--kds-semantic-text-default);
}
```

In React style objects, use the typed `vars` export: each value is the token's CSS variable, so it
follows the theme too.

```tsx
import { vars } from '@kalads/tokens/vars';

<div style={{ gap: vars.spacing.md, backgroundColor: vars.bg.subtle }} />;
```

### Coding agents

Each component package ships an agent skill with the components, tokens and usage rules. In your app,
run `pnpm exec kalads-skills` to link it for your platform.

## Development

Requires Node 22+ and pnpm 9+.

```bash
pnpm install          # Install all workspace dependencies
pnpm build            # Build all packages in dependency order (tokens → icons → components)
pnpm dev              # All packages in watch mode, plus Storybook
pnpm storybook        # Storybook only (build the packages first) at http://localhost:6006
pnpm build:storybook  # Static Storybook build
pnpm typecheck        # TypeScript, including the docs' code snippets
pnpm test             # Token contrast (both themes), React, React Native, the agent skills and API parity
```

### How it fits together

- **Tokens come in three layers.** Core holds the raw values (palettes, sizes). Semantic names say what
  a value is for (`bg.subtle`, `interactive.accent`). Component tokens (`button.primary.bg-hover`) point
  at semantic tokens only.
- **Themes swap only the semantic colours.** The dark theme points the same semantic names at other core
  colours. The build checks that each component token points at a semantic token with the matching
  meaning.
- **The web components are the reference.** Their attributes generate `@kalads/spec`, the React and
  React Native props extend those types, and `pnpm test` checks that the three APIs match.

Contributor rules (no hard-coded values, no inline styles, the new component checklist) are in
[`CLAUDE.md`](CLAUDE.md) and in each package's `CLAUDE.md`.
