/**
 * data/memory/memoria-data.js
 * Parejas concepto ↔ definición del juego «Memoria de conceptos».
 * Cada partida elige al azar algunas parejas de este banco.
 * Las definiciones son cortas y no se parecen entre sí para que cada una
 * encaje con un solo concepto.
 */
(function () {
  const MEMORIA_PARES = [
    { id: "plebiscito", concepto: "Plebiscito", definicion: "El Presidente le pide al pueblo que apoye o rechace una decisión importante del Gobierno." },
    { id: "referendo", concepto: "Referendo", definicion: "El pueblo vota para aprobar o rechazar una norma, o para derogar una que ya existe." },
    { id: "consulta", concepto: "Consulta popular", definicion: "Pregunta general sobre un asunto importante que el pueblo responde votando sí o no." },
    { id: "cabildo", concepto: "Cabildo abierto", definicion: "Reunión pública del concejo o de la junta local en la que los habitantes pueden intervenir." },
    { id: "iniciativa", concepto: "Iniciativa legislativa", definicion: "Derecho de los ciudadanos a presentar proyectos de ley u otras normas ante las corporaciones públicas." },
    { id: "revocatoria", concepto: "Revocatoria del mandato", definicion: "Los ciudadanos votan para decidir si un alcalde o gobernador termina su cargo antes de tiempo." },
    { id: "participacion", concepto: "Participación ciudadana", definicion: "Derecho de las personas a intervenir en las decisiones que afectan a su comunidad y a su país." },
    { id: "democracia", concepto: "Democracia participativa", definicion: "Modelo en el que el pueblo, además de elegir, decide y controla el poder de manera directa." },
    { id: "voto", concepto: "Voto", definicion: "Derecho y deber ciudadano con el que se elige a los gobernantes de forma libre y secreta." },
    { id: "control", concepto: "Control social", definicion: "Vigilancia que la ciudadanía hace a la gestión pública y al uso de los recursos del Estado." },
    { id: "tutela", concepto: "Acción de tutela", definicion: "Acción ante un juez para proteger de forma rápida un derecho fundamental." },
    { id: "peticion", concepto: "Derecho de petición", definicion: "Derecho a pedir respetuosamente información o una solución a una autoridad y recibir respuesta." },
    { id: "soberania", concepto: "Soberanía popular", definicion: "El poder del Estado proviene del pueblo, que lo ejerce directamente o por medio de sus representantes." },
    { id: "constitucion", concepto: "Constitución Política", definicion: "Norma suprema que establece los derechos, los deberes y la organización del Estado." }
  ];
  if (typeof window !== "undefined") window.MEMORIA_PARES = MEMORIA_PARES;
  if (typeof module !== "undefined") module.exports = { MEMORIA_PARES };
})();
