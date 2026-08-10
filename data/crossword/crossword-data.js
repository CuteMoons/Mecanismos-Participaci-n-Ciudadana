/**
 * data/crossword/crossword-data.js
 *
 * Banco de palabras y pistas del crucigrama. Las palabras van sin
 * tildes ni espacios (requisito del generador); la pista sí puede
 * usar el nombre completo y correcto.
 *
 * Campos:
 *   word        → palabra en mayúsculas, sin tildes/espacios (única).
 *   clue        → pista que se muestra al estudiante.
 *   mechanism   → id de data/mecanismos (o null si es un término general,
 *                 no ligado a un solo mecanismo).
 *   difficulty  → "facil" | "media" | "dificil"
 *
 * Para agregar una palabra nueva, solo añade un objeto aquí siguiendo
 * esta misma estructura; el generador y las tarjetas se actualizan solos.
 */

const CROSSWORD_WORDS = [
  // ---- Los 8 mecanismos/temas del proyecto ----
  { word: "TUTELA", clue: "Mecanismo judicial que protege de forma inmediata los derechos fundamentales.", mechanism: "tutela", difficulty: "facil" },
  { word: "PETICION", clue: "Derecho a presentar solicitudes respetuosas a las autoridades y recibir respuesta.", mechanism: "derecho-peticion", difficulty: "facil" },
  { word: "REFERENDO", clue: "Mecanismo para aprobar o derogar una norma mediante votación popular.", mechanism: "referendo", difficulty: "media" },
  { word: "PLEBISCITO", clue: "El Presidente consulta al pueblo sobre una decisión política de gran trascendencia.", mechanism: "plebiscito", difficulty: "media" },
  { word: "CONSULTA", clue: "Se somete una pregunta de trascendencia a consideración del pueblo.", mechanism: "consulta-popular", difficulty: "facil" },
  { word: "CABILDO", clue: "Reunión pública donde la comunidad participa ante el concejo o la junta local.", mechanism: "cabildo-abierto", difficulty: "media" },
  { word: "INICIATIVA", clue: "Derecho de un grupo de ciudadanos a presentar un proyecto de norma.", mechanism: "iniciativa-popular", difficulty: "media" },
  { word: "REVOCATORIA", clue: "Mecanismo para terminar anticipadamente el mandato de un alcalde o gobernador.", mechanism: "revocatoria-mandato", difficulty: "dificil" },
  { word: "MANDATO", clue: "Período durante el cual un funcionario electo ejerce su cargo.", mechanism: "revocatoria-mandato", difficulty: "facil" },
  { word: "FIRMAS", clue: "Apoyos ciudadanos que se recolectan para impulsar una iniciativa popular.", mechanism: "iniciativa-popular", difficulty: "facil" },
  { word: "CORPORACION", clue: "Órgano colegiado, como un concejo municipal, ante el cual se realiza un cabildo abierto.", mechanism: "cabildo-abierto", difficulty: "dificil" },

  // ---- Conceptos generales de participación (sin mecanismo único) ----
  { word: "DEMOCRACIA", clue: "Sistema político en el que el poder proviene del pueblo.", mechanism: null, difficulty: "facil" },
  { word: "CIUDADANIA", clue: "Condición que permite ejercer derechos y deberes dentro de una comunidad política.", mechanism: null, difficulty: "facil" },
  { word: "PARTICIPACION", clue: "Acción de intervenir en las decisiones públicas del país.", mechanism: null, difficulty: "media" },
  { word: "CONSTITUCION", clue: "Norma máxima de Colombia, vigente desde 1991.", mechanism: null, difficulty: "media" },
  { word: "VOTO", clue: "Forma en la que un ciudadano expresa su decisión en una elección o votación.", mechanism: null, difficulty: "facil" },
  { word: "DERECHOS", clue: "Garantías fundamentales que protegen a toda persona.", mechanism: null, difficulty: "facil" },
  { word: "GOBIERNO", clue: "Conjunto de instituciones que dirigen y administran el Estado.", mechanism: null, difficulty: "facil" },
  { word: "ESTADO", clue: "Organización política y jurídica de una sociedad sobre un territorio.", mechanism: null, difficulty: "facil" },
  { word: "ELECCIONES", clue: "Procesos mediante los cuales los ciudadanos eligen a sus representantes.", mechanism: null, difficulty: "media" },
  { word: "LEY", clue: "Norma jurídica expedida por el Congreso de la República.", mechanism: null, difficulty: "facil" },
  { word: "NORMA", clue: "Regla de obligatorio cumplimiento dentro de un ordenamiento jurídico.", mechanism: null, difficulty: "facil" },
  { word: "CONTROL", clue: "Seguimiento que ejerce la ciudadanía sobre la gestión de sus gobernantes.", mechanism: null, difficulty: "media" },
  { word: "SOCIAL", clue: "Relativo a la sociedad; se usa junto con \"control\" para nombrar la vigilancia ciudadana.", mechanism: null, difficulty: "facil" },
  { word: "VEEDURIA", clue: "Organización ciudadana que vigila la gestión pública.", mechanism: null, difficulty: "dificil" },
  { word: "URNA", clue: "Recipiente donde se depositan los votos en una jornada electoral.", mechanism: null, difficulty: "facil" },
  { word: "CENSO", clue: "Registro que determina el universo electoral en ciertos procesos de participación.", mechanism: null, difficulty: "media" },
  { word: "TRANSPARENCIA", clue: "Principio que exige claridad y acceso a la información en la gestión pública.", mechanism: null, difficulty: "dificil" },
  { word: "RENDICION", clue: "Proceso, junto con \"cuentas\", mediante el cual una entidad explica su gestión.", mechanism: null, difficulty: "dificil" }
];

/**
 * Devuelve las palabras que coinciden con una dificultad, o todas si
 * se pide "mixto" / no se especifica.
 */
function obtenerPalabrasPorDificultad(dificultad) {
  if (!dificultad || dificultad === "mixto") return CROSSWORD_WORDS;
  return CROSSWORD_WORDS.filter((w) => w.difficulty === dificultad);
}
