import { Button, Icon, IconButton, Stack } from '@kalads/react-components';
import { CloseIcon, PlusIcon } from '@kalads/icons/react';

declare function add(): void;
declare function close(): void;

export default function Example() {
  return (
    <Stack direction="row" gap="md" align="center">
      <Icon name="search" size="sm" />
      <Button variant="primary" start={<PlusIcon />} onClick={() => add()}>
        Add item
      </Button>
      <IconButton label="Close dialog" onClick={() => close()}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}
