import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { SpeakingProvider } from './locale';
import { productName } from './product';
import { router } from './router';

document.title = productName;

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <SpeakingProvider>
      <RouterProvider router={router} />
    </SpeakingProvider>
  </StrictMode>,
);
