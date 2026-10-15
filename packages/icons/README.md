# @kalads/icons

The KalaDS icons, drawn on a 24-unit grid, with the same names on every platform. They take the colour
and size of where they are.

```sh
pnpm add @kalads/icons @kalads/tokens
```

```ts
// Web components: registers every <kds-icon-*> element (included in @kalads/web-components)
import '@kalads/icons';
```

```html
<kds-icon-search label="Search"></kds-icon-search>
```

```tsx
import { SearchIcon } from '@kalads/icons/react'; // React (needs react)
import { SearchIcon } from '@kalads/icons/native'; // React Native (needs react-native-svg)
```

Icons are decorative unless they have a `label`.

## Documentation

KalaDS is a design system with one set of tokens and component libraries for multiple platforms. Read the
documentation at [kalads.netlify.app](https://kalads.netlify.app), and see the
[KalaDS repository](https://github.com/MattiLiikala/KalaDS) for all packages.

## License

MIT
