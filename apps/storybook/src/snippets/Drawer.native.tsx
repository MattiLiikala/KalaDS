import { useState } from 'react';
import { Button, Drawer, Typography } from '@kalads/react-native-components';

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Filters</Button>
      <Drawer open={open} heading="Filters" onClose={() => setOpen(false)} footer={<Button onPress={() => setOpen(false)}>Apply</Button>}>
        <Typography>Filter options</Typography>
      </Drawer>
    </>
  );
}
