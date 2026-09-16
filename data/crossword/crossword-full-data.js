/**
 * data/crossword/crossword-full-data.js
 *
 * Banco de palabras del SEGUNDO crucigrama (independiente del
 * primero): usa los NOMBRES COMPLETOS de los mecanismos de
 * participación en vez de una sola palabra clave.
 *
 * Campos:
 *   word        → versión para la cuadrícula: MAYÚSCULAS, SIN espacios
 *                 ni tildes (así lo requiere el generador de casillas).
 *   display     → nombre completo, correctamente escrito (con espacios
 *                 y tildes), para mostrarlo en textos y resultados.
 *   clue        → pista que se muestra al estudiante.
 *   mechanism   → id de data/mecanismos (o null si es un término general).
 *   difficulty  → "facil" | "media" | "dificil" (según la longitud/
 *                 complejidad del nombre completo).
 *
 * El generador y la interfaz son los MISMOS módulos que usa el primer
 * crucigrama (js/crossword/crossword-generator.js, -game.js, -ui.js);
 * solo cambian los datos y el controlador (crossword-full.js), tal
 * como se pidió: un segundo conjunto de datos y una configuración
 * independientes, sin tocar el crucigrama original.
 */

const CROSSWORD_FULL_WORDS = [
  { word: "REFERENDO", display: "Referendo", clue: "Mecanismo para aprobar o derogar una norma mediante votación popular.", mechanism: "referendo", difficulty: "facil" },
  { word: "PLEBISCITO", display: "Plebiscito", clue: "El Presidente consulta al pueblo sobre una decisión política de gran trascendencia.", mechanism: "plebiscito", difficulty: "facil" },
  { word: "ACCIONDETUTELA", display: "Acción de Tutela", clue: "Mecanismo judicial que protege de forma inmediata los derechos fundamentales.", mechanism: "tutela", difficulty: "media" },
  { word: "DERECHODEPETICION", display: "Derecho de Petición", clue: "Derecho a presentar solicitudes respetuosas a las autoridades y recibir respuesta.", mechanism: "derecho-peticion", difficulty: "media" },
  { word: "CONSULTAPOPULAR", display: "Consulta Popular", clue: "Se somete una pregunta de trascendencia a consideración del pueblo.", mechanism: "consulta-popular", difficulty: "media" },
  { word: "CABILDOABIERTO", display: "Cabildo Abierto", clue: "Reunión pública donde la comunidad participa ante el concejo o la junta local.", mechanism: "cabildo-abierto", difficulty: "media" },
  { word: "INICIATIVAPOPULAR", display: "Iniciativa Popular", clue: "Derecho de un grupo de ciudadanos a presentar un proyecto de norma.", mechanism: "iniciativa-popular", difficulty: "dificil" },
  { word: "REVOCATORIADELMANDATO", display: "Revocatoria del Mandato", clue: "Mecanismo para terminar anticipadamente el mandato de un alcalde o gobernador.", mechanism: "revocatoria-mandato", difficulty: "dificil" },

  // Términos generales (nombres compuestos, sin mecanismo único)
  { word: "PARTICIPACIONCIUDADANA", display: "Participación Ciudadana", clue: "Nombre general que reciben estas herramientas de intervención en lo público.", mechanism: null, difficulty: "dificil" },
  { word: "CONSTITUCIONPOLITICA", display: "Constitución Política", clue: "Norma máxima de Colombia, vigente desde 1991.", mechanism: null, difficulty: "dificil" },
  { word: "DEMOCRACIAPARTICIPATIVA", display: "Democracia Participativa", clue: "Modelo democrático en el que la ciudadanía interviene más allá del voto.", mechanism: null, difficulty: "dificil" },
  { word: "CONTROLSOCIAL", display: "Control Social", clue: "Seguimiento que ejerce la ciudadanía sobre la gestión de sus gobernantes.", mechanism: null, difficulty: "media" },
  { word: "DERECHOSFUNDAMENTALES", display: "Derechos Fundamentales", clue: "Garantías esenciales que la tutela busca proteger de forma inmediata.", mechanism: "tutela", difficulty: "dificil" },
  { word: "VOTOPOPULAR", display: "Voto Popular", clue: "Forma en que se expresa la decisión ciudadana en varios de estos mecanismos.", mechanism: null, difficulty: "media" }
];

function obtenerPalabrasCompletasPorDificultad(dificultad) {
  if (!dificultad || dificultad === "mixto") return CROSSWORD_FULL_WORDS;
  return CROSSWORD_FULL_WORDS.filter((w) => w.difficulty === dificultad);
}
