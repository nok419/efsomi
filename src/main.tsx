// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';  // Amplify CLI の出力例

import App from './App';

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
