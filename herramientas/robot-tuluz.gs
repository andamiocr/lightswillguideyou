/**
 * @OnlyCurrentDoc
 *
 * ROBOT DE «TU LUZ» — Lights Will Guide You
 * ------------------------------------------------------------------
 * Vive dentro de la hoja «Your Light | Tu Luz». Cada vez que alguien
 * cuelga una estrella, la revisa en 1–2 segundos. Si algo no está bien,
 * escribe el motivo en la columna «Ocultar» y la estrella desaparece
 * del mapa. NUNCA borra nada: para devolver una estrella, vaciá su celda
 * en «Ocultar».
 *
 * Qué revisa:
 *   · Palabras prohibidas (pestaña «Palabras», la podés editar), también
 *     disfrazadas: p.u.t.a, put4, mieeerda, m i e r d a.
 *   · Enlaces, correos, @usuarios y teléfonos.
 *   · Repetidas: el mismo texto desde el mismo teléfono en 24 horas.
 *   · Más de 10 estrellas en un día desde el mismo teléfono.
 *   · Freno automático: si llegan demasiadas en 10 minutos, las nuevas
 *     esperan tu revisión y te avisa por correo.
 *   · Modo revisión (pestaña «Ajustes»): toda estrella nueva espera tu OK.
 *
 * Correos: aviso cuando oculta algo (máximo uno por hora) y un resumen
 * diario a las 8 a. m. (hora de Costa Rica) si hubo estrellas nuevas.
 *
 * INSTALAR (una sola vez): Extensiones → Apps Script → borrar lo que haya →
 * pegar todo este archivo → Guardar → elegir «instalar» arriba → Ejecutar →
 * dar permiso con tu cuenta de Google.
 *
 * Mantener igual que yourlight/luz.js y assets/js/main.js: PALABRAS_INICIALES,
 * limpiar(), armarFiltro() y tieneContacto().
 */

var VERSION_ROBOT = '1.0 (2026-10-12)';
var ZONA_CR = 'America/Costa_Rica';
var MAPA_URL = 'https://www.lightswillguideyou.com/yourlight/';
var MANEJADORES = ['alLlegarEstrella', 'resumenDiario', 'enviarAvisosPendientes'];

var PALABRAS_INICIALES = ['puta*', 'puto', 'putos', 'mierd*', 'verga', 'vergas', 'pija', 'pijas', 'cono', 'pendej*', 'hijueputa*', 'hijoeputa*', 'hijo de puta*', 'malparid*', 'culero*', 'culiao', 'culiado*', 'culear*', 'culiar*', 'cabron', 'cabrona*', 'cabrones', 'chingad*', 'chinga tu madre', 'concha de tu madre', 'conchatumadre', 'conchesumadre', 'ctm', 'csm', 'hdp', 'ptm', 'gonorrea', 'mamaguevo*', 'mamahuevo*', 'mamabicho*', 'maricon*', 'sudaca*', 'negrata*', 'mongolic*', 'subnormal*', 'sidos*', 'singar', 'singao', 'pinga', 'tetas', 'tetona*', 'pene', 'penes', 'chupala', 'chupamela', 'follar', 'follame', 'follando', 'matate', 'suicidate', 'fuck*', 'motherfuck*', 'shit*', 'bitch*', 'cunt*', 'nigg*', 'fagg*', 'whore*', 'slut*', 'asshole*', 'dickhead*', 'retard*', 'twat*', 'wanker*', 'pussy', 'kys', 'kill yourself', 'nazi*', 'hitler', 'heil', 'kkk', 'porn*', 'sexo', 'sex', 'xxx', 'nude', 'nudes', 'onlyfans', 'casino', 'viagra', 'bitcoin', 'punto com', 'dot com'];

/* ================================================================
   1. Menú «⭐ Tu luz» (aparece al abrir la hoja)
   ================================================================ */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('⭐ Tu luz')
    .addItem('Mostrar las que esperan revisión', 'aprobarPendientes')
    .addItem('Revisar todas otra vez (después de agregar palabras)', 'revisarTodas')
    .addItem('Enviarme el resumen ahora', 'resumenAhora')
    .addSeparator()
    .addItem('Instalar o reparar el robot', 'instalar')
    .addToUi();
}

/* ================================================================
   2. Instalar: crea las pestañas y deja al robot trabajando solo
   ================================================================ */
function instalar() {
  var ss = SpreadsheetApp.getActive();
  prepararPestanas(ss);
  ScriptApp.getProjectTriggers().forEach(function (tr) {
    if (MANEJADORES.indexOf(tr.getHandlerFunction()) > -1) ScriptApp.deleteTrigger(tr);
  });
  ScriptApp.newTrigger('alLlegarEstrella').forSpreadsheet(ss).onFormSubmit().create();
  ScriptApp.newTrigger('resumenDiario').timeBased().atHour(8).nearMinute(0).everyDays(1).inTimezone(ZONA_CR).create();
  ScriptApp.newTrigger('enviarAvisosPendientes').timeBased().everyHours(1).create();
  enviarCorreo('El robot de Tu luz quedó instalado ⭐',
    '<p>¡Listo! Desde ahora reviso cada estrella nueva de <b>Tu luz</b>.</p>' +
    '<ul><li>Si algo no está bien, escribo el motivo en la columna <b>Ocultar</b> y la estrella desaparece del mapa. No borro nada.</li>' +
    '<li>Para devolver una estrella, borrá su celda en <b>Ocultar</b>.</li>' +
    '<li>Podés agregar palabras en la pestaña <b>Palabras</b> y cambiar cómo trabajo en <b>Ajustes</b>.</li>' +
    '<li>Te escribo cuando oculte algo (máximo un correo por hora) y te mando un resumen cada mañana si hubo estrellas nuevas.</li></ul>' +
    pieCorreo(ss));
  avisar('¡Listo! El robot quedó instalado. Te mandé un correo de prueba.\n\nPara probarlo: colgá una estrella con una palabra fea desde la página y mirá cómo aparece el motivo en la columna «Ocultar».');
}

function prepararPestanas(ss) {
  if (!ss.getSheetByName('Palabras')) {
    var p = ss.insertSheet('Palabras');
    p.getRange(1, 1, 1, 2).setValues([['Palabra o frase', 'Cómo funciona']]).setFontWeight('bold');
    p.getRange(2, 1, PALABRAS_INICIALES.length, 1).setValues(PALABRAS_INICIALES.map(function (w) { return [w]; }));
    p.getRange(2, 2, 4, 1).setValues([
      ['Una palabra o frase por fila. Agregá o borrá las que querás.'],
      ['Sin * = solo la palabra completa («puto» no tapa «computadora»).'],
      ['Con * al final = cualquier final («mierd*» tapa mierda, mierdas, mierdero…).'],
      ['También detecto palabras disfrazadas: p.u.t.a, put4, mieeerda, m i e r d a. Después de agregar palabras, usá el menú ⭐ Tu luz → Revisar todas otra vez.']
    ]);
    p.setFrozenRows(1); p.setColumnWidth(1, 220); p.setColumnWidth(2, 560);
  }
  if (!ss.getSheetByName('Ajustes')) {
    var a = ss.insertSheet('Ajustes');
    a.getRange(1, 1, 7, 3).setValues([
      ['Ajuste', 'Valor', 'Qué hace'],
      ['Modo revisión', 'NO', 'SÍ = cada estrella nueva espera tu aprobación (dice «en revisión» en Ocultar). Para aprobarlas todas: menú ⭐ Tu luz → Mostrar las que esperan revisión. Cada persona igual ve su propia estrella.'],
      ['Máximo de estrellas por teléfono al día', 10, 'Desde la estrella número 11 del mismo teléfono en un día, se ocultan solas.'],
      ['Freno automático: estrellas en 10 minutos', 40, 'Si llegan más que esto en 10 minutos, las nuevas esperan tu revisión y te aviso. Si vas a pedirle al público que cuelgue estrellas en vivo, subilo ese día (por ejemplo, a 1000).'],
      ['Avisarme por correo cuando oculte algo', 'SÍ', 'Máximo un correo por hora, con todo lo que oculté.'],
      ['Resumen diario por correo (8 a. m.)', 'SÍ', 'Solo llega si hubo estrellas nuevas o hay estrellas esperando revisión.'],
      ['Correo para avisos', '', 'Vacío = tu correo de Google. Ojo: esta hoja se puede leer en público; si escribís un correo aquí, queda visible.']
    ]);
    a.getRange(1, 1, 1, 3).setFontWeight('bold');
    var siNo = SpreadsheetApp.newDataValidation().requireValueInList(['SÍ', 'NO'], true).build();
    [2, 5, 6].forEach(function (f) { a.getRange(f, 2).setDataValidation(siNo); });
    a.setFrozenRows(1); a.setColumnWidth(1, 300); a.setColumnWidth(2, 90); a.setColumnWidth(3, 620);
  }
  if (!ss.getSheetByName('Registro')) {
    var r = ss.insertSheet('Registro');
    r.getRange(1, 1, 1, 5).setValues([['Fecha', 'Fila', 'Luz', 'País', 'Motivo']]).setFontWeight('bold');
    r.setFrozenRows(1); r.setColumnWidth(3, 360); r.setColumnWidth(5, 260);
  }
  columnas(hojaRespuestas(ss)); // crea «Ocultar» si faltara
}

/* ================================================================
   3. Cada estrella nueva
   ================================================================ */
function alLlegarEstrella(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var ss = SpreadsheetApp.getActive(), hoja = hojaRespuestas(ss);
    if (e && e.range && e.range.getSheet().getName() !== hoja.getName()) return;
    var fila = e && e.range ? e.range.getRow() : hoja.getLastRow();
    revisarNueva(ss, hoja, fila);
  } finally {
    lock.releaseLock();
  }
}

function revisarNueva(ss, hoja, fila) {
  var datos = hoja.getDataRange().getValues(), cols = columnas(hoja, datos[0]);
  var r = datos[fila - 1];
  if (!r || String(r[cols.ocultar] || '').trim()) return null;
  var aj = leerAjustes(ss), info = leerFila(r, cols);
  if (!info.luz) return null;
  var motivo = motivoContenido(info, filtroDesde(ss)) || motivoAbuso(info, datos, fila, cols, aj, ss);
  if (!motivo) {
    var recientes = contarRecientes(datos, cols, info.fecha, 10);
    if (recientes > aj.freno) { motivo = 'en revisión (freno automático)'; avisoFreno(recientes, aj, ss); }
  }
  if (!motivo && aj.revision) motivo = 'en revisión';
  if (motivo) marcar(ss, hoja, fila, cols, info, motivo, aj, true);
  return motivo;
}

function motivoContenido(info, filtro) {
  if (tieneContacto(info.luz) || (info.ciudad && tieneContacto(info.ciudad))) return 'auto: enlace, correo o teléfono';
  var w = buscarMala(info.luz, filtro) || buscarMala(info.ciudad, filtro);
  return w ? 'auto: palabra («' + w + '»)' : '';
}

function motivoAbuso(info, datos, fila, cols, aj, ss) {
  var yo = info.disp || 'sin-codigo', zona = zonaValida(info.zona, ss);
  var dia = Utilities.formatDate(info.fecha, zona, 'yyyy-MM-dd'), texto = limpiar(info.luz);
  var hoyN = 0, repetida = false;
  for (var i = 1; i < fila - 1; i++) {
    var o = leerFila(datos[i], cols);
    if (!o.luz || (o.disp || 'sin-codigo') !== yo) continue;
    if (Utilities.formatDate(o.fecha, zona, 'yyyy-MM-dd') === dia) hoyN++;
    if (limpiar(o.luz) === texto && info.fecha - o.fecha < 864e5 && info.fecha >= o.fecha) repetida = true;
  }
  if (repetida) return 'auto: repetida';
  if (hoyN >= aj.maximo) return 'auto: más de ' + aj.maximo + ' en un día';
  return '';
}

function contarRecientes(datos, cols, fecha, minutos) {
  var n = 0, desde = fecha.getTime() - minutos * 60000;
  for (var i = 1; i < datos.length; i++) {
    var f = aFecha(datos[i][cols.fecha]);
    if (f && f.getTime() >= desde && f.getTime() <= fecha.getTime()) n++;
  }
  return n;
}

function marcar(ss, hoja, fila, cols, info, motivo, aj, avisarPorCorreo) {
  hoja.getRange(fila, cols.ocultar + 1).setValue(motivo);
  var reg = ss.getSheetByName('Registro');
  if (reg) reg.appendRow([new Date(), fila, info.luz, info.pais, motivo]);
  if (avisarPorCorreo && aj.aviso) {
    var props = PropertiesService.getScriptProperties();
    var pend = JSON.parse(props.getProperty('pendientes') || '[]');
    pend.push({ f: fila, luz: String(info.luz).slice(0, 90), pais: info.pais, motivo: motivo });
    props.setProperty('pendientes', JSON.stringify(pend.slice(-40)));
    enviarAvisosPendientes();
  }
}

/* ================================================================
   4. Correos
   ================================================================ */
function enviarAvisosPendientes() {
  var props = PropertiesService.getScriptProperties();
  var pend = JSON.parse(props.getProperty('pendientes') || '[]');
  if (!pend.length) return;
  var ultimo = +props.getProperty('ultimoAviso') || 0;
  if (Date.now() - ultimo < 55 * 60000) return; // máximo uno por hora
  var ss = SpreadsheetApp.getActive();
  var enRevision = pend.filter(function (p) { return /^en revisi/.test(p.motivo); }).length;
  var asunto = enRevision === pend.length
    ? 'Tu luz: ' + pend.length + (pend.length === 1 ? ' estrella espera' : ' estrellas esperan') + ' tu revisión'
    : 'Tu luz: oculté ' + (pend.length - enRevision) + (pend.length - enRevision === 1 ? ' estrella' : ' estrellas');
  enviarCorreo(asunto,
    '<p>Esto es lo que revisé desde el último aviso:</p>' + tablaEstrellas(pend) +
    '<p>Si alguna no debía ocultarse, borrá su celda en la columna <b>Ocultar</b> (fila indicada) y vuelve al mapa en un minuto.</p>' +
    (enRevision ? '<p>Para aprobar de una vez todas las que esperan revisión: menú <b>⭐ Tu luz → Mostrar las que esperan revisión</b>.</p>' : '') +
    pieCorreo(ss));
  props.setProperty('pendientes', '[]');
  props.setProperty('ultimoAviso', String(Date.now()));
}

function avisoFreno(n, aj, ss) {
  var props = PropertiesService.getScriptProperties();
  var ultimo = +props.getProperty('ultimoFreno') || 0;
  if (Date.now() - ultimo < 60 * 60000) return;
  props.setProperty('ultimoFreno', String(Date.now()));
  enviarCorreo('⚠️ Tu luz: se activó el freno automático',
    '<p>Llegaron <b>' + n + ' estrellas en 10 minutos</b> (el límite en Ajustes es ' + aj.freno + ').</p>' +
    '<p>Mientras siga así, las nuevas quedan <b>en revisión</b> y no aparecen en el mapa. Puede ser algo lindo (mucha gente a la vez, por ejemplo después de una función) o alguien tratando de llenar el mapa.</p>' +
    '<p>Qué hacer: abrí la hoja y mirá las últimas filas. Si todo está bien, menú <b>⭐ Tu luz → Mostrar las que esperan revisión</b>. Si esperás mucha gente a la vez, subí el número del freno en la pestaña <b>Ajustes</b>.</p>' +
    pieCorreo(ss));
}

function resumenAhora() { resumenDiario(true); avisar('Listo: te mandé el resumen por correo.'); }

function resumenDiario(forzar) {
  var ss = SpreadsheetApp.getActive(), aj = leerAjustes(ss);
  if (!aj.resumen && forzar !== true) return;
  var hoja = hojaRespuestas(ss), datos = hoja.getDataRange().getValues(), cols = columnas(hoja, datos[0]);
  var ahora = Date.now(), nuevas = 0, ocultas = [], esperando = 0, visibles = 0, porPais = {}, paisesTotal = {};
  for (var i = 1; i < datos.length; i++) {
    var o = leerFila(datos[i], cols);
    if (!o.luz) continue;
    var oc = String(datos[i][cols.ocultar] || '').trim(), reciente = ahora - o.fecha.getTime() < 864e5;
    if (/^en revisi/i.test(oc)) esperando++;
    if (!oc) { visibles++; paisesTotal[o.pais || '?'] = 1; }
    if (reciente) {
      nuevas++;
      if (oc) ocultas.push({ f: i + 1, luz: o.luz, pais: o.pais, motivo: oc });
      else porPais[o.pais || '?'] = (porPais[o.pais || '?'] || 0) + 1;
    }
  }
  if (forzar !== true && !nuevas && !esperando) return;
  var top = Object.keys(porPais).sort(function (a, b) { return porPais[b] - porPais[a]; }).slice(0, 6)
    .map(function (p) { return esc(nombrePais(p)) + ' (' + porPais[p] + ')'; }).join(', ');
  var asunto = 'Tu luz · ' + (nuevas === 1 ? '1 estrella nueva' : nuevas + ' estrellas nuevas') + (ocultas.length ? ' (' + ocultas.length + ' ocultas)' : '');
  enviarCorreo(asunto,
    '<p><b>Últimas 24 horas:</b> ' + nuevas + (nuevas === 1 ? ' estrella nueva' : ' estrellas nuevas') + (top ? ', sobre todo desde ' + top : '') + '.</p>' +
    '<p><b>En total, en el mapa:</b> ' + visibles + ' estrellas desde ' + Object.keys(paisesTotal).length + ' países.</p>' +
    (esperando ? '<p><b>Esperando tu revisión:</b> ' + esperando + '. Menú ⭐ Tu luz → Mostrar las que esperan revisión.</p>' : '') +
    (ocultas.length ? '<p><b>Ocultas en las últimas 24 horas:</b></p>' + tablaEstrellas(ocultas.slice(-40)) : '<p>No tuve que ocultar ninguna. 🌟</p>') +
    pieCorreo(ss));
  PropertiesService.getScriptProperties().setProperty('pendientes', '[]');
}

function tablaEstrellas(lista) {
  return '<table cellpadding="6" style="border-collapse:collapse;font-size:14px">' +
    '<tr style="background:#f1eff8;text-align:left"><th>Fila</th><th>Luz</th><th>País</th><th>Motivo</th></tr>' +
    lista.map(function (p) {
      return '<tr style="border-top:1px solid #e3e0ee"><td>' + p.f + '</td><td>' + esc(p.luz) + '</td><td>' + esc(nombrePais(p.pais)) + '</td><td>' + esc(p.motivo) + '</td></tr>';
    }).join('') + '</table>';
}

function pieCorreo(ss) {
  return '<p style="margin-top:22px;color:#6f6992;font-size:13px">Abrir la hoja: <a href="' + ss.getUrl() + '">' + esc(ss.getName()) + '</a> · Ver el mapa: <a href="' + MAPA_URL + '">' + MAPA_URL + '</a><br>Robot de Tu luz, versión ' + VERSION_ROBOT + '</p>';
}

function enviarCorreo(asunto, html) {
  var aj = leerAjustes(SpreadsheetApp.getActive());
  var para = aj.correo || Session.getEffectiveUser().getEmail();
  if (!para) return;
  MailApp.sendEmail({ to: para, subject: asunto, htmlBody: '<div style="font-family:Helvetica,Arial,sans-serif;color:#16132f;line-height:1.5">' + html + '</div>', name: 'Robot de Tu luz' });
}

/* ================================================================
   5. Botones del menú
   ================================================================ */
function aprobarPendientes() {
  var ss = SpreadsheetApp.getActive(), hoja = hojaRespuestas(ss), datos = hoja.getDataRange().getValues(), cols = columnas(hoja, datos[0]), n = 0;
  for (var i = 1; i < datos.length; i++) {
    if (/^en revisi/i.test(String(datos[i][cols.ocultar] || '').trim())) { hoja.getRange(i + 1, cols.ocultar + 1).setValue(''); n++; }
  }
  avisar(n ? 'Listo: ' + n + (n === 1 ? ' estrella vuelve' : ' estrellas vuelven') + ' al mapa (tarda hasta un minuto en verse).' : 'No hay estrellas esperando revisión.');
}

function revisarTodas() {
  var ss = SpreadsheetApp.getActive(), hoja = hojaRespuestas(ss), datos = hoja.getDataRange().getValues(), cols = columnas(hoja, datos[0]);
  var filtro = filtroDesde(ss), aj = leerAjustes(ss), n = 0;
  for (var i = 1; i < datos.length; i++) {
    if (String(datos[i][cols.ocultar] || '').trim()) continue;
    var info = leerFila(datos[i], cols);
    if (!info.luz) continue;
    var m = motivoContenido(info, filtro);
    if (m) { marcar(ss, hoja, i + 1, cols, info, m, aj, false); n++; }
  }
  avisar(n ? 'Revisé todas: oculté ' + n + (n === 1 ? ' estrella' : ' estrellas') + '. Están anotadas en la pestaña «Registro».' : 'Revisé todas y no encontré nada para ocultar.');
}

/* ================================================================
   6. Ayudantes
   ================================================================ */
function hojaRespuestas(ss) {
  var hojas = ss.getSheets();
  for (var i = 0; i < hojas.length; i++) { try { if (hojas[i].getFormUrl()) return hojas[i]; } catch (e) {} }
  return ss.getSheetByName('Form Responses 1') || ss.getSheetByName('Respuestas de formulario 1') || hojas[0];
}

function normal(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim(); }

function columnas(hoja, encabezado) {
  encabezado = encabezado || hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
  var h = encabezado.map(normal);
  function col(re, def) { for (var i = 0; i < h.length; i++) if (re.test(h[i])) return i; return def; }
  var c = { fecha: col(/^(timestamp|marca)/, 0), luz: col(/^(luz|light)/, 1), pais: col(/^(pais|country)/, 2), ciudad: col(/^(ciudad|city)/, 3), idioma: col(/^(idioma|lang)/, 4), ocultar: col(/^(ocultar|aprobar|hide)/, -1) };
  if (c.ocultar < 0) { c.ocultar = encabezado.length; hoja.getRange(1, c.ocultar + 1).setValue('Ocultar'); }
  return c;
}

function aFecha(v) {
  if (v instanceof Date) return v;
  var d = v ? new Date(v) : null;
  return d && !isNaN(d.getTime()) ? d : null;
}

function leerFila(r, cols) {
  var partes = String(r[cols.idioma] || '').split(/\s*[·|]\s*/);
  var disp = /^[a-z0-9]{6,12}$/.test(partes[1] || '') ? partes[1] : '';
  return {
    fecha: aFecha(r[cols.fecha]) || new Date(0),
    luz: String(r[cols.luz] || '').trim(),
    pais: String(r[cols.pais] || '').trim().toUpperCase(),
    ciudad: String(r[cols.ciudad] || '').trim(),
    idioma: partes[0] || '',
    disp: disp,
    zona: partes[2] && partes[2] !== '-' ? partes[2] : ''
  };
}

function zonaValida(z, ss) {
  if (z && /^[A-Za-z_]+(\/[A-Za-z0-9_+\-]+)+$/.test(z)) { try { Utilities.formatDate(new Date(), z, 'yyyy'); return z; } catch (e) {} }
  return ss.getSpreadsheetTimeZone() || ZONA_CR;
}

function leerAjustes(ss) {
  var aj = { revision: false, maximo: 10, freno: 40, aviso: true, resumen: true, correo: '' };
  var a = ss.getSheetByName('Ajustes');
  if (!a) return aj;
  a.getDataRange().getValues().forEach(function (f) {
    var k = normal(f[0]), v = f[1];
    if (/^modo revision/.test(k)) aj.revision = siNo(v, false);
    else if (/^maximo/.test(k)) aj.maximo = Math.max(1, parseInt(v, 10) || 10);
    else if (/^freno/.test(k)) aj.freno = Math.max(5, parseInt(v, 10) || 40);
    else if (/^avisarme/.test(k)) aj.aviso = siNo(v, true);
    else if (/^resumen/.test(k)) aj.resumen = siNo(v, true);
    else if (/^correo/.test(k)) aj.correo = /@/.test(String(v)) ? String(v).trim() : '';
  });
  return aj;
}

function siNo(v, def) {
  var s = normal(v);
  if (!s) return def;
  return /^(si|yes|true|1|x)$/.test(s);
}

function filtroDesde(ss) {
  var p = ss.getSheetByName('Palabras'), lista = PALABRAS_INICIALES;
  if (p && p.getLastRow() > 1) lista = p.getRange(2, 1, p.getLastRow() - 1, 1).getValues().map(function (f) { return String(f[0] || ''); });
  return armarFiltro(lista);
}

function nombrePais(c) {
  c = String(c || '').toUpperCase();
  if (!c || c === '?' || c === 'ZZ') return 'sin país';
  try { return new Intl.DisplayNames(['es'], { type: 'region' }).of(c) || c; } catch (e) { return c; }
}

function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }

function avisar(msg) {
  try { SpreadsheetApp.getUi().alert(msg); } catch (e) { console.log(msg); }
}

/* ---- Filtro de palabras: igual que en la página ---- */
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

function buscarMala(s, filtro) {
  if (!s || !filtro) return '';
  var a = limpiar(s), m = filtro.exec(a) || filtro.exec(a.replace(/([a-z])\1+/g, '$1'));
  return m ? m[2] : '';
}

function tieneContacto(s) {
  s = String(s || '');
  if (/https?:|www\.|\.(com|net|org|io|ly|xyz|link)\b|t\.me\/|@/i.test(s)) return true;
  return /(\d[\s.\-]?){8,}/.test(s.replace(/\b(1[89]|20)\d\d\s*[-–]\s*(1[89]|20)\d\d\b/g, ''));
}
