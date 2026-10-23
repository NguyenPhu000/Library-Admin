import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/App';
import './index.css';

async function enableMocking() {
  const isMswEnabled = import.meta.env.VITE_ENABLE_MSW !== 'false';
  if (import.meta.env.DEV && isMswEnabled) {
    const { worker } = await import('./test/mocks/browser');
    return worker.start();
  }
}

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element #root was not found in index.html');
}

void enableMocking().then(() => {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});