import { createRoot } from 'react-dom/client';
import '@fontsource/overlock/400.css';
import '@fontsource/overlock/700.css';
import '@fontsource/parkinsans/300.css';
import '@fontsource/parkinsans/400.css';
import '@fontsource/parkinsans/500.css';
import '@fontsource/parkinsans/700.css';
import '@kalads/tokens/css';
import '@kalads/react-components/styles.css';
import '@kalads/web-components';
import '@kalads/icons';
import './playground.css';
import { App } from './App.js';

// Render once the fonts are in, so screenshots never show fallback fonts.
void document.fonts.ready.then(() => createRoot(document.getElementById('root')!).render(<App />));
