// Recolector de métricas de layout para qa_movil.py. Corre dentro de la página
// y devuelve un objeto plano: qa_movil.py decide qué pasa y qué falla.
// Solo mide lo que se ve (visible, con tamaño, dentro del documento).
() => {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const sel = (el) => {
    if (el.id) return `#${el.id}`;
    const c = (typeof el.className === 'string' ? el.className : el.className?.baseVal || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.');
    return `${el.tagName.toLowerCase()}${c ? '.' + c : ''}`;
  };
  const texto = (el) => (el.innerText || el.getAttribute('aria-label') || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 40);

  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
      if (n.getAttribute('aria-hidden') === 'true' && n !== el) return false;
    }
    return true;
  };
  // ¿Lo recorta un ancestro con overflow distinto de visible antes del borde?
  const recortadoPorAncestro = (el, r) => {
    for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (/(hidden|clip|auto|scroll)/.test(s.overflowX + s.overflow)) {
        const a = n.getBoundingClientRect();
        if (a.right <= vw + 1 && a.left >= -1) return true;
      }
    }
    return false;
  };

  const todos = Array.from(document.body.querySelectorAll('*')).filter((el) => !['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'BR'].includes(el.tagName));
  const vis = todos.filter(visible);

  // 1. Desborde horizontal real.
  const desborde = document.documentElement.scrollWidth - vw;
  const fuera = [];
  for (const el of vis) {
    const r = el.getBoundingClientRect();
    if ((r.right > vw + 1 || r.left < -1) && !recortadoPorAncestro(el, r)) {
      const s = getComputedStyle(el);
      if (s.position === 'fixed' && (r.width >= vw - 2)) continue;
      fuera.push({ el: sel(el), left: Math.round(r.left), right: Math.round(r.right), txt: texto(el) });
    }
  }

  // 2. Objetivos táctiles.
  const esInterno = (el) => {
    const s = getComputedStyle(el);
    const p = el.parentElement;
    return el.tagName === 'A' && s.display === 'inline' && p && /^(P|LI|SPAN|SMALL|B|STRONG|EM)$/.test(p.tagName) && (p.innerText || '').trim().length > (el.innerText || '').trim().length + 3;
  };
  const tactiles = vis.filter((el) => el.matches('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=tab]') && !el.closest('.af-trampa') && !el.matches('.iti__search-input'));
  const objetivos = tactiles.map((el) => {
    const r = el.getBoundingClientRect();
    // Un checkbox dentro de un <label> se toca por el label entero.
    let w = r.width, h = r.height;
    const lab = el.matches('input[type=checkbox],input[type=radio]') ? el.closest('label') : null;
    if (lab) { const lr = lab.getBoundingClientRect(); w = lr.width; h = lr.height; }
    return { el: sel(el), w: Math.round(w), h: Math.round(h), interno: esInterno(el), txt: texto(el), deshabilitado: !!el.disabled, r: { l: r.left, t: r.top + scrollY, ri: r.right, b: r.bottom + scrollY } };
  });
  const chicos = objetivos.filter((o) => !o.interno && Math.min(o.w, o.h) < 44);
  const muyChicos = objetivos.filter((o) => !o.interno && Math.min(o.w, o.h) < 24);

  // Objetivos que se pisan (no anidados).
  const pisados = [];
  for (let i = 0; i < tactiles.length; i++) {
    for (let j = i + 1; j < tactiles.length; j++) {
      const a = tactiles[i], b = tactiles[j];
      if (a.contains(b) || b.contains(a)) continue;
      // La bandera del teléfono va dentro del campo a propósito (intl-tel-input).
      if (a.matches('.iti__selected-country') || b.matches('.iti__selected-country')) continue;
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      const ix = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
      const iy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      if (ix > 2 && iy > 2) {
        // Dentro de una capa fija (barra de abajo) no es un choque: el contenido pasa por debajo al hacer scroll.
        const enFijo = (el) => { for (let n = el; n; n = n.parentElement) if (getComputedStyle(n).position === 'fixed') return true; return false; };
        pisados.push({ a: sel(a), b: sel(b), ix: Math.round(ix), iy: Math.round(iy), fijo: enFijo(a) || enFijo(b) });
      }
    }
  }

  // 3. Tipografía.
  const camposChicos = vis
    .filter((el) => el.matches('input:not([type=checkbox]):not([type=radio]):not([type=hidden]), textarea, select'))
    .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16)
    .map((el) => ({ el: sel(el), fs: getComputedStyle(el).fontSize }));
  const textoChico = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const vistos = new Set();
  while (walker.nextNode()) {
    const n = walker.currentNode;
    if (!n.textContent.trim()) continue;
    const el = n.parentElement;
    if (!el || vistos.has(el) || !visible(el)) continue;
    vistos.add(el);
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 12) textoChico.push({ el: sel(el), fs, txt: el.innerText.trim().slice(0, 30) });
  }

  // 4. Texto cortado (ellipsis o recorte).
  const cortados = vis
    .filter((el) => el.children.length === 0 && (el.innerText || '').trim().length > 0)
    .filter((el) => {
      const s = getComputedStyle(el);
      return (el.scrollWidth > el.clientWidth + 1 && /(hidden|clip)/.test(s.overflowX)) || (s.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1);
    })
    .map((el) => ({ el: sel(el), txt: texto(el) }));

  // 5. Márgenes laterales del texto.
  const pegados = vis
    .filter((el) => el.matches('p, h1, h2, h3, h4, li, label, blockquote, figcaption') && (el.innerText || '').trim())
    .filter((el) => getComputedStyle(el).position !== 'fixed')
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.left < 12 || r.right > vw - 12;
    })
    .map((el) => { const r = el.getBoundingClientRect(); return { el: sel(el), l: Math.round(r.left), r: Math.round(vw - r.right), txt: texto(el) }; });

  // 6. Contraste (solo sobre fondo sólido conocido).
  const rgba = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const mezcla = (arriba, abajo) => ({ r: arriba.r * arriba.a + abajo.r * (1 - arriba.a), g: arriba.g * arriba.a + abajo.g * (1 - arriba.a), b: arriba.b * arriba.a + abajo.b * (1 - arriba.a), a: 1 });
  const fondoDe = (el) => {
    const capas = [];
    for (let n = el; n; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.backgroundImage !== 'none' || n.tagName === 'VIDEO' || n.tagName === 'IMG' || n.tagName === 'CANVAS') return null;
      const c = rgba(s.backgroundColor);
      if (c && c.a > 0) { capas.push(c); if (c.a >= 0.99) break; }
    }
    if (!capas.length) return null;
    let base = capas.pop();
    if (base.a < 0.99) return null;
    while (capas.length) base = mezcla(capas.pop(), base);
    return base;
  };
  const bajoContraste = [];
  for (const el of vistos) {
    if (!visible(el)) continue;
    const s = getComputedStyle(el);
    const c = rgba(s.color); if (!c || c.a < 0.1) continue;
    // Si hay un hermano/fondo posicionado detrás (video, imagen), no es medible.
    const fondo = fondoDe(el); if (!fondo) continue;
    const col = c.a < 0.99 ? mezcla(c, fondo) : c;
    const L1 = lum(col), L2 = lum(fondo);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const fs = parseFloat(s.fontSize), grande = fs >= 24 || (fs >= 18.66 && Number(s.fontWeight) >= 700);
    if (ratio < (grande ? 3 : 4.5)) bajoContraste.push({ el: sel(el), ratio: Math.round(ratio * 100) / 100, fs, txt: (el.innerText || '').trim().slice(0, 30) });
  }

  // 7. Imágenes y video.
  const imgs = Array.from(document.images);
  const imgSinAlt = imgs.filter((i) => !i.hasAttribute('alt')).map((i) => sel(i));
  const imgRotas = imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('loading') !== 'lazy').map((i) => i.currentSrc || i.src);
  const videos = Array.from(document.querySelectorAll('video')).filter(visible).map((v) => ({ el: sel(v), playsinline: v.playsInline || v.hasAttribute('playsinline'), ancho: Math.round(v.getBoundingClientRect().width), pistas: Array.from(v.textTracks).map((t) => `${t.language}:${t.mode}`) }));

  // 8. Accesibilidad básica.
  const sinNombre = tactiles.filter((el) => !(el.innerText || '').trim() && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.getAttribute('title') && !el.querySelector('img[alt]:not([alt=""])') && !el.matches('input, textarea, select')).map(sel);
  const sinLabel = vis
    .filter((el) => el.matches('input:not([type=hidden]):not([type=checkbox]), textarea, select') && !el.closest('.af-trampa') && !el.matches('.iti__search-input'))
    .filter((el) => !(el.id && document.querySelector(`label[for="${el.id}"]`)) && !el.closest('label') && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby'))
    .map(sel);
  const campos = Array.from(document.querySelectorAll('input:not([type=hidden]):not(.af-trampa):not(.iti__search-input), textarea')).filter(visible).map((el) => ({ el: sel(el), type: el.type, autocomplete: el.getAttribute('autocomplete') || '', inputmode: el.getAttribute('inputmode') || '' }));

  // 9. Encabezado, CTA y capas fijas.
  const h1s = Array.from(document.querySelectorAll('h1')).filter(visible);
  const h1 = h1s[0];
  let h1Info = null;
  if (h1) {
    const r = h1.getBoundingClientRect(), s = getComputedStyle(h1);
    const lh = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.2;
    h1Info = { top: Math.round(r.top + scrollY), bottom: Math.round(r.bottom + scrollY), lineas: Math.round(r.height / lh), fs: parseFloat(s.fontSize), txt: texto(h1) };
  }
  // La primera acción de una pantalla: un botón, una opción o (en contacto) el primer campo.
  const ctas = Array.from(document.querySelectorAll('.boton-primario, .af-cta, .af-opcion, .af-campos .af-input')).filter(visible).map((el) => { const r = el.getBoundingClientRect(); return { el: sel(el), top: Math.round(r.top + scrollY), bottom: Math.round(r.bottom + scrollY), txt: texto(el) }; });
  const fijos = vis.filter((el) => /^(fixed|sticky)$/.test(getComputedStyle(el).position)).map((el) => { const r = el.getBoundingClientRect(); return { el: sel(el), pos: getComputedStyle(el).position, top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), w: Math.round(r.width) }; });

  // Hojas de estilo: ¿alguna regla usa safe-area?
  let safeArea = false;
  for (const ss of Array.from(document.styleSheets)) {
    try { for (const ru of Array.from(ss.cssRules)) { if (ru.cssText.includes('safe-area-inset')) { safeArea = true; break; } } } catch { /* otra procedencia */ }
    if (safeArea) break;
  }

  const meta = document.querySelector('meta[name=viewport]')?.getAttribute('content') || '';
  return {
    vw, vh, alto: document.documentElement.scrollHeight, desborde, fuera: fuera.slice(0, 15),
    objetivos: objetivos.length, chicos: chicos.slice(0, 25), muyChicos: muyChicos.slice(0, 15), pisados: pisados.slice(0, 10),
    camposChicos, textoChico: textoChico.slice(0, 15), cortados: cortados.slice(0, 10), pegados: pegados.slice(0, 15),
    bajoContraste: bajoContraste.slice(0, 15), imgSinAlt, imgRotas, videos, sinNombre, sinLabel, campos,
    h1: h1Info, h1Total: h1s.length, ctas: ctas.slice(0, 12), fijos, safeArea,
    meta, lang: document.documentElement.lang, fuentes: document.fonts.status,
    focoVisible: Array.from(document.styleSheets).some((ss) => { try { return Array.from(ss.cssRules).some((r) => r.cssText.includes(':focus-visible')); } catch { return false; } }),
  };
}
