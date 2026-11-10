"""
Similitud entre páginas del sitio (anti «doorway pages»).

Lee el HTML ya construido (dist/client), saca el texto visible de <main> de
cada página indexable y compara todas contra todas, por palabras, con
difflib.SequenceMatcher. Falla (exit 1) si algún par comparte más del umbral.

    npm run build && npm run similitud
    python scripts/similitud.py --umbral 0.30 --solo soluciones,ciudades,blog

La cifra es ratio() de difflib: 2·M / (palabras de A + palabras de B), donde M
son las palabras que coinciden en bloques en el mismo orden. Es la misma
medida con la que se auditó primecleaningmo.com (58-64 % entre sus páginas
de ciudad). Corre antes de cada PR del programa SEO.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from difflib import SequenceMatcher
from html.parser import HTMLParser
from multiprocessing import Pool
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DIST = RAIZ / "dist" / "client"


class TextoMain(HTMLParser):
    """Junta el texto visible dentro de <main>, sin scripts ni estilos."""

    def __init__(self) -> None:
        super().__init__()
        self.en_main = 0
        self.saltar = 0
        self.partes: list[str] = []
        self.noindex = False

    def handle_starttag(self, tag, attrs):
        if tag == "meta":
            d = dict(attrs)
            if d.get("name") == "robots" and "noindex" in (d.get("content") or ""):
                self.noindex = True
        if tag == "main":
            self.en_main += 1
        if tag in ("script", "style", "noscript", "svg", "template"):
            self.saltar += 1

    def handle_endtag(self, tag):
        if tag == "main":
            self.en_main -= 1
        if tag in ("script", "style", "noscript", "svg", "template") and self.saltar:
            self.saltar -= 1

    def handle_data(self, data):
        if self.en_main and not self.saltar:
            self.partes.append(data)


def palabras(html: str) -> tuple[list[str], bool]:
    p = TextoMain()
    p.feed(html)
    texto = " ".join(p.partes).lower()
    return re.findall(r"[a-záéíóúüñ0-9]+", texto), p.noindex


def ruta_de(archivo: Path) -> str:
    rel = archivo.relative_to(DIST).as_posix()
    return "/" + rel.removesuffix("index.html").rstrip("/")


PAGINAS: list[tuple[str, list[str]]] = []
PROGRAMA = ("/soluciones", "/ciudades", "/blog", "/comparativas", "/calculadoras", "/autor")
TODO = False


def _init(paginas, todo):
    global PAGINAS, TODO
    PAGINAS = paginas
    TODO = todo


def del_programa(ruta: str) -> bool:
    return ruta.startswith(PROGRAMA)


def comparar_desde(i: int, umbral_aviso: float):
    """Compara la página i contra todas las siguientes. Devuelve los pares sobre el aviso."""
    ruta_b, b = PAGINAS[i]
    sm = SequenceMatcher(None, autojunk=False)
    sm.set_seq2(b)
    out = []
    for ruta_a, a in PAGINAS[i + 1 :]:
        if not TODO and not (del_programa(ruta_a) or del_programa(ruta_b)):
            continue
        sm.set_seq1(a)
        if sm.real_quick_ratio() < umbral_aviso or sm.quick_ratio() < umbral_aviso:
            continue
        r = sm.ratio()
        if r >= umbral_aviso:
            out.append((r, ruta_a, ruta_b))
    return out


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("--umbral", type=float, default=0.30)
    ap.add_argument("--solo", default="", help="prefijos de ruta separados por coma (ej. soluciones,ciudades)")
    ap.add_argument("--json", default="", help="guarda el reporte completo en este archivo")
    ap.add_argument(
        "--todo",
        action="store_true",
        help="compara también las páginas viejas entre sí (por defecto, solo pares donde al menos una es del programa SEO)",
    )
    ap.add_argument("--min-palabras", type=int, default=80, help="ignora páginas con menos texto (índices vacíos, 404)")
    args = ap.parse_args()

    if not DIST.exists():
        print("No hay dist/client: corre `npm run build` primero.")
        return 2

    prefijos = tuple(f"/{p.strip()}" for p in args.solo.split(",") if p.strip())
    paginas = []
    for f in sorted(DIST.rglob("index.html")):
        ruta = ruta_de(f) or "/"
        if prefijos and not ruta.startswith(prefijos):
            continue
        ws, noindex = palabras(f.read_text(encoding="utf-8", errors="ignore"))
        if noindex or len(ws) < args.min_palabras:
            continue
        paginas.append((ruta, ws))

    aviso = max(0.0, args.umbral - 0.05)
    with Pool(initializer=_init, initargs=(paginas, args.todo)) as pool:
        resultados = pool.starmap(comparar_desde, [(i, aviso) for i in range(len(paginas))])
    pares = sorted((p for r in resultados for p in r), reverse=True)

    maximo_por_pagina: dict[str, tuple[float, str]] = {}
    for r, a, b in pares:
        for x, y in ((a, b), (b, a)):
            if r > maximo_por_pagina.get(x, (0, ""))[0]:
                maximo_por_pagina[x] = (r, y)

    malos = [p for p in pares if p[0] > args.umbral]
    n_prog = sum(del_programa(r) for r, _ in paginas)
    print(f"Páginas leídas: {len(paginas)} ({n_prog} del programa SEO) · alcance: {'todo el sitio' if args.todo else 'pares con al menos una página del programa'}")
    print(f"Umbral: {args.umbral:.0%} · pares sobre el umbral: {len(malos)} · cerca (≥{aviso:.0%}): {len(pares) - len(malos)}")
    for r, a, b in pares[:25]:
        marca = "FALLA" if r > args.umbral else "cerca"
        print(f"  {marca} {r:6.1%}  {a}  <->  {b}")

    if args.json:
        Path(args.json).write_text(
            json.dumps(
                {
                    "umbral": args.umbral,
                    "paginas": len(paginas),
                    "pares_sobre_umbral": [{"similitud": round(r, 4), "a": a, "b": b} for r, a, b in malos],
                    "pares_cerca": [{"similitud": round(r, 4), "a": a, "b": b} for r, a, b in pares if r <= args.umbral],
                    "maximo_por_pagina": {k: {"similitud": round(v[0], 4), "con": v[1]} for k, v in sorted(maximo_por_pagina.items())},
                },
                ensure_ascii=False,
                indent=2,
            ),
            encoding="utf-8",
        )
    return 1 if malos else 0


if __name__ == "__main__":
    sys.exit(main())
