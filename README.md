# Participación Ciudadana — I.E. José Antonio Aguilera

Plataforma educativa interactiva sobre los **Mecanismos de Participación
Ciudadana en Colombia**, construida como proyecto SENA. Pensada para que
la profesora la proyecte en clase: no requiere cuentas, servidor ni base
de datos — es un sitio 100% estático (HTML + CSS + JS).

---

## 1. Cómo abrirlo

**Opción rápida:** haz doble clic en `index.html`. Todo el sitio funciona
abriendo el archivo directamente en el navegador (Chrome, Edge, Firefox).

**Opción recomendada (evita advertencias de algunos navegadores):**
sirve la carpeta con un servidor local simple. Por ejemplo, con Python
instalado, desde la carpeta del proyecto:

```
python -m http.server 8000
```

y luego abre `http://localhost:8000` en el navegador.

---

## 2. Estructura del proyecto

```
participacion-ciudadana/
├── index.html              → Página principal
├── pages/
│   ├── aprender.html        → Los 8 mecanismos con filtros
│   └── quiz.html             → Configuración + actividad del quiz
├── css/                      → Un archivo por responsabilidad (ver abajo)
├── js/
│   ├── main.js                → Conecta datos con componentes por página
│   ├── theme.js               → Modo claro/oscuro (localStorage)
│   ├── navigation.js          → Navbar activo + menú hamburguesa
│   ├── modal.js                → Modal de información de un mecanismo
│   ├── quiz/                   → Motor del quiz (config, engine, timer, score, ui, orquestador)
│   └── components/             → navbar, cards, buttons, animations, icons
├── data/
│   ├── mecanismos/             → Un archivo por mecanismo + index.js agregador
│   ├── preguntas/               → Banco de opción múltiple (por dificultad) + agregador
│   └── preguntas-abiertas/      → Banco de preguntas abiertas (respuesta libre) + agregador
├── assets/
│   ├── logo/                    → Aquí va logo-colegio.png (ver más abajo)
│   ├── images/
│   └── icons/
└── README.md
```

**Regla de oro del proyecto:** el contenido (preguntas, información de
mecanismos) vive en `data/`, separado del código de interfaz. Para
cambiar un texto nunca necesitas tocar HTML ni la lógica del quiz.

---

## 3. Cómo cambiar los colores (marca del colegio)

Todo el color y la tipografía salen de **un único archivo**:

```
css/variables.css
```

Ahí encontrarás variables como:

```css
--color-primary: #C41E2E;      /* rojo institucional */
--color-secondary: #1E63B0;    /* azul */
--color-accent: #F2B705;       /* amarillo */
--color-success: #2E9E5B;      /* verde */
```

Cambia esos valores hexadecimales y el cambio se refleja en todo el
sitio (navbar, botones, tarjetas, quiz, modo claro y oscuro).

---

## 4. Cómo cambiar el logo

1. Consigue el escudo real del colegio en PNG (idealmente fondo
   transparente, cuadrado).
2. Guárdalo exactamente como:
   ```
   assets/logo/logo-colegio.png
   ```
3. Listo — el navbar y el footer lo detectan automáticamente. Si el
   archivo no existe, el sitio muestra un placeholder con las iniciales
   "JAA" para que nunca se vea un ícono roto.

---

## 5. Sistema de tarjetas interactivas (flip 3D)

Los 8 mecanismos se muestran como **tarjetas que giran en 3D** al hacer
clic (efecto "card flip"): la portada muestra el ícono, el nombre y la
idea clave; al girar aparece un resumen corto, la idea clave destacada
y un botón **"Ver información completa"** que abre el mismo modal
detallado de siempre (no se eliminó nada, solo se agregó una
introducción visual antes de la información completa).

- **Dónde viven los datos:** los campos `resumenCarta` e `ideaClave`
  de cada tarjeta están en los mismos archivos de siempre
  (`data/mecanismos/*.js`), junto a `nombre`, `icono` y `color`. No
  hay un archivo de datos separado para las tarjetas.
- **Cómo funciona el giro:** `js/components/cards.js` construye cada
  tarjeta desde los datos y usa CSS 3D (`perspective`,
  `transform-style: preserve-3d`, `backface-visibility: hidden`) para
  el efecto, definido en `css/cards.css`.
- **Accesibilidad:** cada tarjeta es un `div[role="button"]` enfocable
  por teclado (Enter/Espacio la gira); si el usuario tiene activada la
  reducción de movimiento (`prefers-reduced-motion`), el giro 3D se
  reemplaza automáticamente por un cambio de opacidad más simple.
- **Cómo cambiar el texto de una tarjeta:** edita `resumenCarta` o
  `ideaClave` en el archivo del mecanismo correspondiente dentro de
  `data/mecanismos/`.
- **Cómo cambiar la duración o el estilo de la animación:** en
  `css/cards.css`, la propiedad `transition` de `.flip-card__inner`
  (por defecto `0.6s`, dentro del rango 0.5–0.7s recomendado).
- **Se conserva la identidad visual:** las tarjetas reutilizan
  `--mech-color` (definido por mecanismo) solo como acento sutil sobre
  el fondo de tarjeta existente (`--surface`) — no se introdujeron
  colores nuevos ni se rompió la paleta roja/dorada/azul del sitio.

## 6. Información general (marco legal, comparativas, glosario)

`pages/aprender.html` incluye una guía ampliada sobre participación
política y ciudadana, además de la información de cada mecanismo
individual (dentro del modal):

- Qué son y por qué son importantes.
- **Línea de tiempo del marco legal**: Constitución de 1991, Ley 134 de
  1994, Ley 1755 de 2015 y Ley 1757 de 2015.
- **Nota importante**: aclara que la acción de tutela y el derecho de
  petición NO son dos de los seis mecanismos regulados directamente por
  la Ley 1757 de 2015 (esos seis son: iniciativa popular, referendo,
  consulta popular, revocatoria del mandato, plebiscito y cabildo
  abierto), aunque se estudian junto a ellos por su relación con la
  participación ciudadana.
- Tabla comparativa "¿para qué sirve cada mecanismo?", incluyendo si
  implica o no una votación popular.
- **Casos prácticos** interactivos: "¿qué mecanismo usarías?" — cada
  tarjeta abre el modal del mecanismo relacionado al hacer clic.
- Derechos que protegen y quiénes pueden usarlos.
- **Buenas prácticas vs. errores frecuentes** de participación.
- Participación y control social (rendición de cuentas, veedurías).
- Datos curiosos.
- **Glosario** de términos básicos.
- Resumen final.

Todo ese contenido vive en un único archivo, separado de la interfaz:

```
data/general/info-general.js
```

Para editar cualquiera de esos textos (agregar un dato curioso, un
término al glosario, un caso práctico, etc.) basta con modificar ese
archivo. El componente `js/components/info-general.js` se encarga de
pintarlo automáticamente en la página — no hay que tocar HTML.

## 7. Cómo agregar un nuevo mecanismo

1. Copia un archivo existente como plantilla, por ejemplo:
   ```
   data/mecanismos/tutela.js  →  data/mecanismos/mi-nuevo-mecanismo.js
   ```
2. Cambia el `id`, `nombre`, `color`, `icono` y el resto de los campos
   (`queEs`, `paraQueSirve`, `caracteristicas`, etc.).
3. Si necesitas un ícono nuevo, agrégalo en `js/components/icons.js`
   (mismo formato: un `name` y su contenido SVG interno).
4. Enlaza el nuevo archivo `<script>` en `index.html`,
   `pages/aprender.html` y `pages/quiz.html`, justo antes de
   `data/mecanismos/index.js`.
5. Agrega la constante al arreglo `MECANISMOS` dentro de
   `data/mecanismos/index.js`.

El resto del sitio (tarjetas, modal, filtros, quiz) se actualiza solo:
no hay que tocar ningún componente.

---

## 8. Banco de preguntas

El proyecto incluye dos bancos de preguntas, seleccionables desde el
paso 2 de la configuración del quiz ("Tipo de pregunta"):

### a) Opción múltiple (120 preguntas)

15 por mecanismo (5 fáciles, 5 medias, 5 difíciles), con 4 opciones
(A–D) y la respuesta correcta marcada. Los estudiantes escriben el
número de la pregunta y la letra elegida; la profesora puede consultar
la **hoja de respuestas** (colapsada, botón "📋 Ver hoja de
respuestas") en la pantalla final para calificar rápido.

### b) Preguntas abiertas (409 preguntas)

Preguntas de respuesta libre, sin opciones, para que los estudiantes
respondan con sus propias palabras en el cuaderno o en una hoja. No
tienen una única respuesta correcta (muchas son de reflexión, opinión
o comparación), así que en este modo **no aparece** la hoja de
respuestas automática — la profesora evalúa con su propio criterio y
sigue usando el contador +/- para registrar cuántas respuestas
considera satisfactorias.

Cuando el texto de una pregunta abierta menciona claramente un
mecanismo específico, queda etiquetada para poder practicarse de forma
individual (botón "Practicar este mecanismo"); las preguntas
comparativas o generales no tienen mecanismo asignado y solo aparecen
en el pool general ("todos los mecanismos").

Para agregar más preguntas:

**Opción múltiple** — edita:
```
data/preguntas/preguntas-faciles.js
data/preguntas/preguntas-medias.js
data/preguntas/preguntas-dificiles.js
```
con esta estructura:
```javascript
{
  id: "tutela-016",              // único en todo el proyecto
  mecanismo: "tutela",           // debe coincidir con el id del mecanismo
  dificultad: "facil",           // "facil" | "media" | "dificil"
  pregunta: "¿...?",
  opciones: { A: "...", B: "...", C: "...", D: "..." },
  respuestaCorrecta: "B"
}
```

**Preguntas abiertas** — edita:
```
data/preguntas-abiertas/banco-base.js
data/preguntas-abiertas/banco-adicional.js
```
con esta estructura:
```javascript
{
  id: "abierta-410",             // único en todo el proyecto
  mecanismo: "tutela",           // o null si es general/comparativa
  tipo: "abierta",
  pregunta: "¿...?"
}
```

No necesitas tocar `js/quiz/quiz-engine.js` en ningún caso: el motor
lee automáticamente todo lo que exista en `data/preguntas/` y
`data/preguntas-abiertas/`.

**Importante:** el `id` de cada pregunta debe ser único dentro de su
propio banco; el sistema no depende de la posición en el arreglo.

---

## 9. Cómo cambiar la configuración del quiz

- **Tiempo predeterminado:** en `js/quiz/quiz-config.js`, cambia
  `tiempoSegundos: 120` (está en segundos).
- **Cantidades de preguntas disponibles (5/10/15/20):** en
  `js/quiz/quiz-ui.js`, arreglo `NUM_OPCIONES`.
- **Opciones de tiempo disponibles:** mismo archivo, arreglo
  `TIEMPO_OPCIONES`.
- **XP por respuesta correcta:** en `js/quiz/quiz-score.js`, constante
  `XP_POR_ACIERTO` (por defecto 100).

---

## 10. Cómo funciona la actividad en clase

1. La profesora abre `index.html` (o entra directo a **Quiz**).
2. Elige modalidad (individual o grupos), número de preguntas,
   dificultad y tiempo por pregunta.
3. Pulsa **🚀 Iniciar Quiz**.
4. Cada pregunta se proyecta en pantalla grande con sus 4 opciones
   (A–D) y un temporizador circular. Los estudiantes escriben el
   número de pregunta y la letra elegida en el cuaderno o en una hoja
   — la página no recoge respuestas.
5. Al terminar el tiempo (o si la profesora pulsa "Siguiente pregunta"),
   pasa automáticamente a la siguiente. No hay pantalla de revisión
   intermedia.
6. Al finalizar todas las preguntas, la profesora **registra
   manualmente** cuántas respuestas fueron correctas usando el
   contador +/-. La página calcula el porcentaje y el XP.
7. Botón **🔄 Nuevo Quiz** para repetir con preguntas distintas.

También se puede practicar un solo mecanismo: desde su tarjeta en
"Aprender", botón **Practicar este mecanismo** dentro del modal.

---

## 11. Modo claro / oscuro

El botón del navbar cambia el tema y lo guarda en `localStorage`, así
que la preferencia se mantiene si se vuelve a abrir la página. Ningún
dato personal se guarda: solo la preferencia de tema.

---

## 12. Privacidad

El sitio no recopila nombres, correos ni ningún dato personal de los
estudiantes. No usa analítica externa, no crea cuentas y no depende de
conexión a internet para funcionar (salvo la carga inicial de las
tipografías de Google Fonts referenciadas en `css/main.css`; si se
necesita uso 100% sin conexión, esas tipografías pueden reemplazarse
por fuentes del sistema quitando el `@import` de ese archivo).

---

## 13. Desplegar en un hosting estático gratuito

Al ser un sitio 100% estático, puede subirse tal cual a:

- **GitHub Pages:** sube la carpeta a un repositorio y activa Pages
  apuntando a la raíz.
- **Netlify / Vercel:** arrastra la carpeta del proyecto al panel de
  despliegue ("deploy manually" / drag and drop).

No requiere build, `npm install` ni configuración adicional.

---

## 14. Créditos

Proyecto educativo desarrollado para la **Institución Educativa José
Antonio Aguilera**, en el marco de un proyecto de formación del SENA
sobre Mecanismos de Participación Ciudadana en Colombia.
