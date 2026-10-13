import { useState } from 'react';
import { Button, Dialog, Typography } from '@kalads/react-components';

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete
      </Button>
      <Dialog
        open={open}
        heading="Delete file?"
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
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
