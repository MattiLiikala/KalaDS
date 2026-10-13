import { Grid, GridItem, Paper, Typography } from '@kalads/react-components';

export default function Example() {
  return (
    <Grid columns={3} gap="md">
      <Paper>
        <Typography>One</Typography>
      </Paper>
      <GridItem span={2}>
        <Paper>
          <Typography>Spans two columns</Typography>
        </Paper>
      </GridItem>
    </Grid>
  );
}
