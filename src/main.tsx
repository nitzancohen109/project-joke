import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Hebrew + Latin subsets only, to keep the offline precache small.
import '@fontsource/heebo/hebrew-400.css';
import '@fontsource/heebo/latin-400.css';
import '@fontsource/heebo/hebrew-700.css';
import '@fontsource/heebo/latin-700.css';
import '@fontsource/assistant/hebrew-400.css';
import '@fontsource/assistant/latin-400.css';
import './styles/tokens.css';
import './styles/app.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
