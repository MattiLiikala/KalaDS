# @kalads/react-native-components — Rules for AI Agents

The KalaDS components for React Native (New Architecture, RN 0.76+ / Expo SDK 52+). They match the web
components in API and look; behaviour follows the web where the platform allows (see the differences in
Storybook's Getting Started).

## Component checklist

- [ ] `src/<name>/<Name>.tsx`
- [ ] Props `extend <Name>Spec` from `@kalads/spec`; leave out web-only props explicitly with `Omit<…>`
      (form `name`, link `rel` / `download`, grid `rowSpan`) and document why
- [ ] Every value from `@kalads/tokens/native`. **Zero hardcoded values.** Colours and shadows come from
      `useTokens()` inside the component (`const { c, s } = useTokens();`), so they follow
      `KalaThemeProvider`; the static `c`, `s`, `t` exports of `internal/theme.ts` are the light theme, for
      module-level dimensions only. `src/test/theme.test.tsx` renders every component with placeholder
      colours and fails on any colour read from the static tokens: add new components to its gallery.
- [ ] Text through `typeStyle()` / `textStyle()` (absolute line heights, the right font file per weight)
- [ ] States with Pressable: pressed, `onHoverIn/Out`, focus ring via `useFocusVisible()` + `ring()`
- [ ] Icons colour and size through `IconContext` (React Native has no CSS inheritance)
- [ ] `role` and `aria-*` props matching the web component's roles; text in `<Text>`
- [ ] Exported from `src/index.ts`; tests in `src/test/*.test.tsx`; a screen in `apps/native-playground/src/screens.tsx`

## Shared helpers (`src/internal/`)

`theme.ts` (`KalaThemeProvider`, `useTokens`), `Popup.tsx` (anchored popups in a Modal, placement from `@kalads/spec`), `modal.tsx` (Dialog / Drawer
open state and close reasons), `Field.tsx`, `Group.tsx`, `Listbox.tsx`, `options.tsx` (`Option`), `fonts.ts` (`useKalaFonts`, `fontFamily`), `focus.ts`, `motion.ts`.

## Verify

`pnpm test`, then the playground: `pnpm --filter @kalads/native-playground ios` (Simulator) or `web`.
Open a screen with a deep link: `xcrun simctl openurl booted "exp://127.0.0.1:8081/--/?screen=button"`.
