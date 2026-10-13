import { Autocomplete } from '@kalads/react-components';

export default function Example() {
  return (
    <Autocomplete label="Country" placeholder="Start typing" onChange={(value) => console.log(value)}>
      <option value="fi">Finland</option>
      <option value="fr">France</option>
      <option value="de">Germany</option>
    </Autocomplete>
  );
}
