import { Button, Card, Typography } from '@kalads/react-native-components';

export default function Example() {
  return (
    <Card
      elevation={2}
      header={<Typography variant="h5">Monthly report</Typography>}
      footer={<Button size="sm">Open</Button>}
    >
      <Typography>Sales grew 12% compared to last month.</Typography>
    </Card>
  );
}
