/* ==========================================================================
   LIGHTS WILL GUIDE YOU — main.js v2
   Vanilla JS, sin dependencias. Encapsulado para no tocar nada de WordPress.
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var html = document.documentElement;
  var CFG = window.LWGY_CONFIG || {};
  var QUIETO = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MOVIL = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var ESFERAS = ['#FFD93D', '#4EE5E5', '#FF3D7F', '#C7FF3D', '#FF8A3D', '#A98BFF'];
  var lang = 'es';
  var TEASER = '2vuC5Xzz3o4'; // video del teaser en YouTube

  /* -------------------------------------------------------------
     Textos dinámicos (lo que no vive en el HTML)
     ------------------------------------------------------------- */
  var T = {
    es: {
      luzOn: 'Encendé la luz', luzOff: 'Apagar la luz',
      enviar: 'Encender mi luz', enviando: 'Encendiendo…',
      errorEnvio: 'No se pudo enviar. Revisá tu conexión e intentá de nuevo.',
      masOpciones: 'Más opciones', copiar: 'Copiar enlace', copiado: 'Enlace copiado',
      luces: function (n) { return '<b>' + n.toLocaleString('es-CR') + '</b>' + (n === 1 ? 'luz encendida' : 'luces encendidas'); },
      primera: 'Todavía no hay luces. Encendé la primera.',
      tuLuz: 'Tu luz', delShow: 'Del espectáculo',
      semillas: ['El asombro', 'La imaginación', 'El amor', 'La esperanza', 'La resiliencia', 'La magia de lo cotidiano', 'El propósito', 'La música en vivo'],
      langLabel: 'Read in English',
      ejemplos: ['mi mamá', 'mi hija Sofía', 'mi abuelo, que me enseñó a cantar', 'la música', 'mi mejor amiga', 'mis hijos', 'mi perro Toby', 'mi papá, que ya no está'],
      compartirTexto: 'Te comparto Lights Will Guide You, el espectáculo de teatro, danza y música en vivo inspirado en Coldplay que busca aliados para su próxima temporada:',
      wa: 'Hola, vi el sitio de Lights Will Guide You y me gustaría conversar sobre la próxima temporada.',
      form: {
        nombre: 'Nombre', empresa: 'Empresa',
        falta: 'Escribí tu nombre para que sepamos quién nos escribe.',
        listoWa: 'Listo: se abrió WhatsApp con tu mensaje. Solo falta tocar Enviar.',
        listoMail: 'Listo: se abrió tu correo con el mensaje. Solo falta tocar Enviar.',
        hola: function (n) { return 'Hola, soy ' + n; },
        vi: 'Vi el sitio de Lights Will Guide You y me interesa',
        patrocinio: { t: 'Patrocinar la temporada', i: 'patrocinar la próxima temporada.', ph: 'Por ejemplo: qué tipo de presencia busca tu marca' },
        privada: { t: 'Una función privada', i: 'cotizar una función privada.', ph: 'Por ejemplo: fecha tentativa y cantidad de personas' },
        licencia: { t: 'Licencia y coproducción', i: 'recibir el dossier para licencia o coproducción.', ph: 'Por ejemplo: teatro o festival, ciudad y fechas' },
        general: { t: 'Escribinos', i: 'conversar con ustedes.', ph: 'Lo que quieras contarnos' }
      },
      mail: {
        patrocinio: { to: 'josepablo@persona.cr', cc: 'melania@andamiocr.com', s: 'Patrocinio para Lights Will Guide You',
          b: 'Hola, José Pablo y Melania:\n\nMe interesa conversar sobre patrocinar la próxima temporada de Lights Will Guide You.\n\nNombre:\nEmpresa o marca:\nTeléfono:\n\nGracias.' },
        privada: { to: 'melania@andamiocr.com', cc: 'josepablo@persona.cr', s: 'Función privada de Lights Will Guide You',
          b: 'Hola, Melania y José Pablo:\n\nNos interesa una función privada de Lights Will Guide You.\n\nEmpresa:\nFecha tentativa:\nCantidad aproximada de personas:\nTeléfono:\n\nGracias.' },
        licencia: { to: 'melania@andamiocr.com', cc: 'josepablo@persona.cr', s: 'Licencia o coproducción de Lights Will Guide You',
          b: 'Hola, Melania y José Pablo:\n\nRepresento a (teatro, festival o productora) y quisiera recibir el dossier de Lights Will Guide You.\n\nCiudad y país:\nFechas tentativas:\n\nGracias.' },
        general: { s: 'Lights Will Guide You', b: 'Hola:\n\n' }
      }
    },
    en: {
      luzOn: 'Turn on the light', luzOff: 'Turn off the light',
      enviar: 'Light my star', enviando: 'Lighting…',
      errorEnvio: "It couldn't be sent. Check your connection and try again.",
      masOpciones: 'More options', copiar: 'Copy link', copiado: 'Link copied',
      luces: function (n) { return '<b>' + n.toLocaleString('en-US') + '</b>' + (n === 1 ? 'light on' : 'lights on'); },
      primera: 'No lights yet. Light the first one.',
      tuLuz: 'Your light', delShow: 'From the show',
      semillas: ['Wonder', 'Imagination', 'Love', 'Hope', 'Resilience', 'Everyday magic', 'Purpose', 'Live music'],
      langLabel: 'Leer en español',
      ejemplos: ['my mom', 'my daughter Sofía', 'my grandpa, who taught me to sing', 'music', 'my best friend', 'my kids', 'my dog Toby', 'my dad, who is no longer here'],
      compartirTexto: "Sharing Lights Will Guide You with you: a theatre, dance and live music show inspired by Coldplay, looking for partners for its next season:",
      wa: "Hi, I saw the Lights Will Guide You website and I'd like to talk about the next season.",
      form: {
        nombre: 'Name', empresa: 'Company',
        falta: 'Please write your name so we know who is writing.',
        listoWa: 'Done: WhatsApp opened with your message. Just tap Send.',
        listoMail: 'Done: your email opened with the message. Just tap Send.',
        hola: function (n) { return "Hi, I'm " + n; },
        vi: "I saw the Lights Will Guide You website and I'd like to",
        patrocinio: { t: 'Sponsor the season', i: 'talk about sponsoring the next season.', ph: 'For example: what kind of presence your brand is looking for' },
        privada: { t: 'A private performance', i: 'get a quote for a private performance.', ph: 'For example: tentative date and audience size' },
        licencia: { t: 'Licensing and co-production', i: 'receive the dossier for licensing or co-production.', ph: 'For example: venue or festival, city and dates' },
        general: { t: 'Write to us', i: 'talk with you.', ph: 'Anything you want to tell us' }
      },
      mail: {
        patrocinio: { to: 'josepablo@persona.cr', cc: 'melania@andamiocr.com', s: 'Sponsorship for Lights Will Guide You',
          b: "Hi José Pablo and Melania,\n\nI'd like to talk about sponsoring the next season of Lights Will Guide You.\n\nName:\nCompany or brand:\nPhone:\n\nThank you." },
        privada: { to: 'melania@andamiocr.com', cc: 'josepablo@persona.cr', s: 'Private performance of Lights Will Guide You',
          b: "Hi Melania and José Pablo,\n\nWe're interested in a private performance of Lights Will Guide You.\n\nCompany:\nTentative date:\nApproximate audience size:\nPhone:\n\nThank you." },
        licencia: { to: 'melania@andamiocr.com', cc: 'josepablo@persona.cr', s: 'Licensing or co-production of Lights Will Guide You',
          b: "Hi Melania and José Pablo,\n\nI represent (venue, festival or producer) and would like to receive the Lights Will Guide You dossier.\n\nCity and country:\nTentative dates:\n\nThank you." },
        general: { s: 'Lights Will Guide You', b: 'Hi,\n\n' }
      }
    }
  };
  var t = function (k) { return T[lang][k]; };
  var alCambiarIdioma = [];

  /* -------------------------------------------------------------
     1. Idioma
     ------------------------------------------------------------- */
  function initIdioma() {
    var btn = $('#lwgyLang');
    var inicial = 'es';
    try {
      var q = new URLSearchParams(location.search).get('lang');
      var guardado = localStorage.getItem('lwgy-lang');
      if (q === 'en' || q === 'es') inicial = q; else if (guardado === 'en' || guardado === 'es') inicial = guardado;
    } catch (e) {}
    function poner(l) {
      lang = l;
      html.setAttribute('lang', l);
      html.setAttribute('data-lang', l);
      if (btn) {
        btn.innerHTML = l === 'es' ? '<b>ES</b><span>EN</span>' : '<span>ES</span><b>EN</b>';
        btn.setAttribute('aria-label', t('langLabel'));
      }
      $$('[data-i18n]').forEach(function (el) {
        var k = el.getAttribute('data-i18n');
        if (k === 'luzOn' && el.getAttribute('aria-pressed') === 'true') k = 'luzOff';
        if (k === 'masOpciones' && !navigator.share) k = 'copiar';
        if (T[l][k]) el.textContent = T[l][k];
      });
      try { localStorage.setItem('lwgy-lang', l); } catch (e) {}
      alCambiarIdioma.forEach(function (fn) { fn(); });
    }
    if (btn) btn.addEventListener('click', function () { poner(lang === 'es' ? 'en' : 'es'); });
    poner(inicial);
  }

  /* Todo correo va con copia a José Pablo, Melania y al correo oficial del show
     (menos a quien ya es el destinatario). */
  var COPIAS = ['josepablo@persona.cr', 'melania@andamiocr.com', 'info@lightswillguideyou.com'];
  function copias(to) { return COPIAS.filter(function (c) { return c !== to; }).join(','); }

  /* -------------------------------------------------------------
     2. Correos y WhatsApp con mensaje listo (según idioma)
     ------------------------------------------------------------- */
  function initEnlaces() {
    function mailto(m, toOverride) {
      var to = toOverride || m.to || 'josepablo@persona.cr';
      var q = ['cc=' + encodeURIComponent(copias(to))];
      q.push('subject=' + encodeURIComponent(m.s));
      q.push('body=' + encodeURIComponent(m.b));
      return 'mailto:' + to + '?' + q.join('&');
    }
    function pintar() {
      $$('[data-mail]').forEach(function (a) {
        var m = T[lang].mail[a.getAttribute('data-mail')];
        if (m) a.href = mailto(m, a.getAttribute('data-to'));
      });
      $$('[data-wa]').forEach(function (a) {
        a.href = 'https://wa.me/' + a.getAttribute('data-wa') + '?text=' + encodeURIComponent(t('wa'));
      });
    }
    alCambiarIdioma.push(pintar);
    pintar();
  }

  /* -------------------------------------------------------------
     3. Portada: altura estable, foto y chispas desde la esfera
     ------------------------------------------------------------- */
  function initPortada() {
    var fijar = function () { html.style.setProperty('--alto', window.innerHeight + 'px'); };
    fijar();
    var ancho = window.innerWidth;
    window.addEventListener('resize', function () { if (window.innerWidth !== ancho) { ancho = window.innerWidth; fijar(); } });

    var img = $('#lwgyHeroImg');
    if (!img) return;
    var lista = function () { img.classList.add('is-ready'); };
    if (img.complete && img.naturalWidth) lista(); else img.addEventListener('load', lista);

    var cv = $('#lwgySparks');
    if (!cv || QUIETO) return;
    var cx = cv.getContext('2d');
    var W, H, dpr, orbe = { x: 0, y: 0, r: 10 }, P = [], vivo = true, t0 = 0, inicio = performance.now();
    // La esfera está en x 50 %, y 70.5 % de la foto (en ambas versiones)
    var OX = 0.5, OY = 0.705, POSY = 0.6;

    function medir() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      var iw = img.naturalWidth || 1800, ih = img.naturalHeight || 1200;
      var s = Math.max(W / iw, H / ih), dw = iw * s, dh = ih * s;
      var ox = (W - dw) * 0.5, oy = (H - dh) * POSY;
      orbe.x = ox + OX * dw; orbe.y = oy + OY * dh; orbe.r = Math.max(6, 0.02 * dw);
    }
    function nueva() {
      var a = Math.random() * Math.PI * 2, d = Math.random() * orbe.r;
      return {
        x: Math.cos(a) * d, y: Math.sin(a) * d * 0.7,
        vx: (Math.random() - 0.5) * 30, vy: -(14 + Math.random() * 34),
        r: 0.8 + Math.random() * 1.8, c: ESFERAS[(Math.random() * ESFERAS.length) | 0],
        v: 0, d: 2.8 + Math.random() * 3.6
      };
    }
    medir();
    img.addEventListener('load', medir);
    window.addEventListener('resize', medir);
    for (var k = 0; k < 38; k++) { var p = nueva(); p.v = Math.random() * p.d; P.push(p); }

    function cuadro(ts) {
      if (!vivo) return;
      var dt = Math.min(0.05, (ts - (t0 || ts)) / 1000); t0 = ts;
      var entrada = Math.min(1, Math.max(0, (ts - inicio - 1100) / 1600));
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx.clearRect(0, 0, W, H);
      cx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < P.length; i++) {
        var q = P[i];
        q.v += dt;
        if (q.v > q.d) { P[i] = nueva(); continue; }
        var u = q.v / q.d;
        var x = orbe.x + q.x + q.vx * q.v, y = orbe.y + q.y + q.vy * q.v;
        var a = Math.sin(Math.PI * u) * entrada, R = q.r * 2.4;
        var g = cx.createRadialGradient(x, y, 0, x, y, R * 4);
        g.addColorStop(0, q.c); g.addColorStop(1, 'rgba(0,0,0,0)');
        cx.globalAlpha = a * 0.8; cx.fillStyle = g;
        cx.beginPath(); cx.arc(x, y, R * 4, 0, 6.283); cx.fill();
        cx.globalAlpha = a; cx.fillStyle = '#fff';
        cx.beginPath(); cx.arc(x, y, R * 0.45, 0, 6.283); cx.fill();
      }
      cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(cuadro);
    }
    new IntersectionObserver(function (e) {
      var antes = vivo; vivo = e[0].isIntersecting;
      if (vivo && !antes) { t0 = 0; requestAnimationFrame(cuadro); }
    }).observe(cv);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) vivo = false; else if (!vivo) { vivo = true; t0 = 0; requestAnimationFrame(cuadro); }
    });
    requestAnimationFrame(cuadro);
  }

  /* -------------------------------------------------------------
     4. Scroll: barra de progreso, nav, CTA fijo, líneas de sección
     ------------------------------------------------------------- */
  function initScroll() {
    var barra = $('#lwgyProgress'), nav = $('#lwgyNav'), cta = $('#lwgyBarra');
    var escribiendo = false, pendiente = false;
    function act() {
      pendiente = false;
      var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      if (barra) barra.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
      if (nav) nav.classList.toggle('is-scrolled', y > 40);
      if (cta) cta.classList.toggle('is-on', y > window.innerHeight * 0.6 && !escribiendo);
    }
    window.addEventListener('scroll', function () { if (!pendiente) { pendiente = true; requestAnimationFrame(act); } }, { passive: true });
    // Con el teclado del celular abierto, la barra fija estorba
    document.addEventListener('focusin', function (e) { if (e.target.matches('input, select, textarea')) { escribiendo = true; act(); } });
    document.addEventListener('focusout', function () { escribiendo = false; setTimeout(act, 50); });
    act();

    // Cabeceras que dibujan su línea y fotos que se revelan al entrar en pantalla
    var cabezas = $$('[data-head], [data-revela]');
    if (!('IntersectionObserver' in window) || QUIETO) { cabezas.forEach(function (c) { c.classList.add('is-in'); }); return; }
    html.classList.add('lwgy-revela');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    cabezas.forEach(function (c) { io.observe(c); });
  }

  /* -------------------------------------------------------------
     5. Encender la luz (interacción-firma de La historia)
     ------------------------------------------------------------- */
  function initLuz() {
    var magia = $('#lwgyMagia'), stage = $('#lwgyStage'), btn = $('#lwgyLuzBtn'), cita = $('#lwgyCita'), hilos = $('#lwgyHilos'), cv = $('#lwgyStageCv');
    if (!stage || !btn) return;
    // Estrellas de papel colgando de hilos, como en el escenario real
    var n = 11;
    for (var i = 0; i < n; i++) {
      var h = document.createElement('div');
      h.className = 'lwgy__hilo';
      h.style.left = (6 + (88 / (n - 1)) * i + (Math.random() - 0.5) * 6) + '%';
      h.style.height = (10 + Math.random() * 34) + '%';
      h.style.transitionDelay = (QUIETO ? 0 : 0.25 + Math.random() * 0.9).toFixed(2) + 's';
      h.innerHTML = '<svg viewBox="0 0 100 100" style="--d:' + (3 + Math.random() * 3).toFixed(1) + 's;width:' + (0.8 + Math.random() * 0.7).toFixed(2) + 'rem;height:auto"><use href="#lwgy-estrella"/></svg>';
      hilos.appendChild(h);
    }

    // Estrellas de papel que caen sobre el mar mientras la luz está encendida
    var cx = cv.getContext('2d'), W = 0, H = 0, dpr = 1, caen = [], corriendo = false, t0 = 0, encendida = false;
    function medir() { dpr = Math.min(2, window.devicePixelRatio || 1); W = stage.clientWidth; H = stage.clientHeight; cv.width = W * dpr; cv.height = H * dpr; }
    function estrella(x, y, r, a) {
      cx.save(); cx.translate(x, y); cx.rotate(a); cx.beginPath();
      for (var k = 0; k < 10; k++) { var rr = k % 2 ? r * .45 : r, an = -Math.PI / 2 + k * Math.PI / 5; cx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); }
      cx.closePath(); cx.fill(); cx.stroke(); cx.restore();
    }
    function cuadro(ts) {
      var dt = Math.min(.05, (ts - (t0 || ts)) / 1000); t0 = ts;
      if (encendida && caen.length < 26 && Math.random() < .22) caen.push({ x: Math.random() * W, y: -12, vy: 30 + Math.random() * 45, r: 3.5 + Math.random() * 4.5, a: Math.random() * 6, va: (Math.random() - .5) * 2.4, f: Math.random() * 6 });
      cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, W, H);
      cx.fillStyle = '#F4F2FA'; cx.strokeStyle = 'rgba(22,19,47,.3)'; cx.lineWidth = 1;
      var mar = H * .76;
      for (var j = caen.length - 1; j >= 0; j--) {
        var q = caen[j]; q.y += q.vy * dt; q.a += q.va * dt;
        if (q.y > mar) { caen.splice(j, 1); continue; }
        cx.globalAlpha = Math.min(1, (mar - q.y) / 30);
        estrella(q.x + Math.sin(ts / 1000 + q.f) * 6, q.y, q.r, q.a);
      }
      cx.globalAlpha = 1;
      if (encendida || caen.length) requestAnimationFrame(cuadro); else { corriendo = false; cx.clearRect(0, 0, W, H); }
    }
    function lluvia() { if (QUIETO || corriendo) return; corriendo = true; t0 = 0; medir(); requestAnimationFrame(cuadro); }
    window.addEventListener('resize', function () { if (corriendo) medir(); });

    var ocupado = false, timers = [];
    function luego(fn, ms) { timers.push(setTimeout(fn, QUIETO ? 0 : ms)); }
    function alternar() {
      if (ocupado) return;
      ocupado = true;
      timers.forEach(clearTimeout); timers = [];
      if (encendida) {
        encendida = false;
        stage.classList.remove('is-on', 'is-arco');
        if (magia) magia.classList.remove('is-on');
        btn.setAttribute('aria-pressed', 'false'); btn.textContent = t('luzOn');
        luego(function () { ocupado = false; }, 700);
        return;
      }
      encendida = true;
      if (navigator.vibrate) navigator.vibrate([20, 80, 20]);
      stage.classList.add('is-toc');
      luego(function () {
        stage.classList.remove('is-toc');
        stage.classList.add('is-on');
        btn.setAttribute('aria-pressed', 'true'); btn.textContent = t('luzOff');
        lluvia();
      }, 450);
      luego(function () {
        stage.classList.add('is-arco', 'is-burst');
        if (magia) magia.classList.add('is-on');
        if (navigator.vibrate) navigator.vibrate(30);
      }, 1400);
      luego(function () { stage.classList.remove('is-burst'); }, 3800);
      luego(function () { cita.classList.add('is-on'); ocupado = false; }, 2300);
    }
    btn.addEventListener('click', alternar);
    stage.addEventListener('click', alternar);
  }

  /* -------------------------------------------------------------
     6. Galería: arrastre, flechas, contador y vista ampliada
     ------------------------------------------------------------- */
  function initGaleria() {
    var strip = $('#lwgyStrip');
    if (!strip) return;
    var shots = $$('.lwgy__shot', strip), cont = $('#lwgyGalCount');
    var actual = 0;
    function pad() { return parseFloat(getComputedStyle(strip).paddingLeft) || 0; }
    function indice() {
      var x = strip.scrollLeft, mejor = 0, dist = Infinity, p = pad();
      shots.forEach(function (s, i) { var d = Math.abs(s.offsetLeft - p - x); if (d < dist) { dist = d; mejor = i; } });
      return mejor;
    }
    function contar() { actual = indice(); if (cont) cont.textContent = (actual + 1) + ' / ' + shots.length; }
    function ir(i) {
      i = Math.max(0, Math.min(shots.length - 1, i));
      strip.scrollTo({ left: shots[i].offsetLeft - pad(), behavior: QUIETO ? 'auto' : 'smooth' });
    }
    var tic = null;
    strip.addEventListener('scroll', function () { clearTimeout(tic); tic = setTimeout(contar, 60); }, { passive: true });
    $('#lwgyGalPrev').addEventListener('click', function () { ir(actual - 1); });
    $('#lwgyGalNext').addEventListener('click', function () { ir(actual + 1); });

    // Arrastrar con mouse en escritorio
    var arrastre = null, movido = false;
    strip.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      arrastre = { x: e.clientX, s: strip.scrollLeft }; movido = false;
    });
    window.addEventListener('pointermove', function (e) {
      if (!arrastre) return;
      var dx = e.clientX - arrastre.x;
      if (Math.abs(dx) > 5) { movido = true; strip.classList.add('is-drag'); }
      strip.scrollLeft = arrastre.s - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!arrastre) return;
      arrastre = null;
      if (movido) { strip.classList.remove('is-drag'); ir(indice()); }
    });

    // Vista ampliada
    var dlg = $('#lwgyFoto'), img = $('#lwgyFotoImg'), cap = $('#lwgyFotoCap'), abierta = 0;
    if (!dlg || typeof dlg.showModal !== 'function') return;
    function mostrar(i) {
      abierta = (i + shots.length) % shots.length;
      var b = $('button', shots[abierta]), im = $('img', shots[abierta]);
      img.src = b.getAttribute('data-full'); img.alt = im.alt;
      var fc = $('figcaption', shots[abierta]);
      var txt = fc ? ($('.lwgy-' + lang, fc) || fc).textContent : '';
      cap.textContent = (abierta + 1) + ' / ' + shots.length + '   ' + txt;
    }
    shots.forEach(function (s, i) {
      $('button', s).addEventListener('click', function (e) {
        if (movido) { e.preventDefault(); return; }
        mostrar(i); dlg.showModal();
      });
    });
    $('#lwgyFotoPrev').addEventListener('click', function () { mostrar(abierta - 1); });
    $('#lwgyFotoNext').addEventListener('click', function () { mostrar(abierta + 1); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') mostrar(abierta - 1);
      if (e.key === 'ArrowRight') mostrar(abierta + 1);
    });
    var tx = null;
    dlg.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 40) mostrar(abierta + (dx < 0 ? 1 : -1));
    });
    dlg.addEventListener('close', function () { ir(abierta); });
  }

  /* -------------------------------------------------------------
     7. Ventanas (cerrar con botón o tocando afuera) + teaser
     ------------------------------------------------------------- */
  function initVentanas() {
    $$('.lwgy__dialog').forEach(function (d) {
      d.addEventListener('click', function (e) { if (e.target === d || e.target.closest('[data-cerrar]')) d.close(); });
    });
    var dlg = $('#lwgyTeaser'), caja = $('#lwgyTeaserVideo'), btns = $$('#lwgyTeaserBtn, [data-teaser]');
    if (!dlg || !btns.length) return;
    btns.forEach(function (btn) { btn.addEventListener('click', function () {
      if (typeof dlg.showModal !== 'function') { window.open('https://youtu.be/' + TEASER, '_blank', 'noopener'); return; }
      caja.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + TEASER + '?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="Lights Will Guide You — Teaser" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
      dlg.showModal();
    }); });
    dlg.addEventListener('close', function () { caja.innerHTML = ''; });
  }

  /* -------------------------------------------------------------
     8. Videos de Vimeo: solo se cargan al tocar
     ------------------------------------------------------------- */
  function initFachadas() {
    $$('[data-vimeo]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-vimeo');
        var caja = document.createElement('div');
        caja.className = 'lwgy__video';
        caja.innerHTML = '<iframe src="https://player.vimeo.com/video/' + id + '?autoplay=1&title=0&byline=0&portrait=0&dnt=1" title="' + b.getAttribute('aria-label') + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
        b.replaceWith(caja);
      });
    });
  }

  /* -------------------------------------------------------------
     10. Compartir (WhatsApp directo + menú nativo o copiar)
     ------------------------------------------------------------- */
  function initCompartir() {
    var url = CFG.URL_SITIO || location.href.split('#')[0].split('?')[0];
    var wa = $('#lwgyShareWa'), toast = $('#lwgyToast');
    function msj() { return encodeURIComponent(t('compartirTexto') + '\n' + url); }
    function pintar() {
      if (!wa) return;
      if (MOVIL) { wa.href = 'whatsapp://send?text=' + msj(); wa.removeAttribute('target'); }
      else { wa.href = 'https://api.whatsapp.com/send?text=' + msj(); wa.target = '_blank'; }
    }
    if (wa) wa.addEventListener('click', function (e) {
      if (!MOVIL) return;
      e.preventDefault();
      window.location.href = 'whatsapp://send?text=' + msj();
      setTimeout(function () { if (!document.hidden) window.location.href = 'https://api.whatsapp.com/send?text=' + msj(); }, 1600);
    });
    alCambiarIdioma.push(pintar);
    pintar();

    function avisar() {
      if (!toast) return;
      toast.textContent = t('copiado'); toast.classList.add('is-on');
      setTimeout(function () { toast.classList.remove('is-on'); }, 2200);
    }
    function copiar() {
      var hecho = function () { avisar(); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(hecho, respaldo);
      else respaldo();
      function respaldo() {
        var ta = document.createElement('textarea'); ta.value = url; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        ta.remove(); hecho();
      }
    }
    $$('[data-compartir]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (navigator.share) navigator.share({ title: 'Lights Will Guide You', text: t('compartirTexto'), url: url }).catch(function () {});
        else copiar();
      });
    });
  }

  /* -------------------------------------------------------------
     11. El cielo de luces (participación del público)
     ------------------------------------------------------------- */
  function initCielo() {
    var caja = $('#lwgyFirmamento'), cv = $('#lwgyCielo'), tip = $('#lwgyTip');
    if (!caja || !cv) return;
    var cx = cv.getContext('2d');
    var W = 0, H = 0, dpr = 1, fondo = [], luces = [], propia = null, vivo = false, t0 = 0, marcada = null;
    var contador = $('#lwgyContador'), lista = $('#lwgyLucesLista');
    var input = $('#lwgyLuzInput'), pais = $('#lwgyPais'), enviar = $('#lwgyLuzEnviar'), cuenta = $('#lwgyCuenta');
    var aviso = $('#lwgyLuzAviso'), form = $('#lwgyLuzForm'), gracias = $('#lwgyLuzGracias');
    var CLAVE = 'lwgy_luz_v1';
    var cargadas = false, conHoja = !!CFG.SHEET_ID;

    function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
    function azar(seed) { return function () { seed = (seed + 0x6D2B79F5) | 0; var r = Math.imul(seed ^ (seed >>> 15), 1 | seed); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }

    function ubicar(l) {
      var rnd = azar(hash(l.t + '|' + (l.p || '')));
      var mejor = null;
      for (var k = 0; k < 10; k++) {
        var x = 0.05 + rnd() * 0.9, y = 0.08 + rnd() * 0.84, ok = true;
        for (var j = 0; j < luces.length; j++) {
          var o = luces[j]; if (o === l) continue;
          if (Math.hypot((o.x - x) * W, (o.y - y) * H) < 30) { ok = false; break; }
        }
        mejor = { x: x, y: y };
        if (ok) break;
      }
      l.x = mejor.x; l.y = mejor.y;
      l.c = ESFERAS[hash(l.t) % ESFERAS.length];
      l.fase = rnd() * 6.28; l.r = 2.6 + rnd() * 1.6;
    }
    function agregar(texto, p, esPropia, semilla) {
      var l = { t: texto, p: p || '', propia: !!esPropia, semilla: semilla != null ? semilla : -1, nace: esPropia ? performance.now() : 0 };
      luces.push(l); ubicar(l);
      if (esPropia) propia = l;
      if (l.semilla < 0) { var li = document.createElement('li'); li.textContent = texto + (p ? ' (' + p + ')' : ''); lista.appendChild(li); }
      return l;
    }
    // Las primeras luces las enciende el espectáculo (palabras de su mensaje),
    // así el cielo nunca está vacío. No se cuentan como respuestas del público.
    t('semillas').forEach(function (w, i) { agregar(w, '', false, i); });
    alCambiarIdioma.push(function () { luces.forEach(function (l) { if (l.semilla > -1) l.t = t('semillas')[l.semilla]; }); });
    function medir() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = caja.clientWidth; H = caja.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      fondo = [];
      var n = Math.round(W * H / 4200);
      var rnd = azar(7);
      for (var i = 0; i < n; i++) fondo.push({ x: rnd() * W, y: rnd() * H, r: rnd() * 1.1 + 0.25, a: rnd() * 0.55 + 0.2, f: rnd() * 6.28, v: rnd() * 0.8 + 0.3 });
      if (QUIETO) dibujar(performance.now());
    }
    function dibujar(ts) {
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx.clearRect(0, 0, W, H);
      var s = ts / 1000;
      for (var i = 0; i < fondo.length; i++) {
        var f = fondo[i];
        cx.globalAlpha = f.a * (0.65 + 0.35 * Math.sin(s * f.v + f.f));
        cx.fillStyle = '#F8F7FB'; cx.beginPath(); cx.arc(f.x, f.y, f.r, 0, 6.283); cx.fill();
      }
      cx.globalCompositeOperation = 'lighter';
      for (var j = 0; j < luces.length; j++) {
        var l = luces[j], x = l.x * W, y = l.y * H;
        var brillo = 0.75 + 0.25 * Math.sin(s * 1.3 + l.fase);
        var esc = 1;
        if (l.nace) { var u = Math.min(1, (ts - l.nace) / 1400); esc = 1 - Math.pow(1 - u, 3); if (u < 1) { cx.globalAlpha = (1 - u) * 0.8; cx.strokeStyle = l.c; cx.lineWidth = 1.5; cx.beginPath(); cx.arc(x, y, 8 + u * 60, 0, 6.283); cx.stroke(); } }
        var R = (l.propia ? l.r * 1.9 : l.r) * esc * (l === marcada ? 1.5 : 1);
        var g = cx.createRadialGradient(x, y, 0, x, y, R * 7);
        g.addColorStop(0, l.c); g.addColorStop(1, 'rgba(0,0,0,0)');
        cx.globalAlpha = 0.8 * brillo; cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, R * 7, 0, 6.283); cx.fill();
        cx.globalAlpha = brillo; cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(x, y, R * 0.85, 0, 6.283); cx.fill();
        if (l.propia && esc === 1) { cx.globalAlpha = 0.35 + 0.25 * Math.sin(s * 2); cx.strokeStyle = l.c; cx.lineWidth = 1; cx.beginPath(); cx.arc(x, y, 14 + 3 * Math.sin(s * 2), 0, 6.283); cx.stroke(); }
      }
      cx.globalCompositeOperation = 'source-over'; cx.globalAlpha = 1;
    }
    function bucle(ts) { if (!vivo) return; dibujar(ts); requestAnimationFrame(bucle); }
    function despertar() { if (QUIETO) { dibujar(performance.now()); return; } if (!vivo) { vivo = true; requestAnimationFrame(bucle); } }

    function pintarContador() {
      if (!contador) return;
      var n = luces.filter(function (l) { return l.semilla < 0; }).length;
      if (n > 0) contador.innerHTML = t('luces')(n);
      else contador.textContent = conHoja && cargadas ? t('primera') : '';
    }
    alCambiarIdioma.push(pintarContador);

    // Mostrar el texto de una luz al pasar o tocar
    function buscar(px, py, radio) {
      var mejor = null, d = radio;
      luces.forEach(function (l) { var dd = Math.hypot(l.x * W - px, l.y * H - py); if (dd < d) { d = dd; mejor = l; } });
      return mejor;
    }
    function mostrarTip(l) {
      marcada = l;
      if (!l) { tip.classList.remove('is-on'); if (QUIETO) dibujar(performance.now()); return; }
      tip.innerHTML = '';
      var b = document.createElement('span'); b.textContent = l.t; tip.appendChild(b);
      var meta = l.semilla > -1 ? t('delShow') : (l.propia ? t('tuLuz') + (l.p ? ', ' + l.p : '') : l.p);
      if (meta) { var sm = document.createElement('small'); sm.textContent = meta; tip.appendChild(sm); }
      var x = Math.min(Math.max(l.x * W, 90), W - 90);
      tip.style.left = x + 'px'; tip.style.top = (l.y * H) + 'px';
      tip.classList.add('is-on');
      if (QUIETO) dibujar(performance.now());
    }
    cv.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = cv.getBoundingClientRect();
      var l = buscar(e.clientX - r.left, e.clientY - r.top, 22);
      cv.style.cursor = l ? 'pointer' : 'default';
      if (l !== marcada) mostrarTip(l);
    });
    cv.addEventListener('pointerleave', function () { mostrarTip(null); });
    cv.addEventListener('click', function (e) {
      var r = cv.getBoundingClientRect();
      mostrarTip(buscar(e.clientX - r.left, e.clientY - r.top, 34));
    });

    // Cargar luces aprobadas desde Google Sheets (mismo método que STILL STANDING)
    function cargar() {
      if (!conHoja) { pintarContador(); return; }
      var u = 'https://docs.google.com/spreadsheets/d/' + CFG.SHEET_ID + '/gviz/tq?tqx=out:json&sheet=' + encodeURIComponent(CFG.SHEET_TAB || 'publicar') + '&_=' + Date.now();
      fetch(u).then(function (r) { return r.text(); }).then(function (txt) {
        var j = JSON.parse(txt.substring(txt.indexOf('{'), txt.lastIndexOf('}') + 1));
        var cols = (j.table.cols || []).map(function (c) { return String(c.label || '').toLowerCase(); });
        var iL = cols.findIndex(function (c) { return c.indexOf('luz') > -1 || c.indexOf('light') > -1; });
        var iP = cols.findIndex(function (c) { return c.indexOf('pa') === 0 || c.indexOf('country') > -1; });
        if (iL < 0) iL = 0; if (iP < 0) iP = 1;
        (j.table.rows || []).slice(-400).forEach(function (row) {
          var c = row.c || [];
          var texto = c[iL] && c[iL].v != null ? String(c[iL].v).trim() : '';
          var p = c[iP] && c[iP].v != null ? String(c[iP].v).trim() : '';
          if (!texto || (propia && texto === propia.t)) return;
          agregar(texto.slice(0, 80), p.slice(0, 30), false);
        });
        cargadas = true; pintarContador(); despertar();
      }).catch(function () { cargadas = true; pintarContador(); });
    }

    medir();
    luces.forEach(ubicar);
    // Formulario
    function mostrarGracias() { form.style.display = 'none'; gracias.style.display = 'block'; }
    try {
      var g = JSON.parse(localStorage.getItem(CLAVE) || 'null');
      if (g && g.t) { var l0 = agregar(g.t, g.p, true); l0.nace = 0; mostrarGracias(); }
    } catch (e) {}

    var ej = 0;
    setInterval(function () {
      if (!input || document.activeElement === input || input.value) return;
      input.classList.add('is-cambia');
      setTimeout(function () { var lista = t('ejemplos'); ej = (ej + 1) % lista.length; input.placeholder = lista[ej]; input.classList.remove('is-cambia'); }, 400);
    }, 2600);
    alCambiarIdioma.push(function () { if (input) input.placeholder = t('ejemplos')[0]; if (enviar && !enviar.disabled) enviar.textContent = t('enviar'); });

    if (input) {
      input.addEventListener('input', function () { var n = input.value.trim().length; enviar.disabled = !n; cuenta.textContent = n ? n + '/60' : ''; aviso.textContent = ''; });
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !enviar.disabled) enviar.click(); });
    }
    if (enviar) enviar.addEventListener('click', function () {
      var texto = input.value.trim().replace(/^(mi\s+luz\s+es|my\s+light\s+is)\s*[:,.…-]*\s*/i, '');
      if (!texto) return;
      var p = pais.value || '';
      enviar.disabled = true; enviar.textContent = t('enviando'); input.blur();
      function exito() {
        try { localStorage.setItem(CLAVE, JSON.stringify({ t: texto, p: p })); } catch (e) {}
        if (navigator.vibrate) navigator.vibrate(40);
        agregar(texto, p, true);
        pintarContador(); despertar();
        caja.scrollIntoView({ behavior: QUIETO ? 'auto' : 'smooth', block: 'center' });
        setTimeout(mostrarGracias, 600);
      }
      if (!CFG.FORM_ID || !CFG.ENTRY_LUZ) {
        if (window.console) console.info('[LWGY] Cielo de luces sin configurar: la luz se muestra solo en este navegador. Ver README.');
        setTimeout(exito, 500);
        return;
      }
      var d = new URLSearchParams();
      d.append(CFG.ENTRY_LUZ, texto);
      if (CFG.ENTRY_PAIS && p) d.append(CFG.ENTRY_PAIS, p);
      fetch('https://docs.google.com/forms/d/e/' + CFG.FORM_ID + '/formResponse', {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: d.toString()
      }).then(exito).catch(function () {
        enviar.disabled = false; enviar.textContent = t('enviar'); aviso.textContent = t('errorEnvio');
      });
    });

    var ancho = W;
    window.addEventListener('resize', function () { if (caja.clientWidth !== ancho) { ancho = caja.clientWidth; medir(); luces.forEach(ubicar); } });
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { despertar(); if (!cargadas && conHoja && !cargar.hecho) { cargar.hecho = true; cargar(); } }
      else vivo = false;
    }, { rootMargin: '200px 0px' }).observe(caja);
    if (!conHoja) pintarContador();
  }

  /* -------------------------------------------------------------
     13. El barquito cruza la página entre escenas
     Se mueve solo cuando la persona hace scroll, como un elemento
     escenográfico atravesando el escenario.
     ------------------------------------------------------------- */
  function initMares() {
    var mares = $$('[data-mar]');
    if (!mares.length) return;
    var visibles = [], pendiente = false;
    function mover() {
      pendiente = false;
      var vh = window.innerHeight;
      visibles.forEach(function (m) {
        var r = m.getBoundingClientRect(), b = m._barco, bw = b.offsetWidth, W = m.clientWidth;
        var t = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        var x;
        x = -bw * 1.1 + t * (W + bw * 1.2);
        b.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      });
    }
    function pedir() { if (!pendiente) { pendiente = true; requestAnimationFrame(mover); } }
    mares.forEach(function (m) {
      m._barco = $('.lwgy__mar-barco', m);
      if (QUIETO) {
        var bw = m._barco.offsetWidth;
        m._barco.style.transform = 'translate3d(' + (m.clientWidth * .62) + 'px,0,0)';
      }
    });
    if (QUIETO) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var i = visibles.indexOf(e.target);
        if (e.isIntersecting && i < 0) visibles.push(e.target);
        if (!e.isIntersecting && i > -1) visibles.splice(i, 1);
      });
      pedir();
    }, { rootMargin: '10% 0px' });
    mares.forEach(function (m) { io.observe(m); });
    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir);
  }

  /* -------------------------------------------------------------
     12. Año automático
     ------------------------------------------------------------- */
  function initAnio() { var y = new Date().getFullYear(); $$('[data-anio]').forEach(function (s) { s.textContent = y; }); }

  /* -------------------------------------------------------------
     14. Programa de mano: el menú en celular y tablet
     Baja como un telón; marca el acto en el que está la persona.
     ------------------------------------------------------------- */
  function initMenu() {
    var dlg = $('#lwgyMenu'), btn = $('#lwgyMenuBtn');
    if (!dlg || !btn) return;
    if (typeof dlg.showModal !== 'function') { btn.hidden = true; return; }
    var links = $$('.lwgy__actos a', dlg), saliendo = false;
    function marcar() {
      var actual = null;
      links.forEach(function (a) {
        var sec = $(a.getAttribute('href'));
        if (sec && sec.getBoundingClientRect().top < window.innerHeight * 0.4) actual = a;
      });
      links.forEach(function (a) { if (a === actual) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    }
    function cerrar() {
      if (!dlg.open || saliendo) return;
      html.classList.remove('lwgy-menu-abierto');
      if (QUIETO) { dlg.close(); return; }
      saliendo = true; dlg.classList.add('is-saliendo');
      setTimeout(function () { dlg.classList.remove('is-saliendo'); saliendo = false; dlg.close(); }, 420);
    }
    btn.addEventListener('click', function () {
      marcar(); dlg.showModal();
      btn.setAttribute('aria-expanded', 'true'); html.classList.add('lwgy-menu-abierto');
    });
    dlg.addEventListener('close', function () { btn.setAttribute('aria-expanded', 'false'); html.classList.remove('lwgy-menu-abierto'); });
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); cerrar(); });
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.closest('[data-cerrar]')) { cerrar(); return; }
      if (e.target.closest('.lwgy__actos a, .lwgy__programa-pie a')) cerrar();
    });
    // Si la pantalla crece hasta mostrar el menú de escritorio, se cierra solo
    var mq = window.matchMedia('(min-width: 960px)');
    var alCrecer = function () { if (mq.matches && dlg.open) { html.classList.remove('lwgy-menu-abierto'); dlg.close(); } };
    if (mq.addEventListener) mq.addEventListener('change', alCrecer); else mq.addListener(alCrecer);
  }

  /* -------------------------------------------------------------
     15. El teaser de fondo: sin sonido, atenuado y en bucle.
     Se carga cuando la franja se acerca y se pausa cuando sale de pantalla.
     Con "reducir movimiento" o "ahorro de datos" queda solo la foto.
     ------------------------------------------------------------- */
  function initTeaserFondo() {
    var caja = $('#lwgyTeaserFondo');
    if (!caja || QUIETO || !('IntersectionObserver' in window)) return;
    var ahorro = navigator.connection && navigator.connection.saveData;
    if (ahorro) return;
    var ifr = null;
    function orden(f) {
      if (ifr && ifr.contentWindow) ifr.contentWindow.postMessage(JSON.stringify({ event: 'command', func: f, args: [] }), '*');
    }
    function crear() {
      ifr = document.createElement('iframe');
      ifr.className = 'lwgy__teaser-video';
      ifr.title = 'Teaser de fondo';
      ifr.setAttribute('tabindex', '-1');
      ifr.setAttribute('allow', 'autoplay; encrypted-media');
      ifr.src = 'https://www.youtube-nocookie.com/embed/' + TEASER + '?autoplay=1&mute=1&loop=1&playlist=' + TEASER +
        '&controls=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3&fs=0&enablejsapi=1&origin=' + encodeURIComponent(location.origin);
      // Se muestra un momento después de cargar, para saltar la presentación de YouTube
      ifr.addEventListener('load', function () { setTimeout(function () { caja.classList.add('is-video'); }, 2800); });
      caja.appendChild(ifr);
    }
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { if (!ifr) crear(); else orden('playVideo'); }
      else orden('pauseVideo');
    }, { rootMargin: '250px 0px' }).observe(caja);
  }

  /* -------------------------------------------------------------
     16. Frases que se encienden palabra por palabra
     (como la letra en la pantalla de un concierto)
     ------------------------------------------------------------- */
  function initPalabras() {
    $$('[data-palabras]').forEach(function (frase) {
      $$('.lwgy-es, .lwgy-en', frase).forEach(function (cont) {
        var n = 0;
        Array.prototype.slice.call(cont.childNodes).forEach(function (nodo) {
          if (nodo.nodeType !== 3) return;
          var frag = document.createDocumentFragment();
          nodo.textContent.split(/(\s+)/).forEach(function (pedazo) {
            if (!pedazo) return;
            if (/^\s+$/.test(pedazo)) { frag.appendChild(document.createTextNode(pedazo)); return; }
            var w = document.createElement('span');
            w.className = 'lwgy__palabra'; w.style.setProperty('--n', n++); w.textContent = pedazo;
            frag.appendChild(w);
          });
          cont.replaceChild(frag, nodo);
        });
      });
      if (QUIETO || !('IntersectionObserver' in window)) { frase.classList.add('is-in'); return; }
      html.classList.add('lwgy-palabras');
      var io = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) { frase.classList.add('is-in'); io.disconnect(); }
      }, { rootMargin: '0px 0px -20% 0px' });
      io.observe(frase);
    });
  }

  /* -------------------------------------------------------------
     17. Actos: textos que se abren como un telón
     Sin JS todo queda visible; con JS se pliegan y se abren con el botón.
     ------------------------------------------------------------- */
  function initActos() {
    var actos = $$('[data-acto]');
    if (!actos.length) return;
    html.classList.add('lwgy-actos');
    actos.forEach(function (acto) {
      var btn = $('.lwgy__acto-btn', acto), cuerpo = $('.lwgy__acto-cuerpo', acto), dentro = $('.lwgy__acto-in', acto);
      if (!btn || !cuerpo) return;
      // Cada línea entra un poquito después de la anterior
      Array.prototype.slice.call(dentro.children).forEach(function (h, i) { h.style.setProperty('--n', i); });
      $$('li, .lwgy__pilar', dentro).forEach(function (h, i) { h.style.setProperty('--n', i); });
      cuerpo.inert = true;
      btn.addEventListener('click', function () {
        var abrir = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', abrir ? 'true' : 'false');
        acto.classList.toggle('is-open', abrir);
        cuerpo.inert = !abrir;
        if (abrir) {
          acto.classList.remove('is-foco'); void acto.offsetWidth; acto.classList.add('is-foco');
        } else {
          // Al cerrar, si el botón quedó arriba de la pantalla, se acompaña a la persona
          var r = acto.getBoundingClientRect();
          if (r.top < 0) window.scrollBy({ top: r.top - 120, behavior: QUIETO ? 'auto' : 'smooth' });
        }
      });
    });
  }

  /* -------------------------------------------------------------
     18. Contactar: mini formulario en vez de abrir el correo de una vez.
     La persona elige su interés, escribe su nombre y envía por WhatsApp
     o por correo; el mensaje sale armado y dirigido a quien corresponde.
     (Los correos visibles en Contacto siguen siendo enlaces normales.)
     ------------------------------------------------------------- */
  function initContactar() {
    var dlg = $('#lwgyContactar');
    if (!dlg || typeof dlg.showModal !== 'function') return; // sin ventana: los enlaces siguen abriendo el correo
    var form = $('form', dlg), titulo = $('#lwgyContactarT'), aviso = $('.lwgy__contactar-aviso', dlg);
    // A quién le llega cada tipo de mensaje por WhatsApp (el correo usa T.mail, con copia)
    var WA = '50688055245'; // WhatsApp: todo le llega a Melania
    function tipo() { var r = $('input[name="tipo"]:checked', form); return r ? r.value : 'general'; }
    function pintar() {
      var f = t('form')[tipo()];
      titulo.textContent = f.t; form.mensaje.placeholder = f.ph;
    }
    function texto() {
      var F = t('form'), n = form.nombre.value.trim(), e = form.empresa.value.trim(), m = form.mensaje.value.trim();
      var linea = F.hola(n) + (e ? ' (' + e + ')' : '') + '. ' + F.vi + ' ' + F[tipo()].i;
      return linea + (m ? '\n\n' + m : '');
    }
    function listo() {
      if (form.nombre.value.trim()) return true;
      aviso.textContent = t('form').falta; aviso.classList.add('is-error'); form.nombre.focus();
      return false;
    }
    $$('[data-mail]:not([data-to])').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var r = $('input[name="tipo"][value="' + a.getAttribute('data-mail') + '"]', form) || $('input[value="general"]', form);
        r.checked = true; aviso.textContent = ''; aviso.classList.remove('is-error'); pintar();
        dlg.showModal();
      });
    });
    $$('input[name="tipo"]', form).forEach(function (r) { r.addEventListener('change', pintar); });
    form.nombre.addEventListener('input', function () { if (aviso.classList.contains('is-error')) { aviso.textContent = ''; aviso.classList.remove('is-error'); } });
    $$('[data-enviar]', dlg).forEach(function (b) {
      b.addEventListener('click', function () {
        if (!listo()) return;
        var k = tipo(), cuerpo = texto();
        if (b.getAttribute('data-enviar') === 'wa') {
          window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(cuerpo), '_blank', 'noopener');
          aviso.textContent = t('form').listoWa;
        } else {
          var m = t('mail')[k], q = [];
          q.push('cc=' + encodeURIComponent(copias(m.to || 'josepablo@persona.cr')));
          q.push('subject=' + encodeURIComponent(m.s));
          q.push('body=' + encodeURIComponent(cuerpo + '\n\n' + (lang === 'es' ? 'Gracias.' : 'Thank you.')));
          location.href = 'mailto:' + (m.to || 'josepablo@persona.cr') + '?' + q.join('&');
          aviso.textContent = t('form').listoMail;
        }
        aviso.classList.remove('is-error');
      });
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('[data-cerrar]')) dlg.close(); });
    alCambiarIdioma.push(function () { if (dlg.open) pintar(); });
  }

  /* ------------------------------------------------------------- */
  function arrancar() {
    initIdioma();
    initEnlaces();
    initPortada();
    initScroll();
    initLuz();
    initGaleria();
    initVentanas();
    initFachadas();
    initMenu();
    initContactar();
    initTeaserFondo();
    initPalabras();
    initActos();
    initCompartir();
    initCielo();
    initMares();
    initAnio();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();
})();
