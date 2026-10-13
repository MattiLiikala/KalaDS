import { Button, Stack } from '@kalads/react-native-components';
import { PlusIcon } from '@kalads/icons/native';

declare function save(): void;

export default function Example() {
  return (
    <Stack direction="row" gap="sm">
      <Button variant="primary" start={<PlusIcon />} onPress={() => save()}>
        Add item
      </Button>
      <Button variant="ghost">Cancel</Button>
    </Stack>
  );
}
