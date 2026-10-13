# KalaDS Design System — Rules for AI Agents

## CRITICAL: Read before modifying any code

This is a monorepo for the KalaDS design system. It has strict rules about how to build UIs.
**Never bypass these rules.**

---

## Monorepo Structure

```
packages/tokens/                  @kalads/tokens                  — Design tokens: CSS variables, JS, JSON, React Native (./native)
packages/icons/                   @kalads/icons                   — Icons: <kds-icon-*> elements, ./react and ./native components
packages/spec/                    @kalads/spec                    — Shared component API (prop types, defaults), generated from the web components
packages/web-components/          @kalads/web-components          — Lit UI components (<kds-button>, <kds-input>, etc.)
packages/react-components/        @kalads/react-components        — The same components in React (<Button>), CSS modules on the tokens
packages/react-native-components/ @kalads/react-native-components — The same components in React Native, styled from @kalads/tokens/native
apps/storybook/                   @kalads/storybook               — Documentation (Storybook), one page per component for all three
apps/react-playground/            @kalads/react-playground        — Every React component next to its web component (visual parity)
apps/native-playground/           @kalads/native-playground       — Expo app with every React Native component (iOS, Android, web)
```

The web components are the reference: their attributes (custom-elements.json) generate `@kalads/spec`,
and the React and React Native props extend those types. A component's look, states and behaviour must
match across the three libraries.

---

## ABSOLUTE RULES

### NEVER do these things:

**1. Never add inline styles to `<kds-*>` elements:**
```html
<!-- WRONG -->
<kds-button style="color: red; padding: 8px;">Click</kds-button>

<!-- RIGHT -->
<kds-button variant="danger">Click</kds-button>
```

**2. Never hardcode color, spacing, or typography values:**
```css
/* WRONG */
color: #2563eb;
padding: 12px 16px;
font-size: 14px;

/* RIGHT */
color: var(--kds-semantic-text-brand);
padding: var(--kds-semantic-padding-sm) var(--kds-semantic-padding-lg);
font-size: var(--kds-font-size-200);
```

**3. Never create custom `<button>`, `<input>`, `<badge>`, or `<card>` elements** — use `@kalads/web-components`
(or `@kalads/react-components` / `@kalads/react-native-components` in React and React Native):
```html
<!-- WRONG -->
<button class="btn btn-primary">Click</button>

<!-- RIGHT -->
<kds-button variant="primary">Click</kds-button>
```

**4. Never use inline `<svg>` or raw SVG files** — use icon components:
```html
<!-- WRONG -->
<svg xmlns="..." viewBox="0 0 24 24">...</svg>

<!-- RIGHT -->
<kds-icon-arrow-left label="Go back"></kds-icon-arrow-left>
```

**5. Never add CSS classes that override component styles** — Shadow DOM prevents external style penetration anyway. Use the component's documented attributes.

**6. Never add new components** without:
   - Component tokens in `packages/tokens/src/component/<name>.json`
   - A Storybook story in `apps/storybook/src/stories/components/`

**7. Never place a solid button (`primary`, `secondary`, `danger`) on a surface that doesn't contrast with its fill.**
The label colour tokens keep the label readable on the fill, but the button itself must stand out: the surface
behind it needs at least 3:1 contrast with the button fill in every state (`bg`, `bg-hover`, `bg-active`).
On inverse surfaces (`var(--kds-semantic-bg-inverse)`) always add the `on-inverse` attribute:
`<kds-button variant="primary" on-inverse>`. Never put solid buttons on images, gradients or surfaces close to
the button colour. See **Guidelines/Buttons and Surfaces** in Storybook.

### ALWAYS do these things:

**1. Use semantic tokens for layout:**
- `var(--kds-semantic-spacing-*)` — margins, gaps
- `var(--kds-semantic-bg-*)` — background colors
- `var(--kds-semantic-text-*)` — text colors
- `var(--kds-semantic-border-*)` — border colors
- `var(--kds-semantic-radius-*)` — border radius
- `var(--kds-semantic-padding-*)` — component internal padding

**2. Use core tokens only for data visualization** — `var(--kds-color-data1-500)` etc.

**3. Add `declare global { interface HTMLElementTagNameMap { ... } }` to every new component.**

**4. Use `@property({ reflect: true })` for visual attributes** so CSS attribute selectors work.

**5. Expose `part="..."` on interactive elements** for legitimate external CSS targeting.

---

## Development Commands

```bash
pnpm install              # Install all workspace dependencies
pnpm build                # Build all packages in dependency order (tokens → icons → components)
pnpm dev                  # Start all packages in watch mode + Storybook
pnpm storybook            # Start Storybook only (packages must be built first)
pnpm build:storybook      # Static Storybook build
pnpm typecheck            # TypeScript type checking (includes the docs' code snippets)
pnpm test                 # Unit tests: React (Vitest + Testing Library), React Native (jest-expo)
```

## Adding a New Token

1. Edit the appropriate file in `packages/tokens/src/`
   - Core values → `src/core/`
   - Semantic aliases → `src/semantic/`
   - Component-specific → `src/component/<name>.json`
2. `cd packages/tokens && pnpm build`
3. The CSS custom property is immediately available

## Adding a New Icon

1. Place SVG in `packages/icons/src/svgs/<name>.svg`
   - Do NOT include `width`, `height`, `fill`, or `stroke` attrs — the build strips them
2. `cd packages/icons && pnpm build`
3. Use: `<kds-icon-<name> label="description"></kds-icon-<name>>`

## Adding a New Component

1. Create `packages/web-components/src/components/<name>/kds-<name>.ts`
2. Create component tokens `packages/tokens/src/component/<name>.json` (include all states: default, hover, active, disabled, focus)
3. Build tokens: `cd packages/tokens && pnpm build`
4. Build components: `cd packages/web-components && pnpm build`
5. Create story: `apps/storybook/src/stories/components/<Name>.stories.ts` (no `autodocs` tag), and its docs
   page `<Name>.mdx` next to it with a Usage section (copy any existing page, e.g. `Chip.mdx`).
   Document every attribute, slot, event and CSS part in the component's JSDoc: the docs page's props table
   is generated from it. Keep the story's `docs.description.component` to a short paragraph.
6. Export from `packages/web-components/src/index.ts`
7. Rebuild `@kalads/spec` (`pnpm build`) so `<Name>Spec` / `<Name>Defaults` exist, then add the React
   (`packages/react-components/src/<name>/<Name>.tsx` + `.module.css`) and React Native
   (`packages/react-native-components/src/<name>/<Name>.tsx`) versions. Their props extend `<Name>Spec`.
   Follow each package's CLAUDE.md checklist, and add tests and a playground case for both.
8. Add `apps/storybook/src/snippets/<Name>.web.html`, `<Name>.react.tsx` and `<Name>.native.tsx` for the
   docs page's Code section: the same example in all three.

## Documentation (Storybook)

`apps/storybook` is themed with KalaDS itself. Sections: Introduction, Getting Started, Foundations
(token pages), Components, Guidelines (Accessibility, Buttons and Surfaces, Writing, For AI Agents).

- **Component pages:** every component has `<Name>.mdx` next to its stories, using `<Meta of={...} />`, the
  header block, and a Usage section with `Do` / `Dont` examples built from real components. Usage text
  must match what the component actually does: check the source before writing it.
  Page order is fixed: header, description, main example, **Props** (right below it, so control changes
  are visible), **Code** (`FrameworkTabs`: Web / React / React Native), Usage, then the other examples.
- **Snippets** in `src/snippets/` show one example the same way in every tab: only the markup to use, no
  imports or wrapper. The React / React Native files are whole components (so tsc can check them) whose
  `return (…);` is what the page shows; `.web.html` is checked against `custom-elements.json`. Both run in
  `pnpm typecheck`. The live, Props-driven source stays under the main example's "Show code".
- **Sidebar:** one page per component. Stories are tagged `!dev` globally (`preview.ts`), so they render on
  the docs page but don't get sidebar entries of their own.
- **Token pages** are generated from `@kalads/tokens/json` with `TokenTable` and `ColorScale`. Never write
  token values into docs by hand.
- **Docs styling** lives only in `.storybook/docs.css` (tokens only); the Storybook interface theme in
  `.storybook/kalads-theme.ts` reads `@kalads/tokens/js`.
- In stories, build layouts with `kds-stack`, `kds-box`, `kds-grid` and `kds-typography`, not styled `<div>`s.
