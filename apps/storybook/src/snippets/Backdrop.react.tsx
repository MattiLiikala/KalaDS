import { useState } from 'react';
import { Backdrop, Button, Typography } from '@kalads/react-components';

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Load</Button>
      <Backdrop open={open} onClose={() => setOpen(false)}>
        <Typography color="inverse">Loading…</Typography>
      </Backdrop>
    </>
  );
}
