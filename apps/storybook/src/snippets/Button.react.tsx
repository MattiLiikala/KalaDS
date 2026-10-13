import { Button, Stack } from '@kalads/react-components';
import { PlusIcon } from '@kalads/icons/react';

declare function save(): void;

export default function Example() {
  return (
    <Stack direction="row" gap="sm">
      <Button variant="primary" start={<PlusIcon />} onClick={() => save()}>
        Add item
      </Button>
      <Button variant="ghost">Cancel</Button>
    </Stack>
  );
}
