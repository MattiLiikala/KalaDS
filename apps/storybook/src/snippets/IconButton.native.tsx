import { IconButton } from '@kalads/react-native-components';
import { CloseIcon } from '@kalads/icons/native';

declare function close(): void;

export default function Example() {
  return (
    <IconButton label="Close dialog" onPress={() => close()}>
      <CloseIcon />
    </IconButton>
  );
}
