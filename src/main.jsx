import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import './darkMode.css';

// Apply the saved theme before React renders anything, so the page never
// flashes light-then-dark (or vice versa) on load. See ThemeContext.jsx,
// which keeps this in sync afterwards whenever the user toggles it.
if (localStorage.getItem('modimal_theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);