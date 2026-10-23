# Lights Will Guide You — instrucciones para Claude

Sitio oficial del show (www.lightswillguideyou.com), de Andamio Escuela de Movimiento y PERSONA. Dueño: José Pablo García. Respondé en español (Costa Rica), claro y sin tecnicismos.

## Cómo se publica
- Push a `main` → GitHub Pages publica en 1–2 min. Repo público: nunca poner contraseñas ni datos privados.
- NO borrar: `CNAME`, `BingSiteAuth.xml`, `sitemap.xml`, `robots.txt`, `404.html`.

## Reglas
- Sitio bilingüe en una sola página: cada texto tiene `<span class="lwgy-es">` y `<span class="lwgy-en">`. Cambiar ambos idiomas cuando corresponda.
- Frase del momento interactivo: "Still believe in magic? Yes I do!".
- Direcciones internas absolutas con https://www.lightswillguideyou.com/. El estilo familia viene de https://andamiocr.com/andamio-familia/familia.css.
- "Tu luz" guarda en Google Forms/Sheets (assets/js/main.js, CFG): no cambiar IDs sin pedirlo.
- Pie legal: inspirado en Coldplay, licencia ACAM, no afiliado a Coldplay. No quitarlo.
- El nombre del show como marca (encabezados, tarjetas, imágenes) va con las letras del logo oficial y en MAYÚSCULAS: símbolo `#lwgy-palabra` (portada) / `#palabra` (yourlight), archivo `assets/img/lwgy-nombre.svg`. No escribirlo con Fraunces ni otra letra. En el texto corrido sí va normal.
- Al cambiar contenido importante, actualizar `<lastmod>` en sitemap.xml.
- Buscar el texto exacto antes de editar; mostrar antes/después; `node --check` si se toca JS.
- Al terminar, recordarle a José Pablo: Commit + Push en GitHub Desktop (o hacerlo si tenés permiso).

## Versión en inglés (/en/)
- `en/index.html` es GENERADO: nunca editarlo a mano. Editar `index.html` y correr `python3 herramientas/generar_en.py`
  (GitHub Actions también lo regenera solo en cada Push; después hacer Pull antes de seguir editando).
- Si cambiás el título, la descripción o los alt de los videos en español, actualizá también sus equivalentes en inglés dentro de `herramientas/generar_en.py`.
- Datos para Google (JSON-LD) viven en el `<script type="application/ld+json">` de index.html: mantener cifras y fechas al día.

## Tu luz / Your light (/yourlight/)
- Página propia en `yourlight/` (index.html, luz.css, luz.js, mapa.js, og.jpg). `/tuluz/` es la misma página en español: `tuluz/index.html` es GENERADO desde `yourlight/index.html` con `python3 herramientas/generar_tuluz.py` (GitHub Actions también lo regenera en cada Push); nunca editarlo a mano. Cada idioma tiene su dirección: español = /tuluz/, inglés = /yourlight/; al cambiar de idioma la dirección cambia sola y se quita `?lang=`.
- Un solo archivo para los dos idiomas: elige solo (?lang=es|en › la dirección /tuluz/ › elección guardada › idioma del teléfono) y tiene botón ES/EN.
- Formulario de Google (respuesta corta): Luz, País, Ciudad, Idioma. El país se guarda como código de 2 letras (CR, MX, US…).
- La hoja se lee pública (gviz). Moderación al revés: todo se publica; una X (o cualquier valor) en la columna "Ocultar" (antes "Aprobar") retira la luz.
- Robot de la hoja: `herramientas/robot-tuluz.gs` (Apps Script pegado dentro de la hoja, Extensiones → Apps Script). Revisa cada estrella al llegar y escribe el motivo en "Ocultar" (nunca borra): palabras de la pestaña "Palabras" (también disfrazadas), enlaces/teléfonos, repetidas (mismo texto + mismo teléfono en 24 h), más de 10 por teléfono al día, freno automático (más de 40 en 10 min → "en revisión") y modo revisión. Pestañas "Ajustes" y "Registro". Correo de aviso (máx. 1 por hora) y resumen diario 8 a. m. Si se cambia el código, José Pablo tiene que volver a pegarlo en la hoja (y correr «instalar» si cambian los disparadores).
- Filtro de palabras: la lista y las funciones `limpiar`, `armarFiltro`, `tieneContacto` están repetidas en `yourlight/luz.js`, `assets/js/main.js` y el robot. Mantenerlas iguales.
- El campo Idioma lleva "idioma · código anónimo del navegador · zona horaria" (ej. `es · k7f3q2ab · America/Costa_Rica`); el robot lo usa para límites y repetidas. Límite en la página: 10 por día por navegador (`lwgy-hoy`), 30 s entre estrellas.
- Dentro de Instagram/Facebook/TikTok (navegadores internos) no se pueden guardar imágenes: el botón dice "Abrir en Safari/Chrome para compartir" y abre la página afuera con `?mia=texto&p=CR&c=ciudad&ts=…` (se muestra el panel listo y se limpia la dirección; no se reenvía a la hoja). Si no sale en 3 s, se abre el visor con la imagen para guardarla manteniendo el dedo. Trucos no oficiales: `instagram://extbrowser/?url=` (iPhone), `intent://…;package=com.android.chrome` (Android), `x-safari-https://` (Facebook). Revisar si Instagram los cambia.
- Al tocar "Compartir en historias" se copia el enlace solo (para el sticker «Enlace») y la imagen ya está hecha de antemano (Safari exige compartir en el mismo toque).
- La sección "Tu luz" de la portada usa el mismo formulario y la misma hoja (LWGY_CONFIG en index.html) y enlaza al mapa.
- mapa.js es generado (puntos de tierra + centro de cada país): no editar a mano salvo coordenadas de un país.
- Vista de prueba con estrellas inventadas (solo en tu navegador): /yourlight/?demo=1

## Links de la bio (/links/)
- `links/index.html`: página para el link de la bio de Instagram/TikTok (reemplaza Linktree). noindex: no compite con la portada en Google.
- Orden según la campaña del momento: la tarjeta dorada es la acción principal (hoy: Tu luz). Cambiar el orden o la tarjeta destacada cuando haya temporada nueva (entradas primero).
- Mismo idioma automático que /yourlight (clave `lwgy-lang`).
- Contador: GoatCounter, un sitio por marca: lightswillguideyou (este repo: portada, /en, /yourlight, /links), andamiocr (andamioweb), persona (persona.cr). Mismo usuario; se cambia de sitio en Settings → Sites. /yourlight cuenta acciones: estrella-colgada, compartir-historia, compartido, descargar-imagen, ver-imagen, whatsapp, seguir-instagram, copiar-enlace, limite-diario, abrir-fuera (salir de Instagram), llego-desde-app (salió bien), no-se-abrio-navegador (no salió).
