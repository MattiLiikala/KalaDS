import { Button, Menu, MenuItem } from '@kalads/react-native-components';

declare function run(action: string): void;

export default function Example() {
  return (
    <Menu trigger={<Button variant="ghost">Actions</Button>} onSelect={(value) => run(value)}>
      <MenuItem value="edit">Edit</MenuItem>
      <MenuItem value="duplicate">Duplicate</MenuItem>
      <MenuItem value="delete" variant="danger">
        Delete
      </MenuItem>
    </Menu>
  );
}
