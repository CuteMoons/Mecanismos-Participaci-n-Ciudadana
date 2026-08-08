/**
 * data/preguntas/preguntas-dificiles.js
 *
 * Banco de preguntas de dificultad DIFÍCIL.
 * 40 preguntas de opción múltiple (A-D), 5 por mecanismo,
 * provenientes del banco oficial entregado por la profesora.
 * Los estudiantes eligen su respuesta en papel (A/B/C/D); la
 * profesora registra los aciertos al final de la actividad.
 */

const PREGUNTAS_DIFICILES = [
  {
    id: "tutela-011",
    mecanismo: "tutela",
    dificultad: "dificil",
    pregunta: "¿En qué año comenzó a regir la Constitución que creó la tutela?",
    opciones: {
      A: "1986",
      B: "1991",
      C: "1994",
      D: "2000"
    },
    respuestaCorrecta: "B"
  },
  {
    id: "tutela-012",
    mecanismo: "tutela",
    dificultad: "dificil",
    pregunta: "¿Principal diferencia entre tutela y derecho de petición?",
    opciones: {
      A: "La tutela protege derechos fundamentales; el derecho de petición sirve para solicitar información o respuestas",
      B: "Son iguales",
      C: "Ambos sirven para votar",
      D: "Ninguna"
    },
    respuestaCorrecta: "A"
  },
  {
    id: "tutela-013",
    mecanismo: "tutela",
    dificultad: "dificil",
    pregunta: "Si se vulnera el derecho a la salud y se necesita una solución urgente, ¿qué mecanismo usar?",
    opciones: {
      A: "Consulta Popular",
      B: "Cabildo Abierto",
      C: "Tutela",
      D: "Revocatoria del Mandato"
    },
    respuestaCorrecta: "C"
  },
  {
    id: "tutela-014",
    mecanismo: "tutela",
    dificultad: "dificil",
    pregunta: "¿Cuál afirmación es correcta?",
    opciones: {
      A: "Solo puede presentarse en elecciones",
      B: "Fue creada por la Constitución de 1991 para proteger derechos fundamentales",
      C: "Sirve para aprobar leyes",
      D: "Solo la usan congresistas"
    },
    respuestaCorrecta: "B"
  },
  {
    id: "tutela-015",
    mecanismo: "tutela",
    dificultad: "dificil",
    pregunta: "¿Por qué la tutela es uno de los mecanismos más importantes?",
    opciones: {
      A: "Permite modificar la Constitución",
      B: "Ofrece un mecanismo rápido y efectivo para proteger derechos fundamentales",
      C: "Reemplaza todas las leyes",
      D: "Solo la utilizan jueces"
    },
    respuestaCorrecta: "B"
  },
  {
    id: "derecho-peticion-026",
    mecanismo: "derecho-peticion",
    dificultad: "dificil",
    pregunta: "¿Qué artículo de la Constitución Política de Colombia reconoce el derecho de petición?",
    opciones: {
      A: "Artículo 23.",
      B: "Artículo 86.",
      C: "Artículo 40.",
      D: "Artículo 103."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "derecho-peticion-027",
    mecanismo: "derecho-peticion",
    dificultad: "dificil",
    pregunta: "¿Cuál de las siguientes afirmaciones es correcta?",
    opciones: {
      A: "El derecho de petición únicamente puede dirigirse a entidades públicas.",
      B: "También puede presentarse ante algunas entidades privadas en los casos previstos por la ley.",
      C: "Solo pueden presentarlo los abogados.",
      D: "Solo existe durante épocas electorales."
    },
    respuestaCorrecta: "B"
  },
  {
    id: "derecho-peticion-028",
    mecanismo: "derecho-peticion",
    dificultad: "dificil",
    pregunta: "¿Qué diferencia existe entre la tutela y el derecho de petición?",
    opciones: {
      A: "La tutela protege derechos fundamentales; el derecho de petición permite solicitar información, consultas, reclamos o peticiones.",
      B: "Ambos sirven exactamente para lo mismo.",
      C: "La tutela sirve para votar.",
      D: "El derecho de petición sirve para destituir gobernadores."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "derecho-peticion-029",
    mecanismo: "derecho-peticion",
    dificultad: "dificil",
    pregunta: "¿Cuál de las siguientes situaciones representa el mejor ejemplo de un derecho de petición?",
    opciones: {
      A: "Solicitar a una alcaldía información sobre el presupuesto destinado a la educación.",
      B: "Elegir un senador.",
      C: "Revocar el mandato de un alcalde.",
      D: "Aprobar una reforma constitucional."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "derecho-peticion-030",
    mecanismo: "derecho-peticion",
    dificultad: "dificil",
    pregunta: "¿Por qué el derecho de petición es considerado un mecanismo importante para la participación ciudadana?",
    opciones: {
      A: "Porque facilita la comunicación entre ciudadanos y autoridades, promoviendo la transparencia y el acceso a la información.",
      B: "Porque reemplaza las elecciones.",
      C: "Porque permite modificar la Constitución sin votar.",
      D: "Porque elimina la necesidad de las entidades públicas."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "referendo-041",
    mecanismo: "referendo",
    dificultad: "dificil",
    pregunta: "¿En cuál Constitución colombiana quedó reconocido el referendo como mecanismo de participación ciudadana?",
    opciones: {
      A: "1886",
      B: "1991",
      C: "1810",
      D: "1905"
    },
    respuestaCorrecta: "B"
  },
  {
    id: "referendo-042",
    mecanismo: "referendo",
    dificultad: "dificil",
    pregunta: "¿Qué diferencia correctamente el referendo del plebiscito?",
    opciones: {
      A: "El referendo consulta sobre normas jurídicas; el plebiscito sobre decisiones políticas del Gobierno.",
      B: "Son iguales.",
      C: "El plebiscito elige congresistas.",
      D: "El referendo protege derechos fundamentales."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "referendo-043",
    mecanismo: "referendo",
    dificultad: "dificil",
    pregunta: "¿Qué sucede si la ciudadanía rechaza una norma sometida a referendo?",
    opciones: {
      A: "La norma no es aprobada.",
      B: "Se convierte en ley.",
      C: "El Presidente decide.",
      D: "El Congreso ignora la votación."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "referendo-044",
    mecanismo: "referendo",
    dificultad: "dificil",
    pregunta: "¿Por qué el referendo es un mecanismo de democracia directa?",
    opciones: {
      A: "Porque los ciudadanos votan directamente sobre una norma.",
      B: "Porque decide el Congreso.",
      C: "Porque solo participan jueces.",
      D: "Porque no requiere votación."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "referendo-045",
    mecanismo: "referendo",
    dificultad: "dificil",
    pregunta: "¿Cuál es el principal objetivo del referendo?",
    opciones: {
      A: "Permitir que los ciudadanos aprueben o rechacen normas jurídicas mediante el voto.",
      B: "Elegir al Presidente.",
      C: "Proteger derechos fundamentales.",
      D: "Presentar solicitudes."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "plebiscito-056",
    mecanismo: "plebiscito",
    dificultad: "dificil",
    pregunta: "¿En qué Constitución quedó reconocido el plebiscito como mecanismo de participación ciudadana?",
    opciones: {
      A: "1886",
      B: "1991",
      C: "1810",
      D: "1905"
    },
    respuestaCorrecta: "B"
  },
  {
    id: "plebiscito-057",
    mecanismo: "plebiscito",
    dificultad: "dificil",
    pregunta: "¿Cuál afirmación es correcta sobre el plebiscito?",
    opciones: {
      A: "Permite que los ciudadanos apoyen o rechacen decisiones políticas del Gobierno Nacional.",
      B: "Sirve para proteger derechos fundamentales.",
      C: "Se utiliza para presentar proyectos de ley.",
      D: "Reemplaza las elecciones presidenciales."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "plebiscito-058",
    mecanismo: "plebiscito",
    dificultad: "dificil",
    pregunta: "¿Qué diferencia correctamente un plebiscito de una consulta popular?",
    opciones: {
      A: "El plebiscito trata decisiones políticas del Gobierno Nacional; la consulta popular consulta asuntos de interés general.",
      B: "Son iguales.",
      C: "Ambos sirven para elegir gobernadores.",
      D: "Ninguna."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "plebiscito-059",
    mecanismo: "plebiscito",
    dificultad: "dificil",
    pregunta: "¿Por qué el plebiscito fortalece la democracia?",
    opciones: {
      A: "Porque permite que los ciudadanos participen directamente en decisiones políticas importantes del Gobierno.",
      B: "Porque elimina al Congreso.",
      C: "Porque reemplaza las elecciones.",
      D: "Porque únicamente participan funcionarios."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "plebiscito-060",
    mecanismo: "plebiscito",
    dificultad: "dificil",
    pregunta: "¿Cuál es el principal objetivo del plebiscito?",
    opciones: {
      A: "Permitir que la ciudadanía exprese mediante el voto si apoya o rechaza una decisión política importante del Gobierno Nacional.",
      B: "Elegir al Presidente.",
      C: "Aprobar leyes directamente.",
      D: "Presentar solicitudes."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "consulta-popular-071",
    mecanismo: "consulta-popular",
    dificultad: "dificil",
    pregunta: "¿En qué Constitución quedó reconocida la consulta popular?",
    opciones: {
      A: "1886",
      B: "1991",
      C: "1810",
      D: "1905"
    },
    respuestaCorrecta: "B"
  },
  {
    id: "consulta-popular-072",
    mecanismo: "consulta-popular",
    dificultad: "dificil",
    pregunta: "¿Cuál afirmación es correcta sobre la consulta popular?",
    opciones: {
      A: "Permite conocer la opinión de la ciudadanía sobre asuntos de interés general.",
      B: "Sirve únicamente para elegir gobernadores.",
      C: "Protege derechos fundamentales.",
      D: "Reemplaza las elecciones presidenciales."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "consulta-popular-073",
    mecanismo: "consulta-popular",
    dificultad: "dificil",
    pregunta: "¿Qué diferencia correctamente una consulta popular de un plebiscito?",
    opciones: {
      A: "La consulta popular plantea preguntas sobre asuntos de interés general; el plebiscito busca apoyo o rechazo a una decisión política del Gobierno.",
      B: "Son iguales.",
      C: "Ambos sirven para aprobar leyes.",
      D: "Ninguna."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "consulta-popular-074",
    mecanismo: "consulta-popular",
    dificultad: "dificil",
    pregunta: "¿Por qué la consulta popular fortalece la democracia?",
    opciones: {
      A: "Porque permite que los ciudadanos expresen directamente su opinión sobre temas importantes.",
      B: "Porque elimina el Congreso.",
      C: "Porque reemplaza las elecciones.",
      D: "Porque solo participan funcionarios."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "consulta-popular-075",
    mecanismo: "consulta-popular",
    dificultad: "dificil",
    pregunta: "¿Cuál es el principal objetivo de la consulta popular?",
    opciones: {
      A: "Permitir que los ciudadanos decidan mediante el voto sobre una pregunta de interés público.",
      B: "Elegir al Presidente.",
      C: "Aprobar leyes.",
      D: "Presentar solicitudes."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "cabildo-abierto-086",
    mecanismo: "cabildo-abierto",
    dificultad: "dificil",
    pregunta: "¿En qué Constitución fue reconocido este mecanismo?",
    opciones: {
      A: "1886",
      B: "1991",
      C: "1810",
      D: "1905"
    },
    respuestaCorrecta: "B"
  },
  {
    id: "cabildo-abierto-087",
    mecanismo: "cabildo-abierto",
    dificultad: "dificil",
    pregunta: "¿Qué diferencia al cabildo abierto de una consulta popular?",
    opciones: {
      A: "En el cabildo se debate públicamente; en la consulta se vota una pregunta.",
      B: "Son iguales.",
      C: "Ambos eligen gobernadores.",
      D: "Ninguna."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "cabildo-abierto-088",
    mecanismo: "cabildo-abierto",
    dificultad: "dificil",
    pregunta: "¿Por qué fortalece la democracia?",
    opciones: {
      A: "Porque acerca a los ciudadanos a las decisiones locales.",
      B: "Porque reemplaza elecciones.",
      C: "Porque elimina concejos.",
      D: "Porque solo participan funcionarios."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "cabildo-abierto-089",
    mecanismo: "cabildo-abierto",
    dificultad: "dificil",
    pregunta: "¿Cuál es el principal objetivo del cabildo abierto?",
    opciones: {
      A: "Permitir la intervención directa de la ciudadanía en asuntos de interés público.",
      B: "Elegir presidente.",
      C: "Aprobar leyes nacionales.",
      D: "Proteger derechos fundamentales."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "cabildo-abierto-090",
    mecanismo: "cabildo-abierto",
    dificultad: "dificil",
    pregunta: "¿Qué nivel de gobierno utiliza con mayor frecuencia este mecanismo?",
    opciones: {
      A: "Municipal y local.",
      B: "Internacional.",
      C: "Privado.",
      D: "Judicial."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "iniciativa-popular-101",
    mecanismo: "iniciativa-popular",
    dificultad: "dificil",
    pregunta: "¿En qué Constitución quedó reconocida la iniciativa popular como mecanismo de participación ciudadana?",
    opciones: {
      A: "1886",
      B: "1991",
      C: "1810",
      D: "1905"
    },
    respuestaCorrecta: "B"
  },
  {
    id: "iniciativa-popular-102",
    mecanismo: "iniciativa-popular",
    dificultad: "dificil",
    pregunta: "¿Cuál afirmación es correcta?",
    opciones: {
      A: "La iniciativa popular permite a los ciudadanos participar directamente en la creación de propuestas normativas.",
      B: "Solo los congresistas pueden presentar proyectos de ley.",
      C: "Reemplaza al Congreso.",
      D: "Sirve para proteger derechos fundamentales."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "iniciativa-popular-103",
    mecanismo: "iniciativa-popular",
    dificultad: "dificil",
    pregunta: "¿Qué diferencia existe entre una iniciativa popular y un referendo?",
    opciones: {
      A: "La iniciativa popular propone normas; el referendo permite aprobarlas o rechazarlas mediante votación.",
      B: "Son exactamente iguales.",
      C: "Ambos sirven para elegir gobernadores.",
      D: "Ninguna."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "iniciativa-popular-104",
    mecanismo: "iniciativa-popular",
    dificultad: "dificil",
    pregunta: "¿Por qué este mecanismo fortalece la democracia?",
    opciones: {
      A: "Porque permite que la ciudadanía participe activamente en la creación de propuestas para mejorar el país.",
      B: "Porque elimina el Congreso.",
      C: "Porque reemplaza las elecciones.",
      D: "Porque solo participan funcionarios públicos."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "iniciativa-popular-105",
    mecanismo: "iniciativa-popular",
    dificultad: "dificil",
    pregunta: "¿Cuál es el principal objetivo de la iniciativa popular legislativa y normativa?",
    opciones: {
      A: "Permitir que los ciudadanos presenten proyectos de ley o normas de interés para la sociedad.",
      B: "Elegir al Presidente.",
      C: "Presentar derechos de petición.",
      D: "Aprobar sentencias judiciales."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "revocatoria-mandato-116",
    mecanismo: "revocatoria-mandato",
    dificultad: "dificil",
    pregunta: "¿En qué Constitución fue reconocida como mecanismo de participación?",
    opciones: {
      A: "1886",
      B: "1991",
      C: "1810",
      D: "1905"
    },
    respuestaCorrecta: "B"
  },
  {
    id: "revocatoria-mandato-117",
    mecanismo: "revocatoria-mandato",
    dificultad: "dificil",
    pregunta: "¿Qué diferencia la revocatoria del mandato de una elección ordinaria?",
    opciones: {
      A: "Permite decidir si un mandatario elegido continúa o no en el cargo antes de terminar su período.",
      B: "Sirve para crear leyes.",
      C: "Protege derechos fundamentales.",
      D: "Son iguales."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "revocatoria-mandato-118",
    mecanismo: "revocatoria-mandato",
    dificultad: "dificil",
    pregunta: "¿Por qué fortalece la democracia?",
    opciones: {
      A: "Porque permite a los ciudadanos ejercer control sobre sus gobernantes.",
      B: "Porque reemplaza las elecciones.",
      C: "Porque elimina el Congreso.",
      D: "Porque solo participan funcionarios."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "revocatoria-mandato-119",
    mecanismo: "revocatoria-mandato",
    dificultad: "dificil",
    pregunta: "¿Qué principio democrático representa principalmente?",
    opciones: {
      A: "La responsabilidad política y el control ciudadano.",
      B: "La separación de poderes.",
      C: "La autonomía judicial.",
      D: "La tributación."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "revocatoria-mandato-120",
    mecanismo: "revocatoria-mandato",
    dificultad: "dificil",
    pregunta: "¿Cuál es el principal objetivo de la revocatoria del mandato?",
    opciones: {
      A: "Permitir que la ciudadanía decida mediante el voto si un alcalde o gobernador debe continuar ejerciendo su cargo.",
      B: "Elegir al Presidente.",
      C: "Aprobar leyes.",
      D: "Presentar peticiones."
    },
    respuestaCorrecta: "A"
  }
];
