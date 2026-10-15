# @kalads/react-native-components

The KalaDS components for React Native and Expo (New Architecture: React Native 0.76+, Expo SDK 52+),
with the same components, props and variants as the KalaDS web components.

```sh
pnpm add @kalads/react-native-components @kalads/tokens @kalads/icons
npx expo install react-native-svg react-native-safe-area-context expo-font \
  @expo-google-fonts/overlock @expo-google-fonts/parkinsans
```

```tsx
import { Button, Input, KalaThemeProvider, Stack, useKalaFonts } from '@kalads/react-native-components';

export default function App() {
  const [loaded] = useKalaFonts();
  if (!loaded) return null;
  return (
    <KalaThemeProvider scheme="auto">
      <Stack gap="md">
        <Input label="Email" type="email" required />
        <Button variant="primary" onPress={() => {}}>
          Subscribe
        </Button>
      </Stack>
    </KalaThemeProvider>
  );
}
```

Building with a coding agent? Run `pnpm exec kalads-skills` in your app to give it the KalaDS skill.

## Documentation

KalaDS is a design system with one set of tokens and component libraries for multiple platforms. Read the
documentation at [kalads.netlify.app](https://kalads.netlify.app), and see the
[KalaDS repository](https://github.com/MattiLiikala/KalaDS) for all packages.

## License

MIT
