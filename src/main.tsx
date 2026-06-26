/** Point d'entrée : monte l'application React dans le DOM. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ACTIVE_THEME, applyTheme } from './theme';
import './index.css';

// Applique le thème choisi au build (VITE_THEME). #root étant vide avant le
// montage, aucun « flash » n'est visible.
applyTheme(ACTIVE_THEME);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Élément racine #root introuvable');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
