/**
 * data/matching/matching-data.js
 *
 * Significados/descripciones de cada mecanismo para el juego
 * "Relaciona los mecanismos". El nombre, ícono y color de cada
 * mecanismo NO se repiten aquí: se reutilizan desde data/mecanismos
 * (MECANISMOS) cruzando por "id". Este archivo solo aporta lo que no
 * existe todavía: los significados en dos niveles de dificultad.
 *
 * - significadoMedio: definición clara y educativa (fácil de relacionar).
 * - significadoDificil: definición más técnica/jurídica, sin nombrar
 *   directamente el mecanismo.
 */

const MATCHING_DATA = [
  {
    id: "tutela",
    significadoMedio: "Mecanismo judicial que protege de inmediato los derechos fundamentales de una persona.",
    significadoDificil: "Acción constitucional preferente y sumaria, procedente cuando no existe otro medio de defensa judicial igual de eficaz."
  },
  {
    id: "derecho-peticion",
    significadoMedio: "Derecho a solicitar información o una respuesta a una autoridad, de manera respetuosa.",
    significadoDificil: "Derecho fundamental que obliga a la autoridad a resolver de fondo dentro de los términos legales establecidos."
  },
  {
    id: "referendo",
    significadoMedio: "Mecanismo mediante el cual el pueblo aprueba o rechaza una norma con su voto.",
    significadoDificil: "Convocatoria popular para aprobar, derogar o modificar un texto normativo vigente o propuesto."
  },
  {
    id: "plebiscito",
    significadoMedio: "El Presidente le pregunta al pueblo si apoya una decisión política importante.",
    significadoDificil: "Pronunciamiento popular sobre una decisión del Ejecutivo de trascendencia nacional, convocado por el Presidente."
  },
  {
    id: "consulta-popular",
    significadoMedio: "Se le hace una pregunta a la ciudadanía sobre un tema importante para conocer su opinión.",
    significadoDificil: "Sometimiento de una pregunta de trascendencia a consideración popular, con efectos según el umbral de participación."
  },
  {
    id: "cabildo-abierto",
    significadoMedio: "Reunión pública donde los habitantes pueden hablar directamente ante el concejo o la junta.",
    significadoDificil: "Sesión pública de una corporación territorial en la que la comunidad interviene sobre asuntos de su interés."
  },
  {
    id: "iniciativa-popular",
    significadoMedio: "Un grupo de ciudadanos presenta un proyecto de norma para que sea debatido.",
    significadoDificil: "Derecho político de un grupo de ciudadanos a presentar un proyecto normativo ante la corporación pública competente."
  },
  {
    id: "revocatoria-mandato",
    significadoMedio: "Los ciudadanos deciden si un alcalde o gobernador debe dejar su cargo antes de terminar su periodo.",
    significadoDificil: "Mecanismo mediante el cual el electorado da por terminado, antes de tiempo, el mandato de un mandatario territorial elegido popularmente."
  }
];

/**
 * Combina MATCHING_DATA con el nombre/ícono/color reales de
 * data/mecanismos (MECANISMOS), y elige el significado según la
 * dificultad pedida. Devuelve un arreglo listo para el juego.
 */
function construirMecanismosParaJuego(dificultad) {
  return MATCHING_DATA.map((item) => {
    const mecanismo = obtenerMecanismoPorId(item.id);
    return {
      id: item.id,
      nombre: mecanismo ? mecanismo.nombre : item.id,
      icono: mecanismo ? mecanismo.icono : "shield",
      color: mecanismo ? mecanismo.color : null,
      significado: dificultad === "dificil" ? item.significadoDificil : item.significadoMedio
    };
  });
}
