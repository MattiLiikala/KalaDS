import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useKalaFonts, KalaThemeProvider, Stack, Toggle, Typography, useTokens } from '@kalads/react-native-components';
import { screens } from './screens';

const param = (name: string) => (typeof location !== 'undefined' ? new URLSearchParams(location.search).get(name) : null);

/**
 * One screen per case; the list mirrors the React playground's cases. `?screen=<id>` opens one on web,
 * `?theme=dark` starts in dark mode (also in deep links).
 */
export function App() {
  const [loaded] = useKalaFonts();
  const [dark, setDark] = useState(param('theme') === 'dark');
  useEffect(() => {
    const read = (url: string | null) => url?.match(/[?&]theme=(dark|light)/) && setDark(url.includes('theme=dark'));
    void Linking.getInitialURL().then(read);
    const sub = Linking.addEventListener('url', (e) => read(e.url));
    return () => sub.remove();
  }, []);
  if (!loaded) return null;
  return (
    <KalaThemeProvider scheme={dark ? 'dark' : 'light'}>
      <Playground dark={dark} onDarkChange={setDark} />
    </KalaThemeProvider>
  );
}

function Playground({ dark, onDarkChange }: { dark: boolean; onDarkChange: (dark: boolean) => void }) {
  const { s } = useTokens();
  const initial = param('screen');
  const [screen, setScreen] = useState<string | null>(initial);
  const [open, setOpen] = useState<string | null>(param('open'));
  // On devices, open a screen with a deep link: exp://<host>/--/?screen=button
  useEffect(() => {
    const open = (url: string | null) => {
      const id = url?.match(/[?&]screen=([\w-]+)/)?.[1];
      if (id) setScreen(id);
      setOpen(url?.match(/[?&]open=([\w-]+)/)?.[1] ?? null);
    };
    void Linking.getInitialURL().then(open);
    const sub = Linking.addEventListener('url', (e) => open(e.url));
    return () => sub.remove();
  }, []);
  const current = screens.find((s) => s.id === screen);
  return (
    <View style={{ flex: 1, backgroundColor: s.bg.default }}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={{ padding: s.spacing.lg, paddingTop: 64 }}>
        {current ? (
          <Stack gap="lg">
            <Pressable onPress={() => setScreen(null)} role="link">
              <Typography color="brand">‹ All components</Typography>
            </Pressable>
            <Typography variant="overline">{current.title}</Typography>
            {current.render({ open })}
          </Stack>
        ) : (
          <Stack gap="sm">
            <Typography variant="h3">KalaDS Native</Typography>
            <Toggle checked={dark} onChange={onDarkChange}>
              Dark mode
            </Toggle>
            {screens.map((s) => (
              <Pressable key={s.id} onPress={() => setScreen(s.id)} role="link">
                <Text>
                  <Typography color="brand">{s.title}</Typography>
                </Text>
              </Pressable>
            ))}
          </Stack>
        )}
      </ScrollView>
    </View>
  );
}
