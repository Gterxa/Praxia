# QA móvil del funnel

Regresión del funnel (`/funnel`, `/funnel/aplicar` y sus versiones en `/en`) en
celulares. Recorre todas las etapas en 7 configuraciones (iPhone SE 320 px,
Galaxy S8, iPhone 13 en Chromium y en WebKit/Safari, Pixel 7, iPhone 14 Pro Max
y iPhone 13 en horizontal) y corre 50 casos de QA:

| Grupo | Casos | Qué mide |
|---|---|---|
| Layout | QA-01 a QA-10 | scroll horizontal, desbordes, márgenes, texto cortado, h1 y primera acción en pantalla |
| Toque | QA-11 a QA-17 | objetivos de 24 px (WCAG 2.2 AA) y 44 px (Apple HIG), choques, capas fijas, zona segura de iOS |
| Tipografía | QA-18 a QA-21 | campos de 16 px (sin zoom en iOS), texto de 12 px o más, contraste AA, fuentes |
| Accesibilidad | QA-22 a QA-27 | nombres accesibles, labels, alt, `lang`, `:focus-visible`, viewport sin bloquear zoom |
| Formulario | QA-28 a QA-34 | autocomplete, teclados, error visible, Enter, «Atrás», lista de países |
| Flujo E2E | QA-35 a QA-43 | las 12 preguntas, selección múltiple, compromiso, scroll arriba, confirmación, agenda, salidas A/B/C |
| Video | QA-44 a QA-46 | `playsinline`, ancho, subtítulos del idioma encendidos |
| Técnica | QA-47 a QA-49 | errores de consola, 4xx/5xx, CLS |
| Regresión visual | QA-50 | diferencia por píxeles contra una corrida base |

No toca GHL: `/api/funnel` y `/api/pais` se responden dentro del navegador con
datos de prueba, y todo pedido a terceros (analítica) se corta.

## Correr

Con el sitio en `astro dev` (puerto 4329 en el ejemplo):

```bash
pip install playwright pillow
playwright install chromium webkit
python qa/movil/qa_movil.py --url "http://[::1]:4329" --corrida antes
# ...cambios...
python qa/movil/qa_movil.py --url "http://[::1]:4329" --corrida despues --base antes
```

`--solo iphone-se iphone-13-safari` corre solo esos dispositivos. La salida
queda en `qa/movil/salida/<corrida>/` (fuera de git): `reporte.md`,
`resultados.json`, una captura por etapa y dispositivo, y en `diferencias/` los
píxeles que cambiaron contra la base, en magenta.

## Artefactos conocidos de la herramienta (no son del sitio)

- Después de una captura de página completa, Playwright deja `(hover: hover)` en
  verdadero: por eso `medir()` lleva el puntero a una esquina antes de cada foto.
- En las capturas de página completa, la barra fija de progreso de lectura
  aparece como una línea a media página.
- En `astro dev` hay que ocultar la toolbar de Astro y la «Vista interna»; la
  suite lo hace sola.
