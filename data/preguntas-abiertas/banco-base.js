/**
 * data/preguntas-abiertas/banco-base.js
 *
 * Banco base de preguntas ABIERTAS para proyectar en clase
 * (sin opciones de respuesta; los estudiantes responden con sus
 * propias palabras en el cuaderno o en una hoja). 209 preguntas.
 *
 * Cuando el texto de la pregunta menciona claramente un mecanismo
 * específico, se etiqueta en "mecanismo" para poder practicarlo de
 * forma individual. Las preguntas comparativas o generales quedan
 * con mecanismo: null y solo aparecen en el pool general.
 */

const PREGUNTAS_ABIERTAS_BASE = [
  {
    id: "abierta-001",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué son los mecanismos de participación ciudadana?"
  },
  {
    id: "abierta-002",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿En qué año fue promulgada la Constitución Política de Colombia que fortaleció los mecanismos de participación ciudadana?"
  },
  {
    id: "abierta-003",
    mecanismo: "tutela",
    tipo: "abierta",
    pregunta: "¿Qué es la acción de tutela?"
  },
  {
    id: "abierta-004",
    mecanismo: "tutela",
    tipo: "abierta",
    pregunta: "¿Cuál es la principal finalidad de la acción de tutela?"
  },
  {
    id: "abierta-005",
    mecanismo: "tutela",
    tipo: "abierta",
    pregunta: "¿Qué tipo de derechos busca proteger principalmente la acción de tutela?"
  },
  {
    id: "abierta-006",
    mecanismo: "derecho-peticion",
    tipo: "abierta",
    pregunta: "¿Qué es el derecho de petición?"
  },
  {
    id: "abierta-007",
    mecanismo: "derecho-peticion",
    tipo: "abierta",
    pregunta: "¿Para qué sirve un derecho de petición?"
  },
  {
    id: "abierta-008",
    mecanismo: "referendo",
    tipo: "abierta",
    pregunta: "¿Qué es un referendo?"
  },
  {
    id: "abierta-009",
    mecanismo: "referendo",
    tipo: "abierta",
    pregunta: "¿Qué permite decidir un referendo?"
  },
  {
    id: "abierta-010",
    mecanismo: "plebiscito",
    tipo: "abierta",
    pregunta: "¿Qué es un plebiscito?"
  },
  {
    id: "abierta-011",
    mecanismo: "plebiscito",
    tipo: "abierta",
    pregunta: "¿Cuál es la finalidad principal de un plebiscito?"
  },
  {
    id: "abierta-012",
    mecanismo: "consulta-popular",
    tipo: "abierta",
    pregunta: "¿Qué es una consulta popular?"
  },
  {
    id: "abierta-013",
    mecanismo: "consulta-popular",
    tipo: "abierta",
    pregunta: "¿Qué busca conocer una consulta popular?"
  },
  {
    id: "abierta-014",
    mecanismo: "cabildo-abierto",
    tipo: "abierta",
    pregunta: "¿Qué es un cabildo abierto?"
  },
  {
    id: "abierta-015",
    mecanismo: "cabildo-abierto",
    tipo: "abierta",
    pregunta: "¿Dónde se desarrolla principalmente un cabildo abierto?"
  },
  {
    id: "abierta-016",
    mecanismo: "iniciativa-popular",
    tipo: "abierta",
    pregunta: "¿Qué es una iniciativa popular legislativa y normativa?"
  },
  {
    id: "abierta-017",
    mecanismo: "iniciativa-popular",
    tipo: "abierta",
    pregunta: "¿Qué pueden proponer los ciudadanos mediante una iniciativa popular?"
  },
  {
    id: "abierta-018",
    mecanismo: "revocatoria-mandato",
    tipo: "abierta",
    pregunta: "¿Qué es la revocatoria del mandato?"
  },
  {
    id: "abierta-019",
    mecanismo: "revocatoria-mandato",
    tipo: "abierta",
    pregunta: "¿A qué tipo de funcionarios se puede aplicar la revocatoria del mandato?"
  },
  {
    id: "abierta-020",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cuál de estos mecanismos está relacionado directamente con la protección de derechos fundamentales?"
  },
  {
    id: "abierta-021",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cuál de estos mecanismos permite a los ciudadanos presentar propuestas de normas?"
  },
  {
    id: "abierta-022",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cuál de estos mecanismos permite a los ciudadanos intentar terminar anticipadamente el mandato de un gobernante elegido?"
  },
  {
    id: "abierta-023",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cuál es la importancia de la participación ciudadana en una democracia?"
  },
  {
    id: "abierta-024",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué relación existe entre la Constitución de 1991 y la participación ciudadana?"
  },
  {
    id: "abierta-025",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Quiénes pueden participar en los mecanismos de participación ciudadana?"
  },
  {
    id: "abierta-026",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué papel tiene el ciudadano dentro de una democracia participativa?"
  },
  {
    id: "abierta-027",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿La participación ciudadana se limita únicamente a votar? Explique."
  },
  {
    id: "abierta-028",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo permite a los ciudadanos expresar su opinión sobre una decisión política?"
  },
  {
    id: "abierta-029",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo permite discutir asuntos de interés de una comunidad ante una corporación pública?"
  },
  {
    id: "abierta-030",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo puede utilizar una persona cuando considera que un derecho fundamental está siendo vulnerado?"
  },
  {
    id: "abierta-031",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo utilizaría una persona para presentar una solicitud ante una entidad pública?"
  },
  {
    id: "abierta-032",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué es importante que los ciudadanos conozcan sus mecanismos de participación?"
  },
  {
    id: "abierta-033",
    mecanismo: "plebiscito",
    tipo: "abierta",
    pregunta: "¿Qué diferencia existe entre un referendo y un plebiscito?"
  },
  {
    id: "abierta-034",
    mecanismo: "consulta-popular",
    tipo: "abierta",
    pregunta: "¿Cuál es la principal diferencia entre una consulta popular y un referendo?"
  },
  {
    id: "abierta-035",
    mecanismo: "derecho-peticion",
    tipo: "abierta",
    pregunta: "¿Cuál es la diferencia entre la acción de tutela y el derecho de petición?"
  },
  {
    id: "abierta-036",
    mecanismo: "cabildo-abierto",
    tipo: "abierta",
    pregunta: "¿Qué característica hace diferente al cabildo abierto de otros mecanismos de participación?"
  },
  {
    id: "abierta-037",
    mecanismo: "revocatoria-mandato",
    tipo: "abierta",
    pregunta: "¿Por qué la revocatoria del mandato puede considerarse un mecanismo de control ciudadano?"
  },
  {
    id: "abierta-038",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo sería más apropiado para proteger un derecho fundamental vulnerado?"
  },
  {
    id: "abierta-039",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo permite a los ciudadanos intervenir en la creación o modificación de normas?"
  },
  {
    id: "abierta-040",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué los mecanismos de participación fortalecen la democracia?"
  },
  {
    id: "abierta-041",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué diferencia existe entre participar directamente y elegir representantes?"
  },
  {
    id: "abierta-042",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede la participación ciudadana contribuir al control de los gobernantes?"
  },
  {
    id: "abierta-043",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué la Constitución de 1991 es importante para la participación ciudadana en Colombia?"
  },
  {
    id: "abierta-044",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede la participación ciudadana contribuir a una mayor responsabilidad de los funcionarios públicos?"
  },
  {
    id: "abierta-045",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué consecuencias podría tener utilizar incorrectamente un mecanismo de participación?"
  },
  {
    id: "abierta-046",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué no todos los mecanismos de participación sirven para resolver el mismo tipo de problema?"
  },
  {
    id: "abierta-047",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo utilizarías para intentar proteger un derecho fundamental y por qué?"
  },
  {
    id: "abierta-048",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo utilizarías para presentar una propuesta de norma y por qué?"
  },
  {
    id: "abierta-049",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo utilizarías para solicitar información a una institución pública y por qué?"
  },
  {
    id: "abierta-050",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo utilizarías para participar en una discusión sobre un problema de tu comunidad y por qué?"
  },
  {
    id: "abierta-051",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué puede afirmarse que los mecanismos de participación permiten que los ciudadanos tengan un papel activo en la democracia?"
  },
  {
    id: "abierta-052",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué ventajas tiene una democracia en la que los ciudadanos pueden participar más allá de las elecciones?"
  },
  {
    id: "abierta-053",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué relación existe entre participación ciudadana, derechos y control del poder público?"
  },
  {
    id: "abierta-054",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué importancia tiene la participación de los jóvenes en una democracia?"
  },
  {
    id: "abierta-055",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede la tecnología facilitar la participación ciudadana?"
  },
  {
    id: "abierta-056",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué problemas podrían surgir si la ciudadanía recibe información falsa antes de una decisión?"
  },
  {
    id: "abierta-057",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué verificar la información es importante antes de participar?"
  },
  {
    id: "abierta-058",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué diferencia existe entre proteger un derecho y participar en una decisión política?"
  },
  {
    id: "abierta-059",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede la participación ciudadana prevenir abusos de poder?"
  },
  {
    id: "abierta-060",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué importancia tiene cumplir los requisitos legales de cada mecanismo?"
  },
  {
    id: "abierta-061",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué papel tiene el voto en los mecanismos que requieren decisión popular?"
  },
  {
    id: "abierta-062",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué los ciudadanos deben conocer las consecuencias de una decisión antes de votar?"
  },
  {
    id: "abierta-063",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué papel puede cumplir la educación en la participación ciudadana?"
  },
  {
    id: "abierta-064",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede una institución educativa fomentar la participación de sus estudiantes?"
  },
  {
    id: "abierta-065",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué ejemplo de participación ciudadana podría darse dentro de un colegio?"
  },
  {
    id: "abierta-066",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo se relacionan participación, responsabilidad y convivencia?"
  },
  {
    id: "abierta-067",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué la participación ciudadana debe ejercerse respetando la ley?"
  },
  {
    id: "abierta-068",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué diferencia existe entre participación ciudadana y participación política?"
  },
  {
    id: "abierta-069",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Puede una persona participar políticamente sin pertenecer a un partido? Explique."
  },
  {
    id: "abierta-070",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué la participación ciudadana puede ayudar a representar intereses de diferentes grupos?"
  },
  {
    id: "abierta-071",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué papel juega la argumentación en una discusión democrática?"
  },
  {
    id: "abierta-072",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué las decisiones públicas deberían considerar diferentes puntos de vista?"
  },
  {
    id: "abierta-073",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo distinguir una crítica constructiva de una desinformación?"
  },
  {
    id: "abierta-074",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué la participación debe basarse en información verificable?"
  },
  {
    id: "abierta-075",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué podría ocurrir si una comunidad decide sin conocer las consecuencias de una propuesta?"
  },
  {
    id: "abierta-076",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede una comunidad organizar una participación responsable?"
  },
  {
    id: "abierta-077",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué importancia tiene respetar los resultados de los mecanismos democráticos?"
  },
  {
    id: "abierta-078",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué papel cumplen las instituciones públicas en los mecanismos de participación?"
  },
  {
    id: "abierta-079",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué la participación ciudadana puede aumentar la confianza en las instituciones?"
  },
  {
    id: "abierta-080",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede la participación ayudar a mejorar las políticas públicas?"
  },
  {
    id: "abierta-081",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué significa ejercer una ciudadanía responsable?"
  },
  {
    id: "abierta-082",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué significa ejercer una ciudadanía activa?"
  },
  {
    id: "abierta-083",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede una persona pasar de ser espectadora a participante en su comunidad?"
  },
  {
    id: "abierta-084",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué diferencia existe entre una decisión individual y una decisión colectiva?"
  },
  {
    id: "abierta-085",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué una decisión colectiva necesita reglas claras?"
  },
  {
    id: "abierta-086",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué importancia tiene la transparencia para la participación ciudadana?"
  },
  {
    id: "abierta-087",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede el acceso a la información fortalecer la participación?"
  },
  {
    id: "abierta-088",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué relación existe entre control ciudadano y rendición de cuentas?"
  },
  {
    id: "abierta-089",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede una comunidad evaluar si una autoridad está atendiendo sus necesidades?"
  },
  {
    id: "abierta-090",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué importancia tiene que los ciudadanos conozcan las funciones de sus gobernantes?"
  },
  {
    id: "abierta-091",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué relación existe entre participación y construcción de acuerdos?"
  },
  {
    id: "abierta-092",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué la participación ciudadana requiere responsabilidad además de derechos?"
  },
  {
    id: "abierta-093",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué diferencia existe entre tener un mecanismo legal y saber utilizarlo correctamente?"
  },
  {
    id: "abierta-094",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué importancia tiene distinguir entre una solicitud, una propuesta y una decisión colectiva?"
  },
  {
    id: "abierta-095",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué diferencia existe entre pedir una actuación a una entidad y votar sobre una decisión?"
  },
  {
    id: "abierta-096",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué diferencia existe entre consultar una opinión y aprobar una norma?"
  },
  {
    id: "abierta-097",
    mecanismo: "revocatoria-mandato",
    tipo: "abierta",
    pregunta: "¿Qué diferencia existe entre una revocatoria y unas elecciones ordinarias?"
  },
  {
    id: "abierta-098",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué algunos mecanismos requieren intervención de autoridades o instituciones específicas?"
  },
  {
    id: "abierta-099",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué responsabilidad tiene un ciudadano al participar en un mecanismo de participación?"
  },
  {
    id: "abierta-100",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede una comunidad convertir una necesidad en una propuesta concreta?"
  },
  {
    id: "abierta-101",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué importancia tiene pasar de identificar un problema a proponer una solución?"
  },
  {
    id: "abierta-102",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué la educación es importante para formar ciudadanos participativos?"
  },
  {
    id: "abierta-103",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué conclusión puedes sacar sobre la importancia de participar en una democracia?"
  },
  {
    id: "abierta-104",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué significa para ti ser un ciudadano activo?"
  },
  {
    id: "abierta-105",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué una democracia necesita mecanismos para que la ciudadanía sea escuchada?"
  },
  {
    id: "abierta-106",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede la participación ciudadana fortalecer una comunidad?"
  },
  {
    id: "abierta-107",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué diferencia existe entre participar de manera informada y participar sin conocer el tema?"
  },
  {
    id: "abierta-108",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué es importante conocer las reglas de cada mecanismo de participación?"
  },
  {
    id: "abierta-109",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué papel tienen las instituciones públicas en una democracia participativa?"
  },
  {
    id: "abierta-110",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede una persona saber qué mecanismo corresponde a una situación determinada?"
  },
  {
    id: "abierta-111",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué la Constitución de 1991 es importante al estudiar la participación ciudadana colombiana?"
  },
  {
    id: "abierta-112",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué importancia tiene que los ciudadanos conozcan sus derechos constitucionales?"
  },
  {
    id: "abierta-113",
    mecanismo: "tutela",
    tipo: "abierta",
    pregunta: "¿Cómo se relacionan los derechos fundamentales con la acción de tutela?"
  },
  {
    id: "abierta-114",
    mecanismo: "derecho-peticion",
    tipo: "abierta",
    pregunta: "¿En qué situación cotidiana podría ser útil un derecho de petición?"
  },
  {
    id: "abierta-115",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué diferencia hay entre pedir información y exigir la protección de un derecho fundamental?"
  },
  {
    id: "abierta-116",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué una respuesta de una entidad pública puede ser importante para un ciudadano?"
  },
  {
    id: "abierta-117",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué características debería tener una buena solicitud dirigida a una entidad pública?"
  },
  {
    id: "abierta-118",
    mecanismo: "consulta-popular",
    tipo: "abierta",
    pregunta: "¿Qué diferencia existe entre una consulta popular y una encuesta de opinión?"
  },
  {
    id: "abierta-119",
    mecanismo: "consulta-popular",
    tipo: "abierta",
    pregunta: "¿Por qué una consulta popular tiene una finalidad diferente a una simple encuesta?"
  },
  {
    id: "abierta-120",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué importancia tiene que una comunidad pueda expresar colectivamente su opinión?"
  },
  {
    id: "abierta-121",
    mecanismo: "cabildo-abierto",
    tipo: "abierta",
    pregunta: "¿Qué tipo de participación permite un cabildo abierto?"
  },
  {
    id: "abierta-122",
    mecanismo: "cabildo-abierto",
    tipo: "abierta",
    pregunta: "¿Por qué el cabildo abierto puede ser importante para los problemas locales?"
  },
  {
    id: "abierta-123",
    mecanismo: "cabildo-abierto",
    tipo: "abierta",
    pregunta: "¿Cómo podría una comunidad prepararse antes de participar en un cabildo abierto?"
  },
  {
    id: "abierta-124",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué diferencia existe entre presentar una propuesta y votar una propuesta?"
  },
  {
    id: "abierta-125",
    mecanismo: "iniciativa-popular",
    tipo: "abierta",
    pregunta: "¿Por qué una iniciativa popular puede ser una forma de participación directa?"
  },
  {
    id: "abierta-126",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué importancia tiene que una propuesta ciudadana esté bien fundamentada?"
  },
  {
    id: "abierta-127",
    mecanismo: "iniciativa-popular",
    tipo: "abierta",
    pregunta: "¿Cómo puede una iniciativa popular representar las necesidades de una comunidad?"
  },
  {
    id: "abierta-128",
    mecanismo: "revocatoria-mandato",
    tipo: "abierta",
    pregunta: "¿Por qué la revocatoria del mandato es una herramienta de control político ciudadano?"
  },
  {
    id: "abierta-129",
    mecanismo: "revocatoria-mandato",
    tipo: "abierta",
    pregunta: "¿Qué diferencia existe entre estar inconforme con un gobernante y activar un mecanismo de revocatoria?"
  },
  {
    id: "abierta-130",
    mecanismo: "revocatoria-mandato",
    tipo: "abierta",
    pregunta: "¿Por qué la revocatoria del mandato tiene requisitos y procedimientos?"
  },
  {
    id: "abierta-131",
    mecanismo: "revocatoria-mandato",
    tipo: "abierta",
    pregunta: "¿Qué papel tiene la voluntad ciudadana en una revocatoria?"
  },
  {
    id: "abierta-132",
    mecanismo: "revocatoria-mandato",
    tipo: "abierta",
    pregunta: "¿Por qué no debería confundirse una revocatoria con una elección ordinaria?"
  },
  {
    id: "abierta-133",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué característica diferencia a los mecanismos de protección de derechos de los mecanismos de decisión política?"
  },
  {
    id: "abierta-134",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo usarías para defender un derecho fundamental? Explica tu elección."
  },
  {
    id: "abierta-135",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo usarías para solicitar una actuación de una institución? Explica tu elección."
  },
  {
    id: "abierta-136",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo usarías para proponer una norma? Explica tu elección."
  },
  {
    id: "abierta-137",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo usarías para participar en una discusión sobre un problema local? Explica tu elección."
  },
  {
    id: "abierta-138",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo usarías para consultar la opinión de una comunidad sobre un asunto público? Explica tu elección."
  },
  {
    id: "abierta-139",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo está relacionado con la posibilidad de decidir popularmente sobre una norma?"
  },
  {
    id: "abierta-140",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo está relacionado con una consulta sobre una decisión política del Gobierno?"
  },
  {
    id: "abierta-141",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo permite discutir públicamente asuntos de interés de una comunidad?"
  },
  {
    id: "abierta-142",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo permite impulsar una propuesta normativa desde la ciudadanía?"
  },
  {
    id: "abierta-143",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo puede buscar la terminación anticipada del mandato de un funcionario elegido?"
  },
  {
    id: "abierta-144",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué es importante distinguir entre el objetivo de un mecanismo y su procedimiento?"
  },
  {
    id: "abierta-145",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede un ciudadano evitar elegir un mecanismo incorrecto?"
  },
  {
    id: "abierta-146",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué información debería buscar una persona antes de iniciar un mecanismo de participación?"
  },
  {
    id: "abierta-147",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué la participación ciudadana necesita ciudadanos responsables?"
  },
  {
    id: "abierta-148",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede una comunidad organizarse para presentar una necesidad ante las autoridades?"
  },
  {
    id: "abierta-149",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué el diálogo es importante en una democracia?"
  },
  {
    id: "abierta-150",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede el respeto por opiniones diferentes mejorar una actividad de participación?"
  },
  {
    id: "abierta-151",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué podría ocurrir si solamente participara una pequeña parte de la comunidad?"
  },
  {
    id: "abierta-152",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué la participación de los jóvenes puede ser importante para el futuro de una sociedad?"
  },
  {
    id: "abierta-153",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo podría una institución educativa enseñar participación ciudadana de manera práctica?"
  },
  {
    id: "abierta-154",
    mecanismo: "plebiscito",
    tipo: "abierta",
    pregunta: "¿Qué actividad realizarías para enseñar la diferencia entre plebiscito y referendo?"
  },
  {
    id: "abierta-155",
    mecanismo: "cabildo-abierto",
    tipo: "abierta",
    pregunta: "¿Qué actividad realizarías para enseñar qué es un cabildo abierto?"
  },
  {
    id: "abierta-156",
    mecanismo: "iniciativa-popular",
    tipo: "abierta",
    pregunta: "¿Qué actividad realizarías para enseñar qué es una iniciativa popular?"
  },
  {
    id: "abierta-157",
    mecanismo: "derecho-peticion",
    tipo: "abierta",
    pregunta: "¿Qué actividad realizarías para enseñar la diferencia entre tutela y derecho de petición?"
  },
  {
    id: "abierta-158",
    mecanismo: "consulta-popular",
    tipo: "abierta",
    pregunta: "¿Cómo podrías representar una consulta popular dentro de un salón de clase?"
  },
  {
    id: "abierta-159",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo podrías representar una elección o votación relacionada con un mecanismo de participación?"
  },
  {
    id: "abierta-160",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué ventajas tiene aprender estos mecanismos mediante ejemplos y casos?"
  },
  {
    id: "abierta-161",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué los casos prácticos pueden ayudar a entender mejor los mecanismos?"
  },
  {
    id: "abierta-162",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué error podría cometer una persona que solamente memoriza los nombres de los mecanismos?"
  },
  {
    id: "abierta-163",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué comprender la finalidad de un mecanismo es más útil que memorizar solamente su definición?"
  },
  {
    id: "abierta-164",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo comprobarías si una información sobre participación ciudadana es confiable?"
  },
  {
    id: "abierta-165",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué las redes sociales pueden influir en la participación política?"
  },
  {
    id: "abierta-166",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué riesgos tiene tomar una decisión política basándose únicamente en publicaciones de redes sociales?"
  },
  {
    id: "abierta-167",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede la tecnología facilitar el acceso de los ciudadanos a información pública?"
  },
  {
    id: "abierta-168",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué ventajas tiene que los ciudadanos tengan acceso a información clara sobre sus derechos?"
  },
  {
    id: "abierta-169",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede la desinformación afectar una decisión colectiva?"
  },
  {
    id: "abierta-170",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué responsabilidad tiene una persona antes de compartir información política?"
  },
  {
    id: "abierta-171",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué una ciudadanía informada puede tomar mejores decisiones?"
  },
  {
    id: "abierta-172",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede la educación mejorar la participación democrática?"
  },
  {
    id: "abierta-173",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué relación existe entre participación ciudadana y control social?"
  },
  {
    id: "abierta-174",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede la ciudadanía ayudar a vigilar el cumplimiento de las decisiones públicas?"
  },
  {
    id: "abierta-175",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué importancia tiene la transparencia de las instituciones para la participación?"
  },
  {
    id: "abierta-176",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué relación existe entre rendición de cuentas y participación ciudadana?"
  },
  {
    id: "abierta-177",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué una comunidad debería conocer las funciones de sus autoridades?"
  },
  {
    id: "abierta-178",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede una comunidad expresar una inconformidad de manera democrática?"
  },
  {
    id: "abierta-179",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué diferencia existe entre protestar una decisión y utilizar un mecanismo jurídico o democrático?"
  },
  {
    id: "abierta-180",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué la participación debe respetar los derechos de otras personas?"
  },
  {
    id: "abierta-181",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede resolverse democráticamente un conflicto de opiniones dentro de una comunidad?"
  },
  {
    id: "abierta-182",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué importancia tiene escuchar a las minorías en una democracia?"
  },
  {
    id: "abierta-183",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué una democracia debe permitir el desacuerdo?"
  },
  {
    id: "abierta-184",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué significa aceptar una decisión democrática aunque el resultado no coincida con tu opinión?"
  },
  {
    id: "abierta-185",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede una comunidad construir acuerdos cuando existen opiniones diferentes?"
  },
  {
    id: "abierta-186",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué los mecanismos de participación deben tener reglas claras?"
  },
  {
    id: "abierta-187",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué función cumplen los requisitos legales de los mecanismos de participación?"
  },
  {
    id: "abierta-188",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué podría suceder si cualquiera pudiera activar un mecanismo sin cumplir ningún requisito?"
  },
  {
    id: "abierta-189",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué es importante diferenciar entre un mecanismo nacional y uno relacionado con asuntos locales?"
  },
  {
    id: "abierta-190",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo influye el ámbito territorial en algunos mecanismos de participación?"
  },
  {
    id: "abierta-191",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué algunos asuntos requieren la intervención de autoridades específicas?"
  },
  {
    id: "abierta-192",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué importancia tiene conocer quién puede iniciar o participar en cada mecanismo?"
  },
  {
    id: "abierta-193",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo explicarías a un compañero la diferencia entre participación directa y representación política?"
  },
  {
    id: "abierta-194",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué elegir representantes no elimina la necesidad de participación ciudadana?"
  },
  {
    id: "abierta-195",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo pueden los ciudadanos participar entre una elección y otra?"
  },
  {
    id: "abierta-196",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué importancia tiene que los ciudadanos conozcan las decisiones de sus representantes?"
  },
  {
    id: "abierta-197",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede una comunidad pasar de identificar un problema a buscar una solución?"
  },
  {
    id: "abierta-198",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué papel cumple la propuesta ciudadana en una democracia?"
  },
  {
    id: "abierta-199",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede una comunidad evaluar si una solución propuesta realmente atiende su problema?"
  },
  {
    id: "abierta-200",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Por qué una buena participación necesita argumentos y no solamente opiniones?"
  },
  {
    id: "abierta-201",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué diferencia existe entre una opinión personal y un argumento?"
  },
  {
    id: "abierta-202",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cómo puede un debate respetuoso ayudar a una decisión colectiva?"
  },
  {
    id: "abierta-203",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué aprendiste sobre participación ciudadana que podrías aplicar en tu colegio?"
  },
  {
    id: "abierta-204",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cuál de los mecanismos estudiados te parece más sencillo de explicar y por qué?"
  },
  {
    id: "abierta-205",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Cuál de los mecanismos estudiados te parece más difícil de diferenciar de otro y por qué?"
  },
  {
    id: "abierta-206",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo te parece más útil para proteger derechos?"
  },
  {
    id: "abierta-207",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo te parece más útil para intervenir en asuntos de una comunidad?"
  },
  {
    id: "abierta-208",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué mecanismo te parece más útil para impulsar propuestas ciudadanas?"
  },
  {
    id: "abierta-209",
    mecanismo: null,
    tipo: "abierta",
    pregunta: "¿Qué conclusión sacarías sobre la importancia de conocer los mecanismos de participación?"
  }
];
