/**
 * MIS VISITAS — resumen diario de GoatCounter (José Pablo García)
 * ------------------------------------------------------------------
 * Una página privada (solo se abre con tu cuenta de Google) que junta
 * los datos de tus 3 sitios de GoatCounter y los muestra ordenados.
 *
 * Las llaves (API keys) NO van en este código: se guardan en
 * Configuración del proyecto → Propiedades del script, con estos nombres:
 *   lightswillguideyou   andamiocr   persona
 *
 * Los datos se guardan 20 minutos en memoria para que la página abra rápido.
 */

var SITIOS = [
  { codigo: 'lightswillguideyou', nombre: 'Lights Will Guide You', web: 'lightswillguideyou.com', color: '#E0A800' },
  { codigo: 'andamiocr', nombre: 'Andamio', web: 'andamiocr.com', color: '#2E8FC0' },
  { codigo: 'persona', nombre: 'PERSONA · bio', web: 'bio.persona.cr', color: '#B4517A' }
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
  var r = { generado: Utilities.formatDate(hoy, zona, "d 'de' MMMM, h:mm a"), hoy: dia(0), sitios: [] };

  SITIOS.forEach(function (s) {
    var llave = props.getProperty(s.codigo);
    var o = { codigo: s.codigo, nombre: s.nombre, web: s.web, color: s.color };
    if (!llave) { o.error = 'Falta la llave de este sitio (Propiedades del script → ' + s.codigo + ').'; r.sitios.push(o); return; }
    var base = 'https://' + s.codigo + '.goatcounter.com/api/v0/stats/';
    var p30 = 'start=' + dia(29) + '&end=' + dia(0), p7 = 'start=' + dia(6) + '&end=' + dia(0);
    var pedidos = [
      ['total', 'total?start=' + dia(59) + '&end=' + dia(0)],
      ['paginas', 'hits?' + p30 + '&limit=60'],
      ['fuentes', 'toprefs?' + p7 + '&limit=12'],
      ['paises', 'locations?' + p7 + '&limit=12'],
      ['aparatos', 'sizes?' + p7],
      ['sistemas', 'systems?' + p7 + '&limit=6'],
      ['navegadores', 'browsers?' + p7 + '&limit=6'],
      ['fuentesHoy', 'toprefs?start=' + dia(0) + '&end=' + dia(0) + '&limit=6']
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
    console.log(s.nombre + ': ' + (s.error ? '❌ ' + s.error : '✅ ' + (s.total ? s.total.total : '?') + ' visitas en 60 días'));
  });
}
