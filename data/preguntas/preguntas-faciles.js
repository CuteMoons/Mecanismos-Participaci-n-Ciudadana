/**
 * data/preguntas/preguntas-faciles.js
 *
 * Banco de preguntas de dificultad FÁCIL.
 * 40 preguntas de opción múltiple (A-D), 5 por mecanismo,
 * provenientes del banco oficial entregado por la profesora.
 * Los estudiantes eligen su respuesta en papel (A/B/C/D); la
 * profesora registra los aciertos al final de la actividad.
 */

const PREGUNTAS_FACILES = [
  {
    id: "tutela-001",
    mecanismo: "tutela",
    dificultad: "facil",
    pregunta: "¿Para qué sirve la acción de tutela?",
    opciones: {
      A: "Para crear nuevas leyes.",
      B: "Para proteger los derechos fundamentales.",
      C: "Para elegir alcaldes.",
      D: "Para aprobar impuestos."
    },
    respuestaCorrecta: "B"
  },
  {
    id: "tutela-002",
    mecanismo: "tutela",
    dificultad: "facil",
    pregunta: "¿Quién puede presentar una acción de tutela?",
    opciones: {
      A: "Solo los abogados.",
      B: "Cualquier persona cuyos derechos fundamentales hayan sido vulnerados o amenazados.",
      C: "Únicamente el Presidente.",
      D: "Solo los jueces."
    },
    respuestaCorrecta: "B"
  },
  {
    id: "tutela-003",
    mecanismo: "tutela",
    dificultad: "facil",
    pregunta: "¿La tutela busca proteger principalmente\\...?",
    opciones: {
      A: "Los bienes materiales.",
      B: "Los derechos fundamentales.",
      C: "Los impuestos.",
      D: "Los contratos privados."
    },
    respuestaCorrecta: "B"
  },
  {
    id: "tutela-004",
    mecanismo: "tutela",
    dificultad: "facil",
    pregunta: "¿La acción de tutela normalmente ofrece una solución\\...?",
    opciones: {
      A: "Muy rápida.",
      B: "Después de varios años.",
      C: "Solo cuando termina un gobierno.",
      D: "Nunca."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "tutela-005",
    mecanismo: "tutela",
    dificultad: "facil",
    pregunta: "¿En qué Constitución colombiana quedó consagrada la acción de tutela?",
    opciones: {
      A: "1886",
      B: "1991",
      C: "1810",
      D: "2002"
    },
    respuestaCorrecta: "B"
  },
  {
    id: "derecho-peticion-016",
    mecanismo: "derecho-peticion",
    dificultad: "facil",
    pregunta: "¿Qué es el derecho de petición?",
    opciones: {
      A: "Un mecanismo para elegir gobernantes.",
      B: "Un derecho que permite solicitar información, presentar peticiones, quejas, reclamos o consultas ante autoridades o algunas entidades privadas.",
      C: "Un mecanismo para modificar la Constitución.",
      D: "Un impuesto obligatorio."
    },
    respuestaCorrecta: "B"
  },
  {
    id: "derecho-peticion-017",
    mecanismo: "derecho-peticion",
    dificultad: "facil",
    pregunta: "¿Quién puede ejercer el derecho de petición?",
    opciones: {
      A: "Solo los funcionarios públicos.",
      B: "Solo los abogados.",
      C: "Cualquier persona.",
      D: "Solo los jueces."
    },
    respuestaCorrecta: "C"
  },
  {
    id: "derecho-peticion-018",
    mecanismo: "derecho-peticion",
    dificultad: "facil",
    pregunta: "¿Cuál es uno de los principales objetivos del derecho de petición?",
    opciones: {
      A: "Comprar bienes públicos.",
      B: "Obtener una respuesta oportuna de una autoridad o entidad.",
      C: "Elegir congresistas.",
      D: "Crear nuevos municipios."
    },
    respuestaCorrecta: "B"
  },
  {
    id: "derecho-peticion-019",
    mecanismo: "derecho-peticion",
    dificultad: "facil",
    pregunta: "¿El derecho de petición está reconocido por la Constitución Política de Colombia?",
    opciones: {
      A: "Sí.",
      B: "No.",
      C: "Solo en algunos departamentos.",
      D: "Únicamente para funcionarios públicos."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "derecho-peticion-020",
    mecanismo: "derecho-peticion",
    dificultad: "facil",
    pregunta: "¿Qué puede solicitar una persona mediante un derecho de petición?",
    opciones: {
      A: "Información pública.",
      B: "Una consulta.",
      C: "Un reclamo.",
      D: "Todas las anteriores."
    },
    respuestaCorrecta: "D"
  },
  {
    id: "referendo-031",
    mecanismo: "referendo",
    dificultad: "facil",
    pregunta: "¿Qué es un referendo?",
    opciones: {
      A: "Un mecanismo mediante el cual los ciudadanos aprueban o rechazan una norma jurídica mediante votación.",
      B: "Una reunión entre concejales.",
      C: "Una demanda judicial.",
      D: "Una elección presidencial."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "referendo-032",
    mecanismo: "referendo",
    dificultad: "facil",
    pregunta: "¿Quién participa en un referendo?",
    opciones: {
      A: "Solo los congresistas.",
      B: "Los ciudadanos habilitados para votar.",
      C: "Solo los jueces.",
      D: "Únicamente el Presidente."
    },
    respuestaCorrecta: "B"
  },
  {
    id: "referendo-033",
    mecanismo: "referendo",
    dificultad: "facil",
    pregunta: "¿Qué se busca con un referendo?",
    opciones: {
      A: "Aprobar o rechazar normas jurídicas.",
      B: "Elegir alcaldes.",
      C: "Nombrar ministros.",
      D: "Crear departamentos."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "referendo-034",
    mecanismo: "referendo",
    dificultad: "facil",
    pregunta: "¿El referendo es un mecanismo de participación ciudadana?",
    opciones: {
      A: "Sí.",
      B: "No.",
      C: "Solo en algunos departamentos.",
      D: "Solo durante elecciones presidenciales."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "referendo-035",
    mecanismo: "referendo",
    dificultad: "facil",
    pregunta: "¿Los ciudadanos expresan su decisión en un referendo mediante\\...?",
    opciones: {
      A: "Un contrato.",
      B: "Una encuesta.",
      C: "El voto.",
      D: "Una carta."
    },
    respuestaCorrecta: "C"
  },
  {
    id: "plebiscito-046",
    mecanismo: "plebiscito",
    dificultad: "facil",
    pregunta: "¿Qué es un plebiscito?",
    opciones: {
      A: "Un mecanismo mediante el cual los ciudadanos apoyan o rechazan una decisión importante del Gobierno Nacional.",
      B: "Una reunión del Congreso.",
      C: "Una demanda judicial.",
      D: "Una elección de alcaldes."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "plebiscito-047",
    mecanismo: "plebiscito",
    dificultad: "facil",
    pregunta: "¿Quién puede convocar un plebiscito en Colombia?",
    opciones: {
      A: "El Presidente de la República.",
      B: "Cualquier ciudadano.",
      C: "Los gobernadores.",
      D: "Los jueces."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "plebiscito-048",
    mecanismo: "plebiscito",
    dificultad: "facil",
    pregunta: "¿Qué hacen los ciudadanos en un plebiscito?",
    opciones: {
      A: "Aprueban o rechazan una decisión política del Gobierno.",
      B: "Eligen congresistas.",
      C: "Presentan tutelas.",
      D: "Aprueban el presupuesto nacional."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "plebiscito-049",
    mecanismo: "plebiscito",
    dificultad: "facil",
    pregunta: "¿El plebiscito es un mecanismo de participación ciudadana?",
    opciones: {
      A: "Sí.",
      B: "No.",
      C: "Solo durante elecciones.",
      D: "Solo en municipios."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "plebiscito-050",
    mecanismo: "plebiscito",
    dificultad: "facil",
    pregunta: "¿Cómo participan los ciudadanos en un plebiscito?",
    opciones: {
      A: "Mediante una carta.",
      B: "A través del voto.",
      C: "Presentando una tutela.",
      D: "Mediante un derecho de petición."
    },
    respuestaCorrecta: "B"
  },
  {
    id: "consulta-popular-061",
    mecanismo: "consulta-popular",
    dificultad: "facil",
    pregunta: "¿Qué es una consulta popular?",
    opciones: {
      A: "Un mecanismo mediante el cual los ciudadanos responden una pregunta de interés general formulada por una autoridad.",
      B: "Una reunión del Congreso.",
      C: "Una elección presidencial.",
      D: "Una demanda judicial."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "consulta-popular-062",
    mecanismo: "consulta-popular",
    dificultad: "facil",
    pregunta: "¿Cómo participan los ciudadanos en una consulta popular?",
    opciones: {
      A: "Presentando una tutela.",
      B: "Mediante el voto.",
      C: "Enviando una carta.",
      D: "Pagando impuestos."
    },
    respuestaCorrecta: "B"
  },
  {
    id: "consulta-popular-063",
    mecanismo: "consulta-popular",
    dificultad: "facil",
    pregunta: "¿Cuál es el objetivo principal de una consulta popular?",
    opciones: {
      A: "Conocer la decisión de los ciudadanos sobre un asunto de interés público.",
      B: "Elegir alcaldes.",
      C: "Aprobar el presupuesto nacional.",
      D: "Presentar un derecho de petición."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "consulta-popular-064",
    mecanismo: "consulta-popular",
    dificultad: "facil",
    pregunta: "¿La consulta popular es un mecanismo de participación ciudadana?",
    opciones: {
      A: "Sí.",
      B: "No.",
      C: "Solo en elecciones presidenciales.",
      D: "Solo en municipios."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "consulta-popular-065",
    mecanismo: "consulta-popular",
    dificultad: "facil",
    pregunta: "¿Quién responde la pregunta planteada en una consulta popular?",
    opciones: {
      A: "Los ciudadanos habilitados para votar.",
      B: "Solo el Presidente.",
      C: "Los jueces.",
      D: "El Congreso."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "cabildo-abierto-076",
    mecanismo: "cabildo-abierto",
    dificultad: "facil",
    pregunta: "¿Qué es un cabildo abierto?",
    opciones: {
      A: "Una reunión pública donde los ciudadanos participan para debatir asuntos de interés local.",
      B: "Una elección presidencial.",
      C: "Una demanda judicial.",
      D: "Un impuesto."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "cabildo-abierto-077",
    mecanismo: "cabildo-abierto",
    dificultad: "facil",
    pregunta: "¿Dónde se realiza un cabildo abierto?",
    opciones: {
      A: "En concejos municipales o juntas administradoras locales.",
      B: "Solo en el Congreso.",
      C: "En juzgados.",
      D: "En colegios."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "cabildo-abierto-078",
    mecanismo: "cabildo-abierto",
    dificultad: "facil",
    pregunta: "¿Quiénes pueden participar?",
    opciones: {
      A: "Los ciudadanos.",
      B: "Solo alcaldes.",
      C: "Solo jueces.",
      D: "Solo congresistas."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "cabildo-abierto-079",
    mecanismo: "cabildo-abierto",
    dificultad: "facil",
    pregunta: "¿El cabildo abierto es un mecanismo de participación ciudadana?",
    opciones: {
      A: "Sí",
      B: "No",
      C: "Solo en elecciones",
      D: "Solo nacional"
    },
    respuestaCorrecta: "A"
  },
  {
    id: "cabildo-abierto-080",
    mecanismo: "cabildo-abierto",
    dificultad: "facil",
    pregunta: "¿Cuál es su finalidad?",
    opciones: {
      A: "Permitir que la comunidad exprese opiniones sobre asuntos públicos.",
      B: "Elegir presidente.",
      C: "Presentar tutelas.",
      D: "Aprobar impuestos."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "iniciativa-popular-091",
    mecanismo: "iniciativa-popular",
    dificultad: "facil",
    pregunta: "¿Qué es la iniciativa popular legislativa y normativa?",
    opciones: {
      A: "Un mecanismo que permite a los ciudadanos presentar proyectos de ley o de norma.",
      B: "Un mecanismo para elegir alcaldes.",
      C: "Una demanda judicial.",
      D: "Un impuesto."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "iniciativa-popular-092",
    mecanismo: "iniciativa-popular",
    dificultad: "facil",
    pregunta: "¿Quiénes pueden presentar una iniciativa popular?",
    opciones: {
      A: "Solo el Presidente.",
      B: "Los ciudadanos que cumplan los requisitos establecidos por la ley.",
      C: "Solo los jueces.",
      D: "Solo los congresistas."
    },
    respuestaCorrecta: "B"
  },
  {
    id: "iniciativa-popular-093",
    mecanismo: "iniciativa-popular",
    dificultad: "facil",
    pregunta: "¿Cuál es el objetivo principal de este mecanismo?",
    opciones: {
      A: "Permitir que los ciudadanos propongan normas o leyes.",
      B: "Elegir gobernadores.",
      C: "Presentar tutelas.",
      D: "Convocar plebiscitos."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "iniciativa-popular-094",
    mecanismo: "iniciativa-popular",
    dificultad: "facil",
    pregunta: "¿La iniciativa popular es un mecanismo de participación ciudadana?",
    opciones: {
      A: "Sí.",
      B: "No.",
      C: "Solo en municipios.",
      D: "Solo durante elecciones."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "iniciativa-popular-095",
    mecanismo: "iniciativa-popular",
    dificultad: "facil",
    pregunta: "¿Qué deben hacer los ciudadanos para respaldar una iniciativa popular?",
    opciones: {
      A: "Reunir las firmas exigidas por la ley.",
      B: "Pagar impuestos.",
      C: "Presentar una tutela.",
      D: "Solicitar un derecho de petición."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "revocatoria-mandato-106",
    mecanismo: "revocatoria-mandato",
    dificultad: "facil",
    pregunta: "¿Qué es la revocatoria del mandato?",
    opciones: {
      A: "Un mecanismo para terminar anticipadamente el mandato de un alcalde o gobernador mediante votación ciudadana.",
      B: "Una elección presidencial.",
      C: "Una tutela.",
      D: "Un impuesto."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "revocatoria-mandato-107",
    mecanismo: "revocatoria-mandato",
    dificultad: "facil",
    pregunta: "¿A qué cargos se aplica principalmente?",
    opciones: {
      A: "Alcaldes y gobernadores.",
      B: "Presidentes de juntas.",
      C: "Jueces.",
      D: "Congresistas."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "revocatoria-mandato-108",
    mecanismo: "revocatoria-mandato",
    dificultad: "facil",
    pregunta: "¿Quién puede promover una revocatoria?",
    opciones: {
      A: "Los ciudadanos que cumplan los requisitos legales.",
      B: "Solo el Presidente.",
      C: "Solo jueces.",
      D: "Solo alcaldes."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "revocatoria-mandato-109",
    mecanismo: "revocatoria-mandato",
    dificultad: "facil",
    pregunta: "¿Es un mecanismo de participación ciudadana?",
    opciones: {
      A: "Sí.",
      B: "No.",
      C: "Solo nacional.",
      D: "Solo judicial."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "revocatoria-mandato-110",
    mecanismo: "revocatoria-mandato",
    dificultad: "facil",
    pregunta: "¿Cómo decide la ciudadanía?",
    opciones: {
      A: "Mediante el voto.",
      B: "Con una carta.",
      C: "Con tutela.",
      D: "Con derecho de petición."
    },
    respuestaCorrecta: "A"
  }
];
