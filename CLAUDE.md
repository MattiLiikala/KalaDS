# KalaDS Design System — Rules for AI Agents

## CRITICAL: Read before modifying any code

This is a monorepo for the KalaDS design system. It has strict rules about how to build UIs.
**Never bypass these rules.**

---

## Monorepo Structure

```
packages/tokens/      @kalads/tokens      — CSS custom properties (design tokens)
packages/icons/       @kalads/icons       — SVG icons as <kds-icon-*> web components
packages/components/  @kalads/components  — Lit UI components (<kds-button>, <kds-input>, etc.)
apps/storybook/       @kalads/storybook   — Documentation (Storybook)
```

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

**3. Never create custom `<button>`, `<input>`, `<badge>`, or `<card>` elements** — use `@kalads/components`:
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
Solid buttons render their label as knockout text cut out of the fill, so the label *is* the surface colour.
The surface behind the button must have at least 4.5:1 contrast with the button fill in every state
(`bg`, `bg-hover`, `bg-active`). On inverse surfaces (`var(--kds-semantic-bg-inverse)`) always add the `on-inverse` attribute:
`<kds-button variant="primary" on-inverse>`. Never put solid buttons on images, gradients or surfaces close to
the button colour. See the contrast tables in the Button story.

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
pnpm typecheck            # TypeScript type checking
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

1. Create `packages/components/src/components/<name>/kds-<name>.ts`
2. Create component tokens `packages/tokens/src/component/<name>.json` (include all states: default, hover, active, disabled, focus)
3. Build tokens: `cd packages/tokens && pnpm build`
4. Build components: `cd packages/components && pnpm build`
5. Create story: `apps/storybook/src/stories/components/<Name>.stories.ts`
6. Export from `packages/components/src/index.ts`
