import { Input } from '@kalads/react-native-components';

export default function Example() {
  return (
    <Input
      label="Email"
      type="email"
      placeholder="you@example.com"
      helper="We never share it."
      onChange={(value) => console.log(value)}
    />
  );
}
