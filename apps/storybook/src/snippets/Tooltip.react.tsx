import { IconButton, Tooltip } from '@kalads/react-components';
import { CloseIcon } from '@kalads/icons/react';

export default function Example() {
  return (
    <Tooltip content="Close">
      <IconButton label="Close">
        <CloseIcon />
      </IconButton>
    </Tooltip>
  );
}
