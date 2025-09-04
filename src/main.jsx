// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './assets/styles/index.css';
import { QuizProvider } from './contexts/QuizContext.jsx'; // 1. Import the provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QuizProvider> {/* 2. Wrap the App component */}
      <App />
    </QuizProvider>
  </React.StrictMode>
);