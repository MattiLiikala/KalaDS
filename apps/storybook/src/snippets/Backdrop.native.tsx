import { useState } from 'react';
import { Backdrop, Button, Typography } from '@kalads/react-native-components';

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Load</Button>
      <Backdrop open={open} onClose={() => setOpen(false)}>
        <Typography>Loading…</Typography>
      </Backdrop>
    </>
  );
}
