/**
 * data/crossword/crossword-data.js
 *
 * Banco de palabras y pistas del crucigrama. Las palabras van sin
 * tildes ni espacios (requisito del generador).
 *
 * REGLAS PARA REDACTAR PISTAS (para que el juego exija razonar):
 *   - No nombrar la respuesta, ni su raíz, ni otra respuesta del banco.
 *   - Describir una situación, una función o una definición indirecta;
 *     no copiar la definición textual del material de estudio.
 *
 * Campos:
 *   word        → palabra en mayúsculas, sin tildes/espacios (única).
 *   clue        → pista que se muestra al estudiante (nunca la respuesta).
 *   mechanism   → id de data/mecanismos (o null si es un término general,
 *                 no ligado a un solo mecanismo).
 *   difficulty  → "facil" | "media" | "dificil"
 *
 * Para agregar una palabra nueva, solo añade un objeto aquí siguiendo
 * esta misma estructura; el generador y las tarjetas se actualizan solos.
 */

const CROSSWORD_WORDS = [
  // ---- Los 8 mecanismos/temas del proyecto ----
  { word: "TUTELA", clue: "Ante la amenaza a una garantía esencial de una persona, un juez debe responder con prioridad y en un plazo muy breve.", mechanism: "tutela", difficulty: "facil" },
  { word: "PETICION", clue: "Un vecino pide por escrito a una oficina pública copia de un documento y la entidad debe contestarle dentro de un plazo legal.", mechanism: "derecho-peticion", difficulty: "facil" },
  { word: "REFERENDO", clue: "Jornada en la que los votantes dicen «sí» o «no» a una reforma o a un texto legal que ya está redactado.", mechanism: "referendo", difficulty: "media" },
  { word: "PLEBISCITO", clue: "El jefe del Ejecutivo somete directamente al pueblo si respalda o rechaza una decisión suya de trascendencia nacional.", mechanism: "plebiscito", difficulty: "media" },
  { word: "CONSULTA", clue: "Se plantea una pregunta de «sí» o «no» sobre un asunto de interés general a los habitantes de un territorio, para conocer su opinión.", mechanism: "consulta-popular", difficulty: "facil" },
  { word: "CABILDO", clue: "Sesión abierta al público donde los habitantes de un barrio pueden tomar la palabra ante sus autoridades locales para plantear problemas.", mechanism: "cabildo-abierto", difficulty: "media" },
  { word: "INICIATIVA", clue: "Un grupo de personas reúne respaldos para presentar su propia propuesta legislativa ante el órgano que debe estudiarla.", mechanism: "iniciativa-popular", difficulty: "media" },
  { word: "REVOCATORIA", clue: "Los votantes de un municipio o departamento deciden si un gobernante local sigue o no en el cargo, antes de que termine su periodo.", mechanism: "revocatoria-mandato", difficulty: "dificil" },
  { word: "MANDATO", clue: "Encargo temporal que el electorado confía a quien gana unos comicios, por un número fijo de años.", mechanism: "revocatoria-mandato", difficulty: "facil" },
  { word: "FIRMAS", clue: "Rúbricas que se juntan en planillas para respaldar una propuesta de la comunidad y poder presentarla.", mechanism: "iniciativa-popular", difficulty: "facil" },
  { word: "CORPORACION", clue: "Organismo público integrado por varios miembros elegidos por los habitantes, que delibera y decide en conjunto; el de un municipio es un ejemplo.", mechanism: "cabildo-abierto", difficulty: "dificil" },

  // ---- Conceptos generales de participación (sin mecanismo único) ----
  { word: "DEMOCRACIA", clue: "Sistema en el que la autoridad nace de la voluntad popular y se renueva periódicamente.", mechanism: null, difficulty: "facil" },
  { word: "CIUDADANIA", clue: "Condición de quien, por pertenecer a una nación, puede ejercer deberes y garantías dentro de ella.", mechanism: null, difficulty: "facil" },
  { word: "PARTICIPACION", clue: "Acción de involucrarse y aportar opinión o esfuerzo en las decisiones de la comunidad o del país.", mechanism: null, difficulty: "media" },
  { word: "CONSTITUCION", clue: "Texto fundamental del que dependen todas las demás reglas del país; el actual fue expedido en 1991.", mechanism: null, difficulty: "media" },
  { word: "VOTO", clue: "Decisión individual y secreta con la que alguien expresa su preferencia en una jornada electoral.", mechanism: null, difficulty: "facil" },
  { word: "DERECHOS", clue: "Facultades que el orden jurídico reconoce a toda persona por el solo hecho de serlo.", mechanism: null, difficulty: "facil" },
  { word: "GOBIERNO", clue: "Conjunto de autoridades que conducen la administración del país durante cada periodo.", mechanism: null, difficulty: "facil" },
  { word: "ESTADO", clue: "Organización política con poder soberano sobre un territorio y su población.", mechanism: null, difficulty: "facil" },
  { word: "ELECCIONES", clue: "Jornadas en las que la población escoge a quienes ocuparán cargos públicos.", mechanism: null, difficulty: "media" },
  { word: "LEY", clue: "Disposición general escrita que sale del Congreso y obliga a todos por igual.", mechanism: null, difficulty: "facil" },
  { word: "NORMA", clue: "Pauta de conducta obligatoria, escrita o aceptada por la sociedad, que indica qué se puede y qué no se puede hacer.", mechanism: null, difficulty: "facil" },
  { word: "CONTROL", clue: "Acción de vigilar de cerca cómo se manejan los asuntos y recursos de otros para evitar abusos.", mechanism: null, difficulty: "media" },
  { word: "SOCIAL", clue: "Palabra que califica todo lo relativo a la comunidad y a la convivencia entre las personas.", mechanism: null, difficulty: "facil" },
  { word: "VEEDURIA", clue: "Grupo de personas de la comunidad que se organiza para vigilar que una obra o un servicio público se cumpla como se prometió.", mechanism: null, difficulty: "dificil" },
  { word: "URNA", clue: "Caja con ranura y sellada donde cada persona deposita su papeleta durante la jornada de decisión.", mechanism: null, difficulty: "facil" },
  { word: "CENSO", clue: "Registro oficial que cuenta a las personas de un país o de un lugar y recoge datos sobre ellas.", mechanism: null, difficulty: "media" },
  { word: "TRANSPARENCIA", clue: "Cualidad de lo que se hace a la vista de todos, de modo que cualquiera pueda revisar cómo se actuó.", mechanism: null, difficulty: "dificil" },
  { word: "RENDICION", clue: "Acto en que una autoridad presenta a la comunidad qué hizo con los recursos públicos y qué resultados logró.", mechanism: null, difficulty: "dificil" }
];

/**
 * Devuelve las palabras que coinciden con una dificultad, o todas si
 * se pide "mixto" / no se especifica.
 */
function obtenerPalabrasPorDificultad(dificultad) {
  if (!dificultad || dificultad === "mixto") return CROSSWORD_WORDS;
  return CROSSWORD_WORDS.filter((w) => w.difficulty === dificultad);
}
