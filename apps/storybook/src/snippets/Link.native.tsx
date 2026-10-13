import { Link, Typography } from '@kalads/react-native-components';

export default function Example() {
  return (
    <Typography>
      Read the <Link href="/guide">guide</Link> or the{' '}
      <Link href="https://example.com" target="_blank">
        external docs
      </Link>
      .
    </Typography>
  );
}
