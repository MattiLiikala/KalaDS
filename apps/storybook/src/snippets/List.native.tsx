import { Badge, List, ListItem } from '@kalads/react-native-components';

declare function open(file: string): void;

export default function Example() {
  return (
    <List label="Files">
      <ListItem secondary="Updated today" end={<Badge>New</Badge>}>
        Report.pdf
      </ListItem>
      <ListItem interactive onSelect={() => open('notes')}>
        Notes.txt
      </ListItem>
    </List>
  );
}
