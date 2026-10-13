import { Divider, Stack, Typography } from '@kalads/react-native-components';

export default function Example() {
  return (
    <Stack gap="none">
      <Typography>Sign in with email</Typography>
      <Divider>or</Divider>
      <Typography>Continue with a passkey</Typography>
    </Stack>
  );
}
