/**
 * Verifica que todos los pares de color del sitio cumplan WCAG AA.
 *
 * Los divisores decorativos (--linea) no entran: no comunican estado ni límite
 * de control, así que no tienen umbral. Los bordes de campo sí, y usan
 * --linea-viva, que por eso se aclaró hasta 3:1.
 *
 *   node scripts/verificar-contraste.mjs
 *
 * Si cambias la paleta en src/styles/tokens.css, cambia también los valores
 * de PALETA acá y vuelve a correrlo antes de publicar.
 */

const PALETA = {
  void: '#0A0F1C',
  surface: '#131A2B',
  surface2: '#1C2438',
  linea: '#2A3348',
  lineaViva: '#54668C',
  texto: '#E8ECF4',
  texto2: '#8A96AC',
  texto3: '#7B8BAB',
  brasa: '#FF6B35',
  brasaAlto: '#FF8659',
  cian: '#35E0D4',
  verde: '#3DDC97',
  ambar: '#F5A623',
  wa: '#134D37',
  chatMeta: '#A8B4C8',
  // Rampa "atardecer" (identidad v2, sep 2026).
  noche: '#1A2C88',
  violeta: '#4A2178',
  magenta: '#BD356C',
  coral: '#FA5E45',
  sol: '#FDCD39',
};

// [descripción, texto, fondo, mínimo exigido]
// 4.5 para texto; 3 para elementos no textuales que comunican estado o límite.
const PARES = [
  ['texto sobre void', 'texto', 'void', 4.5],
  ['texto sobre surface', 'texto', 'surface', 4.5],
  ['texto sobre surface-2', 'texto', 'surface2', 4.5],
  ['texto-2 sobre void', 'texto2', 'void', 4.5],
  ['texto-2 sobre surface', 'texto2', 'surface', 4.5],
  ['texto-2 sobre surface-2', 'texto2', 'surface2', 4.5],
  ['mono texto-3 sobre void', 'texto3', 'void', 4.5],
  ['mono texto-3 sobre surface', 'texto3', 'surface', 4.5],
  ['mono texto-3 sobre surface-2', 'texto3', 'surface2', 4.5],
  ['brasa como texto sobre void', 'brasa', 'void', 4.5],
  ['brasa como texto sobre surface', 'brasa', 'surface', 4.5],
  ['botón primario (void sobre brasa)', 'void', 'brasa', 4.5],
  ['botón primario al pasar el mouse', 'void', 'brasaAlto', 4.5],
  ['cian sobre surface', 'cian', 'surface', 4.5],
  ['cian sobre void', 'cian', 'void', 4.5],
  ['verde sobre surface', 'verde', 'surface', 4.5],
  ['ámbar sobre surface', 'ambar', 'surface', 4.5],
  ['botón de WhatsApp (void sobre verde)', 'void', 'verde', 4.5],
  ['chat: texto en burbuja del negocio', 'texto', 'wa', 4.5],
  ['chat: texto en burbuja del cliente', 'texto', 'surface2', 4.5],
  ['chat: hora sobre burbuja del negocio', 'chatMeta', 'wa', 4.5],
  ['chat: hora sobre burbuja del cliente', 'chatMeta', 'surface2', 4.5],
  ['borde de campo sobre surface', 'lineaViva', 'surface', 3],
  ['borde de campo sobre void', 'lineaViva', 'void', 3],
  ['anillo de foco sobre void', 'brasa', 'void', 3],
  ['anillo de foco sobre surface', 'brasa', 'surface', 3],

  // Rampa "atardecer": solo como texto grande (kickers, H1, botones outline
  // sobre glass) — nunca como texto de párrafo. Umbral 3:1 (texto grande).
  ['magenta como texto grande sobre void', 'magenta', 'void', 3],
  ['coral como texto grande sobre void', 'coral', 'void', 3],
  ['sol como texto grande sobre void', 'sol', 'void', 3],
  ['texto sobre superficie de vidrio (aprox. surface)', 'texto', 'surface', 4.5],
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
