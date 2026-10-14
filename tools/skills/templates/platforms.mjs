/**
 * The hand-written parts of each platform's skill: SKILL.md (rules and workflow) and setup.md. Everything
 * else in the skill is generated from the library's own sources.
 *
 * These are guidelines for building apps WITH KalaDS. Nothing here is about changing KalaDS itself:
 * contributor rules live in the repository's CLAUDE.md files and must not be copied in.
 */

export const PLATFORMS = {
  web: {
    skill: 'kalads-web',
    package: '@kalads/web-components',
    dir: 'web-components',
    title: 'KalaDS for web components',
    lang: 'html',
    snippet: 'web.html',
    description:
      'Build and change user interfaces with the KalaDS design system using its web components (<kds-*> elements from @kalads/web-components), in plain HTML or any framework. Use whenever writing or reviewing UI code in a project that depends on @kalads/web-components: choosing components and attributes, layout, forms, dialogs, icons, design tokens in CSS, and interface text.',
    icon: (name) => `<kds-icon-${name}>`,
    iconImport: "import '@kalads/icons'; (included in '@kalads/web-components')",
  },
  react: {
    skill: 'kalads-react',
    package: '@kalads/react-components',
    dir: 'react-components',
    title: 'KalaDS for React',
    lang: 'tsx',
    snippet: 'react.tsx',
    description:
      'Build and change user interfaces with the KalaDS design system in React (@kalads/react-components). Use whenever writing or reviewing React UI code in a project that depends on @kalads/react-components: choosing components and props, layout, forms, dialogs, icons, design tokens in CSS, and interface text.',
    icon: (name, Name) => `<${Name}Icon />`,
    iconImport: "import { PlusIcon } from '@kalads/icons/react';",
  },
  native: {
    skill: 'kalads-react-native',
    package: '@kalads/react-native-components',
    dir: 'react-native-components',
    title: 'KalaDS for React Native',
    lang: 'tsx',
    snippet: 'native.tsx',
    description:
      'Build and change user interfaces with the KalaDS design system in React Native and Expo (@kalads/react-native-components). Use whenever writing or reviewing React Native UI code in a project that depends on @kalads/react-native-components: choosing components and props, layout, forms, dialogs, icons, design tokens in StyleSheets, and interface text.',
    icon: (name, Name) => `<${Name}Icon />`,
    iconImport: "import { PlusIcon } from '@kalads/icons/native';",
  },
};

const RULES = {
  web: `1. **Use a KalaDS component for everything it covers.** Never build your own \`<button>\`, \`<input>\`,
   \`<select>\`, badge, card, dialog or tabs: use \`<kds-button>\`, \`<kds-input>\`, \`<kds-select>\`… Find the
   component in [references/components.md](references/components.md) before writing markup.
2. **Configure components with their attributes**, never with inline styles or CSS that reaches into them:
   \`<kds-button variant="danger">\`, not \`<kds-button style="background: red">\`. If no attribute does
   what you need, pick another component or variant; don't restyle.
3. **Lay out with \`kds-stack\`, \`kds-grid\`, \`kds-container\` and \`kds-box\`**, and put text in
   \`kds-typography\` — not styled \`<div>\`s and \`<span>\`s.
4. **Never hardcode colours, spacing, font sizes, radii or shadows.** In your own CSS use the semantic
   tokens: \`var(--kds-semantic-spacing-md)\`, \`var(--kds-semantic-bg-subtle)\`. They follow dark mode;
   core palette tokens (\`--kds-color-*\`) and literal colours don't, so never use them (semantic tokens
   for data visualisation will come later). See [references/tokens.md](references/tokens.md).
5. **Icons are \`<kds-icon-*>\` elements** (\`<kds-icon-plus>\`). Never inline \`<svg>\` or icon image files.
   Give an icon a \`label\` when it carries meaning on its own; decorative icons need none.
6. **Solid buttons need a surface they stand out from.** On \`bg="inverse"\` surfaces add \`on-inverse\` to
   every button; never put solid buttons on images, gradients or mid-tone surfaces.
   See [references/surfaces.md](references/surfaces.md).
7. **Events are \`kds-*\` events** (\`kds-change\`, \`kds-close\`…) with the value in \`event.detail\`.`,
  react: `1. **Use a KalaDS component for everything it covers.** Never render your own \`<button>\`, \`<input>\`,
   \`<select>\`, badge, card, dialog or tabs: use \`Button\`, \`Input\`, \`Select\`… Find the component in
   [references/components.md](references/components.md) before writing JSX.
2. **Configure components with their props** (\`variant\`, \`size\`, \`elevation\`…). \`className\` and \`style\`
   on a KalaDS component are only for layout around it (margin, grid placement, width) — never for its
   colours, spacing, fonts or borders. If no prop does what you need, pick another component or variant.
3. **Lay out with \`Stack\`, \`Grid\`, \`Container\` and \`Box\`**, and put text in \`Typography\` — not styled
   \`<div>\`s and \`<span>\`s.
4. **Never hardcode colours, spacing, font sizes, radii or shadows.** In your own CSS use the semantic
   tokens: \`var(--kds-semantic-spacing-md)\`, \`var(--kds-semantic-bg-subtle)\`; in style objects, the same
   tokens from \`import { vars } from '@kalads/tokens/vars'\` (\`vars.spacing.md\`, \`vars.bg.subtle\`). They follow
   dark mode; core palette tokens (\`--kds-color-*\`) and literal colours don't, so never use them (semantic
   tokens for data visualisation will come later). See [references/tokens.md](references/tokens.md).
5. **Icons come from \`@kalads/icons/react\`** (\`<PlusIcon />\`), or \`<Icon name="plus" />\`. Never inline
   \`<svg>\` or icon image files. Give an icon a \`label\` when it carries meaning on its own.
6. **Solid buttons need a surface they stand out from.** Inside \`<Box bg="inverse">\` add \`onInverse\` to every
   button; never put solid buttons on images, gradients or mid-tone surfaces.
   See [references/surfaces.md](references/surfaces.md).
7. **Events are callbacks with the value**: \`onChange(value)\`, \`onClose(reason)\`. \`Input\`'s \`onChange\` runs
   on every edit and \`onCommit\` on blur or Enter. Form controls, Tabs, Accordion items, Dialog and Drawer
   work controlled (\`value\` / \`checked\` / \`open\` + callback) or uncontrolled (\`defaultValue\`,
   \`defaultChecked\`, \`defaultOpen\`).`,
  native: `1. **Use a KalaDS component for everything it covers.** Never build your own buttons, text fields,
   switches, badges, cards, dialogs or tabs from \`Pressable\`, \`TouchableOpacity\`, \`TextInput\`, \`Switch\` or
   \`Modal\`: use \`Button\`, \`Input\`, \`Toggle\`, \`Dialog\`… Find the component in
   [references/components.md](references/components.md) before writing JSX.
2. **Configure components with their props** (\`variant\`, \`size\`, \`elevation\`…). \`style\` on a KalaDS
   component is only for layout around it (margin, flex, alignment, width) — never for its colours,
   spacing, fonts or borders. If no prop does what you need, pick another component or variant.
3. **Lay out with \`Stack\`, \`Grid\`, \`Container\` and \`Box\`, and put every text in \`Typography\`** (or a
   component that takes text, such as \`Button\`). Don't style \`Text\` from react-native yourself.
4. **Never hardcode colours, spacing, font sizes, radii or shadows.** In your own styles use the semantic
   tokens. Read colours and shadows inside the component with \`useTokens()\` (\`const { s } = useTokens();\`
   then \`s.bg.subtle\`), so they follow dark mode; sizes and spacing can also come from \`tokens.semantic\`
   in \`@kalads/tokens/native\` (\`tokens.semantic.spacing.md\`). Never use core palette tokens
   (\`tokens.color.*\`). See [references/tokens.md](references/tokens.md).
5. **Icons come from \`@kalads/icons/native\`** (\`<PlusIcon />\`), or \`<Icon name="plus" />\`. Never draw
   icons with react-native-svg or image files. Give an icon a \`label\` when it carries meaning on its own.
6. **Solid buttons need a surface they stand out from.** Inside \`<Box bg="inverse">\` add \`onInverse\` to every
   button; never put solid buttons on images, gradients or mid-tone surfaces.
   See [references/surfaces.md](references/surfaces.md).
7. **Presses are \`onPress\`; events are callbacks with the value**: \`onChange(value)\`, \`onClose(reason)\`.
   Form controls, Tabs, Accordion items, Dialog and Drawer work controlled or uncontrolled
   (\`defaultValue\`, \`defaultChecked\`, \`defaultOpen\`).
8. **Load the fonts once at the app root** with \`useKalaFonts()\` before rendering KalaDS components.`,
};

const COMMON_RULES = `- **Accessibility:** every form field has a visible \`label\` (placeholders aren't labels); every icon-only
  button has a \`label\`; errors go on the group for checkboxes and radios; never use colour alone to carry
  meaning. See [references/accessibility.md](references/accessibility.md).
- **Writing:** sentence case everywhere; buttons start with a verb ("Save changes"); one primary button per
  view or section. See [references/writing.md](references/writing.md).`;

export function skillMd(platform, { version, check }) {
  const p = PLATFORMS[platform];
  return `---
name: ${p.skill}
description: ${p.description}
---

# ${p.title}

KalaDS is a design system: components, icons and design tokens that give every screen the same look and
behaviour. This skill matches **${p.package} ${version}**. Its references are generated from that
version, so the components, props and tokens they list are exactly the ones installed.

## Rules

Follow these in every change to UI code.

${RULES[platform]}

${COMMON_RULES}

## Workflow

1. **Pick components.** Find what you need in [references/components.md](references/components.md).
2. **Read the component's reference** (\`references/components/<Name>.md\`): its props, an example and the
   usage guidance. Use only the props listed there.
3. **Style only the layout around components**, with tokens from [references/tokens.md](references/tokens.md).
4. **Check the surfaces** behind solid buttons ([references/surfaces.md](references/surfaces.md)).
5. **Run the checker** on the files you changed and fix what it reports:
   \`\`\`sh
   ${check}
   \`\`\`
   It flags hardcoded values, inline styles, raw elements and icons, and buttons on inverse surfaces
   without ${platform === 'web' ? '`on-inverse`' : '`onInverse`'}. It can't judge everything: the rules above still apply.

## References

- [setup.md](references/setup.md) — installing and loading the library
- [components.md](references/components.md) — every component, and what to use it for
- [tokens.md](references/tokens.md) — semantic tokens for your own styles
- [icons.md](references/icons.md) — every icon
- [surfaces.md](references/surfaces.md), [accessibility.md](references/accessibility.md),
  [writing.md](references/writing.md) — guidelines
`;
}

export function setupMd(platform, { version }) {
  const install = {
    web: 'pnpm add @kalads/web-components @kalads/tokens @kalads/icons \\\n  @fontsource/overlock @fontsource/parkinsans',
    react: 'pnpm add @kalads/react-components @kalads/tokens @kalads/icons \\\n  @fontsource/overlock @fontsource/parkinsans',
    native:
      'pnpm add @kalads/react-native-components @kalads/tokens @kalads/icons\nnpx expo install react-native-svg react-native-safe-area-context expo-font \\\n  @expo-google-fonts/overlock @expo-google-fonts/parkinsans',
  }[platform];
  const fonts = `import '@fontsource/overlock/400.css';
import '@fontsource/overlock/700.css';
import '@fontsource/parkinsans/400.css';
import '@fontsource/parkinsans/500.css';
import '@fontsource/parkinsans/700.css';`;
  const load = {
    web: `Load the tokens, fonts and components once, in the app's entry module, before any component renders:

\`\`\`ts
import '@kalads/tokens/css';
${fonts}
// Registers every <kds-*> element, icons included.
import '@kalads/web-components';
\`\`\``,
    react: `Load the tokens, the components' stylesheet and the fonts once, in the app's entry module. Requires
React 19.

\`\`\`tsx
import '@kalads/tokens/css';
import '@kalads/react-components/styles.css';
${fonts}

import { Button, Input, Stack } from '@kalads/react-components';
import { PlusIcon } from '@kalads/icons/react';
\`\`\``,
    native: `Needs the New Architecture (React Native 0.76 or later; Expo SDK 52 or later). Load the fonts once at the
app root, then use the components:

\`\`\`tsx
import { Button, Input, Stack, useKalaFonts } from '@kalads/react-native-components';

export default function App() {
  const [loaded] = useKalaFonts();
  if (!loaded) return null;
  return (
    <Stack gap="md">
      <Input label="Email" type="email" required />
      <Button variant="primary" onPress={subscribe}>
        Subscribe
      </Button>
    </Stack>
  );
}
\`\`\`

For your own styles, read the tokens as numbers and colour strings:

\`\`\`tsx
import { StyleSheet } from 'react-native';
import { tokens } from '@kalads/tokens/native';

const styles = StyleSheet.create({
  section: { gap: tokens.semantic.spacing.md, paddingVertical: tokens.semantic.padding.lg },
});
\`\`\``,
  }[platform];
  const page = {
    web: `Give the page the default surface, text colour and body font, so plain text between components matches:

\`\`\`css
body {
  background-color: var(--kds-semantic-bg-default);
  color: var(--kds-semantic-text-default);
  font-family: var(--kds-semantic-font-body);
}
\`\`\``,
    react: `Give the page the default surface, text colour and body font, so plain text between components matches:

\`\`\`css
body {
  background-color: var(--kds-semantic-bg-default);
  color: var(--kds-semantic-text-default);
  font-family: var(--kds-semantic-font-body);
}
\`\`\``,
    native: `Platform behaviour to know:

- Hover and keyboard focus styles appear where the device has a pointer or keyboard; focus rings show for
  keyboard focus only.
- \`Select\` and \`Autocomplete\` take \`Option\` children (React Native has no \`<option>\`).
- Dialog, Drawer and Backdrop are modals; the Android back button closes them with reason \`'escape'\`.
- Tooltip shows on long press on touch screens; its text is also the trigger's accessibility hint.
- Typography inside \`<Box bg="inverse">\` switches to inverse text by itself.
- Grid has no row spans, and form submission props (\`name\`) don't apply.`,
  }[platform];
  const dark = {
    web: `Light is the default. For dark mode, set \`data-kds-theme\` on \`<html>\`: \`dark\`, \`light\`, or \`auto\`
(follows the device's appearance setting). It works on any element too, for a section in the other theme;
give that section \`background-color: var(--kds-semantic-bg-default)\`.

\`\`\`html
<html data-kds-theme="auto">
\`\`\`

Only semantic tokens change with the theme; palette tokens and literal colours stay the same, so never use
them for interface colours. On \`bg="inverse"\` surfaces keep \`on-inverse\` on buttons in both themes.`,
    react: `Light is the default. For dark mode, set \`data-kds-theme\` on \`<html>\`: \`dark\`, \`light\`, or \`auto\`
(follows the device's appearance setting). It works on any element too, for a section in the other theme;
give that section \`background-color: var(--kds-semantic-bg-default)\`.

\`\`\`tsx
document.documentElement.dataset.kdsTheme = 'auto';
\`\`\`

Only semantic tokens change with the theme; palette tokens and literal colours stay the same, so never use
them for interface colours. Inside \`<Box bg="inverse">\` keep \`onInverse\` on buttons in both themes.`,
    native: `Light is the default. For dark mode, wrap the app root in \`KalaThemeProvider\` with \`scheme\`
\`"dark"\`, \`"light"\` or \`"auto"\` (follows the device's appearance setting). Dialogs, drawers, menus and
tooltips keep the theme.

\`\`\`tsx
import { KalaThemeProvider, useTokens } from '@kalads/react-native-components';

<KalaThemeProvider scheme="auto">
  <App />
</KalaThemeProvider>;

// In your own components, read colours from the active theme:
function Section({ children }: { children: React.ReactNode }) {
  const { s } = useTokens();
  return <View style={{ backgroundColor: s.bg.subtle, padding: s.padding.lg }}>{children}</View>;
}
\`\`\`

Colours imported from \`@kalads/tokens/native\` (\`tokens.semantic.bg.*\`) are the light theme's: use them
only for sizes and spacing. Inside \`<Box bg="inverse">\` keep \`onInverse\` on buttons in both themes.`,
  }[platform];
  return `# Setup (${PLATFORMS[platform].package} ${version})

\`\`\`sh
${install}
\`\`\`

${load}

${page}

## Dark mode

${dark}
`;
}
