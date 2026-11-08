/**
 * data/situations/situaciones-data.js
 * Banco del juego «¿Qué harías en esta situación?».
 * Cada situación tiene UNA respuesta correcta y 3 distractores plausibles.
 * Fundamento: Constitución Política de 1991 (arts. 23, 86, 103, 155, 258, 270),
 * Ley 134 de 1994, Ley 850 de 2003, Ley 1755 de 2015 y Ley 1757 de 2015.
 * El orden de las opciones se mezcla al mostrar cada pregunta.
 */
(function () {
  const OPC = {
    tutela: "Acción de tutela",
    peticion: "Derecho de petición",
    referendo: "Referendo",
    plebiscito: "Plebiscito",
    consulta: "Consulta popular",
    cabildo: "Cabildo abierto",
    iniciativa: "Iniciativa popular",
    revocatoria: "Revocatoria del mandato",
    voto: "Voto",
    control: "Control social (veeduría ciudadana)"
  };
  const PREGUNTA = "¿Qué mecanismo sería el más adecuado?";

  function s(n, situacion, correcta, distractores, explicacion) {
    const opciones = distractores.map((k) => OPC[k]);
    const pos = n % 4;
    opciones.splice(pos, 0, OPC[correcta]);
    return { id: "sit-" + String(n).padStart(2, "0"), situacion, pregunta: PREGUNTA, opciones, correcta: pos, explicacion };
  }

  const SITUACIONES = [
    s(1, "En un barrio los cortes de agua son frecuentes. Los vecinos quieren exponer el problema, en persona y en una sesión pública, ante los concejales, y proponerles soluciones. En ese espacio no se votaría ninguna decisión sobre el tema.",
      "cabildo", ["revocatoria", "referendo", "plebiscito"],
      "El cabildo abierto es una reunión pública del concejo (o de la junta administradora local) en la que los habitantes intervienen directamente para discutir asuntos de interés de la comunidad. Se participa con voz, pero la decisión sigue siendo de la corporación."),
    s(2, "Una madre de familia quiere saber por qué todavía no han nombrado al profesor de matemáticas del colegio de su hija. Decide pedir una explicación por escrito a la Secretaría de Educación y exigir una respuesta.",
      "peticion", ["tutela", "plebiscito", "consulta"],
      "El derecho de petición permite pedir información o que una autoridad resuelva un asunto, y recibir una respuesta de fondo en los plazos legales. Como aún no se ha acudido a la entidad, ese es el primer paso; la tutela sería posterior si no responde."),
    s(3, "A un joven un médico le ordenó con urgencia una cirugía, pero su EPS se niega a autorizarla. Su salud empeora cada día y no existe otra vía igual de rápida para lograr que lo operen.",
      "tutela", ["peticion", "iniciativa", "voto"],
      "La acción de tutela protege de forma rápida los derechos fundamentales (como la vida y la salud) cuando están vulnerados o amenazados y no hay otro medio de defensa igual de eficaz. Un juez debe decidir en un plazo muy corto."),
    s(4, "Los habitantes de un municipio están muy inconformes: el alcalde dejó incumplido casi todo el programa de gobierno con el que fue elegido. Quieren que los votantes decidan si debe terminar su periodo antes de tiempo.",
      "revocatoria", ["plebiscito", "cabildo", "iniciativa"],
      "La revocatoria del mandato permite que los ciudadanos den por terminado, mediante una votación, el mandato de un alcalde o de un gobernador antes de que se cumpla su periodo, por ejemplo ante el incumplimiento del programa de gobierno."),
    s(5, "Un grupo de estudiantes y vecinos redactó un proyecto de acuerdo para que cada colegio del municipio tenga zonas verdes. Quieren presentarlo directamente ante el concejo para que lo discuta y lo vote.",
      "iniciativa", ["referendo", "voto", "peticion"],
      "Con la iniciativa popular (legislativa y normativa) un grupo de ciudadanos presenta proyectos de ley, ordenanza, acuerdo o resolución local ante la corporación competente, que está obligada a tramitarlos, aunque no a aprobarlos."),
    s(6, "Un grupo de ciudadanos cree que una ley vigente perjudica al país. Quieren que sea el pueblo, con su voto, quien decida si esa ley se mantiene o se elimina.",
      "referendo", ["plebiscito", "cabildo", "tutela"],
      "El referendo convoca al pueblo para que decida con su voto sobre una norma. Este caso es un referendo derogatorio (se decide si una norma vigente se deroga); también existe el aprobatorio, para un proyecto de norma."),
    s(7, "El Presidente de la República quiere saber si la ciudadanía respalda una decisión política importante que le corresponde tomar al Gobierno, y convoca a todo el país a responder sí o no.",
      "plebiscito", ["referendo", "iniciativa", "revocatoria"],
      "El plebiscito es el pronunciamiento del pueblo, convocado únicamente por el Presidente, para apoyar o rechazar una decisión del Ejecutivo. No se vota un texto de norma (eso sería un referendo)."),
    s(8, "El alcalde quiere conocer qué piensan los habitantes sobre convertir la plaza principal en zona peatonal. Les plantea una sola pregunta general, que cada persona responde con sí o no en una votación.",
      "consulta", ["referendo", "revocatoria", "iniciativa"],
      "La consulta popular somete al pueblo una pregunta de carácter general sobre un asunto de trascendencia, formulada por el Presidente, el gobernador o el alcalde. No se vota un texto normativo, como ocurre en el referendo."),
    s(9, "En el colegio se acerca el día de escoger al personero estudiantil. Cada estudiante recibirá una papeleta y marcará, en secreto, al candidato que prefiere.",
      "voto", ["cabildo", "plebiscito", "peticion"],
      "El voto es el mecanismo con el que los ciudadanos eligen a sus representantes de manera libre y secreta. En los colegios, el personero estudiantil se elige por voto de los estudiantes, como parte del gobierno escolar."),
    s(10, "Un grupo de vecinos se organiza para hacer seguimiento a la construcción del nuevo puesto de salud: revisan el contrato, los plazos y que los recursos se usen como se aprobó.",
      "control", ["plebiscito", "referendo", "iniciativa"],
      "El control social, por ejemplo mediante veedurías ciudadanas, permite a la comunidad vigilar la gestión pública y el uso de los recursos del Estado (artículo 270 de la Constitución y Ley 850 de 2003)."),
    s(11, "Un conductor cree que un agente de tránsito lo trató de manera irrespetuosa y quiere dejar su queja por escrito ante la entidad para que la analicen y le contesten.",
      "peticion", ["revocatoria", "plebiscito", "iniciativa"],
      "El derecho de petición sirve para pedir información, solicitar copias, o presentar quejas y reclamos ante las autoridades y obtener una respuesta."),
    s(12, "Hace varios meses una persona le envió una solicitud a una entidad pública y todavía no recibe respuesta alguna. Siente que se le vulnera un derecho fundamental y quiere que un juez ordene a la entidad responderle.",
      "tutela", ["peticion", "referendo", "voto"],
      "Cuando una autoridad no responde una petición dentro del término legal, se puede acudir a la acción de tutela para que un juez ordene darle respuesta."),
    s(13, "Los habitantes de un departamento, inconformes con su gobernador, quieren que sea el propio electorado —y no una autoridad disciplinaria— el que decida si continúa o no en el cargo.",
      "revocatoria", ["tutela", "cabildo", "referendo"],
      "La revocatoria la decide el pueblo con su voto. Es distinta de la destitución, que es una sanción disciplinaria impuesta por una autoridad y no un mecanismo de participación ciudadana."),
    s(14, "Un grupo de jóvenes quiere presentar sus propuestas sobre canchas deportivas durante una sesión pública del concejo municipal. Se inscriben previamente para tomar la palabra.",
      "cabildo", ["iniciativa", "consulta", "voto"],
      "En el cabildo abierto los habitantes se inscriben para intervenir con voz ante el concejo o la junta administradora local. La iniciativa popular, en cambio, consiste en presentar un proyecto de norma con el respaldo exigido de firmas."),
    s(15, "Una organización juvenil reúne el respaldo de miles de personas para que el Congreso discuta un proyecto de ley que ellos mismos redactaron sobre el cuidado de la salud mental en los colegios.",
      "iniciativa", ["plebiscito", "consulta", "tutela"],
      "La iniciativa popular legislativa permite que un grupo de ciudadanos, con el respaldo de firmas equivalente a un porcentaje del censo electoral, presente un proyecto de ley ante el Congreso (artículo 155 de la Constitución)."),
    s(16, "Un grupo de ciudadanos redactó un proyecto de ordenanza para su departamento y quiere que sean los habitantes, votando en las urnas, quienes lo aprueben o lo rechacen, en lugar de los diputados.",
      "referendo", ["iniciativa", "cabildo", "revocatoria"],
      "En el referendo aprobatorio el pueblo decide con su voto si aprueba o rechaza un proyecto de norma. En la iniciativa popular, en cambio, es la corporación (asamblea, concejo o Congreso) la que lo tramita y decide."),
    s(17, "Se considera necesario reformar un artículo de la Constitución, pero se quiere que la última palabra la tenga el pueblo, votando directamente.",
      "referendo", ["plebiscito", "consulta", "cabildo"],
      "La Constitución puede reformarse mediante referendo constitucional. El plebiscito no sirve para modificar la Constitución, y la consulta popular recoge la opinión del pueblo sobre una pregunta general."),
    s(18, "La gobernadora quiere saber si los habitantes del departamento están de acuerdo con construir una nueva vía regional. Para ello plantea una pregunta general que se responde votando sí o no.",
      "consulta", ["plebiscito", "revocatoria", "iniciativa"],
      "La consulta popular puede ser nacional, departamental, municipal o local, según quién la convoque (Presidente, gobernador o alcalde). El plebiscito solo lo convoca el Presidente y trata de decisiones del Ejecutivo."),
    s(19, "Una joven acaba de cumplir 18 años y sacó su cédula. Quiere participar en la elección del próximo alcalde de su municipio escogiendo entre los candidatos.",
      "voto", ["revocatoria", "plebiscito", "cabildo"],
      "El voto es un derecho y un deber ciudadano (artículo 258). La ciudadanía se ejerce desde los 18 años (artículo 98) y con ella se eligen gobernantes y otros representantes."),
    s(20, "Los habitantes de una vereda notan que el restaurante escolar recibe menos alimentos de los contratados. Quieren organizarse como grupo para hacer seguimiento permanente a la ejecución de ese contrato.",
      "control", ["peticion", "referendo", "plebiscito"],
      "El control social (veedurías) permite vigilar de forma organizada y continua la gestión pública. Un derecho de petición sirve para pedir información puntual, pero no para vigilar de manera permanente."),
    s(21, "Un colegio le prohíbe a un estudiante seguir asistiendo a clases sin haber adelantado ningún proceso disciplinario. La familia necesita una decisión rápida que proteja su derecho a la educación y al debido proceso.",
      "tutela", ["referendo", "revocatoria", "consulta"],
      "La tutela protege derechos fundamentales, como la educación y el debido proceso, cuando son vulnerados por una autoridad o, en algunos casos, por particulares. El juez decide de manera preferente y rápida."),
    s(22, "En 2016, el Gobierno nacional convocó a los colombianos para que votaran sí o no y así respaldaran o rechazaran el acuerdo final firmado para terminar el conflicto armado con las FARC.",
      "plebiscito", ["referendo", "consulta", "cabildo"],
      "Fue un plebiscito (2 de octubre de 2016): el Presidente convocó al pueblo para apoyar o rechazar una decisión del Ejecutivo, en este caso el acuerdo de paz."),
    s(23, "Una estudiante de periodismo necesita copia de un documento público de la alcaldía, el plan de desarrollo municipal, y lo solicita por escrito.",
      "peticion", ["cabildo", "tutela", "iniciativa"],
      "El derecho de petición también permite solicitar copias de documentos públicos. La autoridad debe responder dentro del plazo legal."),
    s(24, "La comunidad quiere participar en la audiencia pública donde la alcaldía explica cómo usó el presupuesto del año, para hacer preguntas y observaciones sobre su gestión.",
      "control", ["iniciativa", "plebiscito", "revocatoria"],
      "La rendición de cuentas es un espacio del control social: la ciudadanía evalúa y cuestiona la gestión de las autoridades (la Ley 1757 de 2015 regula la rendición de cuentas).")
  ];

  if (typeof window !== "undefined") window.SITUACIONES = SITUACIONES;
  if (typeof module !== "undefined") module.exports = { SITUACIONES };
})();
