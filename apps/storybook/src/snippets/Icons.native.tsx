import { Button, Icon, IconButton, Stack } from '@kalads/react-native-components';
import { CloseIcon, PlusIcon } from '@kalads/icons/native';

declare function add(): void;
declare function close(): void;

export default function Example() {
  return (
    <Stack direction="row" gap="md" align="center">
      <Icon name="search" size="sm" />
      <Button variant="primary" start={<PlusIcon />} onPress={() => add()}>
        Add item
      </Button>
      <IconButton label="Close dialog" onPress={() => close()}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}
