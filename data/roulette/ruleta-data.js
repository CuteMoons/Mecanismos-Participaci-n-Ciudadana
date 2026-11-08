/**
 * data/roulette/ruleta-data.js
 * Categorías y preguntas de la «Ruleta de preguntas» (8 por categoría,
 * cada categoría con su propio conjunto). Opción múltiple con una sola
 * respuesta correcta; el orden de las opciones se mezcla al mostrarlas.
 * Fundamento: Constitución Política de 1991, Ley 134 de 1994, Ley 1755 y
 * Ley 1757 de 2015, Ley 115 de 1994 (gobierno escolar), Ley 850 de 2003.
 */
(function () {
  function q(pref, n, texto, correcta, distractores, explicacion) {
    const opciones = distractores.slice();
    const pos = n % 4;
    opciones.splice(pos, 0, correcta);
    return { id: pref + "-" + String(n).padStart(2, "0"), texto, opciones, correcta: pos, explicacion };
  }

  const RULETA_CATEGORIAS = [
    {
      id: "mecanismos", nombre: "Mecanismos de participación", corto: "Mecanismos", icono: "🗳️",
      preguntas: [
        q("mec", 1, "¿Quién puede convocar un plebiscito?", "El Presidente de la República", ["Cualquier alcalde", "Un grupo de vecinos", "El concejo municipal"],
          "El plebiscito lo convoca únicamente el Presidente, para que el pueblo apoye o rechace una decisión del Ejecutivo."),
        q("mec", 2, "¿A qué funcionarios se les puede aplicar la revocatoria del mandato?", "A alcaldes y gobernadores", ["Al Presidente y a los congresistas", "A jueces y magistrados", "A concejales y diputados"],
          "Solo aplica a gobernadores y alcaldes elegidos por voto popular."),
        q("mec", 3, "¿Cuál es la diferencia principal entre referendo y plebiscito?", "El referendo trata de normas (aprobarlas o derogarlas) y el plebiscito de una decisión del Ejecutivo", ["El referendo sirve para elegir gobernantes y el plebiscito para destituirlos", "El plebiscito trata de normas y el referendo de decisiones del Presidente", "Ninguna: son exactamente lo mismo"],
          "El referendo se refiere a un texto normativo; el plebiscito, a una decisión política del Gobierno."),
        q("mec", 4, "En un cabildo abierto, los habitantes pueden…", "Intervenir con voz sobre asuntos de interés de la comunidad", ["Votar y aprobar las decisiones del concejo", "Destituir a los concejales", "Aprobar el presupuesto municipal"],
          "Participan con voz ante el concejo o la junta administradora local, pero la decisión sigue siendo de la corporación."),
        q("mec", 5, "¿Qué permite la iniciativa popular legislativa y normativa?", "Que un grupo de ciudadanos presente proyectos de ley, ordenanza o acuerdo ante la corporación competente", ["Elegir al Presidente de la República", "Anular sentencias judiciales", "Cambiar a un alcalde sin votación"],
          "La corporación está obligada a tramitar el proyecto, aunque no a aprobarlo."),
        q("mec", 6, "¿Qué es una consulta popular?", "Una pregunta general sobre un asunto importante que se somete a la votación del pueblo", ["Una reunión del concejo con la comunidad", "La elección de un personero estudiantil", "Una acción ante un juez para proteger un derecho"],
          "Puede ser nacional, departamental, municipal o local, según quién la convoque."),
        q("mec", 7, "¿Cuál mecanismo sirve para pedir a un juez la protección inmediata de un derecho fundamental?", "Acción de tutela", ["Cabildo abierto", "Referendo", "Iniciativa popular"],
          "La tutela está consagrada en el artículo 86 de la Constitución y el juez debe resolver de manera rápida."),
        q("mec", 8, "Por regla general, ¿en cuánto tiempo debe responder la autoridad a un derecho de petición?", "15 días hábiles", ["5 días hábiles", "3 meses", "1 año"],
          "El término general es de 15 días hábiles, salvo términos especiales según el tipo de solicitud (Ley 1755 de 2015).")
      ]
    },
    {
      id: "democracia", nombre: "Democracia", corto: "Democracia", icono: "🏛️",
      preguntas: [
        q("dem", 1, "La palabra «democracia» viene del griego y significa…", "Gobierno del pueblo", ["Gobierno de un solo rey", "Gobierno de los más fuertes", "Gobierno de los expertos"],
          "Viene de «demos» (pueblo) y «kratos» (poder o gobierno)."),
        q("dem", 2, "En una democracia representativa, el pueblo…", "Elige representantes que toman decisiones en su nombre", ["Decide personalmente cada ley", "No participa en ninguna decisión", "Solo vota cuando el Presidente lo pide"],
          "Se vota para escoger representantes, como el Presidente, los congresistas o los alcaldes."),
        q("dem", 3, "¿Qué caracteriza a la democracia participativa?", "Además de elegir, los ciudadanos intervienen en decisiones y controlan el poder", ["Solo se vota cada cuatro años", "El poder lo ejerce una sola persona", "Se eliminan las elecciones"],
          "La Constitución define a Colombia como un Estado democrático, participativo y pluralista (artículo 1)."),
        q("dem", 4, "¿Qué función cumple la oposición política en una democracia?", "Ejercer una crítica libre frente al Gobierno y proponer alternativas", ["Impedir que el Gobierno trabaje", "Reemplazar al Presidente sin elecciones", "Callar a quienes piensan distinto"],
          "El artículo 112 reconoce a quienes se declaran en oposición el derecho a ejercer la función crítica y plantear alternativas políticas."),
        q("dem", 5, "¿Por qué es importante que el voto sea secreto?", "Para que cada persona decida libremente, sin presiones", ["Para que nadie sepa quién ganó", "Para que los candidatos no hagan campaña", "Para votar más rápido"],
          "El Estado debe garantizar que el voto se ejerza sin coacción y en secreto (artículo 258)."),
        q("dem", 6, "En una democracia, ¿qué ocurre con los derechos de las minorías?", "Deben respetarse aunque la mayoría piense distinto", ["Dejan de existir cuando la mayoría decide", "Solo valen en época de elecciones", "Los define el Presidente cada año"],
          "El pluralismo y la igualdad exigen respetar a todas las personas y grupos."),
        q("dem", 7, "¿Cuáles son las tres ramas del poder público según la Constitución de 1991?", "Legislativa, ejecutiva y judicial", ["Legislativa, ejecutiva y militar", "Ejecutiva, judicial y electoral", "Judicial, fiscal y legislativa"],
          "El artículo 113 establece las ramas legislativa, ejecutiva y judicial; además existen órganos autónomos, como los de control y el electoral."),
        q("dem", 8, "¿Qué es la soberanía popular?", "El principio según el cual el poder del Estado proviene del pueblo", ["El derecho del Presidente a gobernar sin control", "La facultad exclusiva del Congreso de crear impuestos", "La obligación de votar por un partido"],
          "El artículo 3 dice que la soberanía reside exclusivamente en el pueblo, del cual emana el poder público.")
      ]
    },
    {
      id: "derechos", nombre: "Derechos ciudadanos", corto: "Derechos", icono: "⚖️",
      preguntas: [
        q("der", 1, "¿Qué derecho permite expresar libremente pensamientos y opiniones?", "Libertad de expresión", ["Habeas data", "Derecho al trabajo", "Libertad de cultos"],
          "El artículo 20 garantiza expresar y difundir el pensamiento y las opiniones."),
        q("der", 2, "Según la Constitución, ¿cómo pueden las personas manifestar su inconformidad con una decisión pública?", "Reuniéndose y manifestándose de manera pública y pacífica", ["Usando la violencia contra bienes públicos", "Impidiendo que otros ejerzan sus derechos", "Haciéndolo únicamente por redes sociales"],
          "El artículo 37 reconoce el derecho de reunión y manifestación pública y pacífica."),
        q("der", 3, "¿A qué edad se adquiere la ciudadanía y se puede votar en Colombia?", "18 años", ["14 años", "16 años", "21 años"],
          "El artículo 98 dice que la ciudadanía se ejerce a partir de los 18 años."),
        q("der", 4, "¿Qué derecho permite conocer, actualizar y rectificar la información que reposa sobre una persona en bancos de datos?", "Habeas data", ["Libertad de expresión", "Derecho de reunión", "Derecho de petición"],
          "Está en el artículo 15 de la Constitución."),
        q("der", 5, "¿Qué significa el derecho a la igualdad (artículo 13)?", "Todas las personas reciben la misma protección y trato de las autoridades, sin discriminación", ["Todas las personas deben tener el mismo ingreso", "Todas las personas deben pensar igual", "Las autoridades pueden preferir a algunos grupos sin razón"],
          "Igualdad ante la ley significa mismos derechos, libertades y oportunidades, sin discriminación."),
        q("der", 6, "¿Qué establece la Constitución sobre los derechos de los niños?", "Prevalecen sobre los derechos de los demás", ["Valen menos que los de los adultos", "Solo se protegen en las ciudades", "Dependen de la decisión del colegio"],
          "Así lo señala el artículo 44."),
        q("der", 7, "¿Cuál de estos es un deber ciudadano señalado en el artículo 95?", "Participar en la vida política, cívica y comunitaria del país", ["Elegir cuáles normas obedecer", "Guardar silencio ante las injusticias", "Ocultar información a la justicia"],
          "Los derechos van acompañados de deberes, como participar y colaborar con la administración de justicia."),
        q("der", 8, "¿Qué derecho permite crear y pertenecer a organizaciones como juntas de acción comunal, sindicatos o asociaciones?", "Libertad de asociación", ["Habeas corpus", "Derecho a la intimidad", "Libertad de cultos"],
          "El artículo 38 garantiza el derecho de libre asociación.")
      ]
    },
    {
      id: "constitucion", nombre: "Constitución Política de Colombia", corto: "Constitución", icono: "📜",
      preguntas: [
        q("con", 1, "¿En qué año se expidió la actual Constitución Política de Colombia?", "1991", ["1886", "1948", "2005"],
          "La Constitución de 1991 reemplazó a la de 1886."),
        q("con", 2, "¿Qué organismo redactó la Constitución de 1991?", "La Asamblea Nacional Constituyente", ["El Congreso de la República", "La Corte Suprema de Justicia", "La Registraduría Nacional"],
          "Fue una asamblea elegida por voto popular en 1990."),
        q("con", 3, "Según el artículo 1, Colombia es un Estado social de derecho que además es…", "Democrático, participativo y pluralista", ["Monárquico y centralista", "Federal y militar", "Confederado y religioso"],
          "También se organiza como república unitaria, descentralizada y con autonomía de sus entidades territoriales."),
        q("con", 4, "¿Qué artículo de la Constitución enumera los mecanismos de participación del pueblo?", "Artículo 103", ["Artículo 13", "Artículo 20", "Artículo 86"],
          "El artículo 103 enumera el voto, el plebiscito, el referendo, la consulta popular, el cabildo abierto, la iniciativa legislativa y la revocatoria del mandato."),
        q("con", 5, "¿Qué establece el artículo 4 sobre la Constitución?", "Que es norma de normas y prevalece sobre cualquier otra norma", ["Que solo se aplica en tiempos de paz", "Que puede ser ignorada por las leyes", "Que solo protege a los mayores de edad"],
          "Si una norma es incompatible con la Constitución, se aplican las disposiciones constitucionales."),
        q("con", 6, "El artículo 40 reconoce a todo ciudadano el derecho a…", "Participar en la conformación, ejercicio y control del poder político", ["Gobernar sin límite de tiempo", "Escoger a los jueces de su ciudad", "Crear impuestos nacionales"],
          "Incluye elegir y ser elegido, y usar los mecanismos de participación."),
        q("con", 7, "¿Qué institución se encarga de la guarda de la integridad y supremacía de la Constitución?", "La Corte Constitucional", ["La Contraloría General", "La Registraduría", "El Ministerio de Educación"],
          "Así lo establece el artículo 241."),
        q("con", 8, "Según el artículo 2, uno de los fines esenciales del Estado es…", "Facilitar la participación de todos en las decisiones que los afectan", ["Controlar los medios de comunicación", "Limitar el derecho a elegir", "Reemplazar a las autoridades locales"],
          "La participación hace parte de los fines del Estado colombiano.")
      ]
    },
    {
      id: "cotidianas", nombre: "Situaciones cotidianas", corto: "Situaciones", icono: "🧩",
      preguntas: [
        q("cot", 1, "¿Quién puede ser elegido personero estudiantil en un colegio?", "Un estudiante del último grado que ofrece la institución", ["Cualquier docente", "El rector", "Un padre de familia"],
          "Según la Ley 115 de 1994, el personero es un alumno del último grado y promueve los derechos y deberes de los estudiantes."),
        q("cot", 2, "Tu comunidad ve que una obra pública se retrasa y quiere vigilarla de forma organizada. ¿Qué puede hacer?", "Conformar una veeduría ciudadana", ["Convocar un plebiscito", "Pedir la revocatoria del mandato del Presidente", "Esperar a que la obra termine para reclamar"],
          "Las veedurías ciudadanas (Ley 850 de 2003) permiten vigilar la gestión pública."),
        q("cot", 3, "Una entidad te responde solo que «recibió tu solicitud», sin resolver lo que pediste. ¿Qué es cierto?", "Debe responderte de fondo: no basta con acusar recibido", ["Ya cumplió con su obligación", "Tu petición perdió validez", "Debes esperar un año para insistir"],
          "La autoridad debe dar una respuesta clara y de fondo dentro del término legal."),
        q("cot", 4, "¿Dónde puedes consultar el lugar en el que te corresponde votar?", "En los servicios de consulta de la Registraduría Nacional, con tu número de cédula", ["En la oficina de la DIAN", "En la Contraloría de tu municipio", "En la Superintendencia de Industria y Comercio"],
          "La Registraduría organiza las elecciones y ofrece la consulta del puesto de votación."),
        q("cot", 5, "Una joven de 17 años quiere participar en su comunidad aunque aún no puede votar. ¿Qué puede hacer?", "Participar en el gobierno escolar y en organizaciones juveniles o comunitarias", ["Nada, hasta cumplir 18 años", "Votar con su tarjeta de identidad", "Postularse a la Presidencia"],
          "La participación no se limita al voto: los jóvenes pueden intervenir en muchos espacios (artículo 45)."),
        q("cot", 6, "Alguien ofrece dinero a otra persona para que vote por un candidato. ¿Qué es esta práctica?", "Compra de votos: un delito que afecta la democracia", ["Una forma normal de hacer campaña", "Un derecho de los candidatos", "Una consulta popular"],
          "Quien compra o vende el voto vulnera la libertad del elector."),
        q("cot", 7, "Los vecinos de un barrio quieren juntarse en el parque para discutir el mal estado de las vías. ¿Qué derecho ejercen?", "Derecho de reunión", ["Derecho a la propiedad", "Habeas data", "Derecho al trabajo"],
          "El artículo 37 reconoce el derecho a reunirse de manera pública y pacífica."),
        q("cot", 8, "Un amigo dice: «votar en blanco es lo mismo que no votar». ¿Qué es cierto?", "El voto en blanco es un voto válido con el que se expresa inconformidad con las opciones", ["El voto en blanco siempre se anula", "Está prohibido en Colombia", "Solo lo pueden usar los candidatos"],
          "Quien vota en blanco participa y su voto se cuenta como válido.")
      ]
    },
    {
      id: "generales", nombre: "Conocimientos generales sobre participación ciudadana", corto: "Generales", icono: "💡",
      preguntas: [
        q("gen", 1, "¿Qué ley estatutaria de 2015 actualizó las reglas de los mecanismos de participación democrática?", "Ley 1757 de 2015", ["Ley 115 de 1994", "Ley 100 de 1993", "Ley 1098 de 2006"],
          "La Ley 1757 de 2015 actualizó lo previsto por la Ley 134 de 1994 e incluyó rendición de cuentas y veedurías."),
        q("gen", 2, "La Ley 134 de 1994 regula…", "Los mecanismos de participación ciudadana", ["El sistema de salud", "La educación en los colegios", "El tránsito vehicular"],
          "Fue una de las primeras leyes en desarrollar los mecanismos previstos en la Constitución."),
        q("gen", 3, "¿Qué es la participación ciudadana?", "Intervenir en las decisiones públicas, ejercer control sobre quienes gobiernan y proteger derechos", ["Esperar a que las autoridades decidan todo", "Votar únicamente cada cuatro años", "Pertenecer a un partido político"],
          "No se limita a votar: incluye mecanismos institucionales, organizaciones sociales y espacios comunitarios."),
        q("gen", 4, "¿Cuál es un ejemplo de participación ciudadana diferente al voto?", "Asistir a un cabildo abierto", ["Marcar el tarjetón", "Escoger un candidato en las urnas", "Elegir al alcalde"],
          "Los demás ejemplos son formas de votar."),
        q("gen", 5, "¿Qué es el censo electoral?", "El registro de las personas habilitadas para votar", ["El conteo de todos los habitantes del país", "La lista de candidatos de una elección", "El resultado final de una votación"],
          "Muchos mecanismos exigen un porcentaje del censo electoral para solicitarse o validarse."),
        q("gen", 6, "¿Qué entidad dirige y organiza las elecciones, el registro civil y la identificación de las personas?", "La Registraduría Nacional del Estado Civil", ["La Fiscalía General de la Nación", "La Contraloría General de la República", "La Defensoría del Pueblo"],
          "Así lo establece la Constitución para la organización electoral."),
        q("gen", 7, "¿Qué es una veeduría ciudadana?", "Una forma de organización para vigilar la gestión pública", ["Un partido político", "Un tipo de elección", "Un tribunal que sanciona a funcionarios"],
          "Es una herramienta del control social regulada por la Ley 850 de 2003."),
        q("gen", 8, "¿Quién puede presentar una acción de tutela?", "Cualquier persona, sin necesidad de abogado", ["Solo los abogados", "Solo los mayores de 30 años", "Solo los funcionarios públicos"],
          "Puede presentarse directamente o por medio de representante, sin formalidades especiales.")
      ]
    }
  ];

  if (typeof window !== "undefined") window.RULETA_CATEGORIAS = RULETA_CATEGORIAS;
  if (typeof module !== "undefined") module.exports = { RULETA_CATEGORIAS };
})();
