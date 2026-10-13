import { Radio, RadioGroup } from '@kalads/react-components';

export default function Example() {
  return (
    <RadioGroup label="Delivery" defaultValue="standard" onChange={(value) => console.log(value)}>
      <Radio value="standard">Standard</Radio>
      <Radio value="express">Express</Radio>
    </RadioGroup>
  );
}
