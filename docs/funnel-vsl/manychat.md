# ManyChat: las mismas preguntas del funnel

La idea de Tony (19-oct-2026): el lead que llega por WhatsApp o Instagram en vez de llenar
la solicitud tiene que dejar los mismos datos, para que en el CRM todos se comparen igual.
Esto es la ficha para configurarlo. **Nada de esto está configurado todavía**, y lo que
dice de ManyChat no está verificado contra su documentación.

## Entrada

Todos los botones de WhatsApp de `/diagnostico-gratis` abren el chat con este texto ya
escrito:

> Hola Praxia, vi el video y quiero mi diagnóstico gratis.

La frase sale de `CONTEXTO.vsl` en `src/consts.ts`. Si ManyChat usa una palabra clave para
disparar el flujo, que sea esa frase o una parte fija de ella ("vi el video"). Si se cambia
en un lado, se cambia en el otro.

## Preguntas, en el mismo orden que la web

| # | Pregunta | Tipo | Campo del CRM | Valores que se guardan |
|---|---|---|---|---|
| 1 | ¿Cómo se llama tu negocio? | texto | `negocio` | libre |
| 2 | ¿De qué rubro es? | texto o botones | `rubro` | los nombres de `src/industrias.ts` u "Otro" |
| 3 | ¿Cuántas personas trabajan contigo? | botones | `equipo` | `Solo yo`, `2 a 10`, `11 a 50`, `Más de 50` |
| 4 | ¿Cuánto factura tu negocio al mes, aproximadamente? | botones | `facturacion_mensual` | `menos-10k`, `10k-30k`, `30k-100k`, `mas-100k`, `reservado` |
| 5 | ¿Qué te quita más tiempo hoy? | texto | `idea` | libre |
| 6 | ¿Para cuándo quieres tenerlo resuelto? | botones | `urgencia` | `este-mes`, `1-3-meses`, `explorando` |
| 7 | ¿Quién toma la decisión? | botones | `decisor` | `yo`, `con-socio`, `otra-persona` |
| 8 | ¿Cómo te llamas? | texto | `nombre` | libre |

El WhatsApp no se pregunta: ManyChat ya lo tiene. Textos visibles de los botones de
facturación: Menos de S/ 10 mil · S/ 10 mil a 30 mil · S/ 30 mil a 100 mil · Más de S/ 100 mil
· Prefiero no decirlo. Lo que se guarda es el valor de la columna derecha, no el texto.

## Cómo llega al CRM

Opción sugerida: al final del flujo, una petición externa (External Request) de ManyChat
que haga un POST a la API REST de Supabase, igual que el formulario web:

- URL: `https://jsqysebvhthnffmbjyzh.supabase.co/rest/v1/leads`
- Headers: `apikey` y `Authorization: Bearer` con la anon key, `Content-Profile: praxia_leads`,
  `Content-Type: application/json`
- Cuerpo: los campos de la tabla de arriba más `whatsapp` y `origen: "manychat-vsl"`.

La política RLS actual deja a `anon` insertar en `praxia_leads.leads`, así que no hace falta
otra llave. Requisito: la migración `crm-migracion.sql` tiene que estar aplicada; si no, el
POST con los tres campos nuevos falla.

## Por verificar antes de construirlo

- Que el número de Praxia esté conectado a ManyChat por la API de WhatsApp Business (si no,
  el flujo solo corre en Instagram o Messenger).
- Que el plan de ManyChat que tengan incluya External Request.
- Que el texto prellenado dispare la palabra clave tal como llega (con tildes).
