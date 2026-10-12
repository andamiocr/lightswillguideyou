#!/usr/bin/env python3
"""Genera en/index.html (versión en inglés con dirección propia) a partir de index.html.
NO editar en/index.html a mano: editar index.html y volver a correr este script
(GitHub Actions lo corre solo en cada Push)."""
import pathlib, re, sys
raiz = pathlib.Path(__file__).resolve().parent.parent
s = (raiz / 'index.html').read_text(encoding='utf-8')
B = 'https://www.lightswillguideyou.com/'
cambios = [
  ('<html lang="es" data-lang="es"', '<html lang="en" data-lang="en"'),
  (re.compile(r'<title>.*?</title>', re.S),
   '<title>Lights Will Guide You Show | A Coldplay-Inspired Theatre, Dance &amp; Live Music Show</title>'),
  (re.compile(r'<meta name="description" content="[^"]*">'),
   '<meta name="description" content="A family theatre, dance and live music show inspired by Coldplay, created in Costa Rica: 43 performers and a live band with flute, banjo and mandolin. 9 performances, 2,500+ audience members. Open to touring, licensing and sponsorship.">'),
  (f'<link rel="canonical" href="{B}">', f'<link rel="canonical" href="{B}en/">'),
  (re.compile(r'<meta property="og:locale" content="es_CR">\s*<meta property="og:locale:alternate" content="en_US">'),
   '<meta property="og:locale" content="en_US">\n  <meta property="og:locale:alternate" content="es_CR">'),
  (re.compile(r'<meta property="og:title" content="[^"]*">'),
   '<meta property="og:title" content="Lights Will Guide You — A theatre, dance and live music show inspired by Coldplay">'),
  (re.compile(r'<meta property="og:description" content="[^"]*">'),
   '<meta property="og:description" content="9 performances, 2,500+ audience members and a community across Latin America. Bring the show to your city.">'),
  (f'<meta property="og:url" content="{B}">', f'<meta property="og:url" content="{B}en/">'),
  ('alt="Escena Amsterdam de Lights Will Guide You, show inspirado en Coldplay"', 'alt="Amsterdam scene from Lights Will Guide You, a Coldplay-inspired show"'),
  ('alt="Escena O (Fly On) de Lights Will Guide You con danza aérea"', 'alt="O (Fly On) scene from Lights Will Guide You with aerial dance"'),
]
for a, b in cambios:
    if isinstance(a, str):
        if a not in s: sys.exit(f'No encontré: {a[:70]}')
        s = s.replace(a, b)
    else:
        s, n = a.subn(b, s, count=1)
        if n != 1: sys.exit(f'No encontré patrón: {a.pattern[:70]}')
# Rutas relativas → absolutas (la página vive en /en/)
s = re.sub(r'(src|href|srcset|data-full|data-src|poster)="assets/', r'\1="/assets/', s)
s = s.replace('<link rel="stylesheet" href="assets/', '<link rel="stylesheet" href="/assets/')
aviso = '<!-- ARCHIVO GENERADO por herramientas/generar_en.py — no editar a mano: editar index.html -->\n'
(raiz / 'en').mkdir(exist_ok=True)
(raiz / 'en' / 'index.html').write_text(aviso + s, encoding='utf-8')
print('en/index.html generado')
