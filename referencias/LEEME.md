# Laboratorio de referencia

Acá corren los componentes **originales**, sin modificar, con sus librerías
reales y sin la CSP del sitio. Sirve para comparar contra las versiones nativas
que sí van en la web (`/pruebas/hero` en el sitio Astro).

```bash
cd referencias
npm install
npm run dev      # http://localhost:5174
```

| Ruta | Componente | Librería | Por qué no va tal cual en el sitio |
|---|---|---|---|
| `#praxia` | **Hero de Praxia sobre Glow Horizon** | framer-motion | es la maqueta para decidir la configuración final |
| `#gateway` | Gateway Flow | iframe + Tailwind CDN + GSAP + Iconify | `frame-src 'none'` y `script-src 'self'` |
| `#glow` | Glow Horizon | framer-motion | React |
| `#dither` | Dithering CTA | @paper-design/shaders-react | React |
| `#novatrix` | Novatrix | uvcanvas (ogl) | React, y los colores del paquete son fijos |
| `#xenon` | Xenon | uvcanvas (ogl) | igual que Novatrix |
| `/liquid-rings.html` | Liquid Rings | three.js por CDN + lil-gui | los CDN; three sí se instaló por npm en el sitio |

Esta carpeta se puede borrar entera sin tocar la web.
