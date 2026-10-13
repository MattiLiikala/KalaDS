import { Icon, Stack } from '@kalads/react-components';
import { SearchIcon } from '@kalads/icons/react';

export default function Example() {
  return (
    <Stack direction="row" gap="sm" align="center">
      <Icon name="warning" color="warning" label="Warning" />
      <SearchIcon />
    </Stack>
  );
}
