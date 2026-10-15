# @kalads/web-components

The KalaDS components as web components (`<kds-button>`, `<kds-input>`…), for any web page or
framework. Built with Lit, styled with the KalaDS design tokens.

```sh
pnpm add @kalads/web-components @kalads/tokens
```

```ts
import '@kalads/tokens/css';
import '@kalads/web-components'; // registers every <kds-*> element, icons included
```

```html
<kds-stack gap="md">
  <kds-input label="Email" type="email" required></kds-input>
  <kds-button variant="primary">Subscribe</kds-button>
</kds-stack>
```

The tokens use the Overlock and Parkinsans fonts (for example from `@fontsource/overlock` and
`@fontsource/parkinsans`). For dark mode, set `data-kds-theme="dark"` (or `"auto"`) on `<html>`.

Building with a coding agent? Run `pnpm exec kalads-skills` in your app to give it the KalaDS skill.

## Documentation

KalaDS is a design system with one set of tokens and component libraries for multiple platforms. Read the
documentation at [kalads.netlify.app](https://kalads.netlify.app), and see the
[KalaDS repository](https://github.com/MattiLiikala/KalaDS) for all packages.

## License

MIT
