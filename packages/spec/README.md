# @kalads/spec

The shared component API of the KalaDS libraries: prop types, variants and defaults, generated from the
web components. `@kalads/react-components` and `@kalads/react-native-components` build their props on
it, so the three libraries stay the same.

You don't usually install it yourself: the component libraries depend on it. Its types are useful when
you wrap a component and want the same prop values:

```ts
import type { ButtonVariant } from '@kalads/spec';
```

## Documentation

KalaDS is a design system with one set of tokens and component libraries for multiple platforms. Read the
documentation at [kalads.netlify.app](https://kalads.netlify.app), and see the
[KalaDS repository](https://github.com/MattiLiikala/KalaDS) for all packages.

## License

MIT
