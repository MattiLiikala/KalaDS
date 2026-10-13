import { Chip, Stack } from '@kalads/react-native-components';

declare function remove(tag: string): void;

export default function Example() {
  return (
    <Stack direction="row" gap="sm" wrap>
      <Chip selectable defaultSelected>
        All
      </Chip>
      <Chip selectable>Open</Chip>
      <Chip removable onRemove={() => remove('design')}>
        Design
      </Chip>
    </Stack>
  );
}
