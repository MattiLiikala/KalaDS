import { Button, Notification } from '@kalads/react-components';

export default function Example() {
  return (
    <Notification variant="success" heading="Saved" dismissible actions={<Button size="sm" variant="ghost">Undo</Button>}>
      Your changes are saved.
    </Notification>
  );
}
