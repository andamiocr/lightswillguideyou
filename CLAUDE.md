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
- Al cambiar contenido importante, actualizar `<lastmod>` en sitemap.xml.
- Buscar el texto exacto antes de editar; mostrar antes/después; `node --check` si se toca JS.
- Al terminar, recordarle a José Pablo: Commit + Push en GitHub Desktop (o hacerlo si tenés permiso).

## Versión en inglés (/en/)
- `en/index.html` es GENERADO: nunca editarlo a mano. Editar `index.html` y correr `python3 herramientas/generar_en.py`
  (GitHub Actions también lo regenera solo en cada Push; después hacer Pull antes de seguir editando).
- Si cambiás el título, la descripción o los alt de los videos en español, actualizá también sus equivalentes en inglés dentro de `herramientas/generar_en.py`.
- Datos para Google (JSON-LD) viven en el `<script type="application/ld+json">` de index.html: mantener cifras y fechas al día.
