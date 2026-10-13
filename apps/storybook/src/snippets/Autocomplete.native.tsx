import { Autocomplete, Option } from '@kalads/react-native-components';

export default function Example() {
  return (
    <Autocomplete label="Country" placeholder="Start typing" onChange={(value) => console.log(value)}>
      <Option value="fi">Finland</Option>
      <Option value="fr">France</Option>
      <Option value="de">Germany</Option>
    </Autocomplete>
  );
}
