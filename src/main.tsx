import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@unocss/reset/normalize.css';
import 'uno.css';
import './styles.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
