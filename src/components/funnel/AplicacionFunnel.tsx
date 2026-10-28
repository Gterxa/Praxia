/**
 * La aplicación del funnel (/funnel/aplicar y /en/funnel/aplicar): una
 * pregunta por pantalla, con barra de progreso y reloj, como el prototipo
 * "2 · Formulario filtro" del lienzo. Al enviar, clasifica con la matriz de
 * src/funnel.ts y muestra la pantalla que toca: A y B → llamada o agenda;
 * C → perfil en evaluación.
 *
 * Cada avance va a GHL por /api/funnel: el contacto se crea apenas deja sus
 * datos (pantalla 1), cada respuesta se guarda al pasar de pantalla y al enviar
 * se clasifica en el servidor. Así el equipo ve también a quien se queda a
 * medias. Los envíos van en cola, uno detrás de otro, y no frenan la pantalla.
 *
 * Después del resultado: «Sí, llámenme» queda registrado en GHL; la agenda
 * muestra los turnos libres del calendario de diagnóstico (GET /api/funnel) y
 * «Confirmar» reserva la cita ahí. Esa es la única llamada que se espera.
 *
 * Los textos salen de src/i18n/funnel.ts según `idioma`. La moneda sigue
 * saliendo del código del teléfono, en los dos idiomas.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import intlTelInput from 'intl-tel-input/intlTelInputWithUtils';
import { en, es } from 'intl-tel-input/locale';
import 'intl-tel-input/styles';
import './aplicacion-funnel.css';
import {
  PREGUNTAS,
  clasificar,
  datoDelNegocio,
  enHorario,
  opcionesDe,
  type Moneda,
  type Respuestas,
  type Resultado,
} from '../../funnel';
import { EN_BORRADOR, LOCALE, TEXTOS, preguntaEn, rutaFunnel, type Idioma, type Textos } from '../../i18n/funnel';
import { elegirIdioma, hrefEnIdioma, idiomaSugerido } from '../../lib/idioma';
import { guardarOrigen, leerOrigen } from '../../lib/origen';
import VideoFunnel from './VideoFunnel';
import { VIDEO_APROBADOS, VIDEO_EVALUACION } from '../../videos';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const API_FUNNEL = `${BASE}/api/funnel`;
const rutaFunnelBase = (idioma: Idioma) => `${BASE}${rutaFunnel(idioma, '/aplicar')}`;

type Iti = ReturnType<typeof intlTelInput>;
type Fase = 'form' | 'resultado' | 'llamada' | 'agenda' | 'confirmado';

interface Props {
  correo: string;
  instagram: string;
  idioma?: Idioma;
}

const TOTAL = PREGUNTAS.length + 2; // contacto + preguntas + cierre

function etiquetaAvance(i: number, t: Textos['aplicacion']['avance']): string {
  if (i === TOTAL - 1) return t.ultimoPaso;
  if (i === TOTAL - 2) return t.ultimaPregunta;
  const pct = i / TOTAL;
  if (pct < 0.3) return t.comienzo;
  if (pct < 0.6) return t.bien;
  return t.casi;
}

/** Días con turnos libres, como los devuelve GET /api/funnel. */
interface DiaAgenda {
  fecha: string;
  turnos: string[];
}
type Agenda = { estado: 'cargando' } | { estado: 'listo'; dias: DiaAgenda[] } | { estado: 'error' };

// Todo en hora de Lima, sin importar la zona del navegador: el turno trae su offset.
const LIMA = 'America/Lima';
const DIAS_VISIBLES = 5;
const mediodia = (fecha: string) => new Date(`${fecha}T12:00:00-05:00`);
const diaCorto = (fecha: string, loc: string) => mediodia(fecha).toLocaleDateString(loc, { timeZone: LIMA, weekday: 'short' }).replace('.', '');
const diaNum = (fecha: string) => Number(fecha.slice(8, 10));
const horaDe = (turno: string, loc: string) => new Date(turno).toLocaleTimeString(loc, { timeZone: LIMA, hour: 'numeric', minute: '2-digit' });
const diaLargo = (turno: string, loc: string) => new Date(turno).toLocaleDateString(loc, { timeZone: LIMA, weekday: 'long', day: 'numeric', month: 'long' });

export default function AplicacionFunnel({ correo, instagram, idioma = 'es' }: Props) {
  const tx = TEXTOS[idioma];
  const t = tx.aplicacion;
  const loc = LOCALE[idioma];
  const [paso, setPaso] = useState(0);
  const [fase, setFase] = useState<Fase>('form');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [pais, setPais] = useState('pe');
  const [errorContacto, setErrorContacto] = useState('');
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const [frase, setFrase] = useState('');
  const [compromiso, setCompromiso] = useState(false);
  const [confirmarDecide, setConfirmarDecide] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [agenda, setAgenda] = useState<Agenda>({ estado: 'cargando' });
  const [dia, setDia] = useState('');
  const [turno, setTurno] = useState('');
  const [reservando, setReservando] = useState(false);
  const [errorAgenda, setErrorAgenda] = useState('');
  const [sugerido, setSugerido] = useState<Idioma | null>(null);
  const telRef = useRef<HTMLInputElement>(null);
  const itiRef = useRef<Iti | null>(null);
  const cimaRef = useRef<HTMLDivElement>(null);
  const trampaRef = useRef<HTMLInputElement>(null);
  const colaRef = useRef<Promise<unknown>>(Promise.resolve());
  const inicioRef = useRef(false);

  const moneda: Moneda = pais === 'pe' ? 'PEN' : 'USD';
  const otro: Idioma = idioma === 'es' ? 'en' : 'es';

  // Si entró directo a /funnel/aplicar desde un anuncio, los UTM están acá.
  useEffect(guardarOrigen, []);

  // Si la IP es de un país del otro idioma, se le ofrece cambiar (no se le cambia).
  useEffect(() => {
    let vivo = true;
    idiomaSugerido(idioma).then((s) => vivo && setSugerido(s));
    return () => {
      vivo = false;
    };
  }, [idioma]);

  /** Manda el estado actual a GHL. En cola, para que el contacto exista antes del siguiente paso. */
  function avisarCrm(evento: 'inicio' | 'paso' | 'fin' | 'llamada', extra: { respuestas?: Respuestas; paso?: number } = {}) {
    const cuerpo = cuerpoCrm(evento, extra);
    colaRef.current = colaRef.current
      .then(() => fetch(API_FUNNEL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: cuerpo, keepalive: true }))
      .catch(() => {
        /* sin red: el visitante sigue; el siguiente paso vuelve a mandar todo */
      });
  }

  function cuerpoCrm(evento: string, extra: { respuestas?: Respuestas; paso?: number; turno?: string } = {}) {
    return JSON.stringify({
      evento,
      nombre: nombre.trim(),
      telefono: typeof respuestas.telefono === 'string' ? respuestas.telefono : '',
      correo: email.trim(),
      pais,
      moneda,
      idioma,
      respuestas: extra.respuestas ?? respuestas,
      frase,
      compromiso,
      paso: extra.paso ?? paso,
      origen: leerOrigen(),
      turno: extra.turno,
      web: trampaRef.current?.value ?? '',
    });
  }

  async function cargarTurnos() {
    setAgenda({ estado: 'cargando' });
    try {
      const res = await fetch(API_FUNNEL, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(String(res.status));
      const { dias } = (await res.json()) as { dias: DiaAgenda[] };
      const visibles = dias.slice(0, DIAS_VISIBLES);
      setAgenda({ estado: 'listo', dias: visibles });
      setDia((d) => (visibles.some((x) => x.fecha === d) ? d : (visibles[0]?.fecha ?? '')));
    } catch {
      setAgenda({ estado: 'error' });
    }
  }

  /** Reserva el turno en el calendario. Espera a que la cola termine: el contacto tiene que existir. */
  async function reservar() {
    if (!turno || reservando) return;
    setReservando(true);
    setErrorAgenda('');
    const cuerpo = cuerpoCrm('agenda', { turno });
    try {
      await colaRef.current;
      const res = await fetch(API_FUNNEL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: cuerpo });
      if (res.ok) {
        setFase('confirmado');
        return;
      }
      if (res.status === 409) {
        setErrorAgenda(t.agenda.ocupado);
        setTurno('');
        cargarTurnos();
        return;
      }
      throw new Error(String(res.status));
    } catch {
      setErrorAgenda(t.agenda.errorReserva);
    } finally {
      setReservando(false);
    }
  }

  // «Sí, llámenme» queda registrado en GHL; la agenda pide los turnos libres al entrar.
  useEffect(() => {
    if (fase === 'llamada') avisarCrm('llamada');
    if (fase === 'agenda') cargarTurnos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase]);

  // Al llegar a cada pregunta se guarda lo que lleva. La primera vez, como inicio.
  useEffect(() => {
    if (fase !== 'form' || paso < 1) return;
    avisarCrm(inicioRef.current ? 'paso' : 'inicio');
    inicioRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paso, fase]);

  // El teléfono se escribe completo, código de país primero ("51 997 872
  // 779"): no se elige país. Cada dígito se trata como número internacional
  // (se le antepone el "+"), así la librería reconoce el código mientras
  // tipeas y la bandera aparece sola apenas pones "51". El selector queda
  // solo para corregir a mano.
  useEffect(() => {
    if (fase !== 'form' || paso !== 0 || !telRef.current) return;
    const input = telRef.current;
    // Va ANTES de iniciar la librería: los listeners corren en orden y ella
    // tiene que ver el "+" para leer el código.
    const conMas = () => {
      const v = input.value;
      if (v && !v.startsWith('+')) input.value = `+${v.replace(/^0+/, '')}`;
    };
    input.addEventListener('input', conMas);
    const iti = intlTelInput(input, {
      initialCountry: '',
      countryOrder: (idioma === 'en' ? ['us', 'pe', 'mx', 'co', 'cl', 'ec', 'bo', 'ar', 'es'] : ['pe', 'us', 'mx', 'co', 'cl', 'ec', 'bo', 'ar', 'es']) as never,
      separateDialCode: false,
      countrySearch: true,
      countryNameLocale: idioma,
      uiTranslations: idioma === 'en' ? en : es,
    });
    itiRef.current = iti;
    const alCambiar = () => setPais(iti.getSelectedCountry()?.iso2 ?? 'pe');
    input.addEventListener('countrychange', alCambiar);
    return () => {
      input.removeEventListener('input', conMas);
      input.removeEventListener('countrychange', alCambiar);
      iti.destroy();
      itiRef.current = null;
    };
  }, [fase, paso, idioma]);

  // Cada pantalla nueva arranca arriba.
  useEffect(() => {
    cimaRef.current?.scrollIntoView({ block: 'start' });
  }, [paso, fase]);

  const pregunta = paso >= 1 && paso <= PREGUNTAS.length ? preguntaEn(PREGUNTAS[paso - 1], idioma) : null;
  const dato = useMemo(() => datoDelNegocio(respuestas, moneda, idioma), [respuestas, moneda, idioma]);

  function empezar() {
    const iti = itiRef.current;
    if (!nombre.trim()) return setErrorContacto(t.errores.nombre);
    if (!telRef.current?.value.trim()) return setErrorContacto(t.errores.whatsapp);
    if (iti && !iti.getSelectedCountry()) return setErrorContacto(t.errores.codigo);
    if (iti && iti.isValidNumber() === false) return setErrorContacto(t.errores.numero);
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErrorContacto(t.errores.correo);
    setErrorContacto('');
    setRespuestas((r) => ({ ...r, telefono: iti?.getNumber() ?? telRef.current?.value ?? '' }));
    setPaso(1);
  }

  function elegirUna(id: string, valor: string) {
    if (id === 'decide' && valor === 'otra' && (respuestas.rol === 'dueno' || respuestas.rol === 'gerente-general')) {
      setConfirmarDecide(true);
      return;
    }
    setRespuestas((r) => ({ ...r, [id]: valor }));
    setPaso((p) => p + 1);
  }

  function alternar(id: string, valor: string) {
    setRespuestas((r) => {
      const actual = Array.isArray(r[id]) ? (r[id] as string[]) : [];
      return { ...r, [id]: actual.includes(valor) ? actual.filter((v) => v !== valor) : [...actual, valor] };
    });
  }

  function enviar() {
    const res = clasificar(respuestas, moneda);
    const lead = { nombre, email, pais, moneda, idioma, respuestas, frase, compromiso, ...res, enviado: new Date().toISOString() };
    try {
      sessionStorage.setItem('praxia-funnel-lead', JSON.stringify(lead));
    } catch {
      /* sin almacenamiento: la pantalla sigue igual */
    }
    avisarCrm('fin');
    setResultado(res);
    setFase('resultado');
  }

  /** Cambia de idioma llevando los UTM y el cid de la URL (el href renderizado no los tiene). */
  function irA(e: { preventDefault(): void }, destino: Idioma) {
    e.preventDefault();
    elegirIdioma(destino);
    location.href = hrefEnIdioma(destino, '/aplicar');
  }

  const primerNombre = nombre.trim().split(/\s+/)[0] || '';
  // El idioma se cambia solo antes de empezar: cambiar a mitad perdería las respuestas.
  const puedeCambiarIdioma = fase === 'form' && paso === 0;

  return (
    <div className="af" ref={cimaRef}>
      <div className="af-cielo" aria-hidden="true" />
      <div className="af-marco">
        <header className="af-cabecera">
          <span className="af-logo">
            Praxia<span className="af-logo-punto">.</span>
          </span>
          {puedeCambiarIdioma && (
            <a className="af-idioma" href={rutaFunnelBase(otro)} hrefLang={otro} lang={otro} onClick={(e) => irA(e, otro)}>
              {tx.otroIdioma}
            </a>
          )}
        </header>

        {puedeCambiarIdioma && sugerido && (
          <p className="af-sugerencia" lang={sugerido}>
            <a href={rutaFunnelBase(sugerido)} hrefLang={sugerido} onClick={(e) => irA(e, sugerido)}>
              {tx.sugerencia} →
            </a>
            <button type="button" className="af-sugerencia-cerrar" aria-label={tx.cerrar} onClick={() => { elegirIdioma(idioma); setSugerido(null); }}>
              ×
            </button>
          </p>
        )}

        {import.meta.env.DEV && idioma === 'en' && EN_BORRADOR && <p className="af-nota af-mono">EN: borrador sin revisar</p>}

        {fase === 'form' && (
          <>
            <div
              className="af-progreso"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={TOTAL}
              aria-valuenow={paso + 1}
              aria-label={t.pasoDe(paso + 1, TOTAL)}
            >
              {Array.from({ length: TOTAL }, (_, i) => (
                <span key={i} className={`af-seg${i <= paso ? ' af-seg-lleno' : ''}`} />
              ))}
            </div>
            {paso > 0 && (
              <div className="af-avance">
                <span>{etiquetaAvance(paso, t.avance)}</span>
                <span className="af-avance-num">
                  <b>{Math.round((paso / TOTAL) * 100)}%</b> · {t.deTotal(paso + 1, TOTAL)}
                </span>
              </div>
            )}
          </>
        )}

        {fase === 'form' && paso === 0 && (
          <section className="af-cuerpo">
            <h1 className="af-titulo">
              {t.contacto.h1[0]}<span className="af-calido">{t.contacto.h1[1]}</span>
            </h1>
            <p className="af-ayuda">{t.contacto.ayuda}</p>
            <p className="af-tiempo">{t.contacto.tiempo}</p>
            <form
              className="af-campos"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                empezar();
              }}
            >
              <label className="af-label" htmlFor="af-nombre">{t.contacto.nombre}</label>
              <input id="af-nombre" className="af-input" autoComplete="given-name" placeholder={t.contacto.nombrePh} value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <label className="af-label" htmlFor="af-tel">{t.contacto.whatsapp}</label>
              <input id="af-tel" ref={telRef} className="af-input" type="tel" autoComplete="tel" placeholder={idioma === 'en' ? '1 305 555 0123' : '51 997 872 779'} defaultValue={typeof respuestas.telefono === 'string' ? respuestas.telefono : ''} />
              <p className="af-pista">{t.contacto.pista}</p>
              <label className="af-label" htmlFor="af-correo">{t.contacto.correo}</label>
              <input id="af-correo" className="af-input" type="email" autoComplete="email" placeholder={t.contacto.correoPh} value={email} onChange={(e) => setEmail(e.target.value)} />
              {/* Trampa para bots: invisible para personas y lectores de pantalla. */}
              <input ref={trampaRef} name="web" className="af-trampa" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              {errorContacto && <p className="af-error" role="alert">{errorContacto}</p>}
              <button type="submit" className="boton boton-primario af-cta">
                {t.contacto.empezar} <span aria-hidden="true">→</span>
              </button>
              <p className="af-nota">{t.contacto.nota}</p>
            </form>
          </section>
        )}

        {fase === 'form' && pregunta && (
          <section className="af-cuerpo" key={pregunta.id}>
            {/* «¿Sabías que…?»: justo después de clientes, ticket y fines de semana. */}
            {pregunta.id === 'decide' && dato && (
              <aside className="af-dato" aria-label={t.datoAria}>
                <p className="af-dato-titulo">{t.datoTitulo}</p>
                <p className="af-dato-texto">{dato.texto}</p>
                <p className="af-dato-supuesto">{dato.supuesto}</p>
              </aside>
            )}
            <h1 className="af-titulo">{pregunta.titulo}</h1>
            {pregunta.ayuda && <p className="af-ayuda">{pregunta.ayuda}</p>}

            {pregunta.tipo === 'una' && !confirmarDecide && (
              <div className="af-opciones">
                {opcionesDe(pregunta, moneda).map((o) => (
                  <button
                    key={o.valor}
                    type="button"
                    className={`af-opcion${respuestas[pregunta.id] === o.valor ? ' af-opcion-activa' : ''}`}
                    onClick={() => elegirUna(pregunta.id, o.valor)}
                  >
                    <span>{o.texto}</span>
                    <svg className="af-flecha" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}
              </div>
            )}

            {pregunta.id === 'decide' && confirmarDecide && (
              <div className="af-confirmar" role="alert">
                <p>{t.confirmarDecide}</p>
                <div className="af-confirmar-botones">
                  <button type="button" className="af-opcion" onClick={() => { setConfirmarDecide(false); setRespuestas((r) => ({ ...r, decide: 'otra' })); setPaso((p) => p + 1); }}>
                    {t.siOtra}
                  </button>
                  <button type="button" className="af-opcion" onClick={() => setConfirmarDecide(false)}>
                    {t.meEquivoque}
                  </button>
                </div>
              </div>
            )}

            {pregunta.tipo === 'varias' && (
              <>
                <div className="af-opciones">
                  {opcionesDe(pregunta, moneda).map((o) => {
                    const activa = Array.isArray(respuestas[pregunta.id]) && (respuestas[pregunta.id] as string[]).includes(o.valor);
                    return (
                      <button
                        key={o.valor}
                        type="button"
                        aria-pressed={activa}
                        className={`af-opcion af-opcion-check${activa ? ' af-opcion-activa' : ''}`}
                        onClick={() => alternar(pregunta.id, o.valor)}
                      >
                        <span className="af-check" aria-hidden="true">{activa ? '✓' : ''}</span>
                        <span className="af-opcion-textos">
                          <span className="af-opcion-titulo">{o.texto}</span>
                          {o.detalle && <span className="af-opcion-detalle">{o.detalle}</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  className="boton boton-primario af-cta"
                  disabled={!Array.isArray(respuestas[pregunta.id]) || (respuestas[pregunta.id] as string[]).length === 0}
                  onClick={() => setPaso((p) => p + 1)}
                >
                  {t.continuar}
                </button>
              </>
            )}

            <button type="button" className="af-atras" onClick={() => { setConfirmarDecide(false); setPaso((p) => p - 1); }}>
              {t.atras}
            </button>
          </section>
        )}

        {fase === 'form' && paso === TOTAL - 1 && (
          <section className="af-cuerpo">
            <h1 className="af-titulo">
              {t.frase.h1[0]}<span className="af-calido">{t.frase.h1[1]}</span>
            </h1>
            <label className="af-label" htmlFor="af-frase">{t.frase.label}</label>
            <textarea
              id="af-frase"
              className="af-input af-textarea"
              rows={4}
              placeholder={t.frase.ph}
              value={frase}
              onChange={(e) => setFrase(e.target.value)}
            />
            <label className="af-compromiso">
              <input type="checkbox" checked={compromiso} onChange={(e) => setCompromiso(e.target.checked)} />
              <span>{t.frase.compromiso}</span>
            </label>
            <button type="button" className="boton boton-primario af-cta" disabled={!compromiso} onClick={enviar}>
              {t.frase.enviar}
            </button>
            <button type="button" className="af-atras" onClick={() => setPaso((p) => p - 1)}>
              {t.atras}
            </button>
          </section>
        )}

        {fase === 'resultado' && resultado && resultado.categoria !== 'C' && (
          <section className="af-cuerpo">
            <p className="af-kicker">{t.resultado.recibida}</p>
            <h1 className="af-titulo">
              {t.resultado.tuCaso(primerNombre)}
              <span className="af-calido">{t.resultado.encaja}</span>
            </h1>
            <VideoFunnel video={VIDEO_APROBADOS} idioma={idioma} enGrabacion={tx.video.aprobados} sinSoporte={tx.video.sinSoporte} />
            {enHorario() ? (
              <div className="af-panel">
                <p className="af-panel-titulo">{t.resultado.llamarteTitulo}</p>
                <p className="af-ayuda">{t.resultado.llamarteAyuda}</p>
                <div className="af-panel-botones">
                  <button type="button" className="boton boton-primario" onClick={() => setFase('llamada')}>{t.resultado.siLlamenme}</button>
                  <button type="button" className="boton boton-secundario" onClick={() => setFase('agenda')}>{t.resultado.prefieroElegir}</button>
                </div>
              </div>
            ) : (
              <div className="af-panel">
                <p className="af-panel-titulo">{t.resultado.fueraTitulo}</p>
                <p className="af-ayuda">{t.resultado.fueraAyuda}</p>
                <button type="button" className="boton boton-primario af-cta" onClick={() => setFase('agenda')}>{t.resultado.elegir}</button>
              </div>
            )}
          </section>
        )}

        {fase === 'llamada' && (
          <section className="af-cuerpo">
            <p className="af-kicker">{t.llamada.kicker}</p>
            <h1 className="af-titulo">
              {t.llamada.h1[0]}<span className="af-calido">{t.llamada.h1[1]}</span>
            </h1>
            <p className="af-ayuda">
              {t.llamada.ayuda[0]}<b>{t.llamada.ayuda[1]}</b>{t.llamada.ayuda[2]}
            </p>
            <Preparar t={t.preparar} />
          </section>
        )}

        {fase === 'agenda' && (
          <section className="af-agenda">
            <div className="af-agenda-lado">
              <h1 className="af-titulo">
                {t.agenda.h1[0]}<span className="af-calido">{t.agenda.h1[1]}</span>
              </h1>
              <div className="af-aviso">
                <span className="af-aviso-punto" aria-hidden="true" />
                <p>
                  {t.agenda.aviso[0]}<b>{t.agenda.aviso[1]}</b>{t.agenda.aviso[2]}
                </p>
              </div>
              <ul className="af-datos">
                {t.agenda.datos.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <div className="af-agenda-tarjeta" aria-busy={agenda.estado === 'cargando'}>
              {agenda.estado === 'cargando' && <p className="af-nota" role="status">{t.agenda.cargando}</p>}
              {agenda.estado === 'error' && (
                <>
                  <p className="af-error" role="alert">{t.agenda.errorCarga}</p>
                  <button type="button" className="boton boton-secundario af-cta" onClick={cargarTurnos}>{t.agenda.reintentar}</button>
                </>
              )}
              {agenda.estado === 'listo' && agenda.dias.length === 0 && (
                <p className="af-ayuda">
                  {t.agenda.sinCupos[0]}<b className="af-numero">{correo}</b>{t.agenda.sinCupos[1]}
                </p>
              )}
              {agenda.estado === 'listo' && agenda.dias.length > 0 && (
                <>
                  <p className="af-mono">{t.agenda.dia}</p>
                  <div className="af-dias">
                    {agenda.dias.map((d) => (
                      <button key={d.fecha} type="button" className={`af-dia${dia === d.fecha ? ' af-elegido' : ''}`} aria-pressed={dia === d.fecha} onClick={() => { setDia(d.fecha); setTurno(''); }}>
                        <span className="af-dia-nombre">{diaCorto(d.fecha, loc)}</span>
                        <span className="af-dia-num">{diaNum(d.fecha)}</span>
                      </button>
                    ))}
                  </div>
                  <p className="af-mono">{t.agenda.hora}</p>
                  <div className="af-horas">
                    {(agenda.dias.find((d) => d.fecha === dia)?.turnos ?? []).map((x) => (
                      <button key={x} type="button" className={`af-hora${turno === x ? ' af-elegido' : ''}`} aria-pressed={turno === x} onClick={() => setTurno(x)}>
                        {horaDe(x, loc)}
                      </button>
                    ))}
                  </div>
                  {errorAgenda && <p className="af-error" role="alert">{errorAgenda}</p>}
                  <button type="button" className="boton boton-primario af-cta" disabled={!turno || reservando} onClick={reservar}>
                    {reservando ? t.agenda.reservando : turno ? t.agenda.confirmar : t.agenda.elige}
                  </button>
                </>
              )}
            </div>
          </section>
        )}

        {fase === 'confirmado' && (
          <section className="af-cuerpo">
            <p className="af-kicker">{t.confirmado.kicker}</p>
            <h1 className="af-titulo">
              {t.confirmado.h1(diaLargo(turno, loc), horaDe(turno, loc))[0]}
              <span className="af-calido">{t.confirmado.h1(diaLargo(turno, loc), horaDe(turno, loc))[1]}</span>
            </h1>
            <p className="af-ayuda">
              {t.confirmado.ayuda[0]}<b>{t.confirmado.ayuda[1]}</b>{t.confirmado.ayuda[2]}
            </p>
            <Preparar t={t.preparar} />
          </section>
        )}

        {fase === 'resultado' && resultado && resultado.categoria === 'C' && (
          <section className="af-cuerpo">
            <p className="af-kicker">{t.resultado.recibida}</p>
            <h1 className="af-titulo">{t.evaluacion.gracias(primerNombre)}</h1>
            <VideoFunnel video={VIDEO_EVALUACION} idioma={idioma} enGrabacion={tx.video.evaluacion} sinSoporte={tx.video.sinSoporte} />
            <p className="af-ayuda">{t.evaluacion.ayuda}</p>
            <p className="af-ayuda">
              {t.evaluacion.escribenos[0]}<b className="af-numero">{correo}</b>{t.evaluacion.escribenos[1]}
            </p>
            <a className="boton boton-secundario af-cta" href={`https://www.instagram.com/${instagram}/`} target="_blank" rel="noopener noreferrer">
              {t.evaluacion.instagram(instagram)}
            </a>
          </section>
        )}

        {import.meta.env.DEV && resultado && fase !== 'form' && (
          <details className="af-interno">
            <summary>Vista interna (solo en desarrollo)</summary>
            <p>
              Categoría <b>{resultado.categoria}</b> · prioridad <b>{resultado.prioridad}</b> de 28 · moneda {moneda} · idioma {idioma}
            </p>
            <p>{resultado.motivo}</p>
          </details>
        )}
      </div>
    </div>
  );
}

function Preparar({ t }: { t: Textos['aplicacion']['preparar'] }) {
  return (
    <div className="af-panel">
      <p className="af-panel-titulo">{t.titulo}</p>
      <ol className="af-lista">
        {t.items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ol>
    </div>
  );
}
