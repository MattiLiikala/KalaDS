import { Button, Stack } from '@kalads/react-native-components';

export default function Example() {
  return (
    <Stack direction="row" gap="sm" justify="end">
      <Button variant="ghost">Cancel</Button>
      <Button>Save</Button>
    </Stack>
  );
}
