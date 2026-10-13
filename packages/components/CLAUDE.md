# @kalads/components — Rules for AI Agents

## Component Architecture

All components are **Lit web components** using Shadow DOM.
Element prefix: `kds-*`
Source files: `src/components/<name>/kds-<name>.ts`

## Component Checklist (every new component must have all of these)

- [ ] File at `src/components/<name>/kds-<name>.ts`
- [ ] `@customElement('kds-<name>')` decorator
- [ ] All `static styles` values use CSS custom properties — ZERO hardcoded values
- [ ] `@property({ reflect: true })` for every visual attribute (enables CSS attribute selectors)
- [ ] `part="..."` on key interactive elements (documented escape hatch for external CSS)
- [ ] JSDoc with `@element`, `@summary`, `@slot`, `@attr` annotations
- [ ] `declare global { interface HTMLElementTagNameMap { 'kds-<name>': Kds<Name>; } }`
- [ ] Exported from `src/index.ts`
- [ ] Component tokens in `packages/tokens/src/component/<name>.json`
- [ ] Storybook story in `apps/storybook/src/stories/components/<Name>.stories.ts`
- [ ] Docs page with a Usage section in `apps/storybook/src/stories/components/<Name>.mdx`

## Styling Rules

**All CSS values MUST come from CSS custom properties. No exceptions.**

```ts
// WRONG — hardcoded value
static styles = css`button { background: #2563eb; padding: 12px 16px; }`;

// RIGHT — token-based
static styles = css`button { background: var(--kds-component-button-primary-bg); padding: var(--kds-component-button-primary-padding-y) var(--kds-component-button-primary-padding-x); }`;
```

State styles map to state-specific token vars:
```css
button:hover   { background-color: var(--kds-component-button-primary-bg-hover); }
button:active  { background-color: var(--kds-component-button-primary-bg-active); }
button:focus-visible { box-shadow: 0 0 0 3px var(--kds-component-button-primary-ring-focus); }
:host([disabled]) button { background-color: var(--kds-component-button-primary-bg-disabled); }
```

## Why Shadow DOM

Shadow DOM ensures external styles cannot accidentally break component internals.
The `part="..."` attribute is the intentional, documented escape hatch.

## Build

```bash
pnpm build    # Vite library build + CEM manifest generation
pnpm dev      # Vite watch mode (fast incremental rebuilds)
pnpm typecheck  # TypeScript check without emit
```
