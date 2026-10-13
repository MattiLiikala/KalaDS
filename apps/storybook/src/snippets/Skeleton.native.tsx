import { Skeleton, Stack } from '@kalads/react-native-components';

export default function Example() {
  return (
    <Stack gap="sm" aria-busy>
      <Skeleton variant="circle" />
      <Skeleton lines={3} />
    </Stack>
  );
}
