import { Toggle } from '@kalads/react-components';

export default function Example() {
  return (
    <Toggle defaultChecked onChange={(checked) => console.log(checked)}>
      Wi-Fi
    </Toggle>
  );
}
