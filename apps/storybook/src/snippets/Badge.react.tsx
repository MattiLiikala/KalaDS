import { Badge, Stack } from '@kalads/react-components';

export default function Example() {
  return (
    <Stack direction="row" gap="sm">
      <Badge>Draft</Badge>
      <Badge variant="success">Published</Badge>
      <Badge variant="danger">Overdue</Badge>
    </Stack>
  );
}
