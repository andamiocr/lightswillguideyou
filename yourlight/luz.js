/* ==========================================================
   Your Light / Tu Luz — Lights Will Guide You
   Cada respuesta es una estrella de papel que cuelga de un hilo
   sobre el país de quien la escribió.
   Datos: Google Forms (escribir) + Google Sheets (leer, columna
   "Ocultar" con X = no se muestra).
   Vista de prueba con estrellas inventadas: agregar ?demo=1
   ========================================================== */
(function () {
  'use strict';
  var CFG = window.LUZ_CONFIG || {}, M = window.LWGY_MAPA;
  var html = document.documentElement;
  var lang = html.getAttribute('data-lang') === 'es' ? 'es' : 'en';
  var QUIETO = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DEMO = /[?&]demo=1/.test(location.search);
  var CLAVE = 'lwgy-yourlight';
  var $ = function (s) { return document.querySelector(s); };

  /* ---------- Textos ---------- */
  var T = {
    es: {
      elegir: 'Elegí tu país', sinPais: 'algún lugar del mundo',
      contador: function (n, k) { return n === 1 ? 'Una luz encendida. Falta la tuya.' : n.toLocaleString('es') + ' luces colgadas desde ' + k + (k === 1 ? ' país' : ' países'); },
      vacio: 'Todavía no hay luces. Colgá la primera.',
      rankVacio: 'Cuando se cuelguen las primeras luces, aquí vas a ver qué país brilla más.',
      ultVacio: 'Las primeras luces van a aparecer aquí.',
      ejemplos: ['mi mamá', 'mis sueños', 'la canción que me sacó adelante', 'el mar', 'mi hija', 'volver a empezar', 'mi abuelo, que ya no está', 'la música', 'las ganas de seguir', 'mi perro Toby', 'un recuerdo de mi infancia', 'mi mejor amiga'],
      faltaTexto: 'Escribí quién es tu luz.', faltaPais: 'Elegí desde qué país la colgás.',
      filtro: 'Probá con otras palabras. No publicamos enlaces, correos, teléfonos ni insultos.',
      espera: 'Esperá unos segundos antes de colgar otra estrella.',
      errorEnvio: 'No pudimos guardar tu luz. Revisá tu conexión y probá de nuevo.',
      listo: function (p) { return 'Tu estrella ya cuelga sobre ' + p + '.'; },
      tuLuz: 'Tu luz', miLuz: 'La luz que me guía es…', pregunta: '¿Quién es la luz que te guía?',
      tipo: ['Un espectáculo de teatro, danza', 'y música en vivo inspirado en Coldplay'], cta: 'Colgá tu estrella en lightswillguideyou.com/tuluz', copiado: '¡Enlace copiado!',
      nLuces: function (n) { return n === 1 ? '1 luz' : n + ' luces'; }, verPais: 'Ver este país en el mapa',
      wa: function (t) { return 'Mi luz es "' + t + '". Colgué mi estrella en el cielo de Lights Will Guide You. ¿Quién es la tuya? '; },
      compartirTxt: '¿Quién es la luz que te guía? Colgá tu estrella:',
      limite: function (n) { return 'Hoy ya colgaste ' + n + ' estrellas desde este teléfono. Mañana podés colgar más.'; },
      compartir: 'Compartir en historias',
      abrirFuera: function (nav) { return nav ? 'Abrir en ' + nav + ' para compartir' : 'Abrir en el navegador para compartir'; },
      notaApp: function (app, nav) { return 'Dentro de ' + app + ' no se pueden guardar imágenes. En ' + (nav || 'tu navegador') + ' tu estrella ya va a estar lista.'; },
      guardar: 'Guardar imagen', verImagen: 'Ver la imagen',
      copiadoSticker: 'Enlace copiado. En Instagram, pegalo en el sticker «Enlace».', copiadoCorto: '✓ Copiado',
      visorT: 'Tu estrella para historias',
      visorIOS: 'Mantené el dedo sobre la imagen y elegí «Guardar en Fotos».',
      visorAndroid: 'Mantené el dedo sobre la imagen y elegí «Descargar imagen».',
      visorOtro: 'Mantené el dedo sobre la imagen (o hacé clic derecho) para guardarla.',
      visorDespues: 'Después abrí Instagram, creá una historia y elegila de tu galería.',
      noSeAbrio: function (nav) { return '¿No se abrió ' + (nav || 'tu navegador') + '? Tocá ••• arriba a la derecha y elegí «Abrir en el navegador». O guardá la imagen aquí mismo.'; },
      compartirCorto: 'Compartir', cerrar: 'Cerrar', descargar: 'Descargar'
    },
    en: {
      elegir: 'Choose your country', sinPais: 'somewhere in the world',
      contador: function (n, k) { return n === 1 ? 'One light is on. Yours is missing.' : n.toLocaleString('en') + ' lights hung from ' + k + (k === 1 ? ' country' : ' countries'); },
      vacio: 'No lights yet. Hang the first one.',
      rankVacio: 'Once the first lights are hung, you will see which country shines brightest here.',
      ultVacio: 'The first lights will appear here.',
      ejemplos: ['my mom', 'my dreams', 'the song that got me through', 'the ocean', 'my daughter', 'starting over', 'my grandpa, who is gone now', 'music', 'the will to keep going', 'my dog Toby', 'a childhood memory', 'my best friend'],
      faltaTexto: 'Write who your light is.', faltaPais: 'Choose the country you are hanging it from.',
      filtro: 'Try other words. We do not publish links, emails, phone numbers or insults.',
      espera: 'Wait a few seconds before hanging another star.',
      errorEnvio: 'We could not save your light. Check your connection and try again.',
      listo: function (p, c) { return 'Your star now hangs over ' + (CON_THE.indexOf(c) > -1 ? 'the ' : '') + p + '.'; },
      tuLuz: 'Your light', miLuz: 'The light that guides me is…', pregunta: 'Who is the light that guides you?',
      tipo: ['A theatre, dance and live music show', 'inspired by Coldplay'], cta: 'Hang your star at lightswillguideyou.com/yourlight', copiado: 'Link copied!',
      nLuces: function (n) { return n === 1 ? '1 light' : n + ' lights'; }, verPais: 'See this country on the map',
      wa: function (t) { return 'My light is "' + t + '". I hung my star in the Lights Will Guide You sky. Who is yours? '; },
      compartirTxt: 'Who is the light that guides you? Hang your star:',
      limite: function (n) { return 'You have hung ' + n + ' stars from this device today. You can hang more tomorrow.'; },
      compartir: 'Share to Stories',
      abrirFuera: function (nav) { return nav ? 'Open in ' + nav + ' to share' : 'Open in your browser to share'; },
      notaApp: function (app, nav) { return app + "'s browser can't save images. In " + (nav || 'your browser') + ' your star will be ready.'; },
      guardar: 'Save image', verImagen: 'See the image',
      copiadoSticker: 'Link copied. In Instagram, paste it into the "Link" sticker.', copiadoCorto: '✓ Copied',
      visorT: 'Your star for Stories',
      visorIOS: 'Press and hold the image, then choose "Save to Photos".',
      visorAndroid: 'Press and hold the image, then choose "Download image".',
      visorOtro: 'Press and hold (or right-click) the image to save it.',
      visorDespues: 'Then open Instagram, create a Story and pick it from your gallery.',
      noSeAbrio: function (nav) { return "Didn't " + (nav || 'your browser') + ' open? Tap ••• at the top right and choose "Open in browser". Or save the image right here.'; },
      compartirCorto: 'Share', cerrar: 'Close', descargar: 'Download'
    }
  };
  var t = function (k) { return T[lang][k]; };
  var CON_THE = ['US', 'GB', 'NL', 'PH', 'AE', 'DO', 'BS', 'GM', 'CF', 'KY', 'MV', 'MH', 'SB', 'VA', 'CD', 'CG', 'KM'];

  /* ---------- Países ---------- */
  var CODES = Object.keys(M.c);
  function dn(l) { try { var d = new Intl.DisplayNames([l], { type: 'region' }); return function (c) { try { return d.of(c) || c; } catch (e) { return c; } }; } catch (e) { return function (c) { return c; }; } }
  var NOM = { es: dn('es'), en: dn('en') };
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
  var porNombre = {};
  CODES.forEach(function (c) { porNombre[norm(NOM.es(c))] = c; porNombre[norm(NOM.en(c))] = c; });
  Object.assign(porNombre, { 'eeuu': 'US', 'ee uu': 'US', 'usa': 'US', 'uk': 'GB', 'inglaterra': 'GB', 'england': 'GB', 'holanda': 'NL', 'corea': 'KR', 'korea': 'KR' });
  function aCodigo(v) { v = String(v || '').trim(); if (/^[A-Za-z]{2}$/.test(v) && M.c[v.toUpperCase()]) return v.toUpperCase(); return porNombre[norm(v)] || 'ZZ'; }
  function nombrePais(c) { return c === 'ZZ' ? t('sinPais') : NOM[lang](c); }
  function paisDetectado() {
    var ls = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < ls.length; i++) { var m = /[-_]([A-Za-z]{2})$/.exec(ls[i] || ''); if (m && M.c[m[1].toUpperCase()]) return m[1].toUpperCase(); }
    return '';
  }

  /* ---------- Filtro (primer freno; el robot de la hoja revisa todo de nuevo) ----------
     Misma lista y mismas reglas que herramientas/robot-tuluz.gs (pestaña "Palabras").
     Palabra sola = palabra completa. Con * al final = cualquier final (mierd* → mierda, mierdas…).
     Detecta palabras disfrazadas: p.u.t.a, put4, mieeerda, m i e r d a. */
  var PALABRAS = ['puta*', 'puto', 'putos', 'mierd*', 'verga', 'vergas', 'pija', 'pijas', 'cono', 'pendej*', 'hijueputa*', 'hijoeputa*', 'hijo de puta*', 'malparid*', 'culero*', 'culiao', 'culiado*', 'culear*', 'culiar*', 'cabron', 'cabrona*', 'cabrones', 'chingad*', 'chinga tu madre', 'concha de tu madre', 'conchatumadre', 'conchesumadre', 'ctm', 'csm', 'hdp', 'ptm', 'gonorrea', 'mamaguevo*', 'mamahuevo*', 'mamabicho*', 'maricon*', 'sudaca*', 'negrata*', 'mongolic*', 'subnormal*', 'sidos*', 'singar', 'singao', 'pinga', 'tetas', 'tetona*', 'pene', 'penes', 'chupala', 'chupamela', 'follar', 'follame', 'follando', 'matate', 'suicidate', 'fuck*', 'motherfuck*', 'shit*', 'bitch*', 'cunt*', 'nigg*', 'fagg*', 'whore*', 'slut*', 'asshole*', 'dickhead*', 'retard*', 'twat*', 'wanker*', 'pussy', 'kys', 'kill yourself', 'nazi*', 'hitler', 'heil', 'kkk', 'porn*', 'sexo', 'sex', 'xxx', 'nude', 'nudes', 'onlyfans', 'casino', 'viagra', 'bitcoin', 'punto com', 'dot com'];
  function limpiar(s) {
    s = String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    s = s.replace(/[4@]/g, 'a').replace(/3/g, 'e').replace(/[1!|]/g, 'i').replace(/0/g, 'o').replace(/[5$]/g, 's').replace(/7/g, 't');
    s = s.replace(/[^a-z]+/g, ' ').trim();
    return s.replace(/(^| )((?:[a-z] ){2,}[a-z])(?= |$)/g, function (m, a, b) { return a + b.replace(/ /g, ''); });
  }
  function armarFiltro(lista) {
    var partes = [];
    lista.forEach(function (w) {
      w = String(w || '').trim(); if (!w) return;
      var pref = /\*$/.test(w), base = limpiar(w.replace(/\*+$/, ''));
      if (!base) return;
      [base, base.replace(/([a-z])\1+/g, '$1')].forEach(function (v, i) {
        if (i && (v === base || v.length < 3)) return; // «kkk» no puede volverse «k»
        var r = v.replace(/ /g, ' ?');
        partes.push(base.length >= 7 && base.indexOf(' ') < 0 ? '[a-z]*' + r + '[a-z]*' : r + (pref ? '[a-z]*' : ''));
      });
    });
    return partes.length ? new RegExp('(^| )(' + partes.join('|') + ')(?= |$)') : null;
  }
  var MALAS = armarFiltro(PALABRAS);
  function tieneMala(s) { var a = limpiar(s); return !!MALAS && (MALAS.test(a) || MALAS.test(a.replace(/([a-z])\1+/g, '$1'))); }
  function tieneContacto(s) {
    s = String(s || '');
    if (/https?:|www\.|\.(com|net|org|io|ly|xyz|link)\b|t\.me\/|@/i.test(s)) return true;
    // 8 cifras o más seguidas parecen un teléfono (pero "1945-2020" son años y sí se permiten)
    return /(\d[\s.\-]?){8,}/.test(s.replace(/\b(1[89]|20)\d\d\s*[-–]\s*(1[89]|20)\d\d\b/g, ''));
  }
  function aceptable(s) { return !tieneContacto(s) && !tieneMala(s); }

  /* ---------- Límite por teléfono y código anónimo ----------
     Cada navegador recibe un código al azar (no dice quién es la persona). Viaja junto al idioma
     ("es · k7f3q2ab · America/Costa_Rica") para que el robot de la hoja note abusos. */
  var MAX_DIA = 5;
  var DISP = (function () { try { var d = localStorage.getItem('lwgy-dispositivo') || ''; if (!/^[a-z0-9]{6,12}$/.test(d)) { d = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 8); localStorage.setItem('lwgy-dispositivo', d); } return d; } catch (e) { return ''; } })();
  var ZONA = (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; } })();
  function hoy() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function cuentaHoy() { try { var o = JSON.parse(localStorage.getItem('lwgy-hoy') || '{}'); return o.d === hoy() ? +o.n || 0 : 0; } catch (e) { return 0; } }
  function sumarHoy() { try { localStorage.setItem('lwgy-hoy', JSON.stringify({ d: hoy(), n: cuentaHoy() + 1 })); } catch (e) {} }
  /* Protecciones contra bots: una trampa invisible (una persona nunca la llena) y cuántos
     segundos tardó en escribir (viaja al final: "es · k7f3q2ab · America/Costa_Rica · 14s"). */
  var EMPEZO = 0;
  function segundos() { return EMPEZO ? Math.round((Date.now() - EMPEZO) / 1000) : 0; }
  function datosIdioma() { return lang + ' · ' + (DISP || '-') + ' · ' + (ZONA || '-') + ' · ' + segundos() + 's'; }

  /* ---------- ¿Estamos dentro de Instagram, Facebook o TikTok? ----------
     Sus navegadores internos no dejan guardar ni compartir imágenes. Ofrecemos abrir la página
     en Safari o Chrome con la estrella ya lista (?mia=…). */
  var UA = navigator.userAgent || '';
  var IOS = /iPhone|iPad|iPod/i.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var ANDROID = /Android/i.test(UA);
  var APP = /Instagram/i.test(UA) ? 'ig' : /Barcelona/i.test(UA) ? 'threads' : /FBAN|FBAV|FB_IAB|FBIOS|FB4A/i.test(UA) ? 'fb' : /BytedanceWebview|musical_ly|TikTok/i.test(UA) ? 'tiktok' : '';
  var NAV = IOS ? 'Safari' : ANDROID ? 'Chrome' : '';

  /* ---------- Estado ---------- */
  var luces = [];            // {t, p, c, ts, propia, mx, my, fase, giro, nace}
  var claves = {};
  function clave(tx, p) { return norm(tx) + '|' + p; }
  function agregar(o) {
    var k = clave(o.t, o.p) + (o.unico || '');
    if (claves[k]) { if (o.propia) claves[k].propia = true; return claves[k]; }
    o.fase = Math.random() * 6.283; o.giro = Math.random() * 6.283; o.vel = .6 + Math.random() * .7;
    claves[k] = o; luces.push(o); return o;
  }
  function propiasGuardadas() { try { return JSON.parse(localStorage.getItem(CLAVE) || '[]'); } catch (e) { return []; } }
  function guardarPropia(o) { try { var a = propiasGuardadas(); a.push({ t: o.t, p: o.p, c: o.c, ts: o.ts }); localStorage.setItem(CLAVE, JSON.stringify(a.slice(-20))); } catch (e) {} }

  /* ---------- Lienzo ---------- */
  var cv = $('#cielo'), cx = cv.getContext('2d'), escena = $('#escena');
  var W = 0, H = 0, DPR = 1, mapa = { x: 0, y: 0, w: 0, h: 0, celda: 0 }, pan = 0, panMax = 0, panObj = null;
  var capaMapa = null, capaFondo = null, sprites = {};
  var A = M.cols / M.rows;

  function proyectar(lat, lng) { return [(lng - M.lon0) / (M.lon1 - M.lon0) * mapa.w, (M.lat0 - lat) / (M.lat0 - M.lat1) * mapa.h]; }

  function medir() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    var movil = W < 960;
    var marTop = H * (movil ? 0.75 : 0.68), arriba = movil ? Math.max(H * 0.36, 230) : 64;
    var mh = Math.max(160, marTop - arriba - H * 0.02);
    if (movil) mh = Math.min(mh, W * 1.15);
    var mw = mh * A;
    if (!movil && mw > W * 0.96) { mw = W * 0.96; mh = mw / A; }
    var f = mapa.w ? focoActual() : null;
    mapa.w0 = mw; mapa.h0 = mh; mapa.y0 = Math.max(arriba, marTop - H * 0.02 - mh);
    mapa.w = mw; mapa.h = mh; mapa.celda = mw / M.cols; mapa.y = mapa.y0;
    var pad = 28;
    panMax = Math.max(0, mw + pad * 2 - W);
    mapa.base = panMax ? pad : (W - mw) / 2;
    pan = Math.min(pan, panMax);
    pintarCapas();
    if (Z > 1 && f) aplicarZoom(f.u, f.v); else ubicarTodas();
  }

  function pintarCapas() {
    // Puntos de tierra
    capaMapa = document.createElement('canvas');
    capaMapa.width = Math.ceil(mapa.w0 * DPR); capaMapa.height = Math.ceil(mapa.h0 * DPR);
    var g = capaMapa.getContext('2d'); g.scale(DPR, DPR);
    var bits = atob(M.land), cel = mapa.w0 / M.cols, r = Math.max(.7, cel * .2);
    g.fillStyle = 'rgba(169,164,198,.20)';
    for (var i = 0, n = M.cols * M.rows; i < n; i++) {
      if (bits.charCodeAt(i >> 3) & (1 << (i & 7))) {
        var c = i % M.cols, f = (i / M.cols) | 0;
        g.beginPath(); g.arc((c + .5) * cel, (f + .5) * cel * (mapa.h0 / mapa.w0) * A, r, 0, 6.283); g.fill();
      }
    }
    // Polvo de estrellas reales, muy tenue
    capaFondo = document.createElement('canvas');
    capaFondo.width = Math.ceil(W * DPR); capaFondo.height = Math.ceil(H * DPR);
    var b = capaFondo.getContext('2d'); b.scale(DPR, DPR);
    var semilla = 7; function rnd() { semilla = (semilla * 16807) % 2147483647; return semilla / 2147483647; }
    for (var k = 0; k < Math.round(W * H / 2600); k++) { b.fillStyle = 'rgba(248,247,251,' + (.08 + rnd() * .3).toFixed(2) + ')'; b.fillRect(rnd() * W, rnd() * H * .78, rnd() < .1 ? 1.6 : 1, rnd() < .1 ? 1.6 : 1); }
    // Estrellas de papel prerenderizadas: 8 giros × 3 estilos
    sprites = { papel: [], propia: [], marcada: [] };
    ['papel', 'propia', 'marcada'].forEach(function (estilo) {
      for (var j = 0; j < 8; j++) sprites[estilo].push(estrellaSprite(estilo, j / 7));
    });
  }

  function trazarEstrella(g, x, y, R, rot) {
    g.beginPath();
    for (var i = 0; i < 10; i++) {
      var rr = i % 2 ? R * .42 : R, a = rot + i * Math.PI / 5 - Math.PI / 2;
      g[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    g.closePath();
  }
  function estrellaSprite(estilo, giro) {
    var R = estilo === 'papel' ? 7 : 11, S = Math.ceil((R * 2 + 26) * DPR);
    var c = document.createElement('canvas'); c.width = c.height = S;
    var g = c.getContext('2d'); g.scale(DPR, DPR);
    var m = S / DPR / 2, ancho = .28 + .72 * giro;
    if (estilo !== 'papel') {
      var gl = g.createRadialGradient(m, m, 0, m, m, m);
      gl.addColorStop(0, estilo === 'propia' ? 'rgba(255,217,61,.55)' : 'rgba(248,247,251,.45)'); gl.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gl; g.fillRect(0, 0, m * 2, m * 2);
    }
    g.save(); g.translate(m, m); g.scale(ancho, 1);
    var claro = estilo === 'propia' ? '#FFE680' : '#FBFAFD', oscuro = estilo === 'propia' ? '#E0A800' : '#C9C3DE';
    trazarEstrella(g, 0, 0, R, 0); g.fillStyle = claro; g.fill();
    g.save(); g.clip(); g.fillStyle = oscuro; g.globalAlpha = .55 + .45 * (1 - giro); g.fillRect(0, -R, R, R * 2); g.restore();
    g.restore();
    return c;
  }

  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; }
  function ubicarTodas() {
    var grupos = {};
    luces.slice().sort(function (a, b) { return a.ts - b.ts; }).forEach(function (l) { (grupos[l.p] = grupos[l.p] || []).push(l); });
    var paso = Math.max(4.2, mapa.celda * 1.25);
    Object.keys(grupos).forEach(function (p) {
      var base;
      grupos[p].forEach(function (l, i) {
        if (p === 'ZZ') { base = proyectar(-8 + hash(l.t) * 30 - 15, -38 + hash(l.t + 'x') * 22); i = 0; }
        else if (!base) { var ll = M.c[p]; base = proyectar(ll[0], ll[1]); }
        var ang = i * 2.39996 + hash(p) * 6.283, rad = paso * Math.sqrt(i) * (i ? 1 : 0);
        var ox = 0, oy = 0;
        if (l.c) { var hc = hash(norm(l.c)); ox = Math.cos(hc * 6.283) * paso * 1.4; oy = Math.sin(hc * 6.283) * paso * .9; }
        l.mx = base[0] + Math.cos(ang) * rad + ox;
        l.my = Math.max(-mapa.y + 24, base[1] + Math.sin(ang) * rad * .8 + oy);
      });
    });
  }

  /* ---------- Dibujo ---------- */
  var marcada = null, vivo = false, ultimaPos = [];
  function origenX() { return mapa.base - pan; }
  function dibujar(ts) {
    var s = ts / 1000;
    cx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx.clearRect(0, 0, W, H);
    if (capaFondo) cx.drawImage(capaFondo, 0, 0, W, H);
    var ox = origenX(), oy = mapa.y;
    var corte = Z > 1.001 ? mapa.y0 - 12 : -1e9;
    if (Z <= 1.001) cx.drawImage(capaMapa, ox, oy, mapa.w, mapa.h);
    else {
      // Con zoom: se dibujan solo los puntos de tierra que caben en pantalla
      var cel = mapa.celda, rr = Math.min(3.4, Math.max(.7, cel * .2)), k0 = mapa.h / M.rows;
      cx.fillStyle = 'rgba(169,164,198,.22)'; cx.beginPath();
      for (var ti = 0; ti < TIERRA.length; ti++) {
        var px = ox + (TIERRA[ti][0] + .5) * cel; if (px < -4 || px > W + 4) continue;
        var py = oy + (TIERRA[ti][1] + .5) * k0; if (py < corte || py > H + 4) continue;
        cx.moveTo(px + rr, py); cx.arc(px, py, rr, 0, 6.283);
      }
      cx.fill();
    }
    ultimaPos.length = 0;
    // Hilos
    cx.lineWidth = 1;
    cx.strokeStyle = 'rgba(248,247,251,.075)';
    cx.beginPath();
    var pos = [];
    for (var i = 0; i < luces.length; i++) {
      var l = luces[i], hx = ox + l.mx, L = oy + l.my;
      if (hx < -30 || hx > W + 30 || L < corte) { pos.push(null); continue; }
      var th = QUIETO ? 0 : Math.sin(s * .9 * l.vel + l.fase) * 0.012;
      var x = hx + Math.sin(th) * L, y = Math.cos(th) * L, gotas = 1, alfa = 1;
      if (l.nace != null) {
        var u = (ts - l.nace);
        if (u < 0) { pos.push(null); continue; }
        gotas = Math.min(1, u / 700); gotas = 1 - Math.pow(1 - gotas, 3); alfa = Math.min(1, u / 500);
        if (u > 1400) l.nace = null;
      }
      y *= gotas;
      pos.push([x, y, hx, l, alfa]);
      if (!l.propia && l !== marcada) { cx.moveTo(hx, 0); cx.lineTo(x, y - 6); }
    }
    cx.stroke();
    // Hilos destacados
    for (var j = 0; j < pos.length; j++) {
      var q = pos[j]; if (!q) continue;
      if (q[3].propia || q[3] === marcada) {
        var col = q[3].propia ? '255,217,61,' : '248,247,251,', hg = cx.createLinearGradient(0, 0, 0, Math.max(1, q[1]));
        var yy = Math.max(1, q[1]), za = Math.min(.9, Math.max(0, (oy - 90) / yy)), zb = Math.min(.95, Math.max(za + .02, (oy - 10) / yy));
        hg.addColorStop(0, 'rgba(' + col + '0)'); hg.addColorStop(za, 'rgba(' + col + '0)'); hg.addColorStop(zb, 'rgba(' + col + (q[3].propia ? '.5)' : '.4)')); hg.addColorStop(1, 'rgba(' + col + (q[3].propia ? '.6)' : '.45)'));
        cx.strokeStyle = hg;
        cx.beginPath(); cx.moveTo(q[2], 0); cx.lineTo(q[0], q[1] - 8); cx.stroke();
      }
    }
    // Estrellas
    // Las destacadas (la propia y la que se está leyendo) se dibujan al final, encima de las demás
    var encima = [];
    for (var k = 0; k <= pos.length; k++) {
      var p = k < pos.length ? pos[k] : null;
      if (k === pos.length) { if (!encima.length) break; p = encima.shift(); k--; }
      else { if (!p) continue; if ((p[3].propia || p[3] === marcada) && encima.indexOf(p) < 0) { encima.push(p); continue; } }
      var lz = p[3], estilo = lz.propia ? 'propia' : (lz === marcada ? 'marcada' : 'papel');
      var g = QUIETO ? 1 : Math.abs(Math.cos(s * .55 * lz.vel + lz.giro));
      var sp = sprites[estilo][Math.round(g * 7)];
      var tam = sp.width / DPR;
      cx.globalAlpha = p[4];
      cx.drawImage(sp, p[0] - tam / 2, p[1] - tam / 2, tam, tam);
      ultimaPos.push([p[0], p[1], lz]);
    }
    cx.globalAlpha = 1;
    if (vuelo) dibujarVuelo(ts);
  }
  function bucle(ts) {
    if (panObj !== null) { pan += (panObj - pan) * .08; if (Math.abs(panObj - pan) < .5) { pan = panObj; panObj = null; } }
    if (animZ) pasoZoom(ts);
    dibujar(ts); flotar(ts);
    if (vivo) requestAnimationFrame(bucle);
  }
  function despertar() { if (QUIETO && !vuelo && !animZ) { dibujar(performance.now()); return; } if (!vivo) { vivo = true; requestAnimationFrame(bucle); } }
  function redibujar() { if (QUIETO || !vivo) dibujar(performance.now()); }

  /* ---------- Vuelo de la luz: del barquito a su lugar en el cielo ---------- */
  var vuelo = null, orbe = $('#orbe');

  /* ---------- El barquito flota en la ola del medio ----------
     Lee dónde va la ola (se mueve con CSS) y pone el casco un poco por debajo de su superficie,
     inclinado según la pendiente. Se mueve por dentro del SVG para que se dibuje nítido. */
  var ola2 = $('.ola--2'), mar = $('.mar'), barcoDiv = $('#barquito'), grupoBarco = $('#barcoSvg .mece'), reflejo = $('#reflejo'), flot = { ok: false };
  function medirBarco() {
    if (!grupoBarco || !ola2 || !mar) return;
    var rm = mar.getBoundingClientRect(), rb = barcoDiv.getBoundingClientRect();
    flot = { ok: rb.width > 0, x: rb.left - rm.left + rb.width / 2, bw: rb.width, top: rb.top - rm.top, W: ola2.getBoundingClientRect().width,
      oTop: parseFloat(getComputedStyle(ola2).top) || 22, oAlto: ola2.getBoundingClientRect().height || 70 };
  }
  function superficie(x, tx) {
    var u = ((x - tx) / flot.W * 1200) % 400; if (u < 0) u += 400;
    var c = u < 200 ? 42 : 10, t = (u % 200) / 200;   // misma curva que el path de .ola--2
    return flot.oTop + ((1 - t) * (1 - t) * 26 + 2 * t * (1 - t) * c + t * t * 26) * flot.oAlto / 60;
  }
  function flotar(ts) {
    if (!flot.ok) return;
    var tx = 0, m = /matrix\(([^)]+)\)/.exec(getComputedStyle(ola2).transform);
    if (m) tx = parseFloat(m[1].split(',')[4]) || 0;
    var y = superficie(flot.x, tx), d = flot.bw * .12;
    var ang = Math.atan2(superficie(flot.x + d, tx) - superficie(flot.x - d, tx), 2 * d) * 57.3 * .8 + (QUIETO ? 0 : Math.sin(ts / 1500) * .7);
    ang = Math.max(-6, Math.min(6, ang));
    var dy = (y + flot.bw * .075 - (flot.top + flot.bw * .56)) * 200 / flot.bw;   // casco metido en el agua
    grupoBarco.setAttribute('transform', 'translate(0 ' + dy.toFixed(2) + ') rotate(' + ang.toFixed(2) + ' 100 112)');
    if (reflejo) {
      var rw = flot.bw * 1.7, rh = flot.bw * .2;
      reflejo.style.width = rw + 'px'; reflejo.style.height = rh + 'px';
      reflejo.style.transform = 'translate(' + (flot.x - rw / 2).toFixed(1) + 'px,' + (y - rh * .3).toFixed(1) + 'px)';
      reflejo.style.opacity = ((vuelo ? .25 : 1) * (QUIETO ? 1 : .82 + .18 * Math.sin(ts / 650))).toFixed(2);
    }
  }
  function lanzar(l) {
    var r = cv.getBoundingClientRect(), o = orbe.getBoundingClientRect();
    var desde = [o.left + o.width / 2 - r.left, o.top + o.height / 2 - r.top];
    if (QUIETO || desde[1] < 0 || desde[1] > H * 1.2) { l.nace = performance.now(); redibujar(); return; }
    vuelo = { l: l, t0: performance.now(), desde: desde };
    l.nace = vuelo.t0 + 1700;
    orbe.style.opacity = '.2';
    despertar();
  }
  function dibujarVuelo(ts) {
    var u = (ts - vuelo.t0) / 1700;
    if (u >= 1) { vuelo = null; orbe.style.opacity = ''; return; }
    var e = u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    var a = vuelo.desde, b = [origenX() + vuelo.l.mx, mapa.y + vuelo.l.my];
    var c = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - H * .25];
    var x = (1 - e) * (1 - e) * a[0] + 2 * (1 - e) * e * c[0] + e * e * b[0];
    var y = (1 - e) * (1 - e) * a[1] + 2 * (1 - e) * e * c[1] + e * e * b[1];
    var gr = cx.createRadialGradient(x, y, 0, x, y, 34);
    gr.addColorStop(0, 'rgba(255,251,224,1)'); gr.addColorStop(.25, 'rgba(255,217,61,.85)'); gr.addColorStop(1, 'rgba(255,217,61,0)');
    cx.globalCompositeOperation = 'lighter'; cx.fillStyle = gr; cx.beginPath(); cx.arc(x, y, 34, 0, 6.283); cx.fill();
    cx.globalCompositeOperation = 'source-over';
  }

  /* ---------- Tarjeta al pasar o tocar ---------- */
  var tarjeta = $('#tarjeta');
  function buscar(px, py, radio) {
    var mejor = null, d = radio;
    for (var i = 0; i < ultimaPos.length; i++) { var p = ultimaPos[i], dd = Math.hypot(p[0] - px, p[1] - py); if (dd < d) { d = dd; mejor = p; } }
    return mejor;
  }
  function mostrar(p) {
    marcada = p ? p[2] : null;
    if (!p) { tarjeta.classList.remove('is-on'); redibujar(); return; }
    var l = p[2];
    tarjeta.innerHTML = '';
    var qq = document.createElement('q'); qq.textContent = l.t; tarjeta.appendChild(qq);
    var sm = document.createElement('small'); sm.textContent = (l.propia ? t('tuLuz') + '. ' : '') + [l.c, nombrePais(l.p)].filter(Boolean).join(', '); tarjeta.appendChild(sm);
    tarjeta.classList.toggle('is-propia', !!l.propia);
    tarjeta.classList.toggle('is-izq', p[0] > W * .62);
    tarjeta.style.left = p[0] + 'px'; tarjeta.style.top = p[1] + 'px';
    tarjeta.classList.add('is-on'); redibujar();
  }

  /* ---------- Arrastrar para recorrer el mundo ---------- */
  var arr = null, pista = $('#pista');
  cv.addEventListener('pointerdown', function (e) { arr = { x: e.clientX, y: e.clientY, pan: pan, my: mapa.y, mov: false, id: e.pointerId }; panObj = null; });
  cv.addEventListener('pointermove', function (e) {
    var r = cv.getBoundingClientRect();
    if (arr && arr.id === e.pointerId) {
      var dx = e.clientX - arr.x, dy = e.clientY - arr.y;
      if (!arr.mov && (Z > 1.001 ? Math.hypot(dx, dy) > 6 : Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy))) { arr.mov = true; cv.classList.add('is-arrastre'); try { cv.setPointerCapture(e.pointerId); } catch (er) {} if (pista) pista.classList.add('is-fuera'); mostrar(null); }
      if (arr.mov) {
        pan = Math.max(0, Math.min(panMax, arr.pan - dx));
        if (Z > 1.001) { mapa.y = Math.max(mapa.y0 + mapa.h0 - mapa.h, Math.min(mapa.y0, arr.my + dy)); ubicarTodas(); }
        redibujar();
      }
      return;
    }
    if (e.pointerType === 'mouse') { var p = buscar(e.clientX - r.left, e.clientY - r.top, 14); cv.style.cursor = p ? 'pointer' : ''; if ((p && p[2]) !== marcada) mostrar(p); }
  });
  function soltar(e) {
    if (!arr) return;
    if (!arr.mov) {
      var r = cv.getBoundingClientRect(), tx = e.clientX - r.left, ty = e.clientY - r.top;
      var est = buscar(tx, ty, e.pointerType === 'mouse' ? 14 : 26);
      mostrar(est);
      if (!est) { var pp = paisEn(tx, ty); if (pp && (pp !== paisZoom || Z < 2.5)) acercarPais(pp); }
    }
    cv.classList.remove('is-arrastre'); arr = null;
  }
  cv.addEventListener('pointerup', soltar);
  cv.addEventListener('pointercancel', function () { cv.classList.remove('is-arrastre'); arr = null; });
  cv.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !arr) mostrar(null); });
  /* ---------- Zoom: tocar un país o usar los botones ---------- */
  var TIERRA = [];
  (function () { var bits = atob(M.land); for (var i = 0, n = M.cols * M.rows; i < n; i++) if (bits.charCodeAt(i >> 3) & (1 << (i & 7))) TIERRA.push([i % M.cols, (i / M.cols) | 0]); })();
  var Z = 1, ZMAX = 6, animZ = null, paisZoom = null;
  var zMas = $('#zoomMas'), zMenos = $('#zoomMenos'), zMundo = $('#zoomMundo'), zPais = $('#zoomPais');
  function focoActual() {
    return { u: (pan + W / 2 - mapa.base) / mapa.w, v: Z > 1.001 ? (mapa.y0 + mapa.h0 / 2 - mapa.y) / mapa.h : .5 };
  }
  function aplicarZoom(u, v) {
    var mw = mapa.w0 * Z, mh = mapa.h0 * Z, pad = 28;
    mapa.w = mw; mapa.h = mh; mapa.celda = mw / M.cols;
    panMax = Math.max(0, mw + pad * 2 - W);
    mapa.base = panMax ? pad : (W - mw) / 2;
    pan = Math.max(0, Math.min(panMax, u * mw + mapa.base - W / 2));
    mapa.y = Z > 1.001 ? Math.max(mapa.y0 + mapa.h0 - mh, Math.min(mapa.y0, mapa.y0 + mapa.h0 / 2 - v * mh)) : mapa.y0;
    ubicarTodas();
  }
  function zoomA(z, u, v) {
    z = Math.max(1, Math.min(ZMAX, z));
    var f = focoActual();
    if (u == null) { u = f.u; v = f.v; }
    if (z <= 1.001) v = .5;
    mostrar(null);
    if (QUIETO) { Z = z; aplicarZoom(u, v); finZoom(); redibujar(); return; }
    animZ = { t0: performance.now(), z0: Z, z1: z, u0: f.u, v0: f.v, u1: u, v1: v };
    despertar();
  }
  function pasoZoom(ts) {
    var k = Math.min(1, (ts - animZ.t0) / 650), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    Z = animZ.z0 * Math.pow(animZ.z1 / animZ.z0, e);
    aplicarZoom(animZ.u0 + (animZ.u1 - animZ.u0) * e, animZ.v0 + (animZ.v1 - animZ.v0) * e);
    if (k >= 1) { Z = animZ.z1; animZ = null; finZoom(); }
  }
  function finZoom() {
    var dentro = Z > 1.001;
    if (!dentro) { Z = 1; paisZoom = null; }
    cv.style.touchAction = dentro ? 'none' : '';
    zMenos.disabled = !dentro; zMas.disabled = Z >= ZMAX - .01; zMundo.hidden = !dentro;
    if (paisZoom && dentro) {
      var n = luces.filter(function (l) { return l.p === paisZoom; }).length;
      zPais.textContent = nombrePais(paisZoom) + (n ? ' · ' + t('nLuces')(n) : '');
    } else zPais.textContent = '';
    if (pista && dentro) pista.classList.add('is-fuera');
  }
  function paisEn(px, py) {
    var lng = M.lon0 + (px - origenX()) / mapa.w * (M.lon1 - M.lon0), lat = M.lat0 - (py - mapa.y) / mapa.h * (M.lat0 - M.lat1);
    if (lat > M.lat0 + 5 || lat < M.lat1 - 5) return null;
    var mejor = null, d = 9 / Math.sqrt(Z), c = Math.cos(lat * Math.PI / 180);
    Object.keys(M.c).forEach(function (k) { if (k === 'ZZ') return; var dd = Math.hypot((M.c[k][1] - lng) * c, M.c[k][0] - lat); if (dd < d) { d = dd; mejor = k; } });
    return mejor;
  }
  function acercarPais(p) {
    if (!M.c[p]) return;
    paisZoom = p; contar('zoom-pais');
    var ll = M.c[p];
    zoomA(Math.max(Z * 1.6, 3.2), (ll[1] - M.lon0) / (M.lon1 - M.lon0), (M.lat0 - ll[0]) / (M.lat0 - M.lat1));
  }
  zMas.addEventListener('click', function () { paisZoom = null; zoomA(Z * 1.8); contar('zoom-mas'); });
  zMenos.addEventListener('click', function () { zoomA(Z / 1.8); });
  zMundo.addEventListener('click', function () { paisZoom = null; zoomA(1); });

  function centrarEn(p, suave) {
    if (!panMax || !p || !M.c[p]) return;
    var x = proyectar(M.c[p][0], M.c[p][1])[0] + mapa.base;
    var obj = Math.max(0, Math.min(panMax, x - W * .5));
    if (suave && !QUIETO) { panObj = obj; despertar(); } else { pan = obj; redibujar(); }
  }

  /* ---------- Listas, contador, ranking ---------- */
  var contador = $('#contador'), ranking = $('#ranking'), ultimas = $('#ultimas');
  var COLOR_LUZ = ['#4EE5E5', '#FF3D7F', '#FFD93D', '#C7FF3D', '#A98BFF', '#FF8A3D'];
  var PERSONA = /(?:^|[^a-záéíóúñü])(mam[aá]s?|mami|mama|madre|pap[aá]s?|papi|padre|padres|hij[oa]s?|abuel[oa]s?|abu|herman[oa]s?|espos[oa]|novi[oa]|pareja|amig[oa]s?|mejor amig[oa]|t[ií][oa]s?|prim[oa]s?|sobrin[oa]s?|niet[oa]s?|familia|beb[eé]|profe|profesor[a]?|maestr[oa]|entrenador[a]?|teacher|coach|perr[oa]s?|perrit[oa]|gat[oa]s?|gatit[oa]|mascota|mom|mum|mommy|mother|dad|daddy|father|parents|son|daughter|kids?|children|grand\w*|brother|sister|siblings?|wife|husband|boyfriend|girlfriend|partner|friends?|aunt|uncle|cousin|nephew|niece|family|baby|dog|puppy|cat|kitty|pet)(?![a-záéíóúñü])/i;
  function esAbstracta(tx) {
    tx = String(tx || '').trim();
    if (tx.length < 3 || PERSONA.test(tx)) return false;
    if (/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+( [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){0,2}$/.test(tx)) return false;   // parece un nombre propio
    return true;
  }
  function pintarListas() {
    var porPais = {}; luces.forEach(function (l) { if (l.p !== 'ZZ') porPais[l.p] = (porPais[l.p] || 0) + 1; });
    var paises = Object.keys(porPais);
    contador.textContent = luces.length ? t('contador')(luces.length, paises.length) : (cargado ? t('vacio') : '');
    ranking.innerHTML = '';
    var top = paises.sort(function (a, b) { return porPais[b] - porPais[a]; }).slice(0, 10), max = top.length ? porPais[top[0]] : 1;
    if (!top.length) { var v = document.createElement('li'); v.className = 'vacio'; v.textContent = t('rankVacio'); ranking.appendChild(v); }
    top.forEach(function (p) {
      var li = document.createElement('li');
      var n = document.createElement('span'); n.textContent = nombrePais(p);
      var c = document.createElement('span'); c.className = 'n'; c.textContent = porPais[p].toLocaleString(lang);
      var b = document.createElement('i'); b.className = 'barra-luz'; b.style.transform = 'scaleX(' + Math.max(.04, porPais[p] / max).toFixed(3) + ')';
      li.append(n, c, b); ranking.appendChild(li);
      li.tabIndex = 0; li.className = 'con-zoom'; li.title = t('verPais');
      var ir = function () { $('#escena').scrollIntoView({ behavior: QUIETO ? 'auto' : 'smooth', block: 'start' }); setTimeout(function () { acercarPais(p); }, QUIETO ? 0 : 450); };
      li.addEventListener('click', ir); li.addEventListener('keydown', function (e) { if (e.key === 'Enter') ir(); });
    });
    ultimas.innerHTML = '';
    var ult = luces.slice().sort(function (a, b) { return b.ts - a.ts; }).slice(0, 12);
    if (!ult.length) { var u = document.createElement('li'); u.textContent = t('ultVacio'); u.style.color = 'var(--bruma)'; ultimas.appendChild(u); }
    ult.forEach(function (l, i) {
      var li = document.createElement('li'); if (l.propia) li.className = 'propia';
      li.style.setProperty('--c', COLOR_LUZ[i % COLOR_LUZ.length]);
      var q = document.createElement('q'); q.textContent = l.t;
      var sm = document.createElement('small'); sm.textContent = [l.c, nombrePais(l.p)].filter(Boolean).join(', ');
      li.append(q, sm); ultimas.appendChild(li);
    });
  }

  /* ---------- Cargar desde Google Sheets ---------- */
  var cargado = false;
  function celda(c, i) { return i > -1 && c[i] && c[i].v != null ? String(c[i].v).trim() : ''; }
  function cargar() {
    if (!CFG.SHEET_ID) { cargado = true; pintarListas(); return; }
    var u = 'https://docs.google.com/spreadsheets/d/' + CFG.SHEET_ID + '/gviz/tq?tqx=out:json&headers=1&_=' + Date.now();
    fetch(u).then(function (r) { return r.text(); }).then(function (txt) {
      var j = JSON.parse(txt.substring(txt.indexOf('{'), txt.lastIndexOf('}') + 1));
      var cols = (j.table.cols || []).map(function (c) { return norm(c.label); });
      function col(re, def) { var i = cols.findIndex(function (c) { return re.test(c); }); return i > -1 ? i : def; }
      var iTs = col(/^(timestamp|marca)/, 0), iL = col(/^(luz|light)/, 1), iP = col(/^(pais|country)/, 2), iC = col(/^(ciudad|city)/, 3), iX = col(/^(ocultar|hide|aprobar)/, 5);
      var nuevas = 0, antes = luces.length;
      (j.table.rows || []).slice(-3000).forEach(function (row, n) {
        var c = row.c || [];
        var tx = celda(c, iL).slice(0, 90);
        if (!tx || celda(c, iX) || !aceptable(tx)) return;
        var ts = c[iTs] && c[iTs].v ? fechaGviz(c[iTs].v) : n;
        var o = agregar({ t: tx, p: aCodigo(celda(c, iP)), c: celda(c, iC).slice(0, 40), ts: ts });
        if (cargado && luces.length > antes + nuevas) { o.nace = performance.now() + nuevas * 250; nuevas++; }
      });
      cargado = true; ubicarTodas(); pintarListas(); despertar();
    }).catch(function () { cargado = true; pintarListas(); });
  }
  function fechaGviz(v) { var m = /Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?/.exec(String(v)); return m ? new Date(+m[1], +m[2], +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)).getTime() : Date.now(); }

  /* ---------- Formulario ---------- */
  var form = $('#formulario'), luz = $('#luz'), sel = $('#pais'), ciudad = $('#ciudad'), enviar = $('#enviar'), aviso = $('#aviso'), cuenta = $('#cuenta');
  var listo = $('#listo'), ultimaPropia = null;
  function llenarPaises() {
    var actual = sel.value || paisDetectado();
    sel.innerHTML = '';
    var o0 = new Option(t('elegir'), ''); o0.disabled = true; sel.add(o0);
    var lista = CODES.slice().sort(function (a, b) { return NOM[lang](a).localeCompare(NOM[lang](b), lang); });
    if (actual && M.c[actual]) { sel.add(new Option(NOM[lang](actual), actual)); var sep = new Option('──────────', ''); sep.disabled = true; sel.add(sep); }
    lista.forEach(function (c) { if (c !== actual) sel.add(new Option(NOM[lang](c), c)); });
    sel.value = actual && M.c[actual] ? actual : '';
  }
  function validar() { enviar.disabled = !luz.value.trim(); }
  luz.addEventListener('input', function () { if (!EMPEZO) EMPEZO = Date.now(); var n = luz.value.length; cuenta.textContent = n > 60 ? n + '/90' : ''; aviso.textContent = ''; validar(); });
  luz.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!enviar.disabled) form.requestSubmit ? form.requestSubmit() : enviar.click(); } });
  var ej = 0;
  function ejemplo() { luz.placeholder = t('ejemplos')[ej % t('ejemplos').length]; }
  setInterval(function () { if (document.activeElement !== luz && !luz.value && !QUIETO) { ej++; ejemplo(); } }, 2800);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var tx = luz.value.replace(/\s+/g, ' ').trim().replace(/^(mi\s+luz\s+es|my\s+light\s+is)\s*[:,.…-]*\s*/i, '').slice(0, 90);
    var p = sel.value, c = ciudad.value.replace(/\s+/g, ' ').trim().slice(0, 40);
    var trampa = document.getElementById('sitio');
    if (trampa && trampa.value) { form.reset(); return; }                 // lo llenó un bot: no se envía
    if (EMPEZO && Date.now() - EMPEZO < 2000) { aviso.textContent = t('espera'); return; }
    if (!tx) { aviso.textContent = t('faltaTexto'); luz.focus(); return; }
    if (!p) { aviso.textContent = t('faltaPais'); sel.focus(); return; }
    if (!aceptable(tx) || (c && !aceptable(c))) { aviso.textContent = t('filtro'); return; }
    if (cuentaHoy() >= MAX_DIA) { aviso.textContent = t('limite')(MAX_DIA); contar('limite-diario'); return; }
    var ult = 0; try { ult = +localStorage.getItem(CLAVE + '-t') || 0; } catch (er) {}
    if (Date.now() - ult < 30000) { aviso.textContent = t('espera'); return; }
    enviar.disabled = true; aviso.textContent = '';
    var d = new URLSearchParams();
    d.append(CFG.ENTRY.luz, tx); d.append(CFG.ENTRY.pais, p); if (c) d.append(CFG.ENTRY.ciudad, c); d.append(CFG.ENTRY.idioma, datosIdioma());
    var envio = DEMO || !CFG.FORM_ID ? Promise.resolve() :
      fetch('https://docs.google.com/forms/d/e/' + CFG.FORM_ID + '/formResponse', { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: d.toString() });
    envio.then(function () {
      try { localStorage.setItem(CLAVE + '-t', String(Date.now())); } catch (er) {}
      sumarHoy();
      var o = agregar({ t: tx, p: p, c: c, ts: Date.now(), propia: true });
      guardarPropia(o); ultimaPropia = o;
      ubicarTodas(); pintarListas();
      centrarEn(p, true);
      if (window.innerWidth < 960) document.getElementById('lienzo').scrollIntoView({ behavior: QUIETO ? 'auto' : 'smooth', block: 'start' });
      setTimeout(function () { lanzar(o); }, window.innerWidth < 960 ? 650 : 50);
      if (navigator.vibrate) navigator.vibrate(30);
      form.reset(); EMPEZO = 0; llenarPaises(); sel.value = p; validar(); cuenta.textContent = '';
      tarjetaCompartir = null; $('#vuelta').hidden = true;
      form.hidden = true; listo.hidden = false; pintarListo(); contar('estrella-colgada');
    }).catch(function () { enviar.disabled = false; aviso.textContent = t('errorEnvio'); });
  });
  var colaConteo = [];
  function contar(nombre) {
    try {
      if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: nombre, title: nombre, event: true });
      else if (colaConteo.push(nombre) === 1) window.addEventListener('load', function () { setTimeout(function () { var c = colaConteo; colaConteo = []; c.forEach(contar); }, 800); });
    } catch (e) {}
  }
  function dos(k, a, b) { var v = function (l) { var x = T[l][k]; return typeof x === 'function' ? x(a, b) : x; }; return '<span class="es">' + v('es') + '</span><span class="en">' + v('en') + '</span>'; }
  var NOMBRE_APP = { ig: 'Instagram', threads: 'Threads', fb: 'Facebook', tiktok: 'TikTok' };
  function pintarListo() {
    if (ultimaPropia) $('#listoTexto').textContent = t('listo')(nombrePais(ultimaPropia.p), ultimaPropia.p);
    actualizarWa();
    var nota = $('#notaApp');
    if (APP) { $('#compartirTxt').innerHTML = dos('abrirFuera', NAV); nota.innerHTML = dos('notaApp', NOMBRE_APP[APP], NAV); nota.hidden = false; }
    else { $('#compartirTxt').innerHTML = dos('compartir'); nota.hidden = true; }
    // La imagen se prepara de una vez: así "Compartir" abre al instante (Safari exige que sea inmediato)
    setTimeout(function () { crearImagen().then(ponerMini, function () {}); }, 350);
  }
  $('#otra').addEventListener('click', function () { listo.hidden = true; form.hidden = false; luz.focus(); });

  /* ---------- Imagen para compartir (1080 × 1920, historias) ---------- */
  var tarjetaCompartir = null;
  function envolver(g, texto, max) {
    var pal = texto.split(' '), lineas = [], l = '';
    pal.forEach(function (w) { var p = l ? l + ' ' + w : w; if (g.measureText(p).width > max && l) { lineas.push(l); l = w; } else l = p; });
    if (l) lineas.push(l); return lineas;
  }
  function crearImagen() {
    if (tarjetaCompartir) return Promise.resolve(tarjetaCompartir);
    var l = ultimaPropia; if (!l) return Promise.reject();
    var fuentes = document.fonts ? Promise.all([document.fonts.load('italic 400 80px Fraunces'), document.fonts.load('400 60px Fraunces'), document.fonts.load('500 40px "DM Sans"'), document.fonts.load('700 46px "DM Sans"'), document.fonts.load('italic 400 46px Fraunces')]).catch(function () {}) : Promise.resolve();
    return fuentes.then(function () {
      var Wc = 1080, Hc = 1920, c = document.createElement('canvas'); c.width = Wc; c.height = Hc;
      var g = c.getContext('2d');
      /* Tarjeta para historias de Instagram (1080 × 1920).
         Arriba y abajo quedan franjas solo decorativas: Instagram las tapa con su barra y con "Enviar mensaje". */
      var bg = g.createLinearGradient(0, 0, 0, Hc); bg.addColorStop(0, '#16113A'); bg.addColorStop(.5, '#0B0920'); bg.addColorStop(1, '#0A1838');
      g.fillStyle = bg; g.fillRect(0, 0, Wc, Hc);
      function foco(x, ang, col) { g.save(); g.translate(x, -40); g.rotate(ang); var gr = g.createLinearGradient(0, 0, 0, 1500); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(-20, 0); g.lineTo(20, 0); g.lineTo(330, 1500); g.lineTo(-330, 1500); g.closePath(); g.fill(); g.restore(); }
      foco(140, -.42, 'rgba(169,139,255,.2)'); foco(940, .42, 'rgba(78,229,229,.14)');
      var sem = hash(l.t) * 2147483646 + 1; function rnd() { sem = (sem * 16807) % 2147483647; return sem / 2147483647; }
      for (var i = 0; i < 44; i++) {
        var x = 40 + rnd() * 1000, y = 90 + rnd() * 330, R = 9 + rnd() * 9;
        if (Math.abs(x - 540) < 120 && y > 220) continue;
        g.strokeStyle = 'rgba(248,247,251,.12)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, y - R); g.stroke();
        g.save(); g.translate(x, y); g.scale(.35 + rnd() * .65, 1); trazarEstrella(g, 0, 0, R, 0); g.fillStyle = 'rgba(248,247,251,' + (.5 + rnd() * .4).toFixed(2) + ')'; g.fill(); g.restore();
      }
      // La estrella de esta persona
      var sx = 540, sy = 335;
      g.strokeStyle = 'rgba(255,217,61,.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(sx, 0); g.lineTo(sx, sy - 56); g.stroke();
      var gl = g.createRadialGradient(sx, sy, 0, sx, sy, 210); gl.addColorStop(0, 'rgba(255,217,61,.5)'); gl.addColorStop(1, 'rgba(255,217,61,0)');
      g.fillStyle = gl; g.beginPath(); g.arc(sx, sy, 210, 0, 6.283); g.fill();
      trazarEstrella(g, sx, sy, 70, 0); g.fillStyle = '#FFE680'; g.fill();
      g.save(); trazarEstrella(g, sx, sy, 70, 0); g.clip(); g.fillStyle = 'rgba(224,168,0,.75)'; g.fillRect(sx, sy - 72, 72, 144); g.restore();
      // La luz que me guía es… «frase»
      // La luz que me guía es… «frase» · lugar — el grupo se centra entre la estrella y el logo
      g.textAlign = 'center';
      var tam = 100, lineas;
      do { g.font = 'italic 400 ' + tam + 'px Fraunces, Georgia, serif'; lineas = envolver(g, '“' + l.t + '”', 800); tam -= 4; } while ((lineas.length > 4 || lineas.length * tam * 1.12 > 330) && tam > 48);
      tam += 4;
      var altoFrase = (lineas.length - 1) * tam * 1.12 + tam * .78, grupo = 80 + altoFrase + 75, arriba = 450 + Math.max(0, (600 - grupo) / 2);
      g.fillStyle = '#CFCBE3'; g.font = 'italic 400 46px Fraunces, Georgia, serif'; g.fillText(t('miLuz'), 540, arriba + 34);
      var y0 = arriba + 80 + tam * .78; g.fillStyle = '#F8F7FB'; g.font = 'italic 400 ' + tam + 'px Fraunces, Georgia, serif';
      lineas.forEach(function (ln, i) { g.fillText(ln, 540, y0 + i * tam * 1.12); });
      g.fillStyle = '#FFD93D'; g.font = '500 40px "DM Sans", sans-serif';
      g.fillText([l.c, nombrePais(l.p)].filter(Boolean).join(', '), 540, y0 + (lineas.length - 1) * tam * 1.12 + 75);
      // El espectáculo: logo de cuatro líneas y qué es
      logo4(g, 540, 1112, 200, '#F8F7FB');
      g.fillStyle = '#CFCBE3'; g.font = '500 33px "DM Sans", sans-serif';
      g.fillText(t('tipo')[0], 540, 1340); g.fillText(t('tipo')[1], 540, 1382);
      // Mar y barquito
      function ola(y, amp, col, fase) { g.fillStyle = col; g.beginPath(); g.moveTo(0, Hc); for (var x = 0; x <= Wc; x += 20) g.lineTo(x, y + Math.sin(x / 90 + fase) * amp); g.lineTo(Wc, Hc); g.closePath(); g.fill(); }
      ola(1440, 12, '#17204A', 0);
      var bx = 935, by = 1468; g.save(); g.translate(bx, by); g.rotate(-.03); g.scale(.85, .85);
      g.fillStyle = '#FBFAFD'; g.beginPath(); g.moveTo(-48, -34); g.lineTo(0, -104); g.lineTo(0, -34); g.fill();
      g.fillStyle = '#E3DFEC'; g.beginPath(); g.moveTo(0, -104); g.lineTo(48, -34); g.lineTo(0, -34); g.fill();
      g.fillStyle = '#F6F4FA'; g.beginPath(); g.moveTo(-92, -34); g.lineTo(92, -34); g.lineTo(62, 0); g.lineTo(-62, 0); g.fill();
      var ob = g.createRadialGradient(-4, -66, 0, 0, -62, 44); ob.addColorStop(0, 'rgba(255,217,61,.85)'); ob.addColorStop(1, 'rgba(255,217,61,0)'); g.fillStyle = ob; g.beginPath(); g.arc(0, -62, 44, 0, 6.283); g.fill();
      g.restore();
      ola(1462, 16, '#142A55', 1.4); ola(1508, 10, '#0D2147', 2.6);
      // Dónde encontrarnos
      g.fillStyle = '#FFD93D'; g.font = '700 46px "DM Sans", sans-serif'; g.fillText('@lightswillguideyoushow', 540, 1592);
      g.fillStyle = '#A9A4C6'; g.font = '500 30px "DM Sans", sans-serif'; g.fillText(t('cta'), 540, 1645);
      return new Promise(function (ok) { c.toBlob(function (b) { tarjetaCompartir = b; ok(b); }, 'image/png'); });
    });
  }
  // Logo de cuatro líneas (sale del símbolo #logo de la página)
  function logo4(g, cx, arriba, ancho, color) {
    var sy = document.getElementById('logo'); if (!sy || !window.Path2D) return;
    var vb = sy.getAttribute('viewBox').split(/[\s,]+/).map(Number), k = ancho / vb[2];
    g.save(); g.translate(cx - ancho / 2, arriba); g.scale(k, k); g.translate(-vb[0], -vb[1]); g.fillStyle = color;
    sy.querySelectorAll('path').forEach(function (p) { g.fill(new Path2D(p.getAttribute('d'))); });
    g.restore();
  }
  // Nombre del show con las letras del logo (sale del símbolo #palabra de la página)
  function palabra(g, cx, arriba, ancho, color) {
    var sy = document.getElementById('palabra'); if (!sy || !window.Path2D) return;
    var vb = sy.getAttribute('viewBox').split(/[\s,]+/).map(Number), k = ancho / vb[2];
    g.save(); g.translate(cx - ancho / 2, arriba); g.scale(k, k); g.translate(-vb[0], -vb[1]);
    g.fillStyle = color; g.fill(new Path2D(sy.querySelector('path').getAttribute('d'))); g.restore();
  }
  function descargar(b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'my-light-lights-will-guide-you.png'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }
  function enlaceSticker() { return lang === 'es' ? 'https://www.lightswillguideyou.com/tuluz/' : CFG.URL; }

  /* Miniatura de la tarjeta + versión grande (para guardarla manteniendo el dedo encima) */
  var dataTarjeta = '';
  function ponerMini(b) {
    if (!b || !window.FileReader) return;
    var r = new FileReader();
    r.onload = function () { dataTarjeta = r.result; var m = $('#miniImg'); m.src = dataTarjeta; m.alt = t('verImagen'); $('#mini').hidden = false; if (!$('#visor').hidden) $('#visorImg').src = dataTarjeta; };
    r.readAsDataURL(b);
  }
  var visor = $('#visor'), focoPrevio = null;
  function abrirVisor(fallo) {
    contar(fallo ? 'no-se-abrio-navegador' : 'ver-imagen');
    $('#visorT').innerHTML = dos('visorT');
    $('#visorS').innerHTML = (fallo ? dos('noSeAbrio', NAV) + ' ' : '') + dos(IOS ? 'visorIOS' : ANDROID ? 'visorAndroid' : 'visorOtro') + ' ' + dos('visorDespues');
    var vc = $('#visorCompartir'), vf = $('#visorFuera'), vd = $('#visorDescargar');
    vf.hidden = !APP; if (APP) { vf.innerHTML = dos('abrirFuera', NAV); vf.href = urlFuera(); }
    vc.hidden = !!APP || !(navigator.canShare && window.File && navigator.canShare({ files: [new File([new Blob(['x'], { type: 'image/png' })], 'x.png', { type: 'image/png' })] }));
    vd.hidden = !!APP || IOS || ANDROID;
    $('#visorImg').src = dataTarjeta || ''; $('#visorImg').alt = t('visorT') + (ultimaPropia ? ': ' + ultimaPropia.t : '');
    if (!dataTarjeta) crearImagen().then(ponerMini, function () {});
    focoPrevio = document.activeElement; visor.hidden = false; document.body.classList.add('con-visor');
    $('#visorCerrar').focus();
  }
  function cerrarVisor() { visor.hidden = true; document.body.classList.remove('con-visor'); if (focoPrevio && focoPrevio.focus) focoPrevio.focus(); }
  $('#visorCerrar').addEventListener('click', cerrarVisor);
  visor.addEventListener('click', function (e) { if (e.target === visor) cerrarVisor(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !visor.hidden) cerrarVisor(); });
  $('#mini').addEventListener('click', function () { abrirVisor(false); });
  $('#visorCompartir').addEventListener('click', function () { compartirImagen(); });
  $('#visorDescargar').addEventListener('click', function () { contar('descargar-imagen'); crearImagen().then(descargar); });
  $('#visorFuera').addEventListener('click', function () { contar('abrir-fuera'); });

  /* Abrir esta página afuera (Safari o Chrome) con la estrella lista para compartir */
  function urlFuera() {
    var l = ultimaPropia || {};
    var destino = 'https://www.lightswillguideyou.com' + rutaIdioma(lang) + '?mia=' + encodeURIComponent(l.t || '') + '&p=' + encodeURIComponent(l.p || '') + (l.c ? '&c=' + encodeURIComponent(l.c) : '') + '&ts=' + Date.now().toString(36);
    if (ANDROID) return 'intent://' + destino.replace(/^https?:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(destino) + ';end';
    if (APP === 'ig') return 'instagram://extbrowser/?url=' + encodeURIComponent(destino);
    if (APP === 'threads') return 'barcelona://extbrowser/?url=' + encodeURIComponent(destino);
    return 'x-safari-' + destino;
  }
  function abrirFuera() {
    contar('abrir-fuera');
    var salio = false, marcar = function () { salio = true; };
    window.addEventListener('pagehide', marcar, { once: true });
    window.addEventListener('blur', marcar, { once: true });
    document.addEventListener('visibilitychange', function () { if (document.hidden) salio = true; }, { once: true });
    location.href = urlFuera();
    // Si a los 3 segundos seguimos aquí, el truco no funcionó: plan B, guardar la imagen aquí mismo
    setTimeout(function () { if (!salio && !document.hidden) abrirVisor(true); }, 3000);
  }

  /* Copiar el enlace sin preguntar (para pegarlo en el sticker «Enlace») */
  var brindis = $('#brindis'), tBrindis = 0;
  function avisar(txt) { brindis.textContent = txt; brindis.classList.add('is-on'); clearTimeout(tBrindis); tBrindis = setTimeout(function () { brindis.classList.remove('is-on'); }, 4200); }
  function marcarCopiado() { var b = $('#copiar'); b.innerHTML = dos('copiadoCorto'); b.classList.add('is-copiado'); }
  function copiarEnlace(silencio) {
    var u = enlaceSticker();
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(u).then(function () { marcarCopiado(); if (silencio) avisar(t('copiadoSticker')); else avisar(t('copiado')); return true; }, function () { if (!silencio) prompt('', u); return false; });
    if (!silencio) prompt('', u);
    return Promise.resolve(false);
  }

  function compartirImagen() {
    function enviarArchivo(b) {
      var f = window.File ? new File([b], 'my-light.png', { type: 'image/png' }) : null;
      if (f && navigator.canShare && navigator.canShare({ files: [f] })) {
        return navigator.share({ files: [f], text: t('compartirTxt') + ' ' + enlaceSticker() }).then(function () { contar('compartido'); }, function (e) { if (e && e.name === 'NotAllowedError') abrirVisor(false); });
      }
      if (IOS || ANDROID) abrirVisor(false); else descargar(b);
    }
    // Si la imagen ya está hecha, se comparte en el mismo toque (si no, Safari lo bloquea)
    if (tarjetaCompartir) enviarArchivo(tarjetaCompartir);
    else crearImagen().then(function (b) { ponerMini(b); enviarArchivo(b); });
  }
  $('#compartir').addEventListener('click', function () {
    if (APP) { abrirFuera(); return; }
    contar('compartir-historia');
    copiarEnlace(true);
    compartirImagen();
  });
  $('#descargar').addEventListener('click', function () {
    if (APP || IOS || ANDROID) { abrirVisor(false); return; }
    contar('descargar-imagen'); crearImagen().then(descargar);
  });
  $('#whatsapp').addEventListener('click', function () { contar('whatsapp'); });
  $('#seguir').addEventListener('click', function () { contar('seguir-instagram'); });
  $('#copiar').addEventListener('click', function () { contar('copiar-enlace'); copiarEnlace(false); });
  function actualizarWa() { var w = $('#whatsapp'); if (ultimaPropia) w.href = 'https://wa.me/?text=' + encodeURIComponent(t('wa')(ultimaPropia.t) + enlaceSticker()); }

  /* ---------- Idioma ----------
     Cada idioma tiene su propia dirección: español = /tuluz/, inglés = /yourlight/.
     Se cambia la dirección sin recargar y se quita ?lang= (los demás parámetros se quedan). */
  function rutaIdioma(l) { return l === 'es' ? '/tuluz/' : '/yourlight/'; }
  function limpiarDireccion(quitar) {
    try {
      var q = new URLSearchParams(location.search);
      ['lang'].concat(quitar || []).forEach(function (k) { q.delete(k); });
      var s = q.toString();
      history.replaceState(null, '', rutaIdioma(lang) + (s ? '?' + s : '') + location.hash);
    } catch (e) {}
  }
  function ponerIdioma(l) {
    lang = l; html.lang = l; html.setAttribute('data-lang', l);
    try { localStorage.setItem('lwgy-lang', l); } catch (e) {}
    document.querySelectorAll('[data-href-' + l + ']').forEach(function (a) { a.href = a.getAttribute('data-href-' + l); });
    llenarPaises(); ejemplo(); pintarListas(); if (!listo.hidden) pintarListo(); tarjetaCompartir = null;
    if (marcada) mostrar(null);
    limpiarDireccion();
  }
  $('#idioma').addEventListener('click', function () { ponerIdioma(lang === 'es' ? 'en' : 'es'); });

  /* ---------- Demo (?demo=1): estrellas inventadas solo en este navegador ---------- */
  function demo() {
    var frases = { es: ['mi mamá', 'mi abuela Rosa', 'la canción que me sacó adelante', 'mi hija Valentina', 'mi papá, que me enseñó a cantar', 'mis amigos de siempre', 'la música', 'mi hermano', 'mi perro Toby', 'Fix You en el peor año de mi vida', 'mi esposa', 'mi profe de danza', 'mis sueños', 'volver a empezar', 'el mar de mi pueblo', 'las ganas de seguir'],
      en: ['my mom', 'my grandma', 'the song that got me through', 'my little girl', 'my dad', 'my best friend', 'music', 'my brother', 'my dog', 'Fix You, every single time', 'my wife', 'my teacher', 'my dreams', 'starting over', 'the ocean'] };
    var pesos = { AR: 70, MX: 60, CO: 45, CL: 38, CR: 55, PE: 25, GT: 18, ES: 22, US: 30, BR: 15, GB: 14, DE: 6, FR: 5, IT: 5, JP: 4, AU: 4, CA: 7, EC: 8, UY: 9, VE: 7, PA: 6, SV: 5, HN: 4, NI: 3, BO: 3, PY: 3, DO: 4, PR: 3, PH: 3, IN: 3, KR: 2, NL: 2, PT: 3, ZA: 1, NZ: 1 };
    var ciudades = { AR: ['Buenos Aires', 'Córdoba', 'Rosario'], MX: ['CDMX', 'Guadalajara', 'Monterrey'], CR: ['San José', 'Heredia', 'Cartago'], CO: ['Bogotá', 'Medellín'], CL: ['Santiago'], US: ['New York', 'Los Angeles', 'Chicago'] };
    var n = 0;
    Object.keys(pesos).forEach(function (p) {
      for (var i = 0; i < pesos[p]; i++) {
        var es = ['US', 'GB', 'DE', 'FR', 'IT', 'JP', 'AU', 'CA', 'PH', 'IN', 'KR', 'NL', 'ZA', 'NZ'].indexOf(p) < 0;
        var lista = frases[es ? 'es' : 'en'];
        agregar({ unico: '#' + n, t: lista[(i * 7 + n) % lista.length], p: p, c: (ciudades[p] || [''])[i % (ciudades[p] || ['']).length], ts: Date.now() - Math.floor(hash('d' + (n++)) * 864e5) });
      }
    });
  }

  /* ---------- Arranque ---------- */
  limpiarDireccion();
  llenarPaises(); ejemplo(); validar();
  propiasGuardadas().forEach(function (o) { if (o && o.t) agregar({ t: o.t, p: o.p || 'ZZ', c: o.c || '', ts: o.ts || 0, propia: true }); });
  // Llegó desde el navegador de Instagram con su estrella (?mia=…): la mostramos lista para compartir.
  // No se vuelve a enviar a la hoja (ya se envió desde Instagram).
  var llegoDe = (function () {
    var q = new URLSearchParams(location.search), tx = (q.get('mia') || '').slice(0, 90);
    if (!tx) return '';
    var ts = parseInt(q.get('ts') || '', 36), p = (q.get('p') || '').toUpperCase(), c = (q.get('c') || '').slice(0, 40);
    limpiarDireccion(['mia', 'p', 'c', 'ts']);
    if (!ts || Math.abs(Date.now() - ts) > 6 * 36e5 || !aceptable(tx) || (c && !aceptable(c))) return '';
    if (!M.c[p]) p = 'ZZ';
    var ya = propiasGuardadas().some(function (o) { return o && o.t === tx && o.p === p; });
    var o = agregar({ t: tx, p: p, c: c, ts: ts, propia: true });
    if (!ya) guardarPropia(o);
    ultimaPropia = o; form.hidden = true; listo.hidden = false; $('#vuelta').hidden = false;
    pintarListo(); contar('llego-desde-app');
    return p;
  })();
  if (DEMO) { demo(); cargado = true; }
  /* ---------- El barquito: al tocarlo, la luz suelta chispas de colores ---------- */
  if (barcoDiv) {
    barcoDiv.setAttribute('role', 'button'); barcoDiv.tabIndex = 0;
    barcoDiv.setAttribute('aria-label', lang === 'es' ? 'Encender la luz del barquito' : 'Light up the little boat');
    var chispear = function () {
      contar('barquito');
      if (orbe.animate) orbe.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.45)', filter: 'brightness(1.4)' }, { transform: 'scale(1)' }], { duration: 900, easing: 'cubic-bezier(.22,1,.36,1)' });
      if (QUIETO) return;
      for (var i = 0; i < 26; i++) {
        var c = document.createElement('i'), a = -Math.PI / 2 + (Math.random() - .5) * 2.6, d = 50 + Math.random() * 120;
        c.className = 'chispa' + (i % 4 === 0 ? ' chispa--estrella' : '');
        c.style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + 'px');
        c.style.setProperty('--dy', (Math.sin(a) * d - 20).toFixed(1) + 'px');
        c.style.setProperty('--c', COLOR_LUZ[i % COLOR_LUZ.length]);
        c.style.setProperty('--t', (900 + Math.random() * 900).toFixed(0) + 'ms');
        c.style.setProperty('--s', (.5 + Math.random() * .9).toFixed(2));
        c.style.animationDelay = (Math.random() * 160).toFixed(0) + 'ms';
        barcoDiv.appendChild(c);
        setTimeout(function (el) { return function () { el.remove(); }; }(c), 2200);
      }
    };
    barcoDiv.addEventListener('click', chispear);
    barcoDiv.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chispear(); } });
  }
  /* ---------- Abajo: una multitud con pulseras de luz, como en un concierto ---------- */
  (function () {
    var m = $('#multitud'); if (!m) return;
    var semilla = 11; function rnd() { semilla = (semilla * 16807) % 2147483647; return semilla / 2147483647; }
    for (var i = 0; i < 140; i++) {
      var p = document.createElement('i'), y = rnd();
      p.style.left = (rnd() * 100).toFixed(2) + '%'; p.style.bottom = (y * 78).toFixed(1) + '%';
      p.style.setProperty('--c', COLOR_LUZ[(rnd() * COLOR_LUZ.length) | 0]);
      p.style.setProperty('--s', (1.4 - y * .7).toFixed(2));
      p.style.animationDelay = (-rnd() * 6).toFixed(2) + 's'; p.style.animationDuration = (2.4 + rnd() * 3).toFixed(2) + 's';
      m.appendChild(p);
    }
  })();

  (function () {
    var e = $('.escenario'); if (!e) return;
    if (!('IntersectionObserver' in window)) { e.classList.add('is-visto'); return; }
    var io = new IntersectionObserver(function (x) { if (x[0].isIntersecting) { e.classList.add('is-visto'); io.disconnect(); } }, { threshold: .25 }); io.observe(e);
  })();
  medir(); medirBarco(); flotar(0);
  pan = panMax ? Math.max(0, Math.min(panMax, proyectar(10, -80)[0] + mapa.base - W * .5)) : 0;
  var det = llegoDe || paisDetectado(); if (det) centrarEn(det, false);
  if (llegoDe) setTimeout(function () { listo.scrollIntoView({ behavior: 'auto', block: 'center' }); }, 300);
  pintarListas();
  if (!DEMO) cargar();
  setInterval(function () { if (!document.hidden && !DEMO) cargar(); }, 60000);
  var anchoPrev = W;
  window.addEventListener('resize', function () { if (cv.clientWidth !== anchoPrev || Math.abs(cv.clientHeight - H) > 120) { anchoPrev = cv.clientWidth; medir(); redibujar(); } medirBarco(); flotar(performance.now()); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { if (e[0].isIntersecting) despertar(); else if (!vuelo) vivo = false; }).observe(cv);
  } else despertar();
  if (!QUIETO) despertar(); else dibujar(performance.now());
})();
