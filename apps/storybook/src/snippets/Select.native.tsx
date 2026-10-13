import { Option, Select } from '@kalads/react-native-components';

export default function Example() {
  return (
    <Select label="Fruit" placeholder="Pick one" onChange={(value) => console.log(value)}>
      <Option value="apple">Apple</Option>
      <Option value="banana">Banana</Option>
    </Select>
  );
}
