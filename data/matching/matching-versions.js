/**
 * data/matching/matching-versions.js
 *
 * Versiones adicionales del juego "Relaciona los mecanismos". La versión
 * clásica (mecanismo ↔ significado, con dificultad media/difícil) sigue
 * saliendo de data/matching/matching-data.js; estas son versiones
 * COMPLETAS con contenido propio.
 *
 * Cada versión:
 *   id, titulo, nivel ("media" | "dificil")
 *   modo            "normal"  → filas = texto largo, fichas = concepto corto
 *                   "inverso" → filas = concepto, fichas = texto (otra distribución visual)
 *   encabezadoFilas / encabezadoFichas → títulos de las dos columnas
 *   emoji           → ícono de las fichas
 *   pares[]         → { id, concepto, texto }  (correspondencia ÚNICA 1 a 1)
 *
 * El orden de filas y fichas se mezcla en cada partida; la correspondencia
 * se guarda por `id`, por eso no depende del orden en pantalla.
 */

const MATCHING_VERSIONS = [
  {
    id: "instituciones",
    titulo: "Instituciones y funciones",
    nivel: "media",
    modo: "normal",
    encabezadoFilas: "Funciones",
    encabezadoFichas: "Instituciones",
    emoji: "🏛️",
    pares: [
      { id: "registraduria", concepto: "Registraduría Nacional", texto: "Organiza las elecciones y se encarga de la identificación de los ciudadanos." },
      { id: "cne", concepto: "Consejo Nacional Electoral", texto: "Vigila y controla la organización electoral y la actividad de los partidos y movimientos políticos." },
      { id: "congreso", concepto: "Congreso de la República", texto: "Expide las leyes del país y está formado por el Senado y la Cámara de Representantes." },
      { id: "concejo", concepto: "Concejo municipal", texto: "Corporación elegida que aprueba los acuerdos de un municipio y controla a su alcalde." },
      { id: "asamblea", concepto: "Asamblea departamental", texto: "Corporación elegida que aprueba las ordenanzas de un departamento." },
      { id: "corte", concepto: "Corte Constitucional", texto: "Guarda la integridad y la supremacía de la Constitución." },
      { id: "defensoria", concepto: "Defensoría del Pueblo", texto: "Promueve y protege los derechos humanos y acompaña a las personas cuando se vulneran." },
      { id: "contraloria", concepto: "Contraloría General", texto: "Vigila la gestión fiscal y el buen uso de los recursos públicos de la Nación." }
    ]
  },
  {
    id: "terminos-electorales",
    titulo: "Términos electorales",
    nivel: "media",
    modo: "normal",
    encabezadoFilas: "Definiciones",
    encabezadoFichas: "Términos",
    emoji: "🗳️",
    pares: [
      { id: "sufragio", concepto: "Sufragio", texto: "Derecho a elegir y a ser elegido, que se ejerce mediante el voto." },
      { id: "escrutinio", concepto: "Escrutinio", texto: "Conteo y verificación oficial de los votos para establecer los resultados." },
      { id: "abstencion", concepto: "Abstención", texto: "Decisión de no acudir a votar en una jornada electoral." },
      { id: "voto-blanco", concepto: "Voto en blanco", texto: "Forma de expresar que ninguna de las opciones del tarjetón convence." },
      { id: "tarjeton", concepto: "Tarjetón", texto: "Papel con las opciones y los candidatos entre los cuales se marca la preferencia." },
      { id: "jurado", concepto: "Jurado de votación", texto: "Ciudadano designado para atender la mesa y hacer el primer conteo de votos." },
      { id: "censo", concepto: "Censo electoral", texto: "Registro de las personas habilitadas para votar en cada lugar." },
      { id: "candidato", concepto: "Candidato", texto: "Persona que se postula para un cargo de elección popular." }
    ]
  },
  {
    id: "herramientas-casos",
    titulo: "Herramientas ciudadanas en casos reales",
    nivel: "dificil",
    modo: "normal",
    encabezadoFilas: "Situaciones",
    encabezadoFichas: "Herramientas",
    emoji: "🧰",
    pares: [
      { id: "tutela", concepto: "Acción de tutela", texto: "Una EPS niega una cirugía urgente y la familia pide a un juez protección inmediata." },
      { id: "peticion", concepto: "Derecho de petición", texto: "Un vecino solicita por escrito a la alcaldía una copia de un documento público." },
      { id: "popular", concepto: "Acción popular", texto: "Un grupo de vecinos pide al juez frenar la contaminación de una quebrada que afecta a todo el barrio." },
      { id: "cumplimiento", concepto: "Acción de cumplimiento", texto: "Un ciudadano exige a un juez que obligue a una autoridad a cumplir una ley que ha ignorado." },
      { id: "veeduria", concepto: "Veeduría ciudadana", texto: "Un grupo de vecinos vigila que la construcción de un colegio se ejecute como se contrató." },
      { id: "rendicion", concepto: "Rendición de cuentas", texto: "El alcalde presenta a la comunidad qué logró con el presupuesto del último año." },
      { id: "jac", concepto: "Junta de Acción Comunal", texto: "Los habitantes de una vereda se organizan para gestionar la reparación de su camino." },
      { id: "habeas", concepto: "Hábeas corpus", texto: "Una persona es retenida sin orden legal y su familia pide al juez que ordene su libertad." }
    ]
  },
  {
    id: "datos-clave",
    titulo: "Datos clave de cada mecanismo",
    nivel: "media",
    modo: "inverso",
    encabezadoFilas: "Mecanismos",
    encabezadoFichas: "Datos clave",
    emoji: "🔑",
    pares: [
      { id: "plebiscito", concepto: "Plebiscito", texto: "Solo lo puede convocar el Presidente de la República." },
      { id: "revocatoria", concepto: "Revocatoria del mandato", texto: "Se aplica únicamente a alcaldes y gobernadores." },
      { id: "cabildo", concepto: "Cabildo abierto", texto: "Se realiza ante concejos, asambleas o juntas administradoras locales." },
      { id: "voto", concepto: "Voto", texto: "Es un derecho y, a la vez, un deber ciudadano." },
      { id: "iniciativa", concepto: "Iniciativa popular", texto: "Permite a la ciudadanía proponer proyectos de ley, ordenanza o acuerdo." },
      { id: "referendo", concepto: "Referendo", texto: "Puede aprobar o derogar una norma sometida al pueblo." },
      { id: "consulta", concepto: "Consulta popular", texto: "Plantea una pregunta de sí o no sobre un asunto de interés general." },
      { id: "tutela", concepto: "Acción de tutela", texto: "El juez debe resolverla en un plazo muy corto." }
    ]
  },
  {
    id: "conceptos-democracia",
    titulo: "Conceptos de la democracia",
    nivel: "dificil",
    modo: "normal",
    encabezadoFilas: "Definiciones",
    encabezadoFichas: "Conceptos",
    emoji: "💡",
    pares: [
      { id: "democracia", concepto: "Democracia", texto: "Sistema de gobierno en el que la autoridad se elige y se renueva mediante el voto." },
      { id: "soberania", concepto: "Soberanía popular", texto: "Idea de que el poder máximo pertenece al pueblo y de él procede el poder público." },
      { id: "pluralismo", concepto: "Pluralismo", texto: "Respeto por la convivencia de ideas, creencias y grupos distintos." },
      { id: "representacion", concepto: "Representación", texto: "Los ciudadanos eligen a otras personas para que decidan en su nombre." },
      { id: "transparencia", concepto: "Transparencia", texto: "Actuar a la vista de todos, de modo que la gestión pueda conocerse y revisarse." },
      { id: "control-social", concepto: "Control social", texto: "Vigilancia que la ciudadanía ejerce sobre la gestión de los asuntos públicos." },
      { id: "ciudadania", concepto: "Ciudadanía", texto: "Condición que permite ejercer derechos y deberes políticos, como votar." },
      { id: "constitucion", concepto: "Constitución", texto: "Norma suprema del Estado, de la que dependen las demás reglas." }
    ]
  }
];

if (typeof module !== "undefined") module.exports = MATCHING_VERSIONS;
