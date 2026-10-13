import { IconButton } from '@kalads/react-components';
import { CloseIcon } from '@kalads/icons/react';

declare function close(): void;

export default function Example() {
  return (
    <IconButton label="Close dialog" onClick={() => close()}>
      <CloseIcon />
    </IconButton>
  );
}
