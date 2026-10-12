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
      ejemplos: ['mi mamá', 'la canción que me sacó adelante', 'mi hija', 'mi abuelo, que ya no está', 'mi mejor amiga', 'la música', 'mi perro Toby'],
      faltaTexto: 'Escribí quién es tu luz.', faltaPais: 'Elegí desde qué país la colgás.',
      filtro: 'Probá con otras palabras. No publicamos enlaces, correos, teléfonos ni insultos.',
      espera: 'Esperá unos segundos antes de colgar otra estrella.',
      errorEnvio: 'No pudimos guardar tu luz. Revisá tu conexión y probá de nuevo.',
      listo: function (p) { return 'Tu estrella ya cuelga sobre ' + p + '.'; },
      tuLuz: 'Tu luz', miLuz: 'Mi luz es…', pregunta: '¿Quién es la luz que te guía?',
      wa: function (t) { return 'Mi luz es "' + t + '". Colgué mi estrella en el cielo de Lights Will Guide You. ¿Quién es la tuya? '; },
      compartirTxt: '¿Quién es la luz que te guía? Colgá tu estrella:'
    },
    en: {
      elegir: 'Choose your country', sinPais: 'somewhere in the world',
      contador: function (n, k) { return n === 1 ? 'One light is on. Yours is missing.' : n.toLocaleString('en') + ' lights hung from ' + k + (k === 1 ? ' country' : ' countries'); },
      vacio: 'No lights yet. Hang the first one.',
      rankVacio: 'Once the first lights are hung, you will see which country shines brightest here.',
      ultVacio: 'The first lights will appear here.',
      ejemplos: ['my mom', 'the song that got me through', 'my daughter', 'my grandpa, who is gone now', 'my best friend', 'music', 'my dog Toby'],
      faltaTexto: 'Write who your light is.', faltaPais: 'Choose the country you are hanging it from.',
      filtro: 'Try other words. We do not publish links, emails, phone numbers or insults.',
      espera: 'Wait a few seconds before hanging another star.',
      errorEnvio: 'We could not save your light. Check your connection and try again.',
      listo: function (p, c) { return 'Your star now hangs over ' + (CON_THE.indexOf(c) > -1 ? 'the ' : '') + p + '.'; },
      tuLuz: 'Your light', miLuz: 'My light is…', pregunta: 'Who is the light that guides you?',
      wa: function (t) { return 'My light is "' + t + '". I hung my star in the Lights Will Guide You sky. Who is yours? '; },
      compartirTxt: 'Who is the light that guides you? Hang your star:'
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

  /* ---------- Filtro básico (la moderación real es la columna Ocultar) ---------- */
  // Palabras completas (o comienzos de palabra con *). Así "computadora" o "conocer" no se bloquean.
  var MALAS = new RegExp('(^| )(' + ['puta', 'putas', 'puto', 'putos', 'mierda*', 'verga*', 'pija', 'cono', 'pendej*', 'hijueputa*', 'hijoeputa*', 'malparid*', 'culero*', 'fuck*', 'shit*', 'bitch*', 'cunt*', 'nigg*', 'fagg*', 'pussy', 'dick', 'porn*', 'sexo', 'sex', 'xxx']
    .map(function (w) { return w.slice(-1) === '*' ? w.slice(0, -1) + '[a-z]*' : w; }).join('|') + ')( |$)');
  function aceptable(s) {
    if (/https?:|www\.|\.com\b|\.net\b|@|\d[\d\s-]{6,}\d/i.test(s)) return false;
    return !MALAS.test(norm(s));
  }

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
    mapa.w = mw; mapa.h = mh; mapa.celda = mw / M.cols;
    mapa.y = Math.max(arriba, marTop - H * 0.02 - mh);
    var pad = 28;
    panMax = Math.max(0, mw + pad * 2 - W);
    mapa.base = panMax ? pad : (W - mw) / 2;
    pan = Math.min(pan, panMax);
    pintarCapas(); ubicarTodas();
  }

  function pintarCapas() {
    // Puntos de tierra
    capaMapa = document.createElement('canvas');
    capaMapa.width = Math.ceil(mapa.w * DPR); capaMapa.height = Math.ceil(mapa.h * DPR);
    var g = capaMapa.getContext('2d'); g.scale(DPR, DPR);
    var bits = atob(M.land), cel = mapa.celda, r = Math.max(.7, cel * .2);
    g.fillStyle = 'rgba(169,164,198,.20)';
    for (var i = 0, n = M.cols * M.rows; i < n; i++) {
      if (bits.charCodeAt(i >> 3) & (1 << (i & 7))) {
        var c = i % M.cols, f = (i / M.cols) | 0;
        g.beginPath(); g.arc((c + .5) * cel, (f + .5) * cel * (mapa.h / mapa.w) * A, r, 0, 6.283); g.fill();
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
    cx.drawImage(capaMapa, ox, oy, mapa.w, mapa.h);
    ultimaPos.length = 0;
    // Hilos
    cx.lineWidth = 1;
    cx.strokeStyle = 'rgba(248,247,251,.075)';
    cx.beginPath();
    var pos = [];
    for (var i = 0; i < luces.length; i++) {
      var l = luces[i], hx = ox + l.mx, L = oy + l.my;
      if (hx < -30 || hx > W + 30) { pos.push(null); continue; }
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
    dibujar(ts);
    if (vivo) requestAnimationFrame(bucle);
  }
  function despertar() { if (QUIETO && !vuelo) { dibujar(performance.now()); return; } if (!vivo) { vivo = true; requestAnimationFrame(bucle); } }
  function redibujar() { if (QUIETO || !vivo) dibujar(performance.now()); }

  /* ---------- Vuelo de la luz: del barquito a su lugar en el cielo ---------- */
  var vuelo = null, orbe = $('#orbe');
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
  cv.addEventListener('pointerdown', function (e) { arr = { x: e.clientX, y: e.clientY, pan: pan, mov: false, id: e.pointerId }; panObj = null; });
  cv.addEventListener('pointermove', function (e) {
    var r = cv.getBoundingClientRect();
    if (arr && arr.id === e.pointerId) {
      var dx = e.clientX - arr.x;
      if (!arr.mov && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(e.clientY - arr.y)) { arr.mov = true; cv.classList.add('is-arrastre'); try { cv.setPointerCapture(e.pointerId); } catch (er) {} if (pista) pista.classList.add('is-fuera'); mostrar(null); }
      if (arr.mov) { pan = Math.max(0, Math.min(panMax, arr.pan - dx)); redibujar(); }
      return;
    }
    if (e.pointerType === 'mouse') { var p = buscar(e.clientX - r.left, e.clientY - r.top, 14); cv.style.cursor = p ? 'pointer' : ''; if ((p && p[2]) !== marcada) mostrar(p); }
  });
  function soltar(e) {
    if (!arr) return;
    if (!arr.mov) { var r = cv.getBoundingClientRect(); mostrar(buscar(e.clientX - r.left, e.clientY - r.top, e.pointerType === 'mouse' ? 14 : 26)); }
    cv.classList.remove('is-arrastre'); arr = null;
  }
  cv.addEventListener('pointerup', soltar);
  cv.addEventListener('pointercancel', function () { cv.classList.remove('is-arrastre'); arr = null; });
  cv.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !arr) mostrar(null); });
  function centrarEn(p, suave) {
    if (!panMax || !p || !M.c[p]) return;
    var x = proyectar(M.c[p][0], M.c[p][1])[0] + mapa.base;
    var obj = Math.max(0, Math.min(panMax, x - W * .5));
    if (suave && !QUIETO) { panObj = obj; despertar(); } else { pan = obj; redibujar(); }
  }

  /* ---------- Listas, contador, ranking ---------- */
  var contador = $('#contador'), ranking = $('#ranking'), ultimas = $('#ultimas');
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
    });
    ultimas.innerHTML = '';
    var ult = luces.slice().sort(function (a, b) { return b.ts - a.ts; }).slice(0, 12);
    if (!ult.length) { var u = document.createElement('li'); u.textContent = t('ultVacio'); u.style.color = 'var(--bruma)'; ultimas.appendChild(u); }
    ult.forEach(function (l) {
      var li = document.createElement('li'); if (l.propia) li.className = 'propia';
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
  luz.addEventListener('input', function () { var n = luz.value.length; cuenta.textContent = n > 60 ? n + '/90' : ''; aviso.textContent = ''; validar(); });
  luz.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!enviar.disabled) form.requestSubmit ? form.requestSubmit() : enviar.click(); } });
  var ej = 0;
  function ejemplo() { luz.placeholder = t('ejemplos')[ej % t('ejemplos').length]; }
  setInterval(function () { if (document.activeElement !== luz && !luz.value && !QUIETO) { ej++; ejemplo(); } }, 2800);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var tx = luz.value.replace(/\s+/g, ' ').trim().replace(/^(mi\s+luz\s+es|my\s+light\s+is)\s*[:,.…-]*\s*/i, '').slice(0, 90);
    var p = sel.value, c = ciudad.value.replace(/\s+/g, ' ').trim().slice(0, 40);
    if (!tx) { aviso.textContent = t('faltaTexto'); luz.focus(); return; }
    if (!p) { aviso.textContent = t('faltaPais'); sel.focus(); return; }
    if (!aceptable(tx) || (c && !aceptable(c))) { aviso.textContent = t('filtro'); return; }
    var ult = 0; try { ult = +localStorage.getItem(CLAVE + '-t') || 0; } catch (er) {}
    if (Date.now() - ult < 30000) { aviso.textContent = t('espera'); return; }
    enviar.disabled = true; aviso.textContent = '';
    var d = new URLSearchParams();
    d.append(CFG.ENTRY.luz, tx); d.append(CFG.ENTRY.pais, p); if (c) d.append(CFG.ENTRY.ciudad, c); d.append(CFG.ENTRY.idioma, lang);
    var envio = DEMO || !CFG.FORM_ID ? Promise.resolve() :
      fetch('https://docs.google.com/forms/d/e/' + CFG.FORM_ID + '/formResponse', { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: d.toString() });
    envio.then(function () {
      try { localStorage.setItem(CLAVE + '-t', String(Date.now())); } catch (er) {}
      var o = agregar({ t: tx, p: p, c: c, ts: Date.now(), propia: true });
      guardarPropia(o); ultimaPropia = o;
      ubicarTodas(); pintarListas();
      centrarEn(p, true);
      if (window.innerWidth < 960) document.getElementById('lienzo').scrollIntoView({ behavior: QUIETO ? 'auto' : 'smooth', block: 'start' });
      setTimeout(function () { lanzar(o); }, window.innerWidth < 960 ? 650 : 50);
      if (navigator.vibrate) navigator.vibrate(30);
      form.reset(); llenarPaises(); sel.value = p; validar(); cuenta.textContent = '';
      form.hidden = true; listo.hidden = false; pintarListo();
      tarjetaCompartir = null;
    }).catch(function () { enviar.disabled = false; aviso.textContent = t('errorEnvio'); });
  });
  function pintarListo() { if (ultimaPropia) $('#listoTexto').textContent = t('listo')(nombrePais(ultimaPropia.p), ultimaPropia.p); actualizarWa(); }
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
    var fuentes = document.fonts ? Promise.all([document.fonts.load('italic 400 80px Fraunces'), document.fonts.load('400 60px Fraunces'), document.fonts.load('500 40px "DM Sans"')]).catch(function () {}) : Promise.resolve();
    return fuentes.then(function () {
      var Wc = 1080, Hc = 1920, c = document.createElement('canvas'); c.width = Wc; c.height = Hc;
      var g = c.getContext('2d');
      var bg = g.createLinearGradient(0, 0, 0, Hc); bg.addColorStop(0, '#1E1846'); bg.addColorStop(.55, '#100D26'); bg.addColorStop(1, '#0A1838');
      g.fillStyle = bg; g.fillRect(0, 0, Wc, Hc);
      function foco(x, ang, col) { g.save(); g.translate(x, -40); g.rotate(ang); var gr = g.createLinearGradient(0, 0, 0, 1500); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(-20, 0); g.lineTo(20, 0); g.lineTo(330, 1500); g.lineTo(-330, 1500); g.closePath(); g.fill(); g.restore(); }
      foco(140, -.42, 'rgba(169,139,255,.22)'); foco(940, .42, 'rgba(78,229,229,.16)');
      var sem = hash(l.t) * 2147483646 + 1; function rnd() { sem = (sem * 16807) % 2147483647; return sem / 2147483647; }
      for (var i = 0; i < 46; i++) {
        var x = 40 + rnd() * 1000, y = 120 + rnd() * 520, R = 10 + rnd() * 9;
        g.strokeStyle = 'rgba(248,247,251,.12)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, y - R); g.stroke();
        g.save(); g.translate(x, y); g.scale(.35 + rnd() * .65, 1); trazarEstrella(g, 0, 0, R, 0); g.fillStyle = 'rgba(248,247,251,' + (.55 + rnd() * .4).toFixed(2) + ')'; g.fill(); g.restore();
      }
      var sx = 540, sy = 560;
      g.strokeStyle = 'rgba(255,217,61,.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(sx, 0); g.lineTo(sx, sy - 60); g.stroke();
      var gl = g.createRadialGradient(sx, sy, 0, sx, sy, 230); gl.addColorStop(0, 'rgba(255,217,61,.55)'); gl.addColorStop(1, 'rgba(255,217,61,0)');
      g.fillStyle = gl; g.beginPath(); g.arc(sx, sy, 230, 0, 6.283); g.fill();
      trazarEstrella(g, sx, sy, 78, 0); g.fillStyle = '#FFE680'; g.fill();
      g.save(); trazarEstrella(g, sx, sy, 78, 0); g.clip(); g.fillStyle = 'rgba(224,168,0,.75)'; g.fillRect(sx, sy - 80, 80, 160); g.restore();
      g.textAlign = 'center'; g.fillStyle = '#A9A4C6'; g.font = '500 44px "DM Sans", sans-serif';
      g.fillText(t('miLuz'), 540, 800);
      var tam = 104, lineas; g.fillStyle = '#F8F7FB';
      do { g.font = 'italic 400 ' + tam + 'px Fraunces, Georgia, serif'; lineas = envolver(g, '“' + l.t + '”', 900); tam -= 6; } while ((lineas.length > 4 || lineas.length * tam * 1.15 > 520) && tam > 52);
      tam += 6; var y0 = 900 + tam * .8;
      lineas.forEach(function (ln, i) { g.fillText(ln, 540, y0 + i * tam * 1.15); });
      g.fillStyle = '#FFD93D'; g.font = '500 42px "DM Sans", sans-serif';
      g.fillText([l.c, nombrePais(l.p)].filter(Boolean).join(', '), 540, y0 + lineas.length * tam * 1.15 + 40);
      // mar
      function ola(y, amp, col, fase) { g.fillStyle = col; g.beginPath(); g.moveTo(0, Hc); for (var x = 0; x <= Wc; x += 20) g.lineTo(x, y + Math.sin(x / 90 + fase) * amp); g.lineTo(Wc, Hc); g.closePath(); g.fill(); }
      ola(1560, 14, '#17204A', 0);
      var bx = 300, by = 1588; g.save(); g.translate(bx, by); g.rotate(-.04); g.scale(1.1, 1.1);
      g.fillStyle = '#FBFAFD'; g.beginPath(); g.moveTo(52 - 100, 78 - 112); g.lineTo(0, 8 - 112); g.lineTo(0, 78 - 112); g.fill();
      g.fillStyle = '#E3DFEC'; g.beginPath(); g.moveTo(0, 8 - 112); g.lineTo(48, 78 - 112); g.lineTo(0, 78 - 112); g.fill();
      g.fillStyle = '#F6F4FA'; g.beginPath(); g.moveTo(-92, 78 - 112); g.lineTo(92, 78 - 112); g.lineTo(62, 0); g.lineTo(-62, 0); g.fill();
      var ob = g.createRadialGradient(-4, -78, 0, 0, -74, 40); ob.addColorStop(0, 'rgba(255,217,61,.8)'); ob.addColorStop(1, 'rgba(255,217,61,0)'); g.fillStyle = ob; g.beginPath(); g.arc(0, -74, 40, 0, 6.283); g.fill();
      g.restore();
      ola(1590, 18, '#142A55', 1.4); ola(1640, 12, '#0D2147', 2.6);
      g.fillStyle = '#F8F7FB'; g.font = '400 52px Fraunces, Georgia, serif'; g.fillText(t('pregunta'), 540, 1755);
      g.fillStyle = '#A9A4C6'; g.font = '500 38px "DM Sans", sans-serif'; g.fillText('lightswillguideyou.com/yourlight', 540, 1830);
      return new Promise(function (ok) { c.toBlob(function (b) { tarjetaCompartir = b; ok(b); }, 'image/png'); });
    });
  }
  function descargar(b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'my-light-lights-will-guide-you.png'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }
  $('#compartir').addEventListener('click', function () {
    crearImagen().then(function (b) {
      var f = new File([b], 'my-light.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [f] })) return navigator.share({ files: [f], text: t('compartirTxt') + ' ' + CFG.URL }).catch(function () {});
      descargar(b);
    });
  });
  $('#descargar').addEventListener('click', function () { crearImagen().then(descargar); });
  function actualizarWa() { var w = $('#whatsapp'); if (ultimaPropia) w.href = 'https://wa.me/?text=' + encodeURIComponent(t('wa')(ultimaPropia.t) + CFG.URL + (lang === 'es' ? '?lang=es' : '')); }

  /* ---------- Idioma ---------- */
  function ponerIdioma(l) {
    lang = l; html.lang = l; html.setAttribute('data-lang', l);
    try { localStorage.setItem('lwgy-lang', l); } catch (e) {}
    document.querySelectorAll('[data-href-' + l + ']').forEach(function (a) { a.href = a.getAttribute('data-href-' + l); });
    llenarPaises(); ejemplo(); pintarListas(); if (!listo.hidden) pintarListo(); tarjetaCompartir = null;
    if (marcada) mostrar(null);
  }
  $('#idioma').addEventListener('click', function () { ponerIdioma(lang === 'es' ? 'en' : 'es'); });

  /* ---------- Demo (?demo=1): estrellas inventadas solo en este navegador ---------- */
  function demo() {
    var frases = { es: ['mi mamá', 'mi abuela Rosa', 'la canción que me sacó adelante', 'mi hija Valentina', 'mi papá, que me enseñó a cantar', 'mis amigos de siempre', 'la música', 'mi hermano', 'mi perro Toby', 'Fix You en el peor año de mi vida', 'mi esposa', 'mi profe de danza'],
      en: ['my mom', 'my grandma', 'the song that got me through', 'my little girl', 'my dad', 'my best friend', 'music', 'my brother', 'my dog', 'Fix You, every single time', 'my wife', 'my teacher'] };
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
  llenarPaises(); ejemplo(); validar();
  propiasGuardadas().forEach(function (o) { if (o && o.t) agregar({ t: o.t, p: o.p || 'ZZ', c: o.c || '', ts: o.ts || 0, propia: true }); });
  if (DEMO) { demo(); cargado = true; }
  medir();
  pan = panMax ? Math.max(0, Math.min(panMax, proyectar(10, -80)[0] + mapa.base - W * .5)) : 0;
  var det = paisDetectado(); if (det) centrarEn(det, false);
  pintarListas();
  if (!DEMO) cargar();
  setInterval(function () { if (!document.hidden && !DEMO) cargar(); }, 60000);
  var anchoPrev = W;
  window.addEventListener('resize', function () { if (cv.clientWidth !== anchoPrev || Math.abs(cv.clientHeight - H) > 120) { anchoPrev = cv.clientWidth; medir(); redibujar(); } });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { if (e[0].isIntersecting) despertar(); else if (!vuelo) vivo = false; }).observe(cv);
  } else despertar();
  if (!QUIETO) despertar(); else dibujar(performance.now());
})();
