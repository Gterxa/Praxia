import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';

// Laboratorio de referencia: acá corren los componentes ORIGINALES con sus
// librerías reales y sin la CSP del sitio. No es parte de la web de Praxia.
export default defineConfig({
  plugins: [react(), tailwind()],
  server: { port: 5174, strictPort: true },
});
