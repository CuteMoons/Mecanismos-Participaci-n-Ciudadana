/**
 * tools/crossword-source.js
 * FUENTE del contenido de las versiones nuevas del crucigrama.
 * Aquí se editan títulos, palabras y pistas; luego se ejecuta
 *   node tools/generar-crucigramas.js
 * que verifica y escribe data/crossword/crossword-versions.js con las
 * distribuciones ya comprobadas.
 *
 * Reglas de las pistas: describir significado, finalidad o funcionamiento;
 * nunca nombrar la respuesta, su raíz ni otra respuesta de la MISMA versión.
 */
module.exports = [
  {
    id: "elecciones",
    titulo: "Elecciones y voto",
    nivel: "facil",
    words: [
      { word: "SUFRAGIO", clue: "Facultad de las personas habilitadas para escoger a sus gobernantes y representantes en una jornada electoral." },
      { word: "CEDULA", clue: "Documento personal que acredita quién es el ciudadano cuando se presenta en la mesa de votación." },
      { word: "JURADO", clue: "Persona designada para atender una mesa el día de los comicios y contar allí las papeletas depositadas." },
      { word: "ESCRUTINIO", clue: "Revisión y conteo oficial de las papeletas depositadas, para establecer quién ganó." },
      { word: "CANDIDATO", clue: "Persona que se postula para ocupar un cargo de elección y busca el apoyo de los votantes." },
      { word: "PARTIDO", clue: "Organización política que reúne a personas con ideas afines y presenta aspirantes a cargos públicos." },
      { word: "ABSTENCION", clue: "Decisión de no acudir a las mesas el día en que se vota." },
      { word: "REGISTRADURIA", clue: "Entidad que organiza las jornadas de votación y atiende la identificación de las personas en el país." },
      { word: "TARJETON", clue: "Papel que se entrega en la mesa con las opciones entre las que cada persona marca su preferencia." },
      { word: "MAYORIA", clue: "Parte más numerosa de quienes participan en una decisión, que suele definir el resultado." },
      { word: "PROGRAMA", clue: "Documento en el que quien aspira a gobernar expone lo que se compromete a hacer si gana." }
    ]
  },
  {
    id: "convivencia",
    titulo: "Valores y convivencia",
    nivel: "facil",
    words: [
      { word: "LIBERTAD", clue: "Capacidad de pensar, expresarse y actuar sin imposiciones injustas, dentro del respeto a los demás." },
      { word: "IGUALDAD", clue: "Principio según el cual todos los individuos reciben la misma protección y trato ante las autoridades." },
      { word: "DIALOGO", clue: "Intercambio respetuoso de ideas entre individuos que piensan distinto, para llegar a acuerdos." },
      { word: "DEBERES", clue: "Obligaciones que todo individuo tiene con la sociedad, como cumplir las reglas y contribuir al bien común." },
      { word: "SOBERANIA", clue: "Poder supremo que reside en el conjunto de la población y del cual procede la autoridad pública." },
      { word: "PUEBLO", clue: "Conjunto de habitantes de una nación, considerado como el origen del poder político." },
      { word: "COMUNIDAD", clue: "Grupo de individuos que comparten un territorio o intereses y se organizan para resolver necesidades comunes." },
      { word: "CONVIVENCIA", clue: "Vida en común basada en el respeto, la tolerancia y la solución pacífica de las diferencias." },
      { word: "PERSONERIA", clue: "Entidad municipal cuyo titular defiende los intereses de la sociedad y vigila la conducta de los funcionarios locales." },
      { word: "JUSTICIA", clue: "Valor que busca dar a cada quien lo que le corresponde y resolver los conflictos con imparcialidad." },
      { word: "DEFENSORIA", clue: "Institución nacional que acompaña y protege a los individuos cuando sus garantías fundamentales están amenazadas." }
    ]
  },
  {
    id: "mecanismos-accion",
    titulo: "Mecanismos en acción",
    nivel: "media",
    words: [
      { word: "REFERENDO", clue: "Votación en la que la ciudadanía acepta o rechaza un texto normativo, aprobándolo o dejándolo sin efectos." },
      { word: "PLEBISCITO", clue: "Pronunciamiento de la ciudadanía, convocado por el Presidente, para respaldar o rechazar una decisión del Ejecutivo; no sirve para reformar la carta fundamental." },
      { word: "CABILDO", clue: "Espacio abierto en el que los habitantes de una localidad pueden hablar ante quienes los representan y discutir sus asuntos." },
      { word: "REVOCATORIA", clue: "Procedimiento para que los electores decidan si un gobernante local que no cumplió su programa termina antes de tiempo su periodo." },
      { word: "INICIATIVA", clue: "Facultad de las personas del común para presentar proyectos que un cuerpo colegiado debe estudiar y decidir." },
      { word: "CONSULTA", clue: "Pregunta de interés general que una autoridad plantea a los habitantes de un territorio y cuya respuesta mayoritaria obliga cuando se alcanza la participación exigida." },
      { word: "VOTO", clue: "Manera básica en que cada persona habilitada expresa su decisión; es a la vez facultad y obligación ciudadana." },
      { word: "TUTELA", clue: "Herramienta que permite acudir ante cualquier juez para frenar de inmediato la violación de un derecho fundamental." },
      { word: "PETICION", clue: "Solicitud respetuosa dirigida a una entidad pública para pedir información, un trámite o una solución, que debe contestarse en un plazo." },
      { word: "ALCALDE", clue: "Autoridad que dirige la administración de un municipio y es escogida por los habitantes." },
      { word: "CONCEJO", clue: "Cuerpo de representantes elegidos que aprueba los acuerdos del municipio y vigila a su administración." }
    ]
  },
  {
    id: "instituciones",
    titulo: "Instituciones del Estado",
    nivel: "media",
    words: [
      { word: "CONGRESO", clue: "Rama del poder que reúne a dos cuerpos de representantes elegidos y expide las leyes del país." },
      { word: "ASAMBLEA", clue: "Cuerpo de diputados elegidos que aprueba las ordenanzas de un departamento." },
      { word: "ALCALDIA", clue: "Sede y organización administrativa que dirige un municipio." },
      { word: "GOBERNACION", clue: "Entidad que administra un departamento, encabezada por una autoridad escogida por los habitantes de esa región." },
      { word: "PROCURADURIA", clue: "Organismo de control que vigila la conducta de los servidores públicos y puede sancionarlos disciplinariamente." },
      { word: "CONTRALORIA", clue: "Entidad que vigila cómo se gasta el dinero público y si la gestión fiscal fue correcta." },
      { word: "CONSTITUYENTE", clue: "Cuerpo temporal elegido por la ciudadanía para redactar o reformar la carta fundamental de un país; en Colombia se reunió en 1991." },
      { word: "JUNTA", clue: "Organización cívica de vecinos de un barrio o vereda que gestiona soluciones para necesidades comunes." },
      { word: "CORTE", clue: "Tribunal de máxima jerarquía; una de ellas revisa el trámite y el contenido de las leyes frente al texto fundamental." },
      { word: "SENADO", clue: "Cuerpo legislativo cuyos miembros se eligen por circunscripción nacional y que tramita las leyes junto a otro cuerpo hermano." },
      { word: "CAMARA", clue: "Cuerpo legislativo cuyos integrantes se eligen por territorio y que debate proyectos junto a otro cuerpo hermano." }
    ]
  },
  {
    id: "control-gestion",
    titulo: "Control y gestión pública",
    nivel: "dificil",
    words: [
      { word: "VEEDOR", clue: "Persona de la comunidad que vigila que una obra o un servicio público se ejecute según lo prometido." },
      { word: "AUDITORIA", clue: "Revisión sistemática e independiente de cuentas y procesos para verificar que se cumplan reglas y metas." },
      { word: "DENUNCIA", clue: "Aviso formal a la autoridad competente sobre una irregularidad o posible delito, para que sea investigado." },
      { word: "DELIBERACION", clue: "Discusión razonada en la que se pesan argumentos a favor y en contra antes de tomar una decisión colectiva." },
      { word: "CONCERTACION", clue: "Proceso en el que actores con intereses distintos negocian para acordar soluciones aceptables para todos." },
      { word: "INCIDENCIA", clue: "Capacidad de un grupo para influir, con argumentos y presión legítima, en las decisiones que lo afectan." },
      { word: "PRESUPUESTO", clue: "Plan que calcula cuánto dinero ingresará a una entidad y en qué se gastará durante un año." },
      { word: "PLANEACION", clue: "Proceso de fijar metas y pasos a seguir para el desarrollo de un territorio, que debe escuchar a los habitantes." },
      { word: "FISCALIZAR", clue: "Vigilar y examinar con atención la actuación y el gasto de las autoridades para exigir corrección." },
      { word: "PROPUESTA", clue: "Idea o plan formulado por escrito para que otros lo estudien y decidan, como lo que se lleva a un debate público." },
      { word: "GESTION", clue: "Conjunto de acciones con las que una autoridad administra recursos y ejecuta sus funciones." }
    ]
  },
  {
    id: "democracia",
    titulo: "Conceptos de la democracia",
    nivel: "dificil",
    words: [
      { word: "PLURALISMO", clue: "Aceptación de que en una sociedad conviven ideas, creencias y grupos diversos con igual valor." },
      { word: "LEGITIMIDAD", clue: "Aceptación social de que una autoridad tiene razón de mandar porque su origen y su actuar se consideran justos." },
      { word: "REPRESENTACION", clue: "Mecanismo por el cual las personas eligen a otras para que decidan en su nombre en cuerpos colegiados." },
      { word: "ESTATUTARIA", clue: "Clase de ley de especial importancia, que regula temas muy sensibles del régimen político y exige un trámite reforzado con revisión previa del tribunal más alto en esa materia." },
      { word: "QUORUM", clue: "Número mínimo de integrantes presentes que necesita un cuerpo colegiado para deliberar y decidir válidamente." },
      { word: "UMBRAL", clue: "Nivel mínimo de apoyo o asistencia que se exige para que ciertos resultados de una votación sean válidos." },
      { word: "AUTONOMIA", clue: "Capacidad de las regiones y localidades para gobernarse y gestionar sus asuntos dentro de los límites del orden jurídico." },
      { word: "DESCENTRALIZACION", clue: "Traslado de competencias y recursos desde el poder central hacia los niveles locales y regionales." },
      { word: "GARANTIAS", clue: "Medidas y condiciones que aseguran que las personas puedan ejercer libremente sus facultades." },
      { word: "TERRITORIO", clue: "Porción de tierra, con sus límites, sobre la que un Estado o una comunidad ejerce su organización y autoridad." },
      { word: "LEGALIDAD", clue: "Principio según el cual las autoridades solo pueden actuar dentro de lo que el orden jurídico les permite." }
    ]
  }
];
