/**
 * La aplicación del funnel (/funnel/aplicar): una pregunta por pantalla, con
 * barra de progreso y reloj, como el prototipo "2 · Formulario filtro" del
 * lienzo. Al enviar, clasifica con la matriz de src/funnel.ts y muestra la
 * pantalla que toca: A y B → llamada o agenda; C → perfil en evaluación.
 *
 * Cada avance va a GHL por /api/funnel: el contacto se crea apenas deja sus
 * datos (pantalla 1), cada respuesta se guarda al pasar de pantalla y al enviar
 * se clasifica en el servidor. Así el equipo ve también a quien se queda a
 * medias. Los envíos van en cola, uno detrás de otro, y no frenan la pantalla.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import intlTelInput from 'intl-tel-input/intlTelInputWithUtils';
import { es } from 'intl-tel-input/locale';
import 'intl-tel-input/styles';
import './aplicacion-funnel.css';
import {
  HORAS_AGENDA,
  PREGUNTAS,
  clasificar,
  datoDelNegocio,
  enHorario,
  opcionesDe,
  type Moneda,
  type Respuestas,
  type Resultado,
} from '../../funnel';
import { guardarOrigen, leerOrigen } from '../../lib/origen';

const API_FUNNEL = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/api/funnel`;

type Iti = ReturnType<typeof intlTelInput>;
type Fase = 'form' | 'resultado' | 'llamada' | 'agenda' | 'confirmado';

interface Props {
  correo: string;
  instagram: string;
}

const TOTAL = PREGUNTAS.length + 2; // contacto + preguntas + cierre

function etiquetaAvance(i: number): string {
  if (i === TOTAL - 1) return 'Último paso';
  if (i === TOTAL - 2) return 'Última pregunta';
  const pct = i / TOTAL;
  if (pct < 0.3) return 'Buen comienzo';
  if (pct < 0.6) return 'Vas muy bien';
  return 'Ya casi terminas';
}


/** Los próximos cinco días hábiles, desde mañana. */
function proximosDias(): { clave: string; dia: string; num: number; largo: string }[] {
  const dias: { clave: string; dia: string; num: number; largo: string }[] = [];
  const d = new Date();
  while (dias.length < 5) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    dias.push({
      clave: d.toISOString().slice(0, 10),
      dia: d.toLocaleDateString('es-PE', { weekday: 'short' }).replace('.', ''),
      num: d.getDate(),
      largo: d.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' }),
    });
  }
  return dias;
}

export default function AplicacionFunnel({ correo, instagram }: Props) {
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
  const [dia, setDia] = useState('');
  const [hora, setHora] = useState('');
  const telRef = useRef<HTMLInputElement>(null);
  const itiRef = useRef<Iti | null>(null);
  const cimaRef = useRef<HTMLDivElement>(null);
  const trampaRef = useRef<HTMLInputElement>(null);
  const colaRef = useRef<Promise<unknown>>(Promise.resolve());
  const inicioRef = useRef(false);

  const moneda: Moneda = pais === 'pe' ? 'PEN' : 'USD';
  const dias = useMemo(proximosDias, []);

  // Si entró directo a /funnel/aplicar desde un anuncio, los UTM están acá.
  useEffect(guardarOrigen, []);

  /** Manda el estado actual a GHL. En cola, para que el contacto exista antes del siguiente paso. */
  function avisarCrm(evento: 'inicio' | 'paso' | 'fin', extra: { respuestas?: Respuestas; paso?: number } = {}) {
    const cuerpo = JSON.stringify({
      evento,
      nombre: nombre.trim(),
      telefono: typeof respuestas.telefono === 'string' ? respuestas.telefono : '',
      correo: email.trim(),
      pais,
      moneda,
      respuestas: extra.respuestas ?? respuestas,
      frase,
      compromiso,
      paso: extra.paso ?? paso,
      origen: leerOrigen(),
      web: trampaRef.current?.value ?? '',
    });
    colaRef.current = colaRef.current
      .then(() => fetch(API_FUNNEL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: cuerpo, keepalive: true }))
      .catch(() => {
        /* sin red: el visitante sigue; el siguiente paso vuelve a mandar todo */
      });
  }

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
      countryOrder: ['pe', 'us', 'mx', 'co', 'cl', 'ec', 'bo', 'ar', 'es'] as never,
      separateDialCode: false,
      countrySearch: true,
      countryNameLocale: 'es',
      uiTranslations: es,
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
  }, [fase, paso]);

  // Cada pantalla nueva arranca arriba.
  useEffect(() => {
    cimaRef.current?.scrollIntoView({ block: 'start' });
  }, [paso, fase]);

  const pregunta = paso >= 1 && paso <= PREGUNTAS.length ? PREGUNTAS[paso - 1] : null;
  const dato = useMemo(() => datoDelNegocio(respuestas, moneda), [respuestas, moneda]);

  function empezar() {
    const iti = itiRef.current;
    if (!nombre.trim()) return setErrorContacto('Escribe tu nombre.');
    if (!telRef.current?.value.trim()) return setErrorContacto('Escribe tu WhatsApp.');
    if (iti && !iti.getSelectedCountry()) return setErrorContacto('Empieza tu WhatsApp con el código de tu país: 51 si es de Perú.');
    if (iti && iti.isValidNumber() === false) return setErrorContacto('Revisa tu WhatsApp: le falta o le sobra algún número.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErrorContacto('Revisa tu correo.');
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
    const lead = { nombre, email, pais, moneda, respuestas, frase, compromiso, ...res, enviado: new Date().toISOString() };
    try {
      sessionStorage.setItem('praxia-funnel-lead', JSON.stringify(lead));
    } catch {
      /* sin almacenamiento: la pantalla sigue igual */
    }
    avisarCrm('fin');
    setResultado(res);
    setFase('resultado');
  }

  const primerNombre = nombre.trim().split(/\s+/)[0] || '';

  return (
    <div className="af" ref={cimaRef}>
      <div className="af-cielo" aria-hidden="true" />
      <div className="af-marco">
        <header className="af-cabecera">
          <span className="af-logo">
            Praxia<span className="af-logo-punto">.</span>
          </span>
        </header>

        {fase === 'form' && (
          <>
            <div
              className="af-progreso"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={TOTAL}
              aria-valuenow={paso + 1}
              aria-label={`Paso ${paso + 1} de ${TOTAL}`}
            >
              {Array.from({ length: TOTAL }, (_, i) => (
                <span key={i} className={`af-seg${i <= paso ? ' af-seg-lleno' : ''}`} />
              ))}
            </div>
            {paso > 0 && (
              <div className="af-avance">
                <span>{etiquetaAvance(paso)}</span>
                <span className="af-avance-num">
                  <b>{Math.round((paso / TOTAL) * 100)}%</b> · {paso + 1} de {TOTAL}
                </span>
              </div>
            )}
          </>
        )}

        {fase === 'form' && paso === 0 && (
          <section className="af-cuerpo">
            <h1 className="af-titulo">
              Aplica a tu <span className="af-calido">diagnóstico gratis</span>
            </h1>
            <p className="af-ayuda">Unas preguntas rápidas para saber cómo ayudarte.</p>
            <p className="af-tiempo">Tiempo estimado: 2 minutos</p>
            <form
              className="af-campos"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                empezar();
              }}
            >
              <label className="af-label" htmlFor="af-nombre">Nombre</label>
              <input id="af-nombre" className="af-input" autoComplete="given-name" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <label className="af-label" htmlFor="af-tel">WhatsApp</label>
              <input id="af-tel" ref={telRef} className="af-input" type="tel" autoComplete="tel" placeholder="51 997 872 779" defaultValue={typeof respuestas.telefono === 'string' ? respuestas.telefono : ''} />
              <p className="af-pista">Empieza con el código de tu país (51 si es de Perú): la bandera se pone sola.</p>
              <label className="af-label" htmlFor="af-correo">Correo</label>
              <input id="af-correo" className="af-input" type="email" autoComplete="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              {/* Trampa para bots: invisible para personas y lectores de pantalla. */}
              <input ref={trampaRef} name="web" className="af-trampa" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              {errorContacto && <p className="af-error" role="alert">{errorContacto}</p>}
              <button type="submit" className="boton boton-primario af-cta">
                Empezar <span aria-hidden="true">→</span>
              </button>
              <p className="af-nota">Tus datos no se tocan.</p>
            </form>
          </section>
        )}

        {fase === 'form' && pregunta && (
          <section className="af-cuerpo" key={pregunta.id}>
            {/* «¿Sabías que…?»: justo después de clientes, ticket y fines de semana. */}
            {pregunta.id === 'decide' && dato && (
              <aside className="af-dato" aria-label="Un dato de tu negocio">
                <p className="af-dato-titulo">¿Sabías que…?</p>
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
                <p>Marcaste que eres dueño o gerente general. ¿Igual la decisión la toma otra persona?</p>
                <div className="af-confirmar-botones">
                  <button type="button" className="af-opcion" onClick={() => { setConfirmarDecide(false); setRespuestas((r) => ({ ...r, decide: 'otra' })); setPaso((p) => p + 1); }}>
                    Sí, la toma otra persona
                  </button>
                  <button type="button" className="af-opcion" onClick={() => setConfirmarDecide(false)}>
                    No, me equivoqué
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
                  Continuar
                </button>
              </>
            )}

            <button type="button" className="af-atras" onClick={() => { setConfirmarDecide(false); setPaso((p) => p - 1); }}>
              ‹ Atrás
            </button>
          </section>
        )}

        {fase === 'form' && paso === TOTAL - 1 && (
          <section className="af-cuerpo">
            <h1 className="af-titulo">
              En una frase: <span className="af-calido">¿cómo te podríamos ayudar?</span>
            </h1>
            <label className="af-label" htmlFor="af-frase">Opcional, pero nos ayuda mucho</label>
            <textarea
              id="af-frase"
              className="af-input af-textarea"
              rows={4}
              placeholder="Ej.: necesitamos una web que aparezca en Google y que no se nos pierdan las consultas"
              value={frase}
              onChange={(e) => setFrase(e.target.value)}
            />
            <label className="af-compromiso">
              <input type="checkbox" checked={compromiso} onChange={(e) => setCompromiso(e.target.checked)} />
              <span>Me comprometo a estar en la llamada de 15 minutos con quien decide.</span>
            </label>
            <button type="button" className="boton boton-primario af-cta" disabled={!compromiso} onClick={enviar}>
              Enviar aplicación
            </button>
            <button type="button" className="af-atras" onClick={() => setPaso((p) => p - 1)}>
              ‹ Atrás
            </button>
          </section>
        )}

        {fase === 'resultado' && resultado && resultado.categoria !== 'C' && (
          <section className="af-cuerpo">
            <p className="af-kicker">Aplicación recibida</p>
            <h1 className="af-titulo">
              {primerNombre ? `${primerNombre}, tu caso ` : 'Tu caso '}
              <span className="af-calido">encaja con lo que hacemos.</span>
            </h1>
            <div className="af-video">
              <span className="chip-mono">Video en grabación · aprobados</span>
            </div>
            {enHorario() ? (
              <div className="af-panel">
                <p className="af-panel-titulo">¿Podemos llamarte en la próxima hora?</p>
                <p className="af-ayuda">Una llamada corta de alguien del equipo para entender tu situación.</p>
                <div className="af-panel-botones">
                  <button type="button" className="boton boton-primario" onClick={() => setFase('llamada')}>Sí, llámenme</button>
                  <button type="button" className="boton boton-secundario" onClick={() => setFase('agenda')}>Prefiero elegir día y hora</button>
                </div>
              </div>
            ) : (
              <div className="af-panel">
                <p className="af-panel-titulo">Ahora estamos fuera de horario.</p>
                <p className="af-ayuda">Elige el día y la hora que te acomoden y te llamamos ahí.</p>
                <button type="button" className="boton boton-primario af-cta" onClick={() => setFase('agenda')}>Elegir día y hora</button>
              </div>
            )}
          </section>
        )}

        {fase === 'llamada' && (
          <section className="af-cuerpo">
            <p className="af-kicker">Listo</p>
            <h1 className="af-titulo">
              Te llamamos <span className="af-calido">en la próxima hora.</span>
            </h1>
            <p className="af-ayuda">
              Te va a llamar alguien del equipo. Ten el celular a la mano y <b>contesta aunque no reconozcas el número</b>.
            </p>
            <Preparar />
          </section>
        )}

        {fase === 'agenda' && (
          <section className="af-agenda">
            <div className="af-agenda-lado">
              <h1 className="af-titulo">
                Elige día y hora <span className="af-calido">para tu diagnóstico</span>
              </h1>
              <div className="af-aviso">
                <span className="af-aviso-punto" aria-hidden="true" />
                <p>
                  Te atiende el equipo que construye. <b>Pocos cupos por semana:</b> elige el tuyo antes de que cierre la agenda.
                </p>
              </div>
              <ul className="af-datos">
                <li>15 minutos</li>
                <li>Videollamada (o WhatsApp si prefieres)</li>
                <li>Sin costo. Si no tiene sentido, te lo decimos.</li>
                <li>Sales con un plan: qué automatizar, precio y plazo.</li>
              </ul>
            </div>
            <div className="af-agenda-tarjeta">
              <p className="af-mono">Día</p>
              <div className="af-dias">
                {dias.map((d) => (
                  <button key={d.clave} type="button" className={`af-dia${dia === d.clave ? ' af-elegido' : ''}`} aria-pressed={dia === d.clave} onClick={() => setDia(d.clave)}>
                    <span className="af-dia-nombre">{d.dia}</span>
                    <span className="af-dia-num">{d.num}</span>
                  </button>
                ))}
              </div>
              <p className="af-mono">Hora de Lima</p>
              <div className="af-horas">
                {HORAS_AGENDA.map((h) => (
                  <button key={h} type="button" className={`af-hora${hora === h ? ' af-elegido' : ''}`} aria-pressed={hora === h} onClick={() => setHora(h)}>
                    {h}
                  </button>
                ))}
              </div>
              <button type="button" className="boton boton-primario af-cta" disabled={!dia || !hora} onClick={() => setFase('confirmado')}>
                {dia && hora ? 'Confirmar' : 'Elige día y hora'}
              </button>
              {import.meta.env.DEV && <p className="af-nota af-mono">Horarios de ejemplo: falta conectar el calendario real.</p>}
            </div>
          </section>
        )}

        {fase === 'confirmado' && (
          <section className="af-cuerpo">
            <p className="af-kicker">Agendado</p>
            <h1 className="af-titulo">
              Te esperamos el <span className="af-calido">{dias.find((d) => d.clave === dia)?.largo}, a las {hora}</span>
            </h1>
            <p className="af-ayuda">
              A esa hora te llama alguien del equipo: <b>atento al celular, aunque no reconozcas el número</b>. La confirmación te llega a tu correo.
            </p>
            <Preparar />
          </section>
        )}

        {fase === 'resultado' && resultado && resultado.categoria === 'C' && (
          <section className="af-cuerpo">
            <p className="af-kicker">Aplicación recibida</p>
            <h1 className="af-titulo">
              Gracias por contarnos de tu negocio{primerNombre ? `, ${primerNombre}` : ''}.
            </h1>
            <div className="af-video">
              <span className="chip-mono">Video en grabación · perfil en evaluación</span>
            </div>
            <p className="af-ayuda">
              Ya tenemos tu perfil y lo vamos a evaluar. Ahora mismo tenemos la agenda muy cargada, así que todavía no podemos contactarte. Tu perfil queda guardado con nosotros.
            </p>
            <p className="af-ayuda">
              Si quieres darnos más detalles o hacer seguimiento, escríbenos a <b className="af-numero">{correo}</b>.
            </p>
            <a className="boton boton-secundario af-cta" href={`https://www.instagram.com/${instagram}/`} target="_blank" rel="noopener noreferrer">
              Sígueme en Instagram: @{instagram}
            </a>
          </section>
        )}

        {import.meta.env.DEV && resultado && fase !== 'form' && (
          <details className="af-interno">
            <summary>Vista interna (solo en desarrollo)</summary>
            <p>
              Categoría <b>{resultado.categoria}</b> · prioridad <b>{resultado.prioridad}</b> de 28 · moneda {moneda}
            </p>
            <p>{resultado.motivo}</p>
          </details>
        )}
      </div>
    </div>
  );
}

function Preparar() {
  return (
    <div className="af-panel">
      <p className="af-panel-titulo">Para que la llamada te rinda, ten a la mano:</p>
      <ol className="af-lista">
        <li>Las tareas que más tiempo le quitan a tu equipo.</li>
        <li>Qué herramientas usan hoy: WhatsApp, Excel, el sistema que sea.</li>
        <li>Si decides con un socio, que esté en la llamada.</li>
      </ol>
    </div>
  );
}
