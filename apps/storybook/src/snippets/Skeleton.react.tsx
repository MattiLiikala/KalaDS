import { Skeleton, Stack } from '@kalads/react-components';

export default function Example() {
  return (
    <Stack gap="sm" aria-busy="true">
      <Skeleton variant="circle" />
      <Skeleton lines={3} />
    </Stack>
  );
}
