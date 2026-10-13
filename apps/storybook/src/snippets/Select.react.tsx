import { Select } from '@kalads/react-components';

export default function Example() {
  return (
    <Select label="Fruit" placeholder="Pick one" onChange={(value) => console.log(value)}>
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
    </Select>
  );
}
