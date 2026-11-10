# Ciudades del programa SEO: criterio, fuentes y cruces (10-nov-2026)

**Criterio para entrar a la lista:** ciudad con plata (mercado grande o un rubro rico) **y** presencia real de al menos
dos de los ocho nichos del ICP, en los mercados de arranque (Latinoamérica y latinos en EE. UU.). En EE. UU. pesa además
cuántos hispanos viven ahí, porque el contenido va en español.

**Regla:** todas se atienden en remoto. Ninguna página dice ni sugiere que haya oficina fuera de Laurel Rosa 248, Surquillo.

## Lista y fuentes

| Ciudad | Dato verificado (fuente primaria) | Verificado | Nichos fuertes |
|---|---|---|---|
| Lima | Lima Metropolitana, la provincia más poblada del Perú: 9,6 millones (INEI, Censos Nacionales 2025, nota del 10-jul-2026) | Sí | inmobiliarias, clínicas, concesionarias, abogados, constructoras, wellness, ecommerce |
| Arequipa | Supera el millón de personas y es de las provincias que más crecieron entre 2017 y 2025: 2,0 % anual (INEI, misma nota) | Sí | minería, constructoras, inmobiliarias |
| Trujillo | Supera el millón de personas (INEI, misma nota) | Sí | minería, clínicas, concesionarias |
| Ciudad de México | 9 209 944 habitantes (INEGI, Censo 2020, comunicado 98/21) | Sí | ecommerce, inmobiliarias, clínicas, abogados |
| Monterrey | Municipio más poblado de Nuevo León: 1 142 994 habitantes (INEGI, Censo 2020, comunicado 40/21) | Sí | constructoras, concesionarias, inmobiliarias |
| Bogotá | Capital de Colombia. El DANE publica proyecciones por localidad, pero no encontramos la cifra en texto | **No** | clínicas, abogados, ecommerce |
| Medellín | El DANE publica gráficos de proyección para Medellín sin cifra en texto | **No** | wellness, clínicas |
| Santiago | Región Metropolitana: 7 400 741 personas, 40 % del país (INE Chile, Censo 2024, síntesis de resultados) | Sí | minería (contratistas con casa matriz), constructoras, inmobiliarias |
| Miami | Miami-Dade: 70,3 % hispanos (2 838 461 habitantes); ciudad de Miami: 487 014 (Census Bureau, estimaciones al 1-jul-2024) | Sí | wellness, ecommerce, inmobiliarias |
| Houston | Condado de Harris: 45,0 % hispanos; ciudad: 2 390 125 (Census Bureau, 1-jul-2024) | Sí | constructoras, concesionarias, clínicas |
| Los Ángeles | Condado de Los Ángeles: 48,8 % hispanos; ciudad: 3 878 704 (Census Bureau, 1-jul-2024) | Sí | wellness, ecommerce |
| Dallas | Condado de Dallas: 42,3 % hispanos; ciudad: 1 326 087 (Census Bureau, 1-jul-2024) | Sí | inmobiliarias, constructoras |
| Nueva York | Ciudad: 8 478 072 habitantes, 28,7 % hispanos (suma de los cinco condados; Census Bureau, 1-jul-2024) | Sí | abogados, ecommerce |

**Contradicción reportada (Perú):** el INEI da para Lima Metropolitana 9,6 millones en la nota de resultados censales
del 10-jul-2026 y 10 129 708 en otra nota del mismo año. Las páginas usan la de 9,6 millones («la provincia más poblada
del país») y no citan la otra hasta que se aclare cuál es población censada y cuál estimada.

**Cómo se verificó EE. UU.:** archivos oficiales `sub-est2024.csv` (población por ciudad) y
`cc-est2024-alldata-<estado>.csv` (población hispana por condado, YEAR 6 = 1-jul-2024) de www2.census.gov. QuickFacts
y la API del Census no se pudieron leer en automático (verificación anti-bots y API con llave), así que el dato hispano
es del **condado**, no de la ciudad.

URLs:
- INEI: https://www.gob.pe/institucion/inei/noticias/1417313-censos-nacionales-2025-lima-metropolitana-continua-siendo-la-provincia-mas-poblada
- INEGI CDMX: https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2021/EstSociodemo/ResultCenso2020_CdMx.pdf
- INEGI Nuevo León: https://inegi.org.mx/contenidos/saladeprensa/boletines/2021/EstSociodemo/ResultCenso2020_NL.pdf
- INE Chile: https://censo2024.ine.gob.cl/wp-content/uploads/2025/12/sintesis_resultados_censo2024.pdf
- DANE: https://www.dane.gov.co/index.php/estadisticas-por-tema/demografia-y-poblacion/proyecciones-de-poblacion
- Census, ciudades: https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/cities/totals/sub-est2024.csv
- Census, condados: https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/counties/asrh/

## Cruces nicho × ciudad aprobados (28)

Solo donde el rubro tiene peso real en esa ciudad. No se llena la matriz.

| Ciudad | Cruces |
|---|---|
| Lima | inmobiliarias, clínicas, concesionarias, abogados, wellness |
| Arequipa | minería, constructoras |
| Trujillo | minería, clínicas |
| Ciudad de México | ecommerce, inmobiliarias, clínicas |
| Monterrey | constructoras, concesionarias |
| Bogotá | clínicas, abogados |
| Medellín | wellness |
| Santiago | minería, inmobiliarias |
| Miami | wellness, ecommerce, inmobiliarias |
| Houston | constructoras, concesionarias |
| Los Ángeles | wellness, ecommerce |
| Dallas | inmobiliarias |
| Nueva York | abogados |

Archivo de cada cruce: `src/content/nicho-ciudad/<nicho>--<ciudad>.md` (slugs de ciudad: `lima`, `arequipa`,
`trujillo`, `ciudad-mexico`, `monterrey`, `bogota`, `medellin`, `santiago`, `miami`, `houston`, `los-angeles`,
`dallas`, `nueva-york`).
