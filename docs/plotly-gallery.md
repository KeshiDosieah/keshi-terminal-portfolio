# Interactive project galleries

The existing gallery accepts images from `src/assets/project-images/captions.ts` and chart entries from `src/assets/project-images/visualisations.ts`. Chart entries appear first; existing image records are unchanged.

To add another chart:

1. Export the actual Plotly figure with `fig.to_json()` (including animation frames), and place it in `src/assets/project-images/<project>/`.
2. Add a `kind: 'plotly'` entry under the project's exact slug in `visualisations.ts`. Include its JSON `src` (import the file with `?url` as in the existing entries), `title`, short `label` caption, and `preview` interaction hint.
3. Select it in the existing gallery to interact inline. Expansion is optional; no route or iframe is needed.

The selected chart renders directly in the existing gallery. IntersectionObserver defers Plotly and figure JSON until the chart approaches the viewport. A dedicated DOM node isolates Plotly's rendering from React's playback toolbar; stale fetches are aborted and cleanup waits for rendering to finish. ResizeObserver updates canvas dimensions without recreating the chart or restarting animation. Playback is enabled only after all saved frames are registered.

The leaderboard has HTML Play/Pause, Restart and year controls outside Plotly's canvas. The other charts preserve their hover, legend toggles, sunburst drilldown, trend range slider and globe rotation. Expansion is optional. The gallery's original dimensions are preserved, and the position counter is explicitly constrained so it cannot obscure the canvas.

The globe's `world_110m.json` geographic boundaries are stored in `src/assets/project-images/mapping-meteorites-through-geospatial-data-analytics/geography/` (from Plotly's geographic asset distribution), so no third-party network request is required at runtime. Charts use Plotly's JavaScript API directly inside the React component; the unused React wrapper has been removed.

## Meteorite provenance

All four figures were copied from saved `application/vnd.plotly.v1+json` notebook outputs in cell 19 (zero-based). No notebook code was executed, no data cleaning was repeated, and no points or frames were sampled. `src/assets/project-images/mapping-meteorites-through-geospatial-data-analytics/manifest.json` records notebook SHA-256, output indices, trace/frame counts and export sizes. JSON is minified without rounding numbers. Runtime presentation adapts dimensions, font sizes and margins to the viewport; leaderboard controls and legend positioning are adapted for the inline gallery. Analytical values, colours and hover templates are retained.

Regenerate with:

```sh
python3 scripts/extract-meteorite-figures.py /path/to/NTU_N1420858_SOFT40161.ipynb
```

The animated leaderboard preserves 210 frames, fixed country order, square-root bar widths and actual-count hover values. The trend figure preserves its logarithmic axis, spline smoothing and the notebook's 0.1 fill for missing decade/climate combinations. The globe preserves skipped hover on individual location points. The other notebook outputs include static Matplotlib/Seaborn figures, a Matplotlib spatiotemporal animation and a local Tkinter interface, not additional Plotly figures. The map-backed `witnessed-found-map.gif` plays inline through the existing image renderer. The originally supplied `meteorite_falling_stars.gif` lacked country geometry; it remains untouched in the assets directory. The displayed animation is re-exported from notebook Figure 6 using the saved merged CSV and its original Natural Earth country GeoJSON. Its latitude/longitude arrays are checked for exact equality with the saved Plotly globe before rendering, and `witnessed-found-map.provenance.json` records hashes, record/category counts, years and frame timing. No cleaning or enrichment is rerun. There are no saved per-chart static thumbnails, so thumbnail navigation uses lightweight text labels instead of fabricated chart images.

## Verification

- `npm run build` passes TypeScript and Vite production compilation.
- All exported `data`, `layout` and `frames` compare equal to their saved notebook originals, and all four JSON files appear in the build output.
- Existing image gallery rendering was checked during the original integration. Chrome now verifies that all four meteorite charts render inline and the leaderboard plays all 210 frames.
- Chrome interaction checks cover inline playback, pause, restart, year selection, replay and mobile control sizing. Vite reports the expected large, deferred Plotly chunk (about 1.49 MB gzip).

The original gallery aspect ratios and dimensions are preserved. In compact slots, charts reduce margins, omit duplicated chart titles, and use smaller scrollable legends. Playback controls occupy a 30px row within the existing stage; expanded viewing remains optional. No source figure data is changed.

Run the browser regression check with a local preview running. Playwright and a browser are required (they are not production dependencies):

```sh
GALLERY_BASE_URL=http://127.0.0.1:5176 node scripts/check-project-gallery.cjs
```

Set `PLAYWRIGHT_MODULE` to an existing Playwright installation and `CHROME_PATH` to a local Chrome executable if using an external browser test environment. The check covers the counter overlay regression, hover, drilldown, globe rotation, all 210 animation frames, pause/restart, expansion, original GIF, original dimensions and existing image galleries at desktop/mobile widths.

To regenerate the map-backed animation, install Matplotlib, NumPy and Pillow in a temporary Python environment, then run:

```sh
python scripts/export-meteorite-map-animation.py /path/to/notebook-directory
```

This is a scientific plot export from recorded data, not a generated illustration or an edit to the original GIF. The export tools are not website dependencies.

The displayed gallery contains the globe, map-backed GIF, discovery leaderboard and historical trends. The sunburst has been removed from the gallery; its saved export remains available for provenance. The browser check reflects those four displayed items.

The leaderboard displays numeric ticks on its existing square-root relative scale, with an explicit scale label; hover retains actual cumulative counts. Its meteorite-type legend sits to the right and scrolls within compact gallery frames. Long legend names wrap without altering trace groups or data.

Historical Discovery Trends also reserves space for a right-hand climate legend, visible Decade and average-per-year axis labels, and its original range slider. The logarithmic y-axis and source trend values are preserved.

All meteorite assets, including exports, GIFs, provenance and geographic boundaries, live together under the project image directory. Vite imports only their URLs; figures are still fetched on demand. The topology asset retains its original filename in the production output because Plotly requests that name automatically.
