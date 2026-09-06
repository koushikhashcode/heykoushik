import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.2,
        overscroll: false,
      }}
    >
      <App />
    </ReactLenis>
  </StrictMode>,
);
