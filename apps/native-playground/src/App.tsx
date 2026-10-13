import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useKalaFonts, Stack, Typography } from '@kalads/react-native-components';
import { tokens } from '@kalads/tokens/native';
import { screens } from './screens';

/** One screen per case; the list mirrors the React playground's cases. `?screen=<id>` opens one on web. */
export function App() {
  const [loaded] = useKalaFonts();
  const initial = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('screen') : null;
  const [screen, setScreen] = useState<string | null>(initial);
  const [open, setOpen] = useState<string | null>(typeof location !== 'undefined' ? new URLSearchParams(location.search).get('open') : null);
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
  if (!loaded) return null;
  const current = screens.find((s) => s.id === screen);
  return (
    <View style={{ flex: 1, backgroundColor: tokens.semantic.bg.default }}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ padding: tokens.semantic.spacing.lg, paddingTop: 64 }}>
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
