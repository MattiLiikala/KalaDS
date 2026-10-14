import { StyleSheet, View } from 'react-native';
import { tokens } from '@kalads/tokens/native';
import { Box, Button, Typography, useTokens } from '@kalads/react-native-components';

export function Screen() {
  const { s } = useTokens();
  return (
    <View style={[styles.page, { backgroundColor: s.bg.default }]}>
      <Box bg="inverse" padding="lg">
        <Button variant="primary" onInverse onPress={() => {}}>
          Save
        </Button>
      </Box>
      <Typography>Done</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: tokens.semantic.padding.lg },
});
