# @kalads/react-components — Rules for AI Agents

The KalaDS components written in React 19. They match the web components (`packages/web-components`) in
API, look and behaviour: the web component is the reference, ported, never re-designed.

## Component checklist

- [ ] `src/<name>/<Name>.tsx` and `src/<name>/<Name>.module.css`
- [ ] Props `extend <Name>Spec` from `@kalads/spec` (plus the native element's props, minus the spec's keys);
      defaults from `<Name>Defaults`
- [ ] Styles ported from the Lit `static styles`: `:host` → `.root`, `:host([attr])` → `.root[data-attr]`,
      the same `--_private` properties and the same token variables. **Zero hardcoded values.**
- [ ] Token-name props (gap, padding, columns) go through `tokenVars()` (`internal/token-vars.ts`): the
      value is always a `var(--kds-…)` token
- [ ] Events → callbacks with the value (`kds-change` → `onChange(value)`), slots → props (`start`, `footer`)
- [ ] Form controls, Tabs, Accordion, Dialog, Drawer: controlled and uncontrolled (`useControllable`)
- [ ] Same ARIA roles, names and keyboard behaviour as the web component
- [ ] Exported from `src/index.ts`; tests in `src/test/*.test.tsx`; a case in `apps/react-playground/src/cases.tsx`

## Shared helpers (`src/internal/`)

`popup.ts` (top-layer popups, placement from `@kalads/spec`), `modal.ts` (native `<dialog>`),
`Field.module.css` + `fieldVars()` (Select, Autocomplete), `Group.module.css` (checkbox and radio groups), `controllable.ts`, `refs.ts`, `cx.ts`.

## Verify

`pnpm test`, then compare the playground (`pnpm --filter @kalads/react-playground dev`): every case shows
the React and web versions side by side and they must match.
