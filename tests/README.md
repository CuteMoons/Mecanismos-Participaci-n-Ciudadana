# Pruebas automáticas

Requieren Node 18+ y un servidor local en la raíz del proyecto:

    npm install puppeteer-core @sparticuz/chromium jsdom   # dentro de tests/
    python3 -m http.server 8765                              # en la raíz del proyecto
    node t_data.js     # datos y lógica pura (crucigramas, relacionar, sopa)
    node t_cw2.js      # resuelve con teclado las 24 distribuciones nuevas
    node t_mw.js       # las 6 versiones de relacionar (escritorio y móvil)
    node t_ws.js && node t_ws2.js   # sopa de letras
    node t_student.js  # identificación del alumno
    node t_cross.js t_match.js t_sound.js t_misc.js   # regresión

El audio se simula con un AudioContext falso (cuenta osciladores): sirve para
comprobar *qué* suena y que nada queda activo, no el timbre.
Los errores `ERR_NAME_NOT_RESOLVED` de Google Fonts se ignoran (sin internet).
