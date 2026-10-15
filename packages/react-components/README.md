# @kalads/react-components

The KalaDS components for React 19, with the same components, props and variants as the KalaDS web
components. Styled with the KalaDS design tokens.

```sh
pnpm add @kalads/react-components @kalads/tokens @kalads/icons
```

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

The tokens use the Overlock and Parkinsans fonts (for example from `@fontsource/overlock` and
`@fontsource/parkinsans`). For dark mode, set `data-kds-theme="dark"` (or `"auto"`) on `<html>`.

Building with a coding agent? Run `pnpm exec kalads-skills` in your app to give it the KalaDS skill.

## Documentation

KalaDS is a design system with one set of tokens and component libraries for multiple platforms. See the
[KalaDS repository](https://github.com/MattiLiikala/KalaDS) for all packages and the documentation
(Storybook, `apps/storybook`).

## License

MIT
