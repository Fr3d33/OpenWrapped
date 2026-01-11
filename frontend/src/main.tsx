import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // TS weiß jetzt, dass es eine .tsx-Datei ist

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
