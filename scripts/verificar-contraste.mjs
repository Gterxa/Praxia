/**
 * Verifica que todos los pares de color del sitio cumplan WCAG AA.
 *
 *   node scripts/verificar-contraste.mjs
 *
 * Si cambias la paleta en src/styles/global.css, cambia también los valores
 * de PALETA acá y vuelve a correrlo antes de publicar.
 */

const PALETA = {
  tinta: '#1A2332',
  tinta800: '#2E3D52',
  arcilla: '#C4623D',
  arcilla700: '#9A4A2A',
  arcilla800: '#7E3C22',
  arcilla300: '#E39272',
  arcilla50: '#FBF1ED',
  hueso: '#FAF8F5',
  blanco: '#FFFFFF',
  gris600: '#5C6672',
  gris200: '#E2E0DC',
  verde: '#2F6F4E',
  ambar700: '#8A6508',
  crema: '#FDF6E3',
  // Colores del ChatMockup
  chatCliente: '#FFFFFF',
  chatNegocio: '#D8EDDF',
  chatChip: '#3E4551', // hueso al 16 % sobre tinta, el fondo de la etiqueta "Ejemplo"
};

// [descripción, texto, fondo, mínimo exigido]
// 4.5 para cuerpo, 3 para títulos grandes y elementos no textuales.
const PARES = [
  ['texto principal', 'tinta', 'hueso', 4.5],
  ['texto principal en tarjeta', 'tinta', 'blanco', 4.5],
  ['texto secundario', 'gris600', 'hueso', 4.5],
  ['texto secundario en tarjeta', 'gris600', 'blanco', 4.5],
  ['enlaces y antetítulos', 'arcilla700', 'hueso', 4.5],
  ['enlaces sobre tarjeta', 'arcilla700', 'blanco', 4.5],
  ['enlace sobre fondo acento', 'arcilla700', 'arcilla50', 4.5],
  ['botón primario', 'blanco', 'arcilla700', 4.5],
  ['botón primario al pasar el mouse', 'blanco', 'arcilla800', 4.5],
  ['botón de WhatsApp', 'blanco', 'verde', 4.5],
  ['texto sobre fondo tinta', 'hueso', 'tinta', 4.5],
  ['párrafos sobre fondo tinta', 'gris200', 'tinta', 4.5],
  ['antetítulo sobre fondo tinta', 'arcilla300', 'tinta', 4.5],
  ['marcador PENDIENTE', 'ambar700', 'crema', 4.5],
  ['número grande del método', 'arcilla', 'blanco', 3],
  ['anillo de foco', 'arcilla700', 'hueso', 3],
  ['chat: mensaje del cliente', 'tinta', 'chatCliente', 4.5],
  ['chat: mensaje del negocio', 'tinta', 'chatNegocio', 4.5],
  ['chat: hora sobre burbuja clara', 'gris600', 'chatCliente', 4.5],
  ['chat: hora sobre burbuja verde', 'gris600', 'chatNegocio', 4.5],
  ['chat: etiqueta "Ejemplo"', 'gris200', 'chatChip', 4.5],
  ['chat: checks de leído', 'verde', 'chatNegocio', 3],
];

const canal = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const luminancia = (hex) => {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
};

const contraste = (a, b) => {
  const [la, lb] = [luminancia(a), luminancia(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

let fallas = 0;
for (const [nombre, texto, fondo, minimo] of PARES) {
  const r = contraste(PALETA[texto], PALETA[fondo]);
  const ok = r >= minimo;
  if (!ok) fallas++;
  console.log(
    `${ok ? 'OK   ' : 'FALLA'} ${r.toFixed(2).padStart(5)}:1 (mín ${minimo})  ${nombre}`,
  );
}

console.log(fallas === 0 ? '\nTodo cumple WCAG AA.' : `\n${fallas} par(es) por debajo del mínimo.`);
process.exit(fallas === 0 ? 0 : 1);
