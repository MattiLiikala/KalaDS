import { IconButton, Tooltip } from '@kalads/react-native-components';
import { CloseIcon } from '@kalads/icons/native';

export default function Example() {
  return (
    <Tooltip content="Close">
      <IconButton label="Close">
        <CloseIcon />
      </IconButton>
    </Tooltip>
  );
}
