import { useState } from 'react';
import { Button, Dialog, Typography } from '@kalads/react-native-components';

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onPress={() => setOpen(true)}>
        Delete
      </Button>
      <Dialog
        open={open}
        heading="Delete file?"
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="ghost" onPress={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onPress={() => setOpen(false)}>
              Delete
            </Button>
          </>
        }
      >
        <Typography>This can't be undone.</Typography>
      </Dialog>
    </>
  );
}
