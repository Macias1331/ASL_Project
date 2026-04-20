import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from './components/Routes.js';
import { CharacterProvider } from './components/characterContext.tsx';

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CharacterProvider>
      <RouterProvider router={router} />
    </CharacterProvider>
  </StrictMode>,
);