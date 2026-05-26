from pathlib import Path

p = Path('src/pages/index.astro')
text = p.read_text(encoding='utf-8')
old = '''			.info-grid,
			.resource-card-grid,
			.format-grid {
				grid-template-columns: 1fr;
			}

			.service-schedule-grid {
'''
new = '''			.info-grid,
			.resource-card-grid,
			.format-grid,
			.contact-grid {
				grid-template-columns: 1fr;
			}

			.service-schedule-grid {
'''
if old not in text:
    raise RuntimeError('Old CSS block not found')
text = text.replace(old, new, 1)
p.write_text(text, encoding='utf-8')
