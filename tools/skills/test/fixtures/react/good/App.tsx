import { Box, Button, Input, Stack } from '@kalads/react-components';
import { PlusIcon } from '@kalads/icons/react';

export function App() {
  return (
    <Stack gap="md">
      <Input label="Email" type="email" />
      <Box bg="inverse" padding="lg">
        <Button variant="primary" onInverse start={<PlusIcon />}>
          Save
        </Button>
      </Box>
      <Button style={{ marginTop: 'auto' }}>Next</Button>
      <input type="hidden" name="token" value="x" />
    </Stack>
  );
}
