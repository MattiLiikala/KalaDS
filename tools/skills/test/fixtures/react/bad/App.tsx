import { Box, Button } from '@kalads/react-components';

export function App() {
  return (
    <div style={{ padding: 12, color: '#333', borderColor: 'var(--kds-color-primary-500)' }}>
      <Box bg="inverse">
        <Button variant="primary">Save</Button>
      </Box>
      <Button style={{ backgroundColor: 'red' }}>Delete</Button>
      <button onClick={() => {}}>Raw</button>
      <input type="text" />
    </div>
  );
}
