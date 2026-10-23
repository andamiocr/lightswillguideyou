#!/usr/bin/env python3
"""Genera tuluz/index.html (la versión en español de Tu luz) a partir de yourlight/index.html.

Las dos son la MISMA página: /tuluz/ arranca en español y /yourlight/ en el idioma de la
persona. Nunca editar tuluz/index.html a mano: editar yourlight/index.html y correr
    python3 herramientas/generar_tuluz.py
(GitHub Actions también lo corre solo en cada Push que cambie yourlight/index.html).
"""
import pathlib, sys

raiz = pathlib.Path(__file__).resolve().parent.parent
s = (raiz / 'yourlight' / 'index.html').read_text(encoding='utf-8')

CAMBIOS = [
    ('<html lang="en" data-lang="en">', '<html lang="es" data-lang="es">'),
    ('<title>Who is the light that guides you? | Lights Will Guide You</title>',
     '<title>¿Quién es la luz que te guía? | Lights Will Guide You</title>'),
    ('<meta name="description" content="A sky of paper stars hung by Coldplay fans around the world. Write who your light is and hang your star over your country. ¿Quién es la luz que te guía? Encendé tu estrella.">',
     '<meta name="description" content="Un cielo de estrellas de papel colgadas por fans de Coldplay de todo el mundo. Escribí quién es tu luz y colgá tu estrella sobre tu país.">'),
    ('<link rel="canonical" href="https://www.lightswillguideyou.com/yourlight/">',
     '<link rel="canonical" href="https://www.lightswillguideyou.com/tuluz/">'),
    ('<meta property="og:site_name" content="Lights Will Guide You Show">',
     '<meta property="og:site_name" content="Lights Will Guide You Show">\n  <meta property="og:locale" content="es_LA">'),
    ('<meta property="og:title" content="Who is the light that guides you?">',
     '<meta property="og:title" content="¿Quién es la luz que te guía?">'),
    ('<meta property="og:description" content="A person, a dream, a song, a memory… whatever lights you up. Hang your star over your country in the Lights Will Guide You sky.">',
     '<meta property="og:description" content="Puede ser una persona, un sueño, una canción, un recuerdo… lo que te ilumina. Colgá tu estrella sobre tu país en el cielo de Lights Will Guide You.">'),
    ('<meta property="og:url" content="https://www.lightswillguideyou.com/yourlight/">',
     '<meta property="og:url" content="https://www.lightswillguideyou.com/tuluz/">'),
    ('<meta property="og:image" content="https://www.lightswillguideyou.com/yourlight/og-en.jpg">',
     '<meta property="og:image" content="https://www.lightswillguideyou.com/yourlight/og-es.jpg">'),
    ('{"@context":"https://schema.org","@type":"WebPage","name":"Who is the light that guides you?","url":"https://www.lightswillguideyou.com/yourlight/"',
     '{"@context":"https://schema.org","@type":"WebPage","name":"¿Quién es la luz que te guía?","url":"https://www.lightswillguideyou.com/tuluz/"'),
]
for viejo, nuevo in CAMBIOS:
    if s.count(viejo) != 1:
        sys.exit('No encontré exactamente una vez: ' + viejo[:80])
    s = s.replace(viejo, nuevo)

aviso = '<!-- GENERADO por herramientas/generar_tuluz.py a partir de yourlight/index.html. No editar a mano. -->\n'
(raiz / 'tuluz' / 'index.html').write_text(s.replace('<!DOCTYPE html>\n', '<!DOCTYPE html>\n' + aviso, 1), encoding='utf-8')
print('tuluz/index.html listo')
