import { StrictMode } from 'react';
import { initMusic } from './music';
document.addEventListener('click', initMusic, { once: true });
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from './components/Routes.js';
import { CharacterProvider } from './components/characterContext.tsx';
import { AuthProvider } from './components/authContext.tsx';

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CharacterProvider>
        <RouterProvider router={router} />
      </CharacterProvider>
    </AuthProvider>
  </StrictMode>,
);