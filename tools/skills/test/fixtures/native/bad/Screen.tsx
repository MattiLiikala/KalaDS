import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { tokens } from '@kalads/tokens/native';
import { Box, Button } from '@kalads/react-native-components';

export function Screen() {
  return (
    <View style={styles.page}>
      <Box bg="inverse">
        <Button variant="primary">Save</Button>
      </Box>
      <TouchableOpacity>
        <Text>Raw</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 12, backgroundColor: '#fff', borderColor: tokens.semantic.border.default },
});
