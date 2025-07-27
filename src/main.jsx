import React from 'react';
import ReactDOM from 'react-dom/client';
import EmailApp from './EmailApp.jsx';
import './App.css'; // optional, if you're using Tailwind or custom styles


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EmailApp />
  </React.StrictMode>
);