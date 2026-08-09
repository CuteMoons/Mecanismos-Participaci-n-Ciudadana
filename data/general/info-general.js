/**
 * data/general/info-general.js
 *
 * Información general sobre la participación política y ciudadana en
 * Colombia (no específica de un solo mecanismo). Se muestra en
 * pages/aprender.html antes y después de las tarjetas de los 8 mecanismos.
 *
 * Fuente: guía ampliada entregada por la profesora (Constitución de
 * 1991, Ley 134 de 1994, Ley 1757 de 2015, Ley 1755 de 2015).
 *
 * Para editar textos, cambia únicamente este archivo: la interfaz
 * (js/components/info-general.js) los renderiza automáticamente.
 */

const INFO_GENERAL = {
  queEs:
    "Los mecanismos de participación ciudadana son instrumentos establecidos por la Constitución Política de Colombia que permiten a los ciudadanos intervenir en las decisiones públicas, ejercer control sobre los gobernantes y proteger sus derechos. La participación no se limita a votar en elecciones: también incluye mecanismos institucionales, organizaciones sociales, espacios comunitarios y acciones para relacionarse con las autoridades. Su objetivo es fortalecer la democracia y permitir que todas las personas puedan participar activamente en la vida política del país.",

  importancia: [
    { icono: "users", texto: "Permiten que la ciudadanía participe en decisiones importantes." },
    { icono: "shield", texto: "Ayudan a proteger los derechos fundamentales." },
    { icono: "flag", texto: "Fortalecen la democracia más allá de las elecciones." },
    { icono: "eye", texto: "Promueven la transparencia y el control sobre el uso de recursos públicos." },
    { icono: "scale", texto: "Permiten controlar la gestión de los funcionarios públicos." }
  ],

  // Versión compacta de "¿por qué importan?": 4 etiquetas rápidas
  // (emoji + una palabra), pensadas para leerse de un vistazo.
  importanciaRapida: [
    { emoji: "🗳️", texto: "Participación" },
    { emoji: "🛡️", texto: "Derechos" },
    { emoji: "🏛️", texto: "Democracia" },
    { emoji: "👥", texto: "Ciudadanía" }
  ],

  // Línea de tiempo del marco legal (Sección 22 del documento ampliado).
  marcoLegal: [
    {
      anio: "1991",
      titulo: "Constitución Política",
      texto: "Fortalece el modelo de democracia participativa. El artículo 40 reconoce el derecho a participar en la conformación, ejercicio y control del poder político; el artículo 103 enumera los mecanismos de participación del pueblo."
    },
    {
      anio: "1994",
      titulo: "Ley 134 de 1994",
      texto: "Una de las primeras leyes estatutarias dedicadas a desarrollar los mecanismos de participación previstos por la Constitución: iniciativa popular, referendo, consulta popular, revocatoria del mandato, plebiscito y cabildo abierto."
    },
    {
      anio: "2015",
      titulo: "Ley 1755 de 2015",
      texto: "Regula el derecho fundamental de petición: cómo presentarlo, qué se puede solicitar y en qué plazos debe responder la autoridad."
    },
    {
      anio: "2015",
      titulo: "Ley 1757 de 2015",
      texto: "Actualiza y desarrolla las reglas de los seis mecanismos de participación que regula directamente, además de incluir disposiciones sobre rendición de cuentas y veedurías ciudadanas."
    }
  ],

  // Debe usar los mismos "id" que data/mecanismos, para heredar color e ícono.
  // "votacion" resume si el mecanismo implica una votación popular directa.
  diferencias: [
    { mecanismo: "tutela", paraQueSirve: "Proteger derechos fundamentales.", votacion: "No es una votación popular." },
    { mecanismo: "derecho-peticion", paraQueSirve: "Solicitar información o respuestas.", votacion: "No." },
    { mecanismo: "referendo", paraQueSirve: "Decidir sobre determinadas normas.", votacion: "Sí, cuando corresponde." },
    { mecanismo: "plebiscito", paraQueSirve: "Pronunciarse sobre una decisión política del Gobierno.", votacion: "Sí." },
    { mecanismo: "consulta-popular", paraQueSirve: "Responder una pregunta de trascendencia pública.", votacion: "Sí." },
    { mecanismo: "cabildo-abierto", paraQueSirve: "Dialogar públicamente sobre asuntos comunitarios.", votacion: "No, como mecanismo de votación popular general." },
    { mecanismo: "iniciativa-popular", paraQueSirve: "Presentar propuestas normativas.", votacion: "No necesariamente; inicia un trámite." },
    { mecanismo: "revocatoria-mandato", paraQueSirve: "Decidir sobre la continuidad de un mandatario.", votacion: "Sí." }
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
    "En general, todos los ciudadanos colombianos pueden ejercer estos mecanismos, aunque algunos tienen requisitos específicos (como recolectar firmas, cumplir umbrales de participación o pertenecer al censo electoral del territorio correspondiente).",

  // Nota de precisión jurídica: distingue los 6 mecanismos de la Ley 1757
  // de la tutela y el derecho de petición (Secciones 6, 19 y 23 del documento).
  notaImportante:
    "Aunque en este proyecto se estudian juntos porque están relacionados con la participación y la relación ciudadanía-Estado, jurídicamente no los 8 temas pertenecen a la misma categoría. Los 6 mecanismos regulados directamente por la Ley 1757 de 2015 son: iniciativa popular y normativa, referendo, consulta popular, revocatoria del mandato, plebiscito y cabildo abierto. La acción de tutela y el derecho de petición son derechos/herramientas constitucionales que se enseñan junto a ellos por su relación con la participación, pero no forman parte de esos 6 mecanismos de la Ley 1757.",

  // Errores frecuentes que deben evitarse (Sección 19).
  erroresFrecuentes: [
    "Confundir el plebiscito con el referendo.",
    "Pensar que todos los mecanismos funcionan mediante una votación.",
    "Afirmar que la tutela y el derecho de petición son mecanismos de la Ley 1757 de 2015.",
    "Confundir una petición con una iniciativa popular normativa.",
    "Pensar que una iniciativa popular se convierte automáticamente en ley.",
    "Suponer que cualquier funcionario puede ser objeto de revocatoria, sin revisar los cargos y requisitos aplicables.",
    "Aprender solo definiciones sin comprender para qué sirve cada herramienta."
  ],

  // ¿Cómo participar de manera responsable? (Sección 18).
  participacionResponsable: [
    "Informarse antes de tomar una decisión.",
    "Consultar fuentes confiables y distinguir información de opiniones o rumores.",
    "Conocer el mecanismo adecuado para cada situación.",
    "Respetar las opiniones diferentes.",
    "Argumentar las propuestas con razones y evidencias.",
    "Participar sin recurrir a la violencia o a la intimidación.",
    "Conocer los requisitos y procedimientos legales de cada mecanismo formal.",
    "Hacer seguimiento a las decisiones y exigir transparencia."
  ],

  // Casos prácticos (Sección 20): situación breve → mecanismo relacionado.
  casosPracticos: [
    { situacion: "Una comunidad necesita conocer información sobre un proyecto de una entidad pública.", mecanismo: "derecho-peticion" },
    { situacion: "Una persona considera que un derecho fundamental está siendo vulnerado y busca protección judicial.", mecanismo: "tutela" },
    { situacion: "Un grupo de ciudadanos quiere presentar una propuesta de norma ante la corporación competente.", mecanismo: "iniciativa-popular" },
    { situacion: "Una norma o propuesta normativa es sometida a decisión popular.", mecanismo: "referendo" },
    { situacion: "El Gobierno somete una decisión política de especial relevancia a consideración del pueblo.", mecanismo: "plebiscito" },
    { situacion: "Una pregunta sobre un asunto de trascendencia se somete a consideración de los ciudadanos.", mecanismo: "consulta-popular" },
    { situacion: "Habitantes de un territorio quieren discutir públicamente un asunto ante la corporación correspondiente.", mecanismo: "cabildo-abierto" },
    { situacion: "Ciudadanos buscan promover una votación sobre la continuidad de un mandatario elegido popularmente.", mecanismo: "revocatoria-mandato" }
  ],

  // Glosario básico (Sección 21).
  glosario: [
    { termino: "Ciudadanía", definicion: "Condición que permite ejercer derechos y deberes dentro de una comunidad política." },
    { termino: "Democracia participativa", definicion: "Modelo en el que la ciudadanía interviene en decisiones y asuntos públicos mediante diferentes formas de participación." },
    { termino: "Mecanismo de participación", definicion: "Herramienta jurídica o institucional mediante la cual la ciudadanía puede intervenir en asuntos públicos." },
    { termino: "Promotor", definicion: "Persona, grupo u organización que impulsa determinados mecanismos de participación, según las reglas aplicables." },
    { termino: "Apoyos ciudadanos", definicion: "Manifestaciones de respaldo (como firmas) requeridas para determinadas iniciativas de origen popular." },
    { termino: "Censo electoral", definicion: "Registro utilizado para determinar el universo electoral en los procesos en que corresponde." },
    { termino: "Control social", definicion: "Seguimiento que realiza la ciudadanía sobre la gestión pública." },
    { termino: "Rendición de cuentas", definicion: "Proceso mediante el cual las entidades explican y justifican su gestión ante la ciudadanía." },
    { termino: "Corporación pública", definicion: "Órgano colegiado, como un concejo municipal o una asamblea departamental, con funciones definidas por la Constitución y la ley." }
  ],

  // Participación y control social (Sección 16).
  controlSocial: [
    { titulo: "Rendición de cuentas", texto: "Espacios y procesos mediante los cuales las entidades explican su gestión." },
    { titulo: "Veedurías ciudadanas", texto: "Organizaciones o ciudadanos que hacen seguimiento y vigilancia social sobre la gestión pública." },
    { titulo: "Diálogo social", texto: "Interacción entre ciudadanía, organizaciones e instituciones para tratar asuntos públicos." }
  ],

  datosCuriosos: [
    "La participación ciudadana está reconocida por la Constitución Política de 1991.",
    "Colombia es una democracia participativa.",
    "La acción de tutela es uno de los mecanismos más utilizados para proteger derechos fundamentales.",
    "La participación también puede ejercerse en espacios cercanos, como el gobierno escolar o las reuniones comunitarias del barrio."
  ],

  resumen:
    "Los mecanismos de participación ciudadana permiten que los colombianos participen en las decisiones del país, defiendan sus derechos y ejerzan control sobre las autoridades. Conocerlos —y saber cuál usar en cada situación— es una parte esencial de ejercer una ciudadanía informada y responsable."
};
