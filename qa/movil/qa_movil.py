"""
QA móvil del funnel (/funnel y /funnel/aplicar, en español e inglés).

Recorre todas las etapas en varios teléfonos, mide el layout con recolector.js,
corre 50 casos de QA y guarda una captura por etapa y dispositivo. Con
--base compara contra una corrida anterior (regresión visual por píxeles).

  python qa/movil/qa_movil.py --url http://[::1]:4329 --corrida antes
  python qa/movil/qa_movil.py --url http://[::1]:4329 --corrida despues --base antes

No toca GHL: /api/funnel y /api/pais se responden en el navegador con datos
de prueba. Salida en qa/movil/salida/<corrida>/ (fuera de git).

Requiere: pip install playwright pillow && playwright install chromium webkit
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from pathlib import Path

from playwright.sync_api import Page, sync_playwright

AQUI = Path(__file__).parent
RECOLECTOR = (AQUI / 'recolector.js').read_text(encoding='utf-8')

# Teléfonos: los anchos que de verdad llegan (320 el más chico vivo, 430 el más
# grande) y un horizontal. iPhone 13 se corre también en WebKit (Safari de iOS).
DISPOSITIVOS = [
    ('iphone-se', 'iPhone SE', 'chromium'),
    ('galaxy-s8', 'Galaxy S8', 'chromium'),
    ('iphone-13', 'iPhone 13', 'chromium'),
    ('iphone-13-safari', 'iPhone 13', 'webkit'),
    ('pixel-7', 'Pixel 7', 'chromium'),
    ('iphone-14-pro-max', 'iPhone 14 Pro Max', 'chromium'),
    ('iphone-13-horizontal', 'iPhone 13 landscape', 'chromium'),
]

EN_HORARIO = datetime.fromisoformat('2026-11-03T11:00:00-05:00')
FUERA_HORARIO = datetime.fromisoformat('2026-11-03T21:30:00-05:00')


def turnos_de_prueba() -> dict:
    dias = []
    base = datetime.fromisoformat('2026-11-04T00:00:00-05:00')
    for d in range(6):
        dia = base + timedelta(days=d)
        turnos = [(dia + timedelta(hours=h)).isoformat() for h in (9, 10, 11, 12, 15, 16, 17)]
        dias.append({'fecha': dia.strftime('%Y-%m-%d'), 'turnos': turnos})
    return {'dias': dias}


@dataclass
class Estado:
    """Una etapa del funnel vista en un dispositivo."""
    etapa: str
    dispositivo: str
    m: dict
    extra: dict = field(default_factory=dict)


@dataclass
class Resultado:
    caso: str
    titulo: str
    grupo: str
    ok: bool
    detalle: list[str]


class Corrida:
    def __init__(self, url: str, salida: Path):
        self.url = url.rstrip('/')
        self.salida = salida
        self.estados: list[Estado] = []
        self.consola: dict[str, list[str]] = {}
        self.red: dict[str, list[str]] = {}
        self.flujos: dict[str, dict] = {}  # comprobaciones de interacción por dispositivo
        self.cls: dict[str, float] = {}

    # ---------- infraestructura ----------
    def preparar(self, page: Page, clave: str, pais: str = 'PE'):
        self.consola.setdefault(clave, [])
        self.red.setdefault(clave, [])

        def en_consola(msg):
            if msg.type == 'error' and 'favicon' not in msg.text:
                self.consola[clave].append(msg.text[:160])

        page.on('console', en_consola)
        page.on('pageerror', lambda e: self.consola[clave].append(f'pageerror: {str(e)[:160]} @ {page.url[len(self.url):]} :: {(e.stack or "")[:240]}'))

        def en_respuesta(r):
            if r.url.startswith(self.url) and r.status >= 400:
                self.red[clave].append(f'{r.status} {r.url[len(self.url):][:80]}')

        page.on('response', en_respuesta)
        agenda = turnos_de_prueba()

        def api_funnel(route):
            if route.request.method == 'GET':
                route.fulfill(status=200, content_type='application/json', body=json.dumps(agenda))
            else:
                route.fulfill(status=200, content_type='application/json', body='{"ok":true}')

        page.route('**/api/funnel', api_funnel)
        page.route('**/api/pais', lambda r: r.fulfill(status=200, content_type='application/json', body=json.dumps({'pais': pais})))
        # Nada sale a terceros (analítica, píxeles): la QA no ensucia métricas.
        page.route(re.compile(r'^https?://(?!\[::1\]|localhost|127\.0\.0\.1).*'), lambda r: r.abort())
        # Lo que solo existe en `astro dev` (toolbar y «Vista interna») no se mide ni se fotografía.
        # /funnel/aplicar rebota a la landing si no se vio el video (src/lib/video-visto.ts):
        # para medir la aplicación se entra con el video ya visto. La landing se mide bloqueada.
        page.add_init_script("""if (location.pathname.includes('/aplicar')) {
          try { localStorage.setItem('praxia-funnel-video', JSON.stringify({ src: '/videos/bienvenida.mp4', segundos: 93, listo: true })); } catch (e) {}
        }""")
        page.add_init_script("""document.addEventListener('DOMContentLoaded', () => {
          const s = document.createElement('style');
          s.textContent = 'astro-dev-toolbar, .af-interno { display: none !important; }';
          document.head.appendChild(s);
        });""")

    def medir(self, page: Page, etapa: str, disp: str, captura=True, completa=True, **extra):
        # Tras una captura de página completa Playwright deja `hover: hover` en
        # verdadero y pinta el hover donde quedó el puntero: se lo lleva a una esquina.
        try:
            page.mouse.move(1, 1)
        except Exception:  # noqa: BLE001  (WebKit móvil no tiene puntero)
            pass
        page.wait_for_timeout(350)
        m = page.evaluate(RECOLECTOR)
        self.estados.append(Estado(etapa, disp, m, extra))
        if captura:
            ruta = self.salida / 'capturas' / disp / f'{etapa}.png'
            ruta.parent.mkdir(parents=True, exist_ok=True)
            try:
                page.screenshot(path=str(ruta), full_page=completa, animations='disabled')
            except Exception as e:  # noqa: BLE001
                self.consola.setdefault(disp, []).append(f'captura {etapa}: {e}'[:160])
        return m

    # ---------- landing ----------
    def landing(self, page: Page, disp: str, idioma: str):
        ruta = '/funnel' if idioma == 'es' else '/en/funnel'
        page.goto(self.url + ruta, wait_until='load'); page.wait_for_timeout(1200)
        page.evaluate("""() => { window.__cls = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({type: 'layout-shift', buffered: true}); }""")
        page.wait_for_timeout(800)
        top = self.medir(page, f'landing-{idioma}-arriba', disp, completa=False)
        # Recorre la página para disparar los reveals y medir abajo.
        alto = page.evaluate('document.documentElement.scrollHeight')
        y = 0
        while y < alto:
            y += 500
            page.evaluate('window.scrollBy(0, 500)')  # WebKit móvil no tiene rueda
            page.wait_for_timeout(120)
            alto = page.evaluate('document.documentElement.scrollHeight')
        page.wait_for_timeout(600)
        self.cls[f'{disp}:{idioma}'] = page.evaluate('window.__cls || 0')
        page.evaluate('window.scrollTo(0, 0)')
        page.wait_for_timeout(500)
        self.medir(page, f'landing-{idioma}-completa', disp)
        return top

    # ---------- aplicación ----------
    def contacto(self, page: Page, idioma: str):
        # El teléfono valida con intl-tel-input: esperar a que cargue.
        page.wait_for_selector('.iti__selected-country', state='attached')
        page.wait_for_timeout(300)
        page.fill('#af-nombre', 'Lucía Prueba')
        page.click('#af-tel')
        page.keyboard.type('51997872779' if idioma == 'es' else '13055550123', delay=10)
        page.fill('#af-correo', 'qa@ejemplo.com')

    def responder(self, page: Page, disp: str, rama: str, idioma: str, medir_preguntas: bool):
        """Llena el formulario hasta el resultado. rama: A (aprueba) o C (no)."""
        flujo = self.flujos.setdefault(f'{disp}:{rama}:{idioma}', {})
        while True:
            paso = int(page.get_attribute('.af-progreso', 'aria-valuenow') or 0)
            total = int(page.get_attribute('.af-progreso', 'aria-valuemax') or 14)
            if paso >= total:
                break
            titulo = page.inner_text('.af-cuerpo h1').strip()
            if medir_preguntas:
                # Que cada pantalla nueva arranque arriba. Se mide ANTES de la captura:
                # la captura de página completa cambia el viewport y mueve el scroll.
                page.wait_for_timeout(350)
                flujo.setdefault('scroll_arriba', []).append(page.evaluate('Math.round(window.scrollY)'))
                self.medir(page, f'aplicar-{idioma}-p{paso:02d}', disp)
            checks = page.locator('.af-opcion-check')
            if checks.count():
                cta = page.locator('.af-cuerpo .af-cta')
                flujo.setdefault('varias_deshabilitado', []).append(cta.is_disabled())
                checks.first.click()
                flujo.setdefault('aria_pressed', []).append(checks.first.get_attribute('aria-pressed'))
                cta.click()
            else:
                ops = page.locator('.af-opciones .af-opcion')
                n = ops.count()
                idx = 0
                if paso == total - 1:  # inversión (aria-valuenow = paso + 1)
                    idx = 3 if rama == 'A' else 0
                ops.nth(min(idx, n - 1)).click()
            page.wait_for_timeout(150)
            nuevo = int(page.get_attribute('.af-progreso', 'aria-valuenow') or 0)
            if nuevo == paso:
                flujo.setdefault('atascado', []).append(titulo[:40])
                break
        # Última pantalla: frase + compromiso.
        if medir_preguntas:
            self.medir(page, f'aplicar-{idioma}-frase', disp)
        enviar = page.locator('.af-cuerpo .af-cta')
        flujo['enviar_deshabilitado_sin_compromiso'] = enviar.is_disabled()
        page.fill('#af-frase', 'Queremos responder WhatsApp más rápido.')
        page.click('.af-compromiso')
        enviar.click()
        page.wait_for_selector('.af-kicker', timeout=5000)

    def aplicacion(self, browser, nombre_disp: str, disp: str, pw, motor: str):
        dev = dict(pw.devices[nombre_disp])
        if motor == 'chromium':
            dev.pop('default_browser_type', None)
        idiomas = ['es', 'en'] if disp in ('iphone-se', 'iphone-13', 'iphone-13-safari') else ['es']
        for idioma in idiomas:
            base = self.url + ('/funnel/aplicar' if idioma == 'es' else '/en/funnel/aplicar')
            # Rama A en horario → llamada.
            ctx = browser.new_context(**dev, locale='es-PE' if idioma == 'es' else 'en-US', timezone_id='America/Lima')
            page = ctx.new_page()
            page.clock.set_fixed_time(EN_HORARIO)
            self.preparar(page, disp, pais='US' if idioma == 'es' else 'PE')
            page.goto(base, wait_until='load'); page.wait_for_timeout(1200)
            page.wait_for_selector('#af-nombre')
            self.medir(page, f'aplicar-{idioma}-contacto-sugerencia', disp, completa=False)
            fl = self.flujos.setdefault(f'{disp}:contacto:{idioma}', {})
            # Error visible al enviar vacío.
            page.click('.af-cuerpo .af-cta')
            err = page.locator('.af-error')
            fl['error_visible'] = err.count() > 0 and err.first.is_visible()
            if fl['error_visible']:
                r = err.first.bounding_box()
                fl['error_en_pantalla'] = r is not None and r['y'] + r['height'] <= page.viewport_size['height'] and r['y'] >= 0
            self.medir(page, f'aplicar-{idioma}-contacto-error', disp, completa=False)
            # Lista de países del teléfono.
            boton_pais = page.locator('.iti__selected-country')
            if boton_pais.count():
                boton_pais.first.click()
                page.wait_for_timeout(300)
                lista = page.locator('.iti__dropdown-content')
                if lista.count() and lista.first.is_visible():
                    bb = lista.first.bounding_box()
                    vw = page.viewport_size['width']
                    fl['lista_paises'] = {'left': round(bb['x']), 'right': round(bb['x'] + bb['width']), 'vw': vw}
                    self.medir(page, f'aplicar-{idioma}-contacto-paises', disp, completa=False)
                page.keyboard.press('Escape')
                page.wait_for_timeout(200)
            self.contacto(page, idioma)
            # Enter envía el formulario.
            page.press('#af-correo', 'Enter')
            page.wait_for_selector('.af-opciones', timeout=5000)
            fl['enter_envia'] = True
            # Atrás vuelve y conserva el nombre.
            page.click('.af-atras')
            page.wait_for_selector('#af-nombre')
            fl['atras_conserva'] = page.input_value('#af-nombre') == 'Lucía Prueba'
            page.press('#af-correo', 'Enter')
            page.wait_for_selector('.af-opciones')
            self.responder(page, disp, 'A', idioma, medir_preguntas=True)
            self.medir(page, f'aplicar-{idioma}-resultado-A', disp)
            page.click('.af-panel-botones .boton-primario')
            page.wait_for_selector('.af-cuerpo video, .af-cuerpo .af-video', timeout=5000)
            page.wait_for_timeout(800)
            self.medir(page, f'aplicar-{idioma}-llamada', disp)
            ctx.close()

            # Rama A fuera de horario → agenda → confirmado.
            ctx = browser.new_context(**dev, locale='es-PE' if idioma == 'es' else 'en-US', timezone_id='America/Lima')
            page = ctx.new_page()
            page.clock.set_fixed_time(FUERA_HORARIO)
            self.preparar(page, disp)
            page.goto(base, wait_until='load'); page.wait_for_timeout(1200)
            page.wait_for_selector('#af-nombre')
            self.contacto(page, idioma)
            page.click('.af-cuerpo .af-cta')
            page.wait_for_selector('.af-opciones')
            self.responder(page, disp, 'A', idioma, medir_preguntas=False)
            self.medir(page, f'aplicar-{idioma}-resultado-fuera', disp)
            page.click('.af-panel .af-cta')
            page.wait_for_selector('.af-hora', timeout=5000)
            self.medir(page, f'aplicar-{idioma}-agenda', disp)
            fa = self.flujos.setdefault(f'{disp}:agenda:{idioma}', {})
            fa['confirmar_deshabilitado'] = page.locator('.af-agenda-tarjeta .af-cta').is_disabled()
            page.locator('.af-dia').nth(1).click()
            page.locator('.af-hora').nth(2).click()
            self.medir(page, f'aplicar-{idioma}-agenda-elegido', disp)
            page.click('.af-agenda-tarjeta .af-cta')
            page.wait_for_selector('.af-kicker', timeout=5000)
            page.wait_for_timeout(800)
            self.medir(page, f'aplicar-{idioma}-confirmado', disp)
            ctx.close()

            # Rama C.
            ctx = browser.new_context(**dev, locale='es-PE' if idioma == 'es' else 'en-US', timezone_id='America/Lima')
            page = ctx.new_page()
            page.clock.set_fixed_time(EN_HORARIO)
            self.preparar(page, disp)
            page.goto(base, wait_until='load'); page.wait_for_timeout(1200)
            page.wait_for_selector('#af-nombre')
            self.contacto(page, idioma)
            page.click('.af-cuerpo .af-cta')
            page.wait_for_selector('.af-opciones')
            self.responder(page, disp, 'C', idioma, medir_preguntas=False)
            page.wait_for_timeout(800)
            self.medir(page, f'aplicar-{idioma}-resultado-C', disp)
            ig = page.locator('a[href*="instagram.com"]')
            self.flujos.setdefault(f'{disp}:C:{idioma}', {})['instagram'] = {
                'target': ig.first.get_attribute('target') if ig.count() else None,
                'rel': ig.first.get_attribute('rel') if ig.count() else None,
            }
            ctx.close()

        # Confirmación de «decide otra persona» siendo dueño.
        ctx = browser.new_context(**dev, locale='es-PE', timezone_id='America/Lima')
        page = ctx.new_page()
        self.preparar(page, disp)
        page.goto(self.url + '/funnel/aplicar', wait_until='load'); page.wait_for_timeout(1200)
        page.wait_for_selector('#af-nombre')
        self.contacto(page, 'es')
        page.click('.af-cuerpo .af-cta')
        page.wait_for_selector('.af-opciones')
        while int(page.get_attribute('.af-progreso', 'aria-valuenow')) < int(page.get_attribute('.af-progreso', 'aria-valuemax')) - 2:
            if page.locator('.af-opcion-check').count():
                page.locator('.af-opcion-check').first.click()
                page.locator('.af-cuerpo .af-cta').click()
            else:
                page.locator('.af-opciones .af-opcion').first.click()
            page.wait_for_timeout(120)
        page.locator('.af-opciones .af-opcion').nth(2).click()  # «Otra persona»
        page.wait_for_timeout(300)
        self.flujos.setdefault(f'{disp}:decide', {})['confirmar_visible'] = page.locator('.af-confirmar').is_visible()
        self.medir(page, 'aplicar-es-decide-confirmar', disp, completa=False)
        ctx.close()

    def correr(self, solo: list[str] | None):
        with sync_playwright() as pw:
            navegadores = {}
            for disp, nombre, motor in DISPOSITIVOS:
                if solo and disp not in solo:
                    continue
                if motor not in navegadores:
                    navegadores[motor] = getattr(pw, motor).launch()
                browser = navegadores[motor]
                dev = dict(pw.devices[nombre])
                dev.pop('default_browser_type', None)
                t0 = time.time()
                for idioma in ('es', 'en'):
                    ctx = browser.new_context(**dev, locale='es-PE' if idioma == 'es' else 'en-US', timezone_id='America/Lima')
                    page = ctx.new_page()
                    self.preparar(page, disp)
                    try:
                        self.landing(page, disp, idioma)
                    except Exception as e:  # noqa: BLE001
                        self.flujos.setdefault(f'{disp}:error', {})[f'landing-{idioma}'] = str(e)[:300]
                    ctx.close()
                try:
                    self.aplicacion(browser, nombre, disp, pw, motor)
                except Exception as e:  # noqa: BLE001
                    self.flujos.setdefault(f'{disp}:error', {})['excepcion'] = str(e)[:300]
                print(f'  {disp}: {time.time() - t0:.0f} s', flush=True)
            for b in navegadores.values():
                b.close()


# ---------------------------------------------------------------- casos de QA
def casos(c: Corrida, base: Path | None) -> list[Resultado]:
    R: list[Resultado] = []
    E = c.estados

    def caso(cid, titulo, grupo, fallas):
        fallas = [f for f in fallas if f]
        R.append(Resultado(cid, titulo, grupo, not fallas, fallas[:12]))

    def por_estado(fn):
        out = []
        for e in E:
            r = fn(e)
            if r:
                out.append(f'{e.dispositivo} · {e.etapa}: {r}')
        return out

    aplic = [e for e in E if e.etapa.startswith('aplicar')]
    land = [e for e in E if e.etapa.startswith('landing')]
    horiz = [e for e in E if 'horizontal' in e.dispositivo]

    # --- Layout
    caso('QA-01', 'Sin scroll horizontal en ninguna etapa', 'Layout', por_estado(lambda e: f'desborda {e.m["desborde"]} px' if e.m['desborde'] > 0 else None))
    caso('QA-02', 'Ningún elemento visible sale del ancho de pantalla', 'Layout', por_estado(lambda e: ', '.join(f'{x["el"]} ({x["left"]}→{x["right"]})' for x in e.m['fuera'][:3]) if e.m['fuera'] else None))
    caso('QA-03', 'Texto con al menos 12 px de margen lateral', 'Layout', por_estado(lambda e: ', '.join(f'{x["el"]} «{x["txt"][:18]}» L{x["l"]} R{x["r"]}' for x in e.m['pegados'][:3]) if e.m['pegados'] else None))
    caso('QA-04', 'Ningún texto cortado (ellipsis o recorte)', 'Layout', por_estado(lambda e: ', '.join(f'{x["el"]} «{x["txt"]}»' for x in e.m['cortados'][:3]) if e.m['cortados'] else None))
    caso('QA-05', 'Un solo h1 por pantalla', 'Layout', por_estado(lambda e: f'{e.m["h1Total"]} h1' if e.m['h1Total'] != 1 else None))
    caso('QA-06', 'El h1 se ve completo en la primera pantalla', 'Layout', por_estado(lambda e: f'h1 termina en {e.m["h1"]["bottom"]} de {e.m["vh"]}' if e.m['h1'] and e.m['h1']['bottom'] > e.m['vh'] and not e.etapa.endswith('completa') else None))
    caso('QA-07', 'h1 de la aplicación en 5 líneas o menos', 'Layout', [f'{e.dispositivo} · {e.etapa}: {e.m["h1"]["lineas"]} líneas' for e in aplic if e.m['h1'] and e.m['h1']['lineas'] > 5])
    caso('QA-08', 'h1 del hero en 5 líneas o menos', 'Layout', [f'{e.dispositivo} · {e.etapa}: {e.m["h1"]["lineas"]} líneas' for e in land if e.m['h1'] and e.m['h1']['lineas'] > 5])
    caso('QA-09', 'En la aplicación, la primera acción se ve sin bajar', 'Layout', [
        f'{e.dispositivo} · {e.etapa}: primera acción en {min(x["top"] for x in e.m["ctas"])} (pantalla {e.m["vh"]})'
        for e in aplic if e.m['ctas'] and 'horizontal' not in e.dispositivo and min(x['top'] for x in e.m['ctas']) > e.m['vh'] - 40 and re.search(r'-p\d\d$|contacto-sugerencia', e.etapa)])
    caso('QA-10', 'En el hero, el CTA o el video se ven sin bajar', 'Layout', [
        f'{e.dispositivo} · {e.etapa}: nada accionable antes de {e.m["vh"]}'
        for e in land if e.etapa.endswith('arriba') and 'horizontal' not in e.dispositivo and not any(x['top'] < e.m['vh'] for x in e.m['ctas']) and not any(v for v in e.m['videos'])])

    # --- Toque
    caso('QA-11', 'Objetivos táctiles de al menos 24 px (WCAG 2.2 AA, 2.5.8)', 'Toque', por_estado(lambda e: ', '.join(f'{x["el"]} {x["w"]}×{x["h"]}' for x in e.m['muyChicos'][:3]) if e.m['muyChicos'] else None))
    caso('QA-12', 'Objetivos táctiles de 44 px en la aplicación (Apple HIG)', 'Toque', [f'{e.dispositivo} · {e.etapa}: ' + ', '.join(f'{x["el"]} «{x["txt"][:14]}» {x["w"]}×{x["h"]}' for x in e.m['chicos'][:3]) for e in aplic if e.m['chicos']])
    caso('QA-13', 'Objetivos táctiles de 44 px en la landing', 'Toque', [f'{e.dispositivo} · {e.etapa}: ' + ', '.join(f'{x["el"]} «{x["txt"][:14]}» {x["w"]}×{x["h"]}' for x in e.m['chicos'][:3]) for e in land if e.m['chicos']])
    caso('QA-14', 'Ningún objetivo táctil se pisa con otro', 'Toque', por_estado(lambda e: ', '.join(f'{x["a"]}⨯{x["b"]}' for x in e.m['pisados'] if not x['fijo'])[:120] or None))
    caso('QA-15', 'Las capas fijas no tapan el h1 de la aplicación', 'Toque', [
        f'{e.dispositivo} · {e.etapa}: {f["el"]} tapa el h1' for e in aplic if e.m['h1'] for f in e.m['fijos']
        if f['pos'] == 'fixed' and f['top'] < e.m['h1']['bottom'] and f['bottom'] > e.m['h1']['top'] and f['h'] < e.m['vh'] * 0.9])
    caso('QA-16', 'La barra fija inferior deja libre la zona segura de iOS', 'Toque', [f'{e.dispositivo} · {e.etapa}: hay barra fija abajo y ninguna regla usa safe-area-inset' for e in E if any(f['pos'] == 'fixed' and f['bottom'] >= e.m['vh'] - 2 and f['h'] < 200 for f in e.m['fijos']) and not e.m['safeArea']])
    caso('QA-17', 'Capas fijas ocupan menos del 20 % de la pantalla', 'Toque', por_estado(lambda e: ', '.join(f'{f["el"]} {f["h"]} px' for f in e.m['fijos'] if f['pos'] == 'fixed' and f['h'] > e.m['vh'] * 0.2 and f['h'] < e.m['vh'] * 0.95) or None))

    # --- Tipografía y contraste
    caso('QA-18', 'Campos con letra de 16 px o más (iOS no hace zoom)', 'Tipografía', por_estado(lambda e: ', '.join(f'{x["el"]} {x["fs"]}' for x in e.m['camposChicos']) or None))
    caso('QA-19', 'Ningún texto menor a 12 px', 'Tipografía', por_estado(lambda e: ', '.join(f'{x["el"]} {x["fs"]} «{x["txt"][:14]}»' for x in e.m['textoChico'][:3]) or None))
    caso('QA-20', 'Contraste AA del texto sobre fondo sólido', 'Tipografía', por_estado(lambda e: ', '.join(f'{x["el"]} {x["ratio"]}:1 «{x["txt"][:14]}»' for x in e.m['bajoContraste'][:3]) or None))
    caso('QA-21', 'Las fuentes web cargan', 'Tipografía', por_estado(lambda e: f'fonts {e.m["fuentes"]}' if e.m['fuentes'] != 'loaded' else None))

    # --- Accesibilidad
    caso('QA-22', 'Todo control tiene nombre accesible', 'Accesibilidad', por_estado(lambda e: ', '.join(e.m['sinNombre'][:4]) or None))
    caso('QA-23', 'Todo campo tiene label', 'Accesibilidad', por_estado(lambda e: ', '.join(e.m['sinLabel'][:4]) or None))
    caso('QA-24', 'Imágenes con alt', 'Accesibilidad', por_estado(lambda e: ', '.join(e.m['imgSinAlt'][:4]) or None))
    caso('QA-25', 'html lang correcto por idioma', 'Accesibilidad', por_estado(lambda e: f'lang={e.m["lang"]}' if ('-en-' in e.etapa and not e.m['lang'].startswith('en')) or ('-es-' in e.etapa and not e.m['lang'].startswith('es')) else None))
    caso('QA-26', 'Hay estilos :focus-visible', 'Accesibilidad', por_estado(lambda e: 'sin :focus-visible' if not e.m['focoVisible'] else None))
    caso('QA-27', 'Meta viewport width=device-width sin bloquear el zoom', 'Accesibilidad', por_estado(lambda e: e.m['meta'] if 'width=device-width' not in e.m['meta'] or re.search(r'user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b', e.m['meta']) else None))

    # --- Campos del formulario
    contacto = [e for e in E if e.etapa.endswith('contacto-sugerencia')]
    def campo(e, sufijo):
        return next((x for x in e.m['campos'] if x['el'].startswith(sufijo)), None)
    caso('QA-28', 'Nombre con autocomplete', 'Formulario', [f'{e.dispositivo}: {campo(e, "#af-nombre")}' for e in contacto if not (campo(e, '#af-nombre') or {}).get('autocomplete')])
    caso('QA-29', 'Teléfono type=tel (teclado numérico)', 'Formulario', [f'{e.dispositivo}: {campo(e, "#af-tel")}' for e in contacto if (campo(e, '#af-tel') or {}).get('type') != 'tel'])
    caso('QA-30', 'Correo type=email (teclado con @)', 'Formulario', [f'{e.dispositivo}: {campo(e, "#af-correo")}' for e in contacto if (campo(e, '#af-correo') or {}).get('type') != 'email'])
    fl = {k: v for k, v in c.flujos.items() if ':contacto:' in k}
    caso('QA-31', 'Error de contacto visible y dentro de pantalla', 'Formulario', [f'{k}: {v}' for k, v in fl.items() if not (v.get('error_visible') and v.get('error_en_pantalla'))])
    caso('QA-32', 'Enter en el último campo envía', 'Formulario', [k for k, v in fl.items() if not v.get('enter_envia')])
    caso('QA-33', '«Atrás» conserva lo escrito', 'Formulario', [k for k, v in fl.items() if not v.get('atras_conserva')])
    caso('QA-34', 'La lista de países del teléfono entra en pantalla', 'Formulario', [f'{k}: {v["lista_paises"]}' for k, v in fl.items() if 'lista_paises' in v and (v['lista_paises']['left'] < 0 or v['lista_paises']['right'] > v['lista_paises']['vw'])])

    # --- Flujos (E2E)
    fa = {k: v for k, v in c.flujos.items() if re.search(r':(A|C):', k)}
    caso('QA-35', 'Las 12 preguntas se responden sin atascarse', 'Flujo', [f'{k}: atascado en {v["atascado"]}' for k, v in fa.items() if v.get('atascado')] + [f'{k}: {v}' for k, v in c.flujos.items() if k.endswith(':error')])
    caso('QA-36', 'Selección múltiple: «Continuar» deshabilitado hasta elegir', 'Flujo', [k for k, v in fa.items() if v.get('varias_deshabilitado') and not all(v['varias_deshabilitado'])])
    caso('QA-37', 'Selección múltiple con aria-pressed', 'Flujo', [k for k, v in fa.items() if v.get('aria_pressed') and any(x != 'true' for x in v['aria_pressed'])])
    caso('QA-38', 'Enviar deshabilitado sin el compromiso', 'Flujo', [k for k, v in fa.items() if v.get('enviar_deshabilitado_sin_compromiso') is False])
    caso('QA-39', 'Cada pantalla nueva arranca arriba', 'Flujo', [f'{k}: scrollY {[y for y in v["scroll_arriba"] if y > 120][:4]}' for k, v in fa.items() if any(y > 120 for y in v.get('scroll_arriba', []))])
    caso('QA-40', 'Dueño que elige «Otra persona» ve la confirmación', 'Flujo', [k for k, v in c.flujos.items() if k.endswith(':decide') and not v.get('confirmar_visible')])
    ag = {k: v for k, v in c.flujos.items() if ':agenda:' in k}
    caso('QA-41', 'Agenda: «Confirmar» deshabilitado sin turno', 'Flujo', [k for k, v in ag.items() if not v.get('confirmar_deshabilitado')])
    caso('QA-42', 'Las tres salidas (A llamada, A agenda, C) llegan a su pantalla', 'Flujo', [
        f'{d}: falta {et}' for d in {e.dispositivo for e in aplic} for et in ('resultado-A', 'llamada', 'agenda', 'confirmado', 'resultado-C')
        if not any(e.dispositivo == d and e.etapa.endswith(et) for e in aplic)])
    caso('QA-43', 'Link a Instagram abre aparte con rel=noopener', 'Flujo', [f'{k}: {v["instagram"]}' for k, v in c.flujos.items() if k.split(':')[1] == 'C' and v.get('instagram') and (v['instagram']['target'] != '_blank' or 'noopener' not in (v['instagram']['rel'] or ''))])

    # --- Video
    con_video = [e for e in E if e.m['videos']]
    caso('QA-44', 'Videos con playsinline (iOS no salta a pantalla completa)', 'Video', [f'{e.dispositivo} · {e.etapa}: {v["el"]}' for e in con_video for v in e.m['videos'] if not v['playsinline']])
    caso('QA-45', 'Videos no más anchos que la pantalla', 'Video', [f'{e.dispositivo} · {e.etapa}: {v["ancho"]} > {e.m["vw"]}' for e in con_video for v in e.m['videos'] if v['ancho'] > e.m['vw']])
    caso('QA-46', 'Subtítulos del idioma encendidos', 'Video', [
        f'{e.dispositivo} · {e.etapa}: {v["pistas"]}' for e in con_video for v in e.m['videos']
        if v['pistas'] and f'{"en" if "-en-" in e.etapa else "es"}:showing' not in v['pistas']])

    # --- Salud técnica y rendimiento
    caso('QA-47', 'Sin errores de consola ni de JS', 'Técnica', [f'{k}: {v[:2]}' for k, v in c.consola.items() if v])
    caso('QA-48', 'Sin respuestas 4xx/5xx del propio sitio', 'Técnica', [f'{k}: {v[:3]}' for k, v in c.red.items() if v])
    caso('QA-49', 'CLS de la landing menor a 0.1 (Core Web Vitals)', 'Rendimiento', [f'{k}: {v:.3f}' for k, v in c.cls.items() if v >= 0.1])

    # --- Regresión visual
    dif = regresion(c, base) if base else None
    if dif is None:
        caso('QA-50', 'Regresión visual contra la corrida base', 'Regresión', [])
        R[-1].detalle = ['sin base: esta corrida queda como línea base']
    else:
        c.regresion = dif
        cambios = [f'{k}: {v:.1f} %' for k, v in sorted(dif['cambios'].items(), key=lambda x: -x[1])]
        R.append(Resultado('QA-50', 'Regresión visual contra la corrida base', 'Regresión', not dif['faltan'], (dif['faltan'] + cambios)[:20]))
    return R


def regresion(c: Corrida, base: Path) -> dict:
    """Compara capturas con PIL. Un cambio no es falla: se lista para revisarlo a ojo."""
    from PIL import Image, ImageChops

    out = {'cambios': {}, 'faltan': [], 'iguales': 0}
    nuevas = c.salida / 'capturas'
    for p in sorted(nuevas.rglob('*.png')):
        rel = p.relative_to(nuevas)
        q = base / 'capturas' / rel
        if not q.exists():
            out['faltan'].append(f'sin base: {rel.as_posix()}')
            continue
        a, b = Image.open(q).convert('RGB'), Image.open(p).convert('RGB')
        if a.size != b.size:
            w, h = max(a.width, b.width), max(a.height, b.height)
            a2, b2 = Image.new('RGB', (w, h)), Image.new('RGB', (w, h))
            a2.paste(a), b2.paste(b)
            a, b = a2, b2
        d = ImageChops.difference(a, b).convert('L').point(lambda v: 255 if v > 24 else 0)
        pct = 100 * sum(d.histogram()[255:]) / (d.width * d.height)
        if pct > 0.5:
            out['cambios'][rel.as_posix()] = pct
            ruta = c.salida / 'diferencias' / rel
            ruta.parent.mkdir(parents=True, exist_ok=True)
            mezcla = Image.blend(b, Image.new('RGB', b.size, (255, 0, 80)), 0.0)
            mezcla.paste((255, 0, 80), mask=d)
            mezcla.save(ruta)
        else:
            out['iguales'] += 1
    return out


def reporte(c: Corrida, R: list[Resultado]):
    ok = sum(r.ok for r in R)
    lineas = [f'# QA móvil del funnel — {c.salida.name}', '', f'**{ok}/{len(R)} casos pasan** · {len(c.estados)} pantallas medidas en {len({e.dispositivo for e in c.estados})} dispositivos', '']
    grupo = None
    for r in R:
        if r.grupo != grupo:
            grupo = r.grupo
            lineas += ['', f'## {grupo}', '']
        lineas.append(f'- {"✅" if r.ok else "❌"} **{r.caso}** {r.titulo}')
        for d in r.detalle[:8]:
            lineas.append(f'  - {d}')
    (c.salida / 'reporte.md').write_text('\n'.join(lineas), encoding='utf-8')
    (c.salida / 'resultados.json').write_text(json.dumps({
        'casos': [r.__dict__ for r in R],
        'estados': [{'etapa': e.etapa, 'dispositivo': e.dispositivo, 'm': e.m} for e in c.estados],
        'flujos': c.flujos, 'cls': c.cls, 'consola': c.consola, 'red': c.red,
    }, ensure_ascii=False, indent=1), encoding='utf-8')
    return ok


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--url', default='http://[::1]:4329')
    ap.add_argument('--corrida', required=True)
    ap.add_argument('--base')
    ap.add_argument('--solo', nargs='*')
    a = ap.parse_args()
    salida = AQUI / 'salida' / a.corrida
    salida.mkdir(parents=True, exist_ok=True)
    c = Corrida(a.url, salida)
    c.correr(a.solo)
    base = (AQUI / 'salida' / a.base) if a.base else None
    R = casos(c, base)
    ok = reporte(c, R)
    print(f'{ok}/{len(R)} casos pasan · reporte en {salida / "reporte.md"}')
    for r in R:
        if not r.ok:
            print(f'  ❌ {r.caso} {r.titulo}: {len(r.detalle)} hallazgos')
    sys.exit(0 if ok == len(R) else 1)


if __name__ == '__main__':
    main()
