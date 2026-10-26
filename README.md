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
│   ├── aprender.html          → Los 8 mecanismos con filtros
│   ├── quiz.html               → Rol, configuración, cuestionario y resultados
│   ├── juegos.html              → Hub: enlaza los juegos siguientes
│   ├── crucigrama.html          → Crucigrama (único)
│   └── relacionar.html          → Relaciona los mecanismos (drag & drop)
├── css/                      → Un archivo por responsabilidad (ver abajo)
├── js/
│   ├── main.js                → Conecta datos con componentes por página
│   ├── theme.js               → Modo claro/oscuro (localStorage)
│   ├── navigation.js          → Navbar activo + menú hamburguesa
│   ├── modal.js                → Modal de información de un mecanismo
│   ├── quiz/                   → Motor del quiz (config, engine, timer, score, ui, orquestador)
│   ├── crossword/               → Motor del crucigrama (generator/game/nav/ui + controlador)
│   ├── matching/                 → Motor de "Relaciona los mecanismos"
│   └── components/             → navbar, cards, buttons, animations, icons, info-general
├── data/
│   ├── mecanismos/             → Un archivo por mecanismo + index.js agregador
│   ├── preguntas/               → Banco de opción múltiple (por dificultad) + agregador
│   ├── preguntas-abiertas/      → Banco de preguntas abiertas (respuesta libre) + agregador
│   ├── crossword/                → Banco de palabras/pistas del crucigrama
│   ├── matching/                  → Significados (medio/difícil) del juego de relación
│   └── general/                   → Información general (marco legal, glosario, etc.)
├── assets/
│   ├── logo/                    → Escudo institucional + favicon
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

El logo se muestra a 54px en el navbar (72px en el footer) con
`object-fit: contain` y fondo transparente (se ve bien en ambos temas).
Si quieres ajustar el tamaño, edita `.navbar__logo` en `css/navbar.css`
— la altura de la barra de navegación (`--navbar-height` en
`css/variables.css`) se ajusta con el resto del sitio automáticamente.

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

- **Tiempo predeterminado (maestro):** `js/quiz/quiz-config.js`, `tiempoSegundos: 120`
  (en segundos). El maestro también puede escribir un tiempo personalizado (10 a 1800 s).
- **Tiempo fijo del alumno:** `js/quiz/quiz-ui.js`, constante `TIEMPO_ALUMNO`
  (por defecto 120 s en opción múltiple y 300 s en preguntas abiertas).
- **Cantidades de preguntas (5/10/15/20):** `js/quiz/quiz-ui.js`, arreglo `NUM_OPCIONES`.
  El maestro puede además escribir una cantidad personalizada (1 a 60; límite en `QuizConfig.MAX_PREGUNTAS`).
- **Opciones de tiempo:** mismo archivo, arreglo `TIEMPO_OPCIONES`.
- **Máximo de grupos:** `QuizConfig.MAX_GRUPOS` (8). Las opciones del selector están en `NUM_GRUPOS_OPCIONES`.

---

## 10. Cómo funciona el quiz: roles, calificación y salida

Al abrir **Quiz** se elige un rol. **El rol organiza la actividad en la página;
no es un inicio de sesión ni una medida de seguridad** (el sitio es estático y no
tiene servidor: cualquier persona con conocimientos técnicos podría alterar el
comportamiento desde las herramientas del navegador).

### Modo alumno
1. Elige tipo de pregunta (opción múltiple o abiertas), cantidad (5/10/15/20) y dificultad.
   La modalidad **por grupos aparece bloqueada** («solo maestro»); el tiempo por pregunta
   es fijo y el alumno no puede pausarlo.
2. Una pregunta a la vez: selecciona una opción y pulsa **Confirmar respuesta**. La página
   indica con texto y color si fue correcta o incorrecta (y cuál era la correcta). Cada pregunta
   se cuenta una sola vez aunque se pulse varias veces.
3. Si el tiempo se agota, se registra la opción marcada (o «sin responder») y el cuestionario
   continúa solo tras unos segundos.
4. **Preguntas abiertas:** el alumno redacta su respuesta en un campo de texto y pulsa
   **Guardar y continuar** (no se admiten respuestas vacías; existe el botón explícito
   **Dejar sin responder**). Estas respuestas **no se califican automáticamente**: quedan
   «pendientes de revisión del maestro» y aparecen en el resumen final. No se usa inteligencia artificial.
5. Resultado: total, correctas, incorrectas, sin responder, porcentaje, nota de 1,0 a 5,0,
   resumen por pregunta y botón **Copiar resumen** (para entregarlo al maestro).

### Modo maestro
- Configura modalidad (individual o por grupos), tipo, cantidad (incluida personalizada), dificultad,
  tiempo por pregunta, orden aleatorio y sonido.
- Proyecta cada pregunta con temporizador circular y controles: **Pausar / Reanudar**
  (conserva el tiempo restante exacto), **Mostrar respuesta** (opción múltiple) y **Siguiente**.
  Al llegar a cero el aviso «¡TIEMPO!» queda en pantalla y el maestro decide cuándo continuar.
- **Por grupos:** se elige el número de grupos (2 a 8) y se les pone nombre. En cada pregunta el maestro
  otorga (o quita) el punto a los grupos que respondieron bien. Al final se muestra un ranking
  con puntos y nota por grupo.
- **Individual (respuestas en papel):** al terminar, el maestro registra cuántas fueron correctas con el
  contador +/- y la página calcula porcentaje y nota con la misma fórmula.

### Calificación (1,0 a 5,0)
```
Nota = 1,0 + (aciertos / preguntas calificables) × 4,0      (redondeada a 1 decimal)
```
Ejemplos: 75 % → 4,0 · 60 % → 3,4 · 0 % → 1,0 · 100 % → 5,0.
Solo las preguntas de opción múltiple son «calificables»; las no contestadas cuentan como no acertadas.
Si hubiera preguntas abiertas pendientes junto a preguntas objetivas, la nota se muestra como
**provisional**. Si no hay preguntas calificables, no se calcula nota. El antiguo sistema de XP
fue eliminado. Código: `js/quiz/quiz-score.js`.

### Salir del cuestionario
El botón **✕ Salir** abre una confirmación. **Continuar** conserva respuestas, pregunta y temporizador;
**Salir** descarta la partida, detiene el temporizador y vuelve a la pantalla de rol con una
configuración nueva. La siguiente partida genera otra selección y otro orden aleatorios.
Recargar la página, cerrar la pestaña o usar el botón «Atrás» durante la partida también piden confirmación.

### Aleatoriedad
Cada partida elige preguntas al azar del banco (sin repetir), mezcla su orden y mezcla las opciones
A–D conservando la relación con la respuesta correcta (se trabaja sobre copias: los bancos no se modifican).
Si con los filtros elegidos hay menos preguntas que las pedidas, la página avisa antes de iniciar y
el cuestionario se ajusta a la cantidad disponible.

### Limitaciones
- Nada se guarda: ni notas, ni respuestas, ni el rol (solo viven en memoria durante la partida).
  No hay registro académico centralizado ni sincronización entre dispositivos.
- El rol y los bloqueos del alumno son de interfaz (ver arriba): no impiden manipulación técnica.
- Los bancos no incluyen explicaciones por pregunta; si algún día se agrega un campo `explicacion`
  a una pregunta, se muestra automáticamente tras responder.
- Una partida contiene un solo tipo de pregunta (opción múltiple o abierta), según la configuración.
- Tras una partida, el botón «Atrás» del navegador puede requerir una pulsación extra
  (se añade una entrada de historial para poder pedir confirmación).

También se puede practicar un solo mecanismo: desde su tarjeta en
"Aprender", botón **Practicar este mecanismo** dentro del modal.

---

## 11. Juegos: crucigrama y relación

Hay dos actividades tipo juego (además del quiz), reunidas en `pages/juegos.html` y
enlazadas desde el ítem "Juegos" del navbar (que queda activo en las
tres páginas de juegos, no solo en el hub).

### 11.1. Crucigrama (original)

`pages/crucigrama.html`. Minijuego de crucigrama generado
automáticamente a partir de un banco de palabras y pistas, con
tarjetas de los 8 mecanismos que se activan solas según la palabra
seleccionada.

**Arquitectura (todo esto es GENÉRICO y lo reutiliza también el
segundo crucigrama — ver 11.2):**

```
data/crossword/crossword-data.js     -> banco de palabras + pistas (contenido)
js/crossword/crossword-generator.js  -> arma la cuadricula y cruza las palabras
js/crossword/crossword-game.js       -> puntuacion, respuestas, ayudas, comprobacion
js/crossword/crossword-ui.js         -> pinta tablero, tarjetas, pistas y estados
js/crossword/crossword.js            -> controlador: conecta todo lo anterior
css/crossword.css                    -> layout general (intro, stats, tablero+pistas)
js/crossword/crossword-nav.js        -> selección de palabra y teclado (lógica pura, sin DOM)
css/game-shell.css                   -> barra Salir, panel del maestro, pista activa
css/crossword-board.css              -> cuadricula, casillas y panel de pistas
```

La configuración (modalidad/tiempo/dificultad) y la pantalla de
resultado reutilizan los mismos estilos del quiz (`config-card`,
`option-grid`, `pill-group`, `result-stage` de `css/quiz.css`).

**Cómo agregar una palabra nueva:** abre
`data/crossword/crossword-data.js` y agrega un objeto:

```javascript
{
  word: "EJEMPLO",        // MAYUSCULAS, sin tildes ni espacios, unica
  clue: "Pista que vera el estudiante.",
  mechanism: "tutela",    // id de data/mecanismos, o null si es general
  difficulty: "facil"     // "facil" | "media" | "dificil"
}
```

**Puntuación:** +100 por palabra correcta, -20 por revelar una letra,
-50 por revelar una palabra completa, -10 por cada palabra marcada
como incorrecta al comprobar (nunca baja de 0).

**Casillas resueltas quedan bloqueadas de verdad:** en cuanto una
palabra queda correcta (o se revela), sus casillas pasan a
`input.readOnly = true` — no se pueden editar, borrar ni pegar texto
sobre ellas, ni con backspace/delete. Si esa casilla también pertenece
a otra palabra cruzada que aún no se ha resuelto, esa otra palabra
sigue siendo editable en sus demás casillas; solo la letra compartida
queda protegida (`celdaBloqueada()` en `crossword-game.js`). Si al
pulsar "Comprobar" una palabra completa resulta incorrecta, sus
letras se borran automáticamente (excepto las que ya pertenecen a un
cruce resuelto) para que pueda volver a intentarse.

**Nota jurídica:** la tutela y el derecho de petición aparecen como
palabras/derechos relacionados con la participación, pero no se
presentan como dos de los seis mecanismos que regula directamente la
Ley 1757 de 2015.

### 11.2. Selección, teclado y pistas del crucigrama

- Casilla de **una** palabra → se selecciona esa palabra. Casilla
  **compartida** → un segundo clic (o Espacio/Enter, o el botón
  «Cambiar a horizontal/vertical» del panel de la pista) alterna la
  dirección. El color indica la dirección activa (azul horizontal,
  rojo vertical) y la casilla muestra una flecha.
- Escribir rellena solo la palabra activa y avanza dentro de ella.
  Las flechas mueven el cursor (saltan huecos, no fallan en los bordes)
  y conservan la dirección cuando es posible. Retroceso borra la letra
  de la casilla; si está vacía, borra la anterior de la misma palabra.
- Las casillas muestran solo lo escrito y el número de referencia. Las
  pistas son descripciones/situaciones: **no pueden nombrar la
  respuesta ni otra respuesta del banco** (ver encabezado de
  `crossword-data.js`). Los nombres de los mecanismos no aparecen en el
  juego.
- Corrección importante en `crossword-generator.js`: antes, si una
  palabra candidata se descartaba, las casillas podían apuntar a otra
  palabra; ahora el índice es la posición real en `placements`.

### 11.3. Relaciona los Mecanismos (arrastrar y soltar, o clic)

`pages/relacionar.html`. Juego de relación: cada fila muestra el
significado de un mecanismo; el estudiante arrastra la ficha del
mecanismo correcto hasta esa fila. También funciona por clic/toque
(tocar una ficha y luego tocar la fila), para pantallas táctiles.

```
data/matching/matching-data.js  -> significados (medio/difícil) por mecanismo
js/matching/matching-game.js    -> colocar/quitar fichas, bloqueo, calificación
js/matching/matching-ui.js      -> pinta filas y fichas arrastrables
js/matching/matching.js         -> controlador: configuración, temporizador, flujo
css/matching.css                -> filas, casillas de destino y fichas
```

El nombre, ícono y color de cada mecanismo se toman de
`data/mecanismos` (no se duplican); `matching-data.js` solo aporta los
dos significados:

```javascript
{
  id: "referendo",              // debe coincidir con un id de data/mecanismos
  significadoMedio: "...",      // definición clara y educativa
  significadoDificil: "..."     // más técnica/jurídica, sin nombrar el mecanismo
}
```

**Reglas de colocación:** una relación correcta queda bloqueada de
inmediato (no se puede volver a mover). Una relación incorrecta se
marca en rojo y puede corregirse — arrastrando otra ficha sobre esa
fila, o tocándola para liberarla — y la ficha vuelve a estar
disponible en la bolsa de opciones.

**Calificación (1.0 a 5.0):** `calcularCalificacion(correctas, total)`
en `matching-game.js` usa `1 + (correctas/total) × 4`, redondeada a
un decimal — 0% da exactamente 1.0 y 100% da exactamente 5.0.

**Tiempo:** sin límite (cuenta hacia arriba) o 10/15/20 minutos
(cuenta regresiva; al llegar a 00:00 finaliza automáticamente con lo
que se alcanzó a responder).

### 11.3.1. Rediseño del juego de relacionar

Dos columnas compactas (significados con su casilla · mecanismos
disponibles; en teléfono, lista vertical con bandeja fija abajo).
Arrastre con Pointer Events (ratón, lápiz y táctil) o selección por
clic/toque en cualquier orden. Un mecanismo solo puede estar en un
significado; se puede mover, intercambiar o quitar. **No hay
aciertos/errores a la vista durante la partida**: se califican al pulsar
«Comprobar y finalizar». El alumno no ve las respuestas correctas; el
maestro puede mostrarlas al final.

### 11.4. Modo alumno / maestro, salida y página de Juegos

**Modo.** Antes de cada juego se elige alumno o maestro. Es solo
organización de la actividad en una página estática: **no es
autenticación** y no protege nada. El alumno recibe valores fijos y no
tiene controles administrativos en el DOM. El maestro configura
(modalidad/tiempo/dificultad), puede **pausar/reanudar**, consultar la
solución (se construye solo al pedirla) y **terminar** la actividad.

**Salir.** Todos los juegos tienen botón «Salir» con aviso «¿Salir del
juego?» (Continuar / Salir). `js/game-shell.js` (`RCGame.session`)
registra intervalos, temporizadores y oyentes de la partida y los libera
al terminar o salir; también pide confirmación al pulsar enlaces
internos y al usar «Atrás», y activa el aviso nativo del navegador al
recargar/cerrar.

**Página de Juegos.** `pages/juegos.html` reúne los juegos en tarjetas simples. El
navbar solo muestra un ítem "Juegos" (para no saturarlo); ese enlace
queda marcado como activo en las cuatro páginas de esta sección,
gracias a que `data-page` en `js/components/navbar.js` acepta varias
páginas separadas por `|`, y `js/navigation.js` las reconoce todas.

## 11.5. Sonido global

`js/sound.js` (`window.RCSound`) sintetiza los efectos con Web Audio
(sin archivos ni librerías). Un único botón en el navbar activa o
desactiva el sonido de **toda** la página; la preferencia se guarda en
`localStorage` (`rc-sound`). Activado por defecto; el navegador solo
permite audio tras el primer clic/toque. Al desactivar se corta todo lo
que suene. Uso: `RCSound.play("correct")` (nombres en `SOUNDS`). Los
clics en botones suenan automáticamente; usa `data-sound="none"` para
silenciar uno o `data-sound="confirm"` para otro efecto. El interruptor
de sonido del quiz usa esta misma preferencia global.

## 12. Modo claro / oscuro

El botón del navbar cambia el tema y lo guarda en `localStorage`, así
que la preferencia se mantiene si se vuelve a abrir la página. Ningún
dato personal se guarda: solo la preferencia de tema.

---

## 13. Privacidad

El sitio no recopila nombres, correos ni ningún dato personal de los
estudiantes. No usa analítica externa, no crea cuentas y no depende de
conexión a internet para funcionar (salvo la carga inicial de las
tipografías de Google Fonts referenciadas en `css/main.css`; si se
necesita uso 100% sin conexión, esas tipografías pueden reemplazarse
por fuentes del sistema quitando el `@import` de ese archivo).

---

## 14. Desplegar en un hosting estático gratuito

Al ser un sitio 100% estático, puede subirse tal cual a:

- **GitHub Pages:** sube la carpeta a un repositorio y activa Pages
  apuntando a la raíz.
- **Netlify / Vercel:** arrastra la carpeta del proyecto al panel de
  despliegue ("deploy manually" / drag and drop).

No requiere build, `npm install` ni configuración adicional.

---

## 15. Créditos

Proyecto educativo desarrollado para la **Institución Educativa José
Antonio Aguilera**, en el marco de un proyecto de formación del SENA
sobre Mecanismos de Participación Ciudadana en Colombia.
