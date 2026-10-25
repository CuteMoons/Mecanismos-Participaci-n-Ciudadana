/**
 * js/quiz/quiz-engine.js
 * Motor de selección de preguntas para una partida de quiz.
 * Solo ELIGE preguntas; no toca el DOM. Cada partida genera una selección
 * y un orden nuevos (Fisher-Yates con Math.random).
 *
 * Las preguntas devueltas son COPIAS: las opciones se reordenan en la copia
 * y se guarda la clave correcta (respuestaCorrecta) de la copia, de modo que
 * los bancos originales nunca se modifican.
 */

const QuizEngine = (() => {
  const LETRAS = ["A", "B", "C", "D", "E", "F"];

  /** Mezcla un arreglo sin mutar el original (Fisher-Yates). */
  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /** Reparte una cantidad total en partes lo más equilibradas posible. */
  function distribuirEquilibrado(total, partes) {
    const base = Math.floor(total / partes);
    let resto = total % partes;
    return Array.from({ length: partes }, () => {
      const extra = resto > 0 ? 1 : 0;
      if (resto > 0) resto--;
      return base + extra;
    });
  }

  /** Quita duplicados por id (conserva la primera aparición). */
  function sinDuplicados(lista) {
    const vistos = new Set();
    return lista.filter((p) => {
      if (vistos.has(p.id)) return false;
      vistos.add(p.id);
      return true;
    });
  }

  /**
   * Devuelve una copia de la pregunta con las opciones reordenadas.
   * La letra correcta se recalcula a partir del TEXTO de la opción correcta
   * original, por lo que la relación con la respuesta correcta se conserva.
   */
  function barajarOpciones(pregunta, mezclar) {
    const copia = { ...pregunta };
    if (!pregunta.opciones) return copia;

    const entradas = Object.entries(pregunta.opciones); // [[letra, texto], ...]
    const orden = mezclar ? shuffle(entradas) : entradas;
    const nuevas = {};
    let nuevaCorrecta = null;

    orden.forEach(([letraOriginal, texto], i) => {
      const letra = LETRAS[i];
      nuevas[letra] = texto;
      if (letraOriginal === pregunta.respuestaCorrecta) nuevaCorrecta = letra;
    });

    copia.opciones = nuevas;
    copia.respuestaCorrecta = nuevaCorrecta;
    return copia;
  }

  /**
   * Construye la partida.
   * @returns {{preguntas:Array, solicitadas:number, disponibles:number, ajustada:boolean}}
   */
  function construirPartida(config) {
    const resultado =
      config.tipoPregunta === "abierta"
        ? construirAbiertas(config)
        : construirMultiples(config);

    let preguntas = sinDuplicados(resultado.preguntas);
    if (config.aleatorio) preguntas = shuffle(preguntas);

    if (config.tipoPregunta !== "abierta") {
      preguntas = preguntas.map((p) => barajarOpciones(p, config.aleatorio));
    }

    return {
      preguntas,
      solicitadas: config.numPreguntas,
      disponibles: resultado.disponibles,
      ajustada: preguntas.length < config.numPreguntas
    };
  }

  function construirMultiples(config) {
    const universo = config.mecanismoFiltro
      ? obtenerPreguntasPorMecanismo(config.mecanismoFiltro)
      : BANCO_PREGUNTAS;

    const objetivo = config.numPreguntas;
    let seleccionadas = [];
    let disponibles;

    if (config.dificultad === "mixto") {
      disponibles = universo.length;
      const niveles = ["facil", "media", "dificil"].filter((n) => universo.some((p) => p.dificultad === n));
      const cantidades = distribuirEquilibrado(objetivo, niveles.length || 1);
      const usados = new Set();

      niveles.forEach((nivel, idx) => {
        const pool = shuffle(universo.filter((p) => p.dificultad === nivel));
        pool.slice(0, cantidades[idx]).forEach((p) => {
          seleccionadas.push(p);
          usados.add(p.id);
        });
      });

      // Si algún nivel tenía menos preguntas, completa con otras no usadas.
      if (seleccionadas.length < objetivo) {
        const resto = shuffle(universo.filter((p) => !usados.has(p.id)));
        seleccionadas.push(...resto.slice(0, objetivo - seleccionadas.length));
      }
    } else {
      const pool = universo.filter((p) => p.dificultad === config.dificultad);
      disponibles = pool.length;
      seleccionadas = shuffle(pool).slice(0, objetivo);
    }

    return { preguntas: seleccionadas, disponibles };
  }

  function construirAbiertas(config) {
    const universo = config.mecanismoFiltro
      ? obtenerPreguntasAbiertasPorMecanismo(config.mecanismoFiltro)
      : BANCO_PREGUNTAS_ABIERTAS;
    return {
      preguntas: shuffle(universo).slice(0, config.numPreguntas),
      disponibles: universo.length
    };
  }

  /** Cantidad de preguntas disponibles para la configuración dada (para avisos en la UI). */
  function contarDisponibles(config) {
    if (config.tipoPregunta === "abierta") {
      return (config.mecanismoFiltro
        ? obtenerPreguntasAbiertasPorMecanismo(config.mecanismoFiltro)
        : BANCO_PREGUNTAS_ABIERTAS
      ).length;
    }
    const universo = config.mecanismoFiltro
      ? obtenerPreguntasPorMecanismo(config.mecanismoFiltro)
      : BANCO_PREGUNTAS;
    if (config.dificultad === "mixto") return universo.length;
    return universo.filter((p) => p.dificultad === config.dificultad).length;
  }

  return { construirPartida, contarDisponibles, shuffle, barajarOpciones };
})();
