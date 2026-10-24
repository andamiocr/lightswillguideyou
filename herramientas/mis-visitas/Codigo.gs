/**
 * MIS VISITAS — resumen diario de GoatCounter (José Pablo García)
 * ------------------------------------------------------------------
 * Una página privada (solo se abre con tu cuenta de Google) que junta
 * los datos de tus sitios de GoatCounter y los muestra ordenados.
 *
 * Las llaves (API keys) NO van en este código: se guardan en
 * Configuración del proyecto → Propiedades del script, con estos nombres:
 *   lightswillguideyou   andamiocr   persona   personacr
 *
 * Los datos se guardan 20 minutos en memoria para que la página abra rápido.
 */

var SITIOS = [
  { codigo: 'lightswillguideyou', nombre: 'Lights Will Guide You', web: 'lightswillguideyou.com', color: '#E0A800' },
  { codigo: 'andamiocr', nombre: 'Andamio · /info', web: 'andamiocr.com/info', color: '#2E8FC0' },
  { codigo: 'persona', nombre: 'PERSONA · bio', web: 'bio.persona.cr', color: '#B4517A' },
  { codigo: 'personacr', nombre: 'PERSONA · sitio', web: 'www.persona.cr', color: '#4FB3E8' }
];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Pagina')
    .setTitle('Mis visitas')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

/** La página llama a esta función. forzar = true ignora la memoria. */
function datos(forzar) {
  var cache = CacheService.getUserCache();
  if (!forzar) { var c = cache.get('datos'); if (c) return c; }
  var props = PropertiesService.getScriptProperties();
  var zona = 'America/Costa_Rica';
  var hoy = new Date();
  function dia(n) { return Utilities.formatDate(new Date(hoy.getTime() - n * 864e5), zona, 'yyyy-MM-dd'); }
  // GoatCounter quiere fecha y hora completas (RFC 3339), en hora de Costa Rica
  function desde(n) { return encodeURIComponent(dia(n) + 'T00:00:00-06:00'); }
  function hasta() { return encodeURIComponent(dia(-1) + 'T06:00:00-06:00'); }
  var r = { generado: Utilities.formatDate(hoy, zona, "d 'de' MMMM, h:mm a"), hoy: dia(0), sitios: [] };

  SITIOS.forEach(function (s) {
    var llave = props.getProperty(s.codigo);
    var o = { codigo: s.codigo, nombre: s.nombre, web: s.web, color: s.color };
    if (!llave) { o.error = 'Falta la llave de este sitio (Propiedades del script → ' + s.codigo + ').'; r.sitios.push(o); return; }
    var base = 'https://' + s.codigo + '.goatcounter.com/api/v0/stats/';
    var p7 = 'start=' + desde(6) + '&end=' + hasta();
    var pedidos = [
      ['paginas', 'hits?start=' + desde(59) + '&end=' + hasta() + '&limit=100&daily=true'],
      ['fuentes', 'toprefs?' + p7 + '&limit=12'],
      ['paises', 'locations?' + p7 + '&limit=12'],
      ['aparatos', 'sizes?' + p7],
      ['sistemas', 'systems?' + p7 + '&limit=6'],
      ['navegadores', 'browsers?' + p7 + '&limit=6'],
      ['fuentesHoy', 'toprefs?start=' + desde(0) + '&end=' + hasta() + '&limit=6']
    ];
    // GoatCounter permite ~4 pedidos por segundo: van de 4 en 4
    for (var i = 0; i < pedidos.length; i += 4) {
      var tanda = pedidos.slice(i, i + 4);
      var resp = UrlFetchApp.fetchAll(tanda.map(function (p) {
        return { url: base + p[1], headers: { Authorization: 'Bearer ' + llave, 'Content-Type': 'application/json' }, muteHttpExceptions: true };
      }));
      resp.forEach(function (re, j) {
        var nombre = tanda[j][0];
        if (re.getResponseCode() === 200) { try { o[nombre] = JSON.parse(re.getContentText()); } catch (e) { o[nombre] = null; } }
        else { o[nombre] = null; o.error = (o.error ? o.error + ' · ' : '') + nombre + ': error ' + re.getResponseCode() + (re.getResponseCode() === 401 ? ' (llave incorrecta)' : ''); }
      });
      if (i + 4 < pedidos.length) Utilities.sleep(1100);
    }
    // Visitas por día: se suman las páginas (sin contar los clics/eventos)
    if (o.paginas && o.paginas.hits) {
      var porDia = {};
      for (var k = 59; k >= 0; k--) porDia[dia(k)] = 0;
      o.paginas.hits.forEach(function (h) {
        (h.stats || []).forEach(function (st) {
          st.daily = st.daily || (st.hourly || []).reduce(function (a, b) { return a + b; }, 0);
          delete st.hourly;
          // Si GoatCounter usa hora UTC, lo de esta noche ya aparece como «mañana»: se suma a hoy
          if (st.day > dia(0)) st.day = dia(0);
          if (!h.event && st.day in porDia) porDia[st.day] += st.daily;
        });
      });
      o.total = { stats: Object.keys(porDia).sort().map(function (d) { return { day: d, daily: porDia[d] }; }) };
    }
    r.sitios.push(o);
  });
  var json = JSON.stringify(r);
  try { cache.put('datos', json, 1200); } catch (e) {}
  return json;
}

/** Para probar desde el editor: muestra en el registro si las llaves funcionan. */
function probar() {
  var r = JSON.parse(datos(true));
  r.sitios.forEach(function (s) {
    console.log(s.nombre + ': ' + (s.error ? '❌ ' + s.error : '✅ ' + (s.total ? s.total.stats.reduce(function (t, d) { return t + d.daily; }, 0) : '?') + ' visitas en 60 días'));
  });
}
