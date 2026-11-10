// Diagrama de flujo de las páginas SEO de Praxia. Un solo sistema para los 48
// flujos (src/lib/flujos.ts), en dos orientaciones:
//   ancho (1280×360): pasos de izquierda a derecha, para escritorio
//   alto  (720×960):  pasos de arriba abajo, para móvil
//
// Registro: explicativo y calmado. Todo el texto está siempre en pantalla (el
// diagrama se lee aunque no se mueva); lo que se mueve es el recorrido: la línea
// naranja va de un paso al siguiente y cada paso se enciende cuando la línea
// llega (causa y efecto). Un solo acento: brasa #FF6B35.
// Curvas de la skill motion-designer (kit.heavy para el trazo, kit.land para el
// asentamiento del nodo, kit.leave para la salida). El texto corta, no se
// desvanece. Bucle limpio: el último cuadro es el estado de reposo del primero.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {
  Bell,
  CalendarDays,
  Camera,
  Car,
  ChartColumn,
  CircleCheck,
  Clock,
  FileText,
  FolderOpen,
  HardHat,
  House,
  ListChecks,
  ListFilter,
  Megaphone,
  MessageCircle,
  MessageSquareText,
  Package,
  PenLine,
  Search,
  Send,
  ShoppingBag,
  Smartphone,
  Star,
  TriangleAlert,
  UserRound,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type {IconoFlujo, PasoFlujo} from '../../src/lib/flujos';
import {LIENZO} from '../../src/lib/flujos';

const ICONOS: Record<IconoFlujo, LucideIcon> = {
  mensaje: MessageCircle,
  respuesta: MessageSquareText,
  filtro: ListFilter,
  persona: UserRound,
  personas: Users,
  calendario: CalendarDays,
  campana: Bell,
  check: CircleCheck,
  reloj: Clock,
  documento: FileText,
  carpeta: FolderOpen,
  firma: PenLine,
  foto: Camera,
  grafico: ChartColumn,
  alerta: TriangleAlert,
  enviar: Send,
  carrito: ShoppingBag,
  paquete: Package,
  auto: Car,
  casa: House,
  casco: HardHat,
  estrella: Star,
  publicar: Megaphone,
  lista: ListChecks,
  buscar: Search,
  celular: Smartphone,
  llave: Wrench,
};

// Tokens del sitio (src/styles/tokens.css)
const C = {
  fondo: '#0D0E14', // --color-surface
  nodo: '#15161E', // --color-surface-2
  linea: '#2C2E40', // un paso más claro que --color-linea, para que el trazo de reposo se vea en video
  texto: '#E8ECF4',
  texto2: '#8A96AC',
  texto3: '#7B8BAB',
  brasa: '#FF6B35',
};

const bz = (x1: number, y1: number, x2: number, y2: number) => Easing.bezier(x1, y1, x2, y2);
const K = {
  land: bz(0.1, 0.75, 0.15, 1),
  heavy: bz(0.75, 0, 0.18, 1),
  leave: bz(0.55, 0, 0.9, 0.35),
};

// Tiempos en cuadros (30 fps)
export const FPS = 30;
const INICIO = 14; // reposo antes del primer paso
const TRAMO = 30; // un paso se enciende cada 30 cuadros
const DEMORA = 6; // la línea sale un instante después de que el paso se enciende
const TRAZO = TRAMO - DEMORA; // y llega justo cuando se enciende el siguiente
const SOSTEN = 60; // el flujo completo se queda a la vista 2 s
const SALIDA = 12; // cada línea se retira en 0,4 s, más rápido de lo que entró
const OLA = 3; // la salida corre en ola, un paso cada 3 cuadros
const COLA = 10; // reposo final, igual al del principio

export const duracion = (n: number) => INICIO + (n - 1) * TRAMO + SOSTEN + (n - 1) * OLA + SALIDA + COLA;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type Orientacion = 'ancho' | 'alto';

export const Diagrama: React.FC<{pasos: PasoFlujo[]; orientacion: Orientacion}> = ({pasos, orientacion}) => {
  const f = useCurrentFrame();
  const n = pasos.length;
  const {w: W, h: H} = LIENZO[orientacion];
  const ancho = orientacion === 'ancho';

  const enciende = (i: number) => INICIO + i * TRAMO;
  const reinicio = INICIO + (n - 1) * TRAMO + SOSTEN;
  const sale = (i: number) => reinicio + i * OLA;

  // Geometría
  const R = ancho ? 38 : 42; // radio del nodo
  const HUECO = ancho ? 14 : 10; // aire entre nodo y línea
  let centro: (i: number) => {x: number; y: number};
  if (ancho) {
    const pad = 64;
    const col = (W - pad * 2) / n;
    centro = (i) => ({x: pad + col * (i + 0.5), y: 150});
  } else {
    const pad = 70;
    const fila = (H - pad * 2) / n;
    centro = (i) => ({x: 116, y: pad + fila * (i + 0.5)});
  }
  const col = ancho ? (W - 128) / n : 0;

  return (
    <AbsoluteFill style={{background: C.fondo, fontFamily: '"Manrope", system-ui, sans-serif'}}>
      {/* Conectores: trazo de reposo punteado + trazo encendido */}
      {pasos.slice(0, -1).map((_, i) => {
        const a = centro(i);
        const b = centro(i + 1);
        const largo = ancho ? b.x - a.x - 2 * (R + HUECO) : b.y - a.y - 2 * (R + HUECO);
        const t0 = enciende(i) + DEMORA;
        const entra = interpolate(f, [t0, t0 + TRAZO], [0, 1], {...clamp, easing: K.heavy});
        const retira = interpolate(f, [sale(i), sale(i) + SALIDA], [0, 1], {...clamp, easing: K.leave});
        const dibujando = f >= t0 && f < t0 + TRAZO;
        const caja: React.CSSProperties = ancho
          ? {left: a.x + R + HUECO, top: a.y - 1, width: largo, height: 2}
          : {left: a.x - 1, top: a.y + R + HUECO, width: 2, height: largo};
        // La línea crece desde su origen y, al reiniciar, se retira hacia el paso siguiente.
        const escala = retira > 0 ? 1 - retira : entra;
        const origen = retira > 0 ? (ancho ? 'right center' : 'center bottom') : ancho ? 'left center' : 'center top';
        const punta = entra * largo;
        return (
          <React.Fragment key={`c${i}`}>
            <div
              style={{
                position: 'absolute',
                ...caja,
                backgroundImage: ancho
                  ? `repeating-linear-gradient(90deg, ${C.linea} 0 6px, transparent 6px 12px)`
                  : `repeating-linear-gradient(180deg, ${C.linea} 0 6px, transparent 6px 12px)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                ...caja,
                background: C.brasa,
                borderRadius: 2,
                transformOrigin: origen,
                transform: ancho ? `scaleX(${escala})` : `scaleY(${escala})`,
              }}
            />
            {dibujando && (
              <div
                style={{
                  position: 'absolute',
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  background: C.brasa,
                  left: ancho ? a.x + R + HUECO + punta - 5 : a.x - 5,
                  top: ancho ? a.y - 5 : a.y + R + HUECO + punta - 5,
                }}
              />
            )}
          </React.Fragment>
        );
      })}

      {/* Pasos */}
      {pasos.map((paso, i) => {
        const {x, y} = centro(i);
        const encendido = f >= enciende(i) && f < sale(i) + 4;
        const asienta = interpolate(f, [enciende(i), enciende(i) + 16], [0.92, 1], {...clamp, easing: K.land});
        const escala = encendido ? asienta : 1;
        const Icono = ICONOS[paso.icono];
        const ultimo = i === n - 1;
        // El último paso suelta un anillo una sola vez: el flujo terminó.
        const anillo = interpolate(f, [enciende(i), enciende(i) + 30], [0, 1], {...clamp, easing: K.land});
        const num = String(i + 1).padStart(2, '0');
        return (
          <React.Fragment key={`p${i}`}>
            {ultimo && encendido && anillo < 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: x - R,
                  top: y - R,
                  width: R * 2,
                  height: R * 2,
                  borderRadius: '50%',
                  border: `2px solid ${C.brasa}`,
                  transform: `scale(${1 + anillo * 0.55})`,
                  opacity: 0.6 * (1 - anillo),
                }}
              />
            )}
            <div
              style={{
                position: 'absolute',
                left: x - R,
                top: y - R,
                width: R * 2,
                height: R * 2,
                borderRadius: '50%',
                background: encendido ? 'rgba(255,107,53,0.10)' : C.nodo,
                boxShadow: `inset 0 0 0 2px ${encendido ? C.brasa : C.linea}`,
                display: 'grid',
                placeItems: 'center',
                transform: `scale(${escala})`,
              }}
            >
              <Icono size={ancho ? 32 : 36} strokeWidth={1.75} color={encendido ? C.brasa : C.texto2} />
            </div>
            {ancho ? (
              <>
                <div
                  style={{
                    position: 'absolute',
                    left: x - col / 2,
                    width: col,
                    top: y - R - 46,
                    textAlign: 'center',
                    fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                    fontSize: 17,
                    letterSpacing: '0.12em',
                    color: encendido ? C.brasa : C.texto3,
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: x - col / 2 + 10,
                    width: col - 20,
                    top: y + R + 22,
                    textAlign: 'center',
                    fontSize: n > 5 ? 23 : 25,
                    fontWeight: 600,
                    lineHeight: 1.28,
                    letterSpacing: '-0.01em',
                    textWrap: 'balance',
                    color: encendido ? C.texto : C.texto2,
                  }}
                >
                  {paso.texto}
                </div>
              </>
            ) : (
              <div
                style={{
                  position: 'absolute',
                  left: x + R + 30,
                  width: W - (x + R + 30) - 48,
                  top: y,
                  transform: 'translateY(-50%)',
                }}
              >
                <div
                  style={{
                    fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                    fontSize: 19,
                    letterSpacing: '0.12em',
                    color: encendido ? C.brasa : C.texto3,
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 34,
                    fontWeight: 600,
                    lineHeight: 1.22,
                    letterSpacing: '-0.015em',
                    textWrap: 'balance',
                    color: encendido ? C.texto : C.texto2,
                  }}
                >
                  {paso.texto}
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
