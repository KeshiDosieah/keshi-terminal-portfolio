"""Export notebook Figure 6 from saved data, without rerunning its cleaning pipeline.

Usage: python scripts/export-meteorite-map-animation.py /path/to/notebook-directory
Requires matplotlib, numpy and Pillow; these are export tools, not site dependencies.
"""
import base64
import csv
import hashlib
import json
import struct
import sys
from pathlib import Path

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.path import Path as PlotPath
from matplotlib.patches import PathPatch
import numpy as np
from PIL import Image

source = Path(sys.argv[1])
root = Path(__file__).resolve().parents[1]
target = root / 'src/assets/project-images/mapping-meteorites-through-geospatial-data-analytics'
csv_path = source / 'data/merged/source/merged-meteorite-landings.csv'
map_path = source / 'data/raw/source/countries-10m/natural-earth-vector-countries.geojson'
rows = list(csv.DictReader(csv_path.open()))
# Confirm this is the same saved dataset used by the exported notebook globe.
globe = json.loads((target / 'global-distribution.json').read_text())['data'][-1]
for axis, column in [('lat', 'latitude'), ('lon', 'longitude')]:
    saved = globe[axis]
    if isinstance(saved, dict):
        raw = base64.b64decode(saved['bdata'])
        saved = list(struct.unpack('<' + str(len(raw) // 8) + 'd', raw))
    assert saved == [float(row[column]) for row in rows], f'{column} differs from the saved notebook output'

# Figure 6's numeric conversion, dropna, fall normalization and sorted year list.
records = []
for row in rows:
    try:
        lon, lat, year = [float(row[key]) for key in ('longitude', 'latitude', 'year')]
    except (ValueError, TypeError):
        continue
    if not np.isfinite([lon, lat, year]).all():
        continue
    records.append((lon, lat, year, row['fall'].strip().capitalize()))
coords = np.array([r[:2] for r in records])
years = np.array([r[2] for r in records])
falls = np.array([r[3] for r in records])
frame_years = np.unique(years)

fig, ax = plt.subplots(figsize=(9.6, 5.12), dpi=100, facecolor='#0b0c10')
fig.subplots_adjust(left=0.025, right=0.975, top=0.94, bottom=0.06)
ax.set_facecolor('#0b0c10')
world = json.loads(map_path.read_text())
for feature in world['features']:
    geometry = feature.get('geometry')
    if not geometry:
        continue
    polygons = [geometry['coordinates']] if geometry['type'] == 'Polygon' else geometry['coordinates'] if geometry['type'] == 'MultiPolygon' else []
    for polygon in polygons:
        rings = []
        for ring in polygon:
            vertices = np.asarray(ring)[:, :2]
            codes = np.full(len(vertices), PlotPath.LINETO, dtype=np.uint8)
            codes[0], codes[-1] = PlotPath.MOVETO, PlotPath.CLOSEPOLY
            rings.append(PlotPath(vertices, codes))
        if rings:
            ax.add_patch(PathPatch(PlotPath.make_compound_path(*rings), facecolor='#1a1a1a', edgecolor='#333333', linewidth=0.5, zorder=1))
ax.set_xlim(-180, 180)
ax.set_ylim(-90, 90)
ax.set_aspect('equal')
ax.axis('off')
past_fell = ax.scatter([], [], c='#ff0055', alpha=0.3, s=4, zorder=2, label='Witnessed Fall', animated=True)
past_found = ax.scatter([], [], c='#66fcf1', alpha=0.3, s=4, zorder=2, label='Found Later', animated=True)
flash_fell = ax.scatter([], [], c='white', s=120, edgecolors='#ff0055', linewidth=2, zorder=3, animated=True)
flash_found = ax.scatter([], [], c='white', s=120, edgecolors='#66fcf1', linewidth=2, zorder=3, animated=True)
ax.legend(handles=[past_fell, past_found], loc='lower left', fontsize=10, markerscale=6, facecolor='black', edgecolor='white', labelcolor='white', framealpha=0.6)
title = ax.text(0.5, 0.96, '', transform=ax.transAxes, color='white', ha='center', fontsize=16, fontfamily='monospace', animated=True)
fig.canvas.draw()
background = fig.canvas.copy_from_bbox(fig.bbox)
artists = [past_fell, past_found, flash_fell, flash_found, title]

def render(year):
    fig.canvas.restore_region(background)
    for collection, mask in [
        (past_fell, (years <= year) & (falls == 'Fell')),
        (past_found, (years <= year) & (falls == 'Found')),
        (flash_fell, (years == year) & (falls == 'Fell')),
        (flash_found, (years == year) & (falls == 'Found')),
    ]:
        collection.set_offsets(coords[mask])
    title.set_text(f'YEAR: {int(year)}')
    for artist in artists:
        ax.draw_artist(artist)
    return Image.fromarray(np.asarray(fig.canvas.buffer_rgba()).copy()).convert('RGB')

# One palette across all frames avoids flicker and includes both category colours.
palette = render(frame_years[-1]).quantize(colors=256)
frames = []
for index, year in enumerate(frame_years):
    frames.append(render(year).quantize(palette=palette, dither=Image.Dither.NONE))
    if index % 50 == 0:
        print(f'Rendered {index + 1}/{len(frame_years)} frames', flush=True)
output = target / 'witnessed-found-map.gif'
frames[0].save(output, save_all=True, append_images=frames[1:], duration=50, loop=0, optimize=False, disposal=1)
with Image.open(output) as verification:
    assert verification.n_frames == len(frame_years)
    verification.seek(len(frame_years) // 2)
    verification.convert('RGB').save('/private/tmp/meteorite-map-preview.png')
manifest = {
    'notebook_cell': 21, 'records': len(records), 'witnessed': int(np.sum(falls == 'Fell')), 'found': int(np.sum(falls == 'Found')),
    'frames': len(frame_years), 'years': [int(y) for y in frame_years], 'duration_ms_per_frame': 50,
    'csv': {'file': str(csv_path.relative_to(source)), 'sha256': hashlib.sha256(csv_path.read_bytes()).hexdigest()},
    'map': {'file': str(map_path.relative_to(source)), 'sha256': hashlib.sha256(map_path.read_bytes()).hexdigest()},
    'output': output.name, 'bytes': output.stat().st_size,
    'notes': 'Re-export of notebook Figure 6 with its Natural Earth world map. Reuses saved merged data verified against the notebook globe. No cleaning or enrichment rerun.',
}
(target / 'witnessed-found-map.provenance.json').write_text(json.dumps(manifest, indent=2) + '\n')
plt.close(fig)
print(f'Saved {output}: {len(frame_years)} frames, {output.stat().st_size:,} bytes', flush=True)
