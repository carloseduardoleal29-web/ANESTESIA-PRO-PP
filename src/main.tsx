import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker for Push Notifications and PWA Cache Management
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw-push.js')
      .then((reg) => {
        console.log('[AnestesiaPro SW] Service Worker registrado exitosamente:', reg.scope);
      })
      .catch((err) => {
        console.warn('[AnestesiaPro SW] Error al registrar Service Worker:', err);
      });
  });
}
