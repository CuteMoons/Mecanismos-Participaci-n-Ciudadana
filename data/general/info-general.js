/**
 * data/general/info-general.js
 *
 * Información general sobre la participación ciudadana en Colombia
 * (no específica de un solo mecanismo). Se muestra en pages/aprender.html
 * antes de las tarjetas de los 8 mecanismos individuales.
 *
 * Para editar textos, cambia únicamente este archivo: la interfaz
 * (js/components/info-general.js) los renderiza automáticamente.
 */

const INFO_GENERAL = {
  queEs:
    "Los mecanismos de participación ciudadana son instrumentos establecidos por la Constitución Política de Colombia que permiten a los ciudadanos intervenir en las decisiones públicas, ejercer control sobre los gobernantes y proteger sus derechos. Su objetivo es fortalecer la democracia y permitir que todas las personas puedan participar activamente en la vida política del país.",

  importancia: [
    { icono: "users", texto: "Permiten que la ciudadanía participe en decisiones importantes." },
    { icono: "shield", texto: "Ayudan a proteger los derechos fundamentales." },
    { icono: "flag", texto: "Fortalecen la democracia." },
    { icono: "eye", texto: "Promueven la transparencia del Estado." },
    { icono: "scale", texto: "Permiten controlar la gestión de los funcionarios públicos." }
  ],

  // Debe usar los mismos "id" que data/mecanismos, para heredar color e ícono.
  diferencias: [
    { mecanismo: "tutela", paraQueSirve: "Proteger derechos fundamentales." },
    { mecanismo: "derecho-peticion", paraQueSirve: "Solicitar información o respuestas." },
    { mecanismo: "referendo", paraQueSirve: "Aprobar o rechazar normas." },
    { mecanismo: "plebiscito", paraQueSirve: "Apoyar o rechazar decisiones del Gobierno." },
    { mecanismo: "consulta-popular", paraQueSirve: "Opinar sobre un tema específico." },
    { mecanismo: "cabildo-abierto", paraQueSirve: "Participar en reuniones públicas." },
    { mecanismo: "iniciativa-popular", paraQueSirve: "Presentar proyectos de ley." },
    { mecanismo: "revocatoria-mandato", paraQueSirve: "Retirar del cargo a un alcalde o gobernador." }
  ],

  derechosQueProtegen: [
    "Educación",
    "Salud",
    "Igualdad",
    "Vida",
    "Libertad",
    "Participación ciudadana",
    "Debido proceso",
    "Medio ambiente sano"
  ],

  quienesPuedenUsarlos:
    "En general, todos los ciudadanos colombianos pueden ejercer estos mecanismos, aunque algunos tienen requisitos específicos (como recolectar firmas o cumplir umbrales de participación).",

  datosCuriosos: [
    "La participación ciudadana está reconocida por la Constitución Política de 1991.",
    "Colombia es una democracia participativa.",
    "La acción de tutela es uno de los mecanismos más utilizados para proteger derechos fundamentales."
  ],

  resumen:
    "Los mecanismos de participación ciudadana permiten que los colombianos participen en las decisiones del país, defiendan sus derechos y ejerzan control sobre las autoridades."
};
