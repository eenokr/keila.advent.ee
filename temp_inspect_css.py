from pathlib import Path
p = Path('src/pages/index.astro')
text = p.read_text(encoding='utf-8')
idx = text.index('.format-grid')
print(repr(text[idx-80:idx+180]))
