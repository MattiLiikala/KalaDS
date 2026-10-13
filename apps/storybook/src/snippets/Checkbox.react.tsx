import { Checkbox, CheckboxGroup } from '@kalads/react-components';

export default function Example() {
  return (
    <CheckboxGroup label="Notifications" helper="Pick any">
      <Checkbox defaultChecked onChange={(checked) => console.log(checked)}>
        Email
      </Checkbox>
      <Checkbox>Push</Checkbox>
    </CheckboxGroup>
  );
}
