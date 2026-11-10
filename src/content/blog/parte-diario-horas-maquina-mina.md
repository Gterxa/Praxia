---
nicho: "mineria"
proceso: "reportes"
tipo: "como"
titulo: "Cómo armar el parte diario de horas máquina en mina para que no te descuenten nada"
seoTitulo: "Parte diario de horas máquina en mina: cómo armarlo bien"
seoDescripcion: "Qué registrar en el parte diario de equipos en mina para cobrar todas tus horas: horómetro, operador, paradas con causa y evidencia del mismo turno."
respuesta: "Un buen parte diario de horas máquina en mina registra por equipo el horómetro de inicio y fin, el operador, las horas efectivas, cada parada con hora de inicio, fin, causa y foto, y la firma del responsable de la mina cuando corresponde. Si falta cualquiera de esos datos, la hora se discute en la valorización y casi siempre la pierdes tú."
tldr:
  - "El horómetro de inicio y fin es el dato base: sin él, todo lo demás se discute."
  - "Cada parada necesita su hora, su causa y, si se puede, una foto del momento."
  - "La conformidad del cliente en el mismo turno vale más que cualquier sustento posterior."
  - "Registrar en campo y revisar el mismo día evita la mayoría de descuentos."
conversacion:
  negocio: "Alquiler de Maquinaria Pesada Ccoyllur"
  mensajes:
    - de: "cliente"
      texto: "excavadora 03, horómetro final 8.452, operador Cárdenas"
      hora: "18:10"
    - de: "negocio"
      texto: "Registrado. El horómetro inicial fue 8.441, son 11 horas. El parte dice 1 hora de parada por voladura, ¿tienes la hora exacta?"
      hora: "18:10"
    - de: "cliente"
      texto: "de 12:30 a 13:30, mando foto del aviso de voladura"
      hora: "18:12"
    - de: "negocio"
      texto: "Recibida. Queda como parada no imputable con su foto. Falta la firma del supervisor de la mina en el parte de hoy."
      hora: "18:12"
faq:
  - pregunta: "¿Horas efectivas u horas a disposición?"
    respuesta: "Depende de tu contrato. Algunos pagan horas efectivas de trabajo y otros horas a disposición con un mínimo. Tu parte tiene que registrar lo que tu contrato usa para pagarte."
  - pregunta: "¿Qué hago si el horómetro está malogrado?"
    respuesta: "Regístralo como incidencia en el parte, con foto, y acuerda con el supervisor de la mina cómo se van a medir las horas mientras se repara. Ese acuerdo debe quedar por escrito."
  - pregunta: "¿La foto del horómetro sirve como sustento?"
    respuesta: "Ayuda mucho, sobre todo si tiene fecha y hora. Muchas contratistas la toman al inicio y al final de cada turno como práctica."
fecha: 2026-11-10
portadaAlt: "Primer plano del horómetro de una excavadora en el tablero de cabina con la mano de un operador sosteniendo un celular"
---

## Por qué se pierden horas

En los contratos de alquiler de equipos o de servicios con maquinaria, cobras lo que puedes sustentar. Y lo que se sustenta es lo que quedó escrito en el parte diario. Las horas se pierden por tres motivos:

- **Datos incompletos.** Falta el horómetro de inicio, el operador o la firma.
- **Paradas mal registradas.** «Parado por lluvia» sin hora ni duración.
- **Errores de transcripción.** El parte en papel estaba bien, pero en el Excel alguien escribió 8.425 en lugar de 8.452.

Cada uno de estos errores aparece en la valorización, semanas después, cuando ya nadie se acuerda de qué pasó ese día.

## Qué debe tener el parte, equipo por equipo

| Campo | Para qué sirve |
|---|---|
| Código del equipo | Identifica el equipo en tu contrato |
| Operador | Responsabilidad y control de horas del trabajador |
| Horómetro inicial y final | Base del cálculo de horas |
| Horas efectivas | Lo que trabajó realmente |
| Paradas: inicio, fin, causa | Separa lo imputable de lo no imputable |
| Evidencia de cada parada | Foto, aviso de voladura, orden de la mina |
| Combustible cargado | Control de consumo, si te lo piden |
| Firma o conformidad de la mina | Cierra la discusión antes de que empiece |

## Cómo registrar las paradas

Las paradas son el corazón de la discusión. Clasifícalas siempre con las mismas categorías, las que usa tu contrato. Por ejemplo: mantenimiento programado, falla mecánica, clima, voladura, falta de frente, orden del cliente, cambio de turno. Una categoría ambigua como «otros» es una invitación a que te descuenten.

Registra la parada cuando empieza, no al final del turno. Si el registro es desde el celular, la hora queda guardada sola.

## Revisa el mismo día

El mejor momento para corregir un error es el mismo día, cuando el supervisor y el operador todavía recuerdan lo que pasó. Un sistema que avise al cierre del turno («el horómetro final es menor que el inicial», «falta la causa de la parada de las 10:15») ahorra horas de discusión a fin de mes.

## Del papel al celular sin cambiar el formato

No hace falta cambiar el formato que te pide la mina. Lo que cambia es dónde se llena: en el celular del supervisor, con los mismos campos, funcionando sin señal. Al final del turno, el parte llega ordenado a la oficina, con las horas sumadas por equipo y las paradas clasificadas, listo para alimentar la [valorización automática](/blog/automatizar-valorizaciones-mineras).

Lee también los [errores más comunes en reportes diarios](/blog/errores-reportes-diarios-contratista-minero) o revisa [reportes para contratistas mineros](/soluciones/mineria/reportes).
