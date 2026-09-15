# Praxia

Landing en español para Praxia, con identidad suministrada por el usuario y una composición inspirada en COSMOQ.

## Abrir el proyecto en tu computadora

1. Descomprime el ZIP y abre una terminal dentro de la carpeta `praxia`.
2. Si tienes Python 3, ejecuta `python3 -m http.server 8000 --directory dist` (en Windows también puedes usar `py -m http.server 8000 --directory dist`).
3. Abre `http://localhost:8000` en tu navegador.

También puedes abrir la carpeta `dist` con Live Server de Visual Studio Code, o subir su contenido a cualquier alojamiento estático. Usa un servidor local: abrir `index.html` directamente como archivo no permite cargar los módulos de animación. No requiere npm ni compilación.

## Usar este proyecto en GitHub

Descomprime el ZIP y usa el contenido de la carpeta `praxia` como raíz del repositorio. Incluye `README.md`, `.gitignore` y la carpeta `dist` completa, con sus imágenes y módulos. No subas el ZIP como sustituto de los archivos del proyecto.

El código es un sitio estático independiente. No necesita credenciales de Sites ni un archivo de dependencias. Para alojarlo, el directorio público es `dist`. Guardarlo en un repositorio y publicarlo como una web son pasos distintos.

## Entrega

Sitio estático en `dist/`. No requiere compilación. `index.html`, las hojas CSS y los módulos JavaScript contienen toda la experiencia.

- Un hook inicial, un carrusel de tres demos de automatización y el re-hook animado del hilo.
- Tres servicios y once rubros seleccionables.
- Proceso y preguntas desplegables.
- Formulario de cuatro pasos con validación; prepara un mensaje de WhatsApp al número comercial suministrado. La persona revisa y envía en WhatsApp. No almacena consultas ni utiliza un backend de formularios.
- Casos, métricas y conversaciones señalados como ilustrativos.
- No se incorporaron logos de clientes ni fotografías de equipo no proporcionadas.
- Marca original suministrada en `dist/assets/praxia-brand.png`. Fondo de portada original generado para este sitio en `dist/assets/praxia-horizon.png`.

## Verificación

Sintaxis JavaScript, existencia de archivos, anclas y referencias ARIA, identificadores únicos y etiquetas del formulario verificados. No se realizó QA del sitio en navegador. Las herramientas WebMCP opcionales tienen detección de soporte; validación en un contexto WebMCP compatible no disponible.

## Apertura con motion design

La apertura comienza con «Ya sabes qué quieres automatizar. Nosotros lo automatizamos», sobre el fondo de Praxia. Después aparece el carrusel con citas, cotizaciones y recordatorios. Las pestañas y las flechas permiten elegir el ejemplo; el contador anuncia el cambio y no hay avance automático. Las pestañas conservan navegación por teclado.

El re-hook deja el protagonismo al cordón: una sola frase acompaña cada momento del desanudado. «Cuando todo se cruza» da paso a «Cada proceso encuentra su lugar» y termina con «Y tu negocio empieza a fluir». No incluye botones, descripciones, etiquetas de tareas ni indicadores de pasos. Los textos cambian cuando están transparentes y se mueven suavemente.

El cordón conserva el grosor fino, el degradado azul, violeta, rosa y durazno y el recorrido del nudo. La escena lo presenta completo en el centro. Ambos extremos se prolongan fuera de la pantalla durante toda la secuencia, también cuando queda recto. Un punto luminoso recorre el hilo ordenado. El movimiento se detiene fuera de pantalla y no intercepta el scroll.

`intro.css` define el hero y los controles del carrusel; `app.js` gestiona los ejemplos. `knot-geometry.mjs` y `thread-mesh.mjs` definen el recorrido y la malla; `knot-webgl.mjs` aporta volumen, iluminación y profundidad con WebGL, sin dependencias externas. `knot-motion.mjs` y `knot-motion.css` sincronizan el re-hook. La malla solo se actualiza si cambia el recorrido o el tamaño. `prefers-reduced-motion` y la ausencia de WebGL muestran directamente el estado ordenado; el segundo caso dispone de un trazado estático en Canvas 2D. Sin JavaScript, la frase final acompaña una línea estática de ancho completo.

`page-motion.mjs` y `page-motion.css` añaden entradas breves de títulos y tarjetas, una entrada en perspectiva del panel y transiciones al cambiar servicios, rubros y conversaciones. Los elementos permanecen visibles sin JavaScript y las animaciones respetan la preferencia de movimiento reducido.

Validación de esta revisión: 36 estados de malla y 1206 comprobaciones de extremo a extremo en seis tamaños. Se comprobó que el recorrido del nudo y los tiempos de cambio de frase se conservan, que el cordón queda dentro del alto visible y que ambos extremos sobrepasan los bordes laterales. Los shaders reales compilaron y enlazaron en un contexto OpenGL ES fuera del navegador; se renderizaron 18 estados para revisar cruces, material y apertura. Referencias locales, anclas, ARIA y sintaxis JavaScript verificados. No se realizó QA del sitio en navegador.
