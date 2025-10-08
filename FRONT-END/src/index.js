import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style/global.css';  // ← importe os estilos aqui
import './style/login.css';   // ← importe os estilos aqui

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
