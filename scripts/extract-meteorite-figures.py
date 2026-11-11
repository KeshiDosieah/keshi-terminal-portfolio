"""Export saved figures without executing notebook code. Usage: python3 scripts/extract-meteorite-figures.py /path/to/notebook.ipynb"""
import hashlib
import json
from pathlib import Path
import sys

source = Path(sys.argv[1])
notebook = json.loads(source.read_text())
target = Path(__file__).resolve().parents[1] / 'src/assets/project-images/mapping-meteorites-through-geospatial-data-analytics'
target.mkdir(parents=True, exist_ok=True)
names = ['witnessed-falls', 'discovery-leaderboard', 'historical-trends', 'global-distribution']
figures = []
for cell_index, cell in enumerate(notebook['cells']):
    for output_index, output in enumerate(cell.get('outputs', [])):
        figure = output.get('data', {}).get('application/vnd.plotly.v1+json')
        if figure:
            figures.append((cell_index, output_index, figure))
if len(figures) != len(names):
    raise ValueError('Notebook figure inventory changed; inspect before exporting.')
manifest = {'notebook': source.name, 'sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'figures': []}
for name, (cell, output, original) in zip(names, figures):
    figure = {key: original[key] for key in ('data', 'layout', 'frames') if key in original}
    path = target / f'{name}.json'
    path.write_text(json.dumps(figure, ensure_ascii=False, separators=(',', ':'), allow_nan=False))
    assert json.loads(path.read_text()) == figure
    manifest['figures'].append({'file': path.name, 'cell': cell, 'output': output, 'traces': len(figure['data']), 'frames': len(figure.get('frames', [])), 'bytes': path.stat().st_size})
(target / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(json.dumps(manifest, indent=2))
