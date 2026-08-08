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
│   └── preguntas/               → Preguntas separadas por dificultad + agregador
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

## 5. Cómo agregar un nuevo mecanismo

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

## 6. Banco de preguntas

El proyecto incluye el **banco oficial de 120 preguntas de opción
múltiple** (15 por mecanismo: 5 fáciles, 5 medias, 5 difíciles), con
4 opciones (A–D) y la respuesta correcta marcada. Los estudiantes
escriben el número de la pregunta y la letra elegida en su cuaderno u
hoja; la profesora puede consultar la **hoja de respuestas** que
aparece (colapsada) en la pantalla final del quiz para calificar
rápido.

Para agregar más preguntas:

1. Abre el archivo de la dificultad correspondiente:
   ```
   data/preguntas/preguntas-faciles.js
   data/preguntas/preguntas-medias.js
   data/preguntas/preguntas-dificiles.js
   ```
2. Agrega un objeto nuevo siguiendo esta estructura:
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
3. No necesitas tocar `js/quiz/quiz-engine.js`: el motor lee
   automáticamente todo lo que exista en `data/preguntas/`.

**Importante:** el `id` de cada pregunta debe ser único; el sistema no
depende de la posición en el arreglo.

---

## 7. Cómo cambiar la configuración del quiz

- **Tiempo predeterminado:** en `js/quiz/quiz-config.js`, cambia
  `tiempoSegundos: 120` (está en segundos).
- **Cantidades de preguntas disponibles (5/10/15/20):** en
  `js/quiz/quiz-ui.js`, arreglo `NUM_OPCIONES`.
- **Opciones de tiempo disponibles:** mismo archivo, arreglo
  `TIEMPO_OPCIONES`.
- **XP por respuesta correcta:** en `js/quiz/quiz-score.js`, constante
  `XP_POR_ACIERTO` (por defecto 100).

---

## 8. Cómo funciona la actividad en clase

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

## 9. Modo claro / oscuro

El botón del navbar cambia el tema y lo guarda en `localStorage`, así
que la preferencia se mantiene si se vuelve a abrir la página. Ningún
dato personal se guarda: solo la preferencia de tema.

---

## 10. Privacidad

El sitio no recopila nombres, correos ni ningún dato personal de los
estudiantes. No usa analítica externa, no crea cuentas y no depende de
conexión a internet para funcionar (salvo la carga inicial de las
tipografías de Google Fonts referenciadas en `css/main.css`; si se
necesita uso 100% sin conexión, esas tipografías pueden reemplazarse
por fuentes del sistema quitando el `@import` de ese archivo).

---

## 11. Desplegar en un hosting estático gratuito

Al ser un sitio 100% estático, puede subirse tal cual a:

- **GitHub Pages:** sube la carpeta a un repositorio y activa Pages
  apuntando a la raíz.
- **Netlify / Vercel:** arrastra la carpeta del proyecto al panel de
  despliegue ("deploy manually" / drag and drop).

No requiere build, `npm install` ni configuración adicional.

---

## 12. Créditos

Proyecto educativo desarrollado para la **Institución Educativa José
Antonio Aguilera**, en el marco de un proyecto de formación del SENA
sobre Mecanismos de Participación Ciudadana en Colombia.
