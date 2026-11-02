/**
 * data/wordsearch/wordsearch-data.js
 * Versiones de la sopa de letras. Cada versión tiene su propio tema y un
 * conjunto distinto de palabras (mínimo 10). Las palabras van en MAYÚSCULAS,
 * sin tildes ni espacios. Reglas que se comprueban al probar el proyecto:
 *   - ninguna palabra es palíndromo ni está contenida en otra de su versión
 *     (evita encontrar dos palabras con una sola selección);
 *   - mínimo 10 palabras por versión.
 * Las posiciones NO se guardan: se calculan al azar en cada partida.
 */
const WORDSEARCH_VERSIONS = [
  {
    id: "mecanismos",
    titulo: "Mecanismos de participación",
    nivel: "media",
    words: ["VOTO", "REFERENDO", "PLEBISCITO", "CONSULTA", "CABILDO", "INICIATIVA", "REVOCATORIA", "TUTELA", "PETICION", "POPULAR", "MANDATO", "FIRMAS"]
  },
  {
    id: "ciudadania",
    titulo: "Ciudadanía y derechos",
    nivel: "facil",
    words: ["CIUDADANO", "DERECHOS", "DEBERES", "LIBERTAD", "IGUALDAD", "PUEBLO", "SOBERANIA", "COMUNIDAD", "DIALOGO", "JUSTICIA", "RESPETO", "PAZ"]
  },
  {
    id: "elecciones",
    titulo: "Día de elecciones",
    nivel: "facil",
    words: ["ELECCIONES", "SUFRAGIO", "CANDIDATO", "PARTIDO", "TARJETON", "CEDULA", "JURADO", "ESCRUTINIO", "MAYORIA", "ABSTENCION", "CENSO", "MESA"]
  },
  {
    id: "democracia",
    titulo: "Democracia y Constitución",
    nivel: "media",
    words: ["DEMOCRACIA", "CONSTITUCION", "REPRESENTANTE", "PLURALISMO", "TRANSPARENCIA", "LEGITIMIDAD", "GOBIERNO", "ESTADO", "NACION", "LEY", "CONGRESO", "SENADO"]
  },
  {
    id: "control",
    titulo: "Control y participación local",
    nivel: "dificil",
    words: ["VEEDURIA", "FISCALIZAR", "DENUNCIA", "PROPUESTA", "DELIBERACION", "CONCERTACION", "ALCALDIA", "CONCEJO", "ASAMBLEA", "PRESUPUESTO", "JUNTA", "BARRIO"]
  },
  {
    id: "instituciones",
    titulo: "Instituciones del Estado",
    nivel: "dificil",
    words: ["REGISTRADURIA", "PROCURADURIA", "CONTRALORIA", "DEFENSORIA", "PERSONERIA", "GOBERNACION", "CORTE", "FISCALIA", "TRIBUNAL", "JUEZ", "ALCALDE", "DIPUTADO"]
  }
];

if (typeof module !== "undefined") module.exports = WORDSEARCH_VERSIONS;
