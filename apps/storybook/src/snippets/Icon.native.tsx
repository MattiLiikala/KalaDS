import { Icon, Stack } from '@kalads/react-native-components';
import { SearchIcon } from '@kalads/icons/native';

export default function Example() {
  return (
    <Stack direction="row" gap="sm" align="center">
      <Icon name="warning" color="warning" label="Warning" />
      <SearchIcon />
    </Stack>
  );
}
