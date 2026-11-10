# Guía de contenido del programa SEO/AEO/GEO (nov 2026)

Para quien escriba páginas de `src/content/{nichos,nicho-proceso,nicho-ciudad,ciudades,blog,comparativas,calculadoras}`.
Las plantillas, el código y las imágenes no se tocan desde las sesiones de contenido.

## A quién le hablamos (ICP FINAL, 4-nov-2026)

Al **dueño o gerente que decide y paga**, en Latinoamérica o latino en Estados Unidos, con **un proceso manual que le
cuesta plata visible** (horas, ventas perdidas, clientes sin atender, multas). Compra por resultado, nunca por
tecnología. No le hablamos al curioso de la IA, al desarrollador ni al que quiere armar una agencia.

El copy **califica**: habla de negocios que ya venden y tienen volumen («si tu tienda ya vende», «si tu clínica atiende
decenas de pacientes por semana»). Al que no tiene volumen se le dice con naturalidad que primero conviene crecer.

Ocho rubros (slug → nombre): `mineria` contratistas mineros · `inmobiliarias` · `concesionarias` · `clinicas` clínicas
privadas · `constructoras` · `abogados` estudios de abogados · `wellness` spas, medspas y centros de bienestar de lujo
o de volumen · `ecommerce` tiendas online de lujo o de volumen. Foco de hoy: **ecommerce y wellness de lujo afuera**.

## Reglas duras (si una se rompe, la página no se publica)

1. **Nada inventado.** Ni clientes, ni testimonios, ni casos, ni cifras («el 73 % de las clínicas…»). Si un dato
   ayuda, va con fuente primaria enlazada (INEI, Census, DANE, INEGI, INE Chile, documentación oficial). Si no hay
   fuente, se describe la situación sin número.
2. **Sin plata.** Ni montos, ni rangos, ni «desde», ni «barato», ni «económico» (regla 6 de `CONTENIDO.md`). Los
   artículos «cuánto cuesta» explican **de qué depende** el precio y mandan al diagnóstico. Tampoco «no te cobramos de
   más» ni «no te estafamos».
3. **Demos de WhatsApp con negocios inventados.** El componente las etiqueta «Ejemplo». Nunca el nombre de un cliente
   real (XS+, De-Lows, PickaTop y cualquier otro van solo como caso, con OK escrito de Tony y `autorizado: true`).
   Entre 4 y 8 mensajes, horas que cuenten la historia (23:41 = de noche), sin montos.
4. **Sin oficinas falsas.** La única sede es Laurel Rosa 248, Surquillo, Lima. En las demás ciudades: «atendemos en
   remoto, por videollamada y WhatsApp».
5. **Sin jerga técnica.** «Responde a tus clientes a las 11 de la noche», no «agente conversacional con LLM».
6. **Palabras prohibidas:** transformación digital, sinergia, disrupción, ecosistema, solución integral, escalable,
   robusto, empoderar, potenciar, revolucionar, de última generación, end-to-end, seamless. Sin emojis en el cuerpo.
7. **Sin raya larga (—).** Usa punto, coma o dos puntos. Comillas angulares «así».
8. **De tú, español con jerga latina neutra.** «Dejarte tirado» sí; peruanismos puros, solo en páginas de Perú.
9. **Nada de frases que declaren honestidad** («te decimos con honestidad», «no es magia»): se muestra cómo trabajamos.
10. **Cada página trae algo propio:** el problema concreto de ese rubro o esa ciudad, su demo y sus preguntas. El
    script `npm run similitud` falla si dos páginas comparten más del 30 % de su contenido propio (todo lo que va
    dentro de `<main>` menos los bloques fijos de la plantilla marcados con `data-plantilla`: CTA, autor, enlaces del
    cluster). Las frases de cierre y las citas de fuentes también cuentan: varíalas entre páginas hermanas. No copies párrafos entre páginas
    cambiando el nombre del rubro: reescribe desde el problema.

## El diferenciador (va en el cuerpo cuando encaje, sin repetirlo palabra por palabra)

El miedo del dueño: «me cobran, me entregan algo que no entiendo y desaparecen». Lo desarmamos con hechos: lo dejamos
funcionando y seguimos contigo; todo por escrito (factura, contrato, alcance); te lo explicamos sin jerga, hasta con
audios; tres opciones (el completo, el que de verdad recomendamos y el que entra en tu presupuesto). «Llevamos la
tecnología a los negocios, no los negocios a la tecnología.» El bloque de cierre de la plantilla ya lo dice: en el
cuerpo, cuéntalo aplicado al rubro.

## Estructura de cada página

La plantilla pone sola: migas, H1 (`titulo`), respuesta, CTA a `/funnel`, TL;DR, portada, demo, preguntas, CTA de
cierre, autor y enlaces del cluster. **Tú escribes el frontmatter y el cuerpo.**

- `titulo` (H1) distinto de `seoTitulo` (≤ 70 caracteres, con la palabra clave al inicio).
- `seoDescripcion`: 70 a 165 caracteres, con el resultado que busca el dueño.
- `respuesta`: responde la búsqueda en 1 o 2 frases (60 a 420 caracteres). Es lo primero que lee Google y un LLM.
- `tldr`: 3 a 5 líneas, cada una una conclusión.
- `faq`: 3 a 8 preguntas reales de dueño, respuestas de 1 a 3 frases.
- Cuerpo en markdown: solo `##` y `###` (el H1 lo pone la plantilla), al menos **una tabla o lista**, párrafos cortos.
- Enlaces internos dentro del cuerpo: rutas absolutas sin UTM, por ejemplo `[citas para clínicas](/soluciones/clinicas/citas)`.
  Enlaza solo a páginas que existen o que están en el plan de tu bloque.
- Largo: nicho 700-1100 palabras · nicho × proceso 500-800 · ciudad y nicho × ciudad 500-800 · blog 700-1200 ·
  comparativa 700-1000 · calculadora 300-500 (más los campos).
- `fecha: 2026-11-10` (la del día que se escribe). `portadaAlt`: describe la escena de la portada.

## Plantillas de frontmatter

Copia el archivo más parecido que ya exista (`src/content/nichos/ecommerce.md` es la referencia) y cambia todo.

```yaml
# src/content/nicho-proceso/<nicho>--<proceso>.md     proceso: atencion|citas|seguimiento|documentos|reportes|contenido
nicho: "wellness"
proceso: "citas"
titulo: "…"
# …campos base (seoTitulo, seoDescripcion, respuesta, tldr, conversacion, faq, fecha, portadaAlt)

# src/content/nicho-ciudad/<nicho>--<ciudad>.md        solo cruces aprobados en docs/seo/ciudades.md
nicho: "wellness"
ciudad: "miami"

# src/content/blog/<slug>.md                          slug sin conectores: «cuanto-cuesta-chatbot-clinica»
nicho: "clinicas"          # opcional
ciudad: "bogota"           # opcional
proceso: "citas"           # opcional
tipo: "intencion"          # intencion|cuanto-cuesta|como|errores|checklist|guia

# src/content/comparativas/<slug>.md
nicho: "inmobiliarias"
proceso: "seguimiento"     # opcional

# src/content/calculadoras/<slug>.md                  resultado = producto de campos (porcentaje/100) × factor, por MES
nicho: "clinicas"
proceso: "citas"
factor: 1
resultado: "Lo que se te va al mes en citas que no llegan"
campos:
  - { id: "citas", etiqueta: "Citas agendadas al mes", ayuda: "Todas, de todos los profesionales", ejemplo: 400 }
  - { id: "noshow", etiqueta: "Porcentaje que no llega", ayuda: "Mira tu agenda del último mes", ejemplo: 12, porcentaje: true }
  - { id: "ticket", etiqueta: "Lo que deja una cita en promedio", ayuda: "Tu ticket promedio", ejemplo: 80, moneda: true }
```

## Antes de abrir el PR

```bash
npx astro check
npm run build
npm run similitud
```

Los tres en verde. Si `similitud` marca un par, reescribe la página más nueva desde su problema propio.
