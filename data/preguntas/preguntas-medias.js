/**
 * data/preguntas/preguntas-medias.js
 *
 * Banco de preguntas de dificultad MEDIA.
 * 40 preguntas de opción múltiple (A-D), 5 por mecanismo,
 * provenientes del banco oficial entregado por la profesora.
 * Los estudiantes eligen su respuesta en papel (A/B/C/D); la
 * profesora registra los aciertos al final de la actividad.
 */

const PREGUNTAS_MEDIAS = [
  {
    id: "tutela-006",
    mecanismo: "tutela",
    dificultad: "media",
    pregunta: "Un colegio niega injustificadamente el ingreso de un estudiante. ¿Qué mecanismo podría utilizar?",
    opciones: {
      A: "Referendo",
      B: "Tutela",
      C: "Plebiscito",
      D: "Cabildo Abierto"
    },
    respuestaCorrecta: "B"
  },
  {
    id: "tutela-007",
    mecanismo: "tutela",
    dificultad: "media",
    pregunta: "¿Qué tipo de derechos protege principalmente la tutela?",
    opciones: {
      A: "Comerciales",
      B: "Fundamentales",
      C: "Tributarios",
      D: "Deportivos"
    },
    respuestaCorrecta: "B"
  },
  {
    id: "tutela-008",
    mecanismo: "tutela",
    dificultad: "media",
    pregunta: "¿Cuál de estos derechos podría protegerse mediante una tutela?",
    opciones: {
      A: "Derecho a la vida",
      B: "Comprar un automóvil",
      C: "Vacaciones pagadas",
      D: "Abrir una empresa"
    },
    respuestaCorrecta: "A"
  },
  {
    id: "tutela-009",
    mecanismo: "tutela",
    dificultad: "media",
    pregunta: "¿Cuál fue uno de los principales objetivos de crear la tutela en 1991?",
    opciones: {
      A: "Aumentar impuestos",
      B: "Brindar una protección rápida y efectiva de los derechos fundamentales",
      C: "Elegir gobernadores",
      D: "Crear departamentos"
    },
    respuestaCorrecta: "B"
  },
  {
    id: "tutela-010",
    mecanismo: "tutela",
    dificultad: "media",
    pregunta: "¿Cuál situación podría justificar una tutela?",
    opciones: {
      A: "Un hospital niega atención médica urgente",
      B: "Comprar una bicicleta",
      C: "Solicitar vacaciones",
      D: "Cambiar de equipo"
    },
    respuestaCorrecta: "A"
  },
  {
    id: "derecho-peticion-021",
    mecanismo: "derecho-peticion",
    dificultad: "media",
    pregunta: "Si un ciudadano desea conocer cómo se invirtieron los recursos de una obra pública, ¿qué mecanismo debería utilizar?",
    opciones: {
      A: "Tutela.",
      B: "Derecho de Petición.",
      C: "Referendo.",
      D: "Revocatoria del Mandato."
    },
    respuestaCorrecta: "B"
  },
  {
    id: "derecho-peticion-022",
    mecanismo: "derecho-peticion",
    dificultad: "media",
    pregunta: "¿Cuál de las siguientes solicitudes corresponde a un derecho de petición?",
    opciones: {
      A: "Solicitar copia de un documento público.",
      B: "Elegir un alcalde.",
      C: "Aprobar una ley.",
      D: "Convocar elecciones."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "derecho-peticion-023",
    mecanismo: "derecho-peticion",
    dificultad: "media",
    pregunta: "¿Cuál de estas opciones NO corresponde al derecho de petición?",
    opciones: {
      A: "Solicitar información.",
      B: "Presentar una consulta.",
      C: "Presentar una queja.",
      D: "Elegir al Presidente."
    },
    respuestaCorrecta: "D"
  },
  {
    id: "derecho-peticion-024",
    mecanismo: "derecho-peticion",
    dificultad: "media",
    pregunta: "¿Qué debe hacer una entidad cuando recibe un derecho de petición?",
    opciones: {
      A: "Ignorarlo.",
      B: "Responder dentro de los plazos establecidos por la ley.",
      C: "Cobrar dinero por responder.",
      D: "Enviarlo automáticamente a un juez."
    },
    respuestaCorrecta: "B"
  },
  {
    id: "derecho-peticion-025",
    mecanismo: "derecho-peticion",
    dificultad: "media",
    pregunta: "Si una entidad pública no responde un derecho de petición dentro del plazo legal, ¿qué derecho podría verse afectado?",
    opciones: {
      A: "El derecho a obtener una respuesta oportuna.",
      B: "El derecho al voto.",
      C: "El derecho a la nacionalidad.",
      D: "El derecho a portar armas."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "referendo-036",
    mecanismo: "referendo",
    dificultad: "media",
    pregunta: "¿Cuál de las siguientes situaciones podría resolverse mediante un referendo?",
    opciones: {
      A: "Aprobar una reforma constitucional.",
      B: "Elegir un rector.",
      C: "Solicitar información pública.",
      D: "Presentar una tutela."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "referendo-037",
    mecanismo: "referendo",
    dificultad: "media",
    pregunta: "¿Qué diferencia al referendo de una elección ordinaria?",
    opciones: {
      A: "En el referendo se vota sobre una norma jurídica, no sobre personas.",
      B: "En ambos se eligen funcionarios públicos.",
      C: "El referendo solo puede realizarse en municipios.",
      D: "Ninguna de las anteriores."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "referendo-038",
    mecanismo: "referendo",
    dificultad: "media",
    pregunta: "¿Cuál de estas opciones corresponde a un ejemplo de referendo?",
    opciones: {
      A: "Votar para aprobar una reforma a la Constitución.",
      B: "Presentar una queja.",
      C: "Solicitar atención médica.",
      D: "Elegir un alcalde."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "referendo-039",
    mecanismo: "referendo",
    dificultad: "media",
    pregunta: "¿Qué principio democrático fortalece el referendo?",
    opciones: {
      A: "La participación directa de los ciudadanos.",
      B: "La autoridad exclusiva del Congreso.",
      C: "El poder de los jueces.",
      D: "La elección de gobernadores."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "referendo-040",
    mecanismo: "referendo",
    dificultad: "media",
    pregunta: "¿Cuál afirmación sobre el referendo es correcta?",
    opciones: {
      A: "Permite que la ciudadanía participe directamente en decisiones normativas.",
      B: "Solo participa el Congreso.",
      C: "Reemplaza elecciones.",
      D: "Sirve para quejas."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "plebiscito-051",
    mecanismo: "plebiscito",
    dificultad: "media",
    pregunta: "¿Cuál de las siguientes situaciones podría someterse a un plebiscito?",
    opciones: {
      A: "Una decisión política importante del Gobierno Nacional.",
      B: "La elección de un alcalde.",
      C: "Una reforma al reglamento de un colegio.",
      D: "Una consulta médica."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "plebiscito-052",
    mecanismo: "plebiscito",
    dificultad: "media",
    pregunta: "¿Cuál es la principal diferencia entre un plebiscito y un referendo?",
    opciones: {
      A: "El plebiscito consulta decisiones políticas del Gobierno; el referendo consulta normas jurídicas.",
      B: "Son exactamente iguales.",
      C: "El plebiscito sirve para elegir congresistas.",
      D: "El referendo solo puede realizarse en municipios."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "plebiscito-053",
    mecanismo: "plebiscito",
    dificultad: "media",
    pregunta: "¿Qué principio fortalece el plebiscito?",
    opciones: {
      A: "La participación ciudadana en decisiones gubernamentales.",
      B: "La elección de jueces.",
      C: "El pago de impuestos.",
      D: "La creación de empresas."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "plebiscito-054",
    mecanismo: "plebiscito",
    dificultad: "media",
    pregunta: "¿Cuál representa un ejemplo de plebiscito?",
    opciones: {
      A: "Consultar a los ciudadanos si apoyan una decisión política del Gobierno.",
      B: "Elegir un gobernador.",
      C: "Solicitar un documento público.",
      D: "Presentar una tutela."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "plebiscito-055",
    mecanismo: "plebiscito",
    dificultad: "media",
    pregunta: "¿Cuál es el papel del ciudadano en un plebiscito?",
    opciones: {
      A: "Expresar su apoyo o rechazo mediante el voto.",
      B: "Redactar leyes.",
      C: "Elegir magistrados.",
      D: "Aprobar el presupuesto municipal."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "consulta-popular-066",
    mecanismo: "consulta-popular",
    dificultad: "media",
    pregunta: "¿Cuál situación podría someterse a una consulta popular?",
    opciones: {
      A: "Preguntar a los ciudadanos si están de acuerdo con un proyecto de gran impacto para su comunidad.",
      B: "Elegir un senador.",
      C: "Presentar una tutela.",
      D: "Solicitar una copia de un documento público."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "consulta-popular-067",
    mecanismo: "consulta-popular",
    dificultad: "media",
    pregunta: "¿Qué diferencia principalmente una consulta popular de un referendo?",
    opciones: {
      A: "La consulta popular busca conocer la opinión ciudadana sobre una pregunta; el referendo aprueba o rechaza una norma jurídica.",
      B: "Son iguales.",
      C: "El referendo solo puede realizarse en municipios.",
      D: "La consulta popular sirve para elegir gobernadores."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "consulta-popular-068",
    mecanismo: "consulta-popular",
    dificultad: "media",
    pregunta: "¿Qué principio fortalece la consulta popular?",
    opciones: {
      A: "La participación directa de los ciudadanos.",
      B: "El aumento de impuestos.",
      C: "La elección de jueces.",
      D: "La creación de empresas."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "consulta-popular-069",
    mecanismo: "consulta-popular",
    dificultad: "media",
    pregunta: "¿Cuál representa un ejemplo de consulta popular?",
    opciones: {
      A: "Preguntar a los habitantes si están de acuerdo con la construcción de un proyecto en su municipio.",
      B: "Elegir un alcalde.",
      C: "Presentar una tutela.",
      D: "Solicitar información pública."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "consulta-popular-070",
    mecanismo: "consulta-popular",
    dificultad: "media",
    pregunta: "¿Cuál es el papel del ciudadano en una consulta popular?",
    opciones: {
      A: "Responder la pregunta mediante el voto.",
      B: "Elaborar leyes.",
      C: "Elegir magistrados.",
      D: "Aprobar el presupuesto nacional."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "cabildo-abierto-081",
    mecanismo: "cabildo-abierto",
    dificultad: "media",
    pregunta: "¿Qué tema podría tratarse en un cabildo abierto?",
    opciones: {
      A: "Problemas de movilidad del municipio.",
      B: "Elegir un senador.",
      C: "Resolver un juicio.",
      D: "Emitir pasaportes."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "cabildo-abierto-082",
    mecanismo: "cabildo-abierto",
    dificultad: "media",
    pregunta: "¿Qué fortalece el cabildo abierto?",
    opciones: {
      A: "La participación directa de la comunidad.",
      B: "La autoridad exclusiva del Congreso.",
      C: "El sistema judicial.",
      D: "Los partidos políticos."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "cabildo-abierto-083",
    mecanismo: "cabildo-abierto",
    dificultad: "media",
    pregunta: "¿Cuál es un ejemplo de cabildo abierto?",
    opciones: {
      A: "Debatir un proyecto ambiental con la comunidad.",
      B: "Presentar un derecho de petición.",
      C: "Elegir alcalde.",
      D: "Interponer tutela."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "cabildo-abierto-084",
    mecanismo: "cabildo-abierto",
    dificultad: "media",
    pregunta: "¿Qué pueden hacer los ciudadanos durante un cabildo abierto?",
    opciones: {
      A: "Expresar opiniones y propuestas.",
      B: "Dictar sentencias.",
      C: "Modificar la Constitución.",
      D: "Elegir ministros."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "cabildo-abierto-085",
    mecanismo: "cabildo-abierto",
    dificultad: "media",
    pregunta: "¿Quién convoca normalmente un cabildo abierto?",
    opciones: {
      A: "La corporación pública competente conforme a la ley.",
      B: "Cualquier empresa privada.",
      C: "Los jueces.",
      D: "La Registraduría."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "iniciativa-popular-096",
    mecanismo: "iniciativa-popular",
    dificultad: "media",
    pregunta: "¿Qué puede proponerse mediante una iniciativa popular?",
    opciones: {
      A: "Un proyecto de ley o una propuesta normativa.",
      B: "Una sentencia judicial.",
      C: "La elección de un alcalde.",
      D: "Un tratado internacional."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "iniciativa-popular-097",
    mecanismo: "iniciativa-popular",
    dificultad: "media",
    pregunta: "¿Qué fortalece este mecanismo?",
    opciones: {
      A: "La participación ciudadana en la elaboración de normas.",
      B: "El poder exclusivo del Congreso.",
      C: "El sistema judicial.",
      D: "Los partidos políticos."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "iniciativa-popular-098",
    mecanismo: "iniciativa-popular",
    dificultad: "media",
    pregunta: "¿Cuál es un ejemplo de iniciativa popular?",
    opciones: {
      A: "Un grupo de ciudadanos presenta un proyecto para proteger los recursos naturales.",
      B: "Un juez dicta una sentencia.",
      C: "Un alcalde presenta su plan de gobierno.",
      D: "Un ciudadano interpone una tutela."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "iniciativa-popular-099",
    mecanismo: "iniciativa-popular",
    dificultad: "media",
    pregunta: "¿Qué sucede después de reunir las firmas necesarias?",
    opciones: {
      A: "La propuesta puede ser presentada para su estudio por la autoridad competente.",
      B: "Se convierte automáticamente en ley.",
      C: "El Presidente debe aprobarla inmediatamente.",
      D: "Se realiza un plebiscito."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "iniciativa-popular-100",
    mecanismo: "iniciativa-popular",
    dificultad: "media",
    pregunta: "¿Cuál es el papel de los ciudadanos en este mecanismo?",
    opciones: {
      A: "Proponer iniciativas que beneficien a la comunidad.",
      B: "Elegir jueces.",
      C: "Aprobar sentencias.",
      D: "Convocar elecciones."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "revocatoria-mandato-111",
    mecanismo: "revocatoria-mandato",
    dificultad: "media",
    pregunta: "¿Cuál es el objetivo principal?",
    opciones: {
      A: "Permitir que los ciudadanos decidan si un alcalde o gobernador debe continuar en el cargo.",
      B: "Elegir congresistas.",
      C: "Crear leyes.",
      D: "Resolver juicios."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "revocatoria-mandato-112",
    mecanismo: "revocatoria-mandato",
    dificultad: "media",
    pregunta: "¿Qué debe hacerse antes de la votación?",
    opciones: {
      A: "Cumplir los requisitos y reunir los apoyos establecidos por la ley.",
      B: "Presentar una tutela.",
      C: "Convocar un referendo.",
      D: "Aprobar una ley."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "revocatoria-mandato-113",
    mecanismo: "revocatoria-mandato",
    dificultad: "media",
    pregunta: "¿Qué fortalece este mecanismo?",
    opciones: {
      A: "El control ciudadano sobre los gobernantes elegidos.",
      B: "El poder judicial.",
      C: "Los impuestos.",
      D: "Las empresas."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "revocatoria-mandato-114",
    mecanismo: "revocatoria-mandato",
    dificultad: "media",
    pregunta: "¿Cuál es un ejemplo?",
    opciones: {
      A: "Los ciudadanos solicitan votar para decidir la permanencia de un alcalde.",
      B: "Elegir un senador.",
      C: "Presentar un derecho de petición.",
      D: "Aprobar una reforma constitucional."
    },
    respuestaCorrecta: "A"
  },
  {
    id: "revocatoria-mandato-115",
    mecanismo: "revocatoria-mandato",
    dificultad: "media",
    pregunta: "¿Qué ocurre si se cumplen los requisitos legales y la opción de revocar obtiene el respaldo exigido?",
    opciones: {
      A: "El mandato termina anticipadamente conforme a la ley.",
      B: "El alcalde continúa automáticamente.",
      C: "Se anulan las elecciones nacionales.",
      D: "Se elimina la alcaldía."
    },
    respuestaCorrecta: "A"
  }
];
