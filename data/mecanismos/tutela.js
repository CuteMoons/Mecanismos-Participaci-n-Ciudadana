/**
 * data/mecanismos/tutela.js
 * Información educativa sobre la Acción de Tutela.
 * Para agregar un nuevo mecanismo, copia este archivo como plantilla
 * y añade el objeto resultante en data/mecanismos/index.js
 */

const MECANISMO_TUTELA = {
  id: "tutela",
  nombre: "Acción de Tutela",
  icono: "shield",
  color: "#C41E2E",
  descripcionCorta: "Protege de forma inmediata los derechos fundamentales cuando son vulnerados o amenazados.",
  queEs:
    "Es un mecanismo judicial de protección inmediata al que puede acudir cualquier persona cuando considera que uno de sus derechos fundamentales está siendo vulnerado o amenazado por la acción o la omisión de una autoridad pública, y en algunos casos de particulares.",
  paraQueSirve:
    "Sirve para pedirle a un juez que ordene, de manera rápida, la protección efectiva de un derecho fundamental (como la vida, la salud, la igualdad o el debido proceso) cuando no existe otro medio de defensa igual de eficaz, o cuando se usa como mecanismo transitorio para evitar un perjuicio irremediable.",
  quienPuedeUsarlo:
    "Cualquier persona, directamente o por medio de representante, sin necesidad de ser abogado. También puede presentarla el Defensor del Pueblo o los personeros municipales en nombre de otra persona.",
  caracteristicas: [
    "Es preferente y sumaria: el juez debe resolver en un plazo breve.",
    "Puede presentarse ante cualquier juez del lugar donde ocurrió la vulneración.",
    "No requiere abogado ni formalidades especiales; puede redactarse a mano.",
    "El fallo puede ser revisado posteriormente por la Corte Constitucional.",
    "Es subsidiaria: procede cuando no hay otro medio de defensa judicial, salvo que se use para evitar un perjuicio irremediable."
  ],
  ejemplo:
    "Una EPS se niega a autorizar un tratamiento médico urgente ordenado por un especialista; el paciente presenta una tutela y el juez ordena a la EPS autorizar el procedimiento en un plazo perentorio.",
  datoHistorico:
    "Fue creada por la Constitución de 1991 y reglamentada mediante el Decreto 2591 de 1991. Se convirtió rápidamente en uno de los mecanismos más usados por los colombianos para la defensa de sus derechos.",
  constitucion91:
    "Está consagrada en el artículo 86 de la Constitución Política de Colombia.",
  datosImportantes: [
    "El plazo general para que el juez resuelva es de 10 días hábiles.",
    "El fallo debe cumplirse de inmediato, aunque se haya impugnado.",
    "No procede para reclamar derechos económicos, sociales o culturales por sí solos, salvo que estén en conexión directa con un derecho fundamental."
  ]
};
