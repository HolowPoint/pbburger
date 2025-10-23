/* global Office */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App';

function mount() {
  const container = document.getElementById('root');
  if (!container) return;
  const root = createRoot(container);
  root.render(<App />);
}

if (window.Office) {
  Office.onReady(() => mount());
} else {
  // For local dev outside Outlook
  mount();
}


