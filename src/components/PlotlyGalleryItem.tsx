import worldMapUrl from '../assets/project-images/mapping-meteorites-through-geospatial-data-analytics/geography/world_110m.json?url';
import { useEffect, useRef, useState } from 'react';
import type { Data, Frame, Layout, PlotlyHTMLElement } from 'plotly.js';
import type Plotly from 'plotly.js';

type Figure = { data: Data[]; layout: Partial<Layout>; frames?: Frame[] };
type Runtime = { api: typeof Plotly; element: PlotlyHTMLElement; frames: Frame[] };

function fitLayout(figure: Figure, width: number, height: number): Partial<Layout> {
  const compact = height < 340;
  const original = figure.layout;
  const sunburst = figure.data[0]?.type === 'sunburst';
  const geographic = !!original.geo;
  const animated = !!figure.frames?.length;
  const temporal = !!original.xaxis?.rangeslider;
  return {
    ...original, width, height, autosize: false, uirevision: 'gallery',
    title: compact ? { text: '' } : { ...original.title, font: { size: width < 600 ? 13 : 18 } },
    margin: compact
      ? { l: animated ? 92 : geographic || sunburst ? 4 : 38, r: 8, t: 20, b: sunburst ? 4 : 32, ...{ autoexpand: false } }
      : { ...original.margin, l: animated ? 140 : 60, r: 30, t: 80, b: 100 },
    font: { ...original.font, size: compact ? 8 : 12 },
    // Controls live in React's own toolbar, outside Plotly's rendering root.
    ...(animated ? { updatemenus: [], sliders: [] } : {}),
    legend: {
      ...original.legend, title: compact ? { text: '' } : original.legend?.title,
      orientation: 'h', x: 0, xanchor: 'left', y: -0.12, yanchor: 'top',
      font: { size: compact ? 7 : 11 }, ...{ maxheight: compact ? 28 : 100 },
    },
    ...(geographic ? {
      margin: { l: 4, r: compact ? Math.min(140, Math.max(112, width * 0.3)) : 190, t: compact ? 22 : 70, b: 4, ...{ autoexpand: false } },
      legend: {
        ...original.legend, title: { text: 'Land cover', font: { size: compact ? 8 : 11 } },
        orientation: 'v', x: 1.02, xanchor: 'left', y: 1, yanchor: 'top',
        font: { size: compact ? (width < 330 ? 7 : 8) : 11 }, itemsizing: 'constant',
        ...{ maxheight: Math.max(60, height - (compact ? 40 : 90)) },
      },
    } : {}),
    ...(!sunburst && !geographic ? {
      xaxis: { ...original.xaxis, title: compact ? { text: '' } : original.xaxis?.title,
        automargin: false, tickfont: { size: compact ? 8 : 11 },
        ...(original.xaxis?.rangeslider ? { rangeslider: { ...original.xaxis.rangeslider, thickness: compact ? 0.1 : 0.08 } } : {}) },
      yaxis: { ...original.yaxis, title: compact ? { text: '' } : original.yaxis?.title,
        automargin: false, tickfont: { size: compact ? 7 : 11 } },
    } : {}),
    ...(animated ? {
      margin: { l: compact ? (width < 330 ? 76 : 92) : 140, r: compact ? (width < 330 ? 120 : 140) : 180,
        t: compact ? 22 : 80, b: compact ? 36 : 65, ...{ autoexpand: false } },
      xaxis: { ...original.xaxis, showticklabels: true, showline: true, linecolor: '#8492a5',
        ticks: 'outside', ticklen: 2, nticks: compact ? 3 : 5, tickfont: { size: compact ? 7 : 11 },
        title: { text: compact && width < 330 ? 'Relative scale<br>(√counts)' : 'Discoveries (√count relative scale)',
          font: { size: compact ? 8 : 11 }, standoff: compact ? 2 : 6 }, automargin: false },
      yaxis: { ...original.yaxis, title: { text: '' }, tickfont: { size: compact ? (width < 330 ? 6 : 7) : 11 }, automargin: false },
      legend: { ...original.legend, title: { text: 'Meteorite type', font: { size: compact ? 7 : 11 } },
        orientation: 'v', x: 1.03, xanchor: 'left', y: 1, yanchor: 'top',
        font: { size: compact ? 7 : 11 }, itemsizing: 'constant', ...{ maxheight: Math.max(50, height - (compact ? 28 : 90)) } },
    } : {}),
    ...(temporal ? {
      margin: { l: compact ? 48 : 80, r: compact ? 100 : 140, t: compact ? 22 : 80, b: compact ? 76 : 110, ...{ autoexpand: false } },
      xaxis: { ...original.xaxis, showticklabels: true, showline: true, linecolor: '#8492a5',
        tickfont: { size: compact ? 7 : 11 }, nticks: compact ? 3 : 6, automargin: false,
        title: { text: 'Decade', font: { size: compact ? 8 : 11 }, standoff: compact ? 2 : 6 },
        rangeslider: { ...original.xaxis?.rangeslider, thickness: compact ? 0.1 : 0.08 } },
      yaxis: { ...original.yaxis, showticklabels: true, showline: true, linecolor: '#8492a5',
        tickfont: { size: compact ? 7 : 11 }, nticks: compact ? 3 : 6, automargin: false,
        title: { text: compact ? 'Avg/year (log)' : 'Average annual discoveries (log scale)', font: { size: compact ? 8 : 11 }, standoff: compact ? 2 : 6 } },
      legend: { ...original.legend, title: { text: 'Climate', font: { size: compact ? 8 : 11 } },
        orientation: 'v', x: 1.04, xanchor: 'left', y: 1, yanchor: 'top',
        font: { size: compact ? 7 : 11 }, ...{ maxheight: Math.max(60, height - (compact ? 30 : 90)) } },
    } : {}),
  };
}

export default function PlotlyGalleryItem({ src, label }: { src: string; label: string }) {
  const container = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const runtime = useRef<Runtime | null>(null);
  const command = useRef(0);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [frameNames, setFrameNames] = useState<string[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '100px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !host.current) return;
    const controller = new AbortController();
    const target = host.current;
    // Each effect owns a fresh DOM node. Strict Mode cleanup and chart switching
    // can never purge a new chart or remove React's playback toolbar.
    const element = document.createElement('div');
    element.style.cssText = 'width:100%;height:100%;position:relative';
    target.appendChild(element);
    let api: typeof Plotly | undefined;
    let resize: ResizeObserver | undefined;
    let finished: Promise<unknown> = Promise.resolve();
    setStatus('loading');
    setFrameNames([]);
    setFrameIndex(0);
    setPlaying(false);
    setPlaybackError(false);
    const draw = async () => {
      const [module, response] = await Promise.all([
        import('./plotlyRenderer'), fetch(src, { signal: controller.signal }),
      ]);
      if (!response.ok) throw new Error(`Figure request failed: ${response.status}`);
      const figure = await response.json() as Figure;
      if (!Array.isArray(figure.data) || !figure.layout) throw new Error('Invalid figure');
      if (controller.signal.aborted) return;
      api = module.default;
      const frames = figure.frames ?? [];
      setFrameNames(frames.map((frame) => frame.name!));
      // Reserve the toolbar before measuring the canvas or enabling playback.
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      if (controller.signal.aborted) return;
      const compact = target.clientHeight < 340;
      // Titles are already supplied by the gallery caption in compact mode.
      const displayTrace = (trace: Data): Data => {
        if (figure.layout.geo && trace.type === 'scattergeo') return { ...trace, name: 'Meteorite<br>locations' };
        if (!frames.length || !trace.name) return trace;
        const names: Record<string, string> = {
          'Enstatite chondrites': 'Enstatite<br>chondrites',
          'Carbonaceous chondrites': 'Carbonaceous<br>chondrites',
          'Other OC chondrite': 'Other OC<br>chondrite',
        };
        return names[trace.name] ? { ...trace, name: names[trace.name] } : trace;
      };
      const displayFrames = frames.map((frame) => ({
        ...frame, data: frame.data?.map(displayTrace),
        ...(compact ? { layout: { ...frame.layout, title: { text: '' } } } : {}),
      }));
      const displayData = figure.data.map(displayTrace);
      const plot = await api.newPlot(element, displayData,
        fitLayout(figure, target.clientWidth, target.clientHeight),
        { displaylogo: false, displayModeBar: compact ? false : 'hover', scrollZoom: true,
          topojsonURL: new URL('.', new URL(worldMapUrl, window.location.href)).href });
      if (controller.signal.aborted) return;
      if (displayFrames.length) await api.addFrames(plot, displayFrames);
      if (controller.signal.aborted) return;
      runtime.current = { api, element: plot, frames: displayFrames };
      plot.on('plotly_animatingframe', (event: { name: string }) => {
        if (controller.signal.aborted) return;
        const index = frames.findIndex((frame) => frame.name === event.name);
        if (index >= 0) setFrameIndex(index);
      });
      let previousWidth = target.clientWidth;
      let previousHeight = target.clientHeight;
      setStatus('ready');
      resize = new ResizeObserver(() => {
        if (controller.signal.aborted || (target.clientWidth === previousWidth && target.clientHeight === previousHeight)) return;
        previousWidth = target.clientWidth;
        previousHeight = target.clientHeight;
        finished = finished.catch(() => {}).then(() => {
          if (!controller.signal.aborted && api && target.clientWidth && target.clientHeight) {
            const fitted = fitLayout(figure, target.clientWidth, target.clientHeight);
            return api.relayout(plot, { width: fitted.width, height: fitted.height, margin: fitted.margin,
              legend: fitted.legend, font: fitted.font, title: fitted.title,
              ...(fitted.xaxis ? { 'xaxis.title': fitted.xaxis.title, 'xaxis.tickfont': fitted.xaxis.tickfont,
                'xaxis.nticks': fitted.xaxis.nticks, 'yaxis.tickfont': fitted.yaxis?.tickfont } : {}) });
          }
        });
      });
      resize.observe(target);
    };
    finished = draw().catch((cause) => {
      if (!controller.signal.aborted) { console.error('Plotly gallery failed', cause); setStatus('error'); }
    });
    return () => {
      controller.abort();
      command.current += 1;
      runtime.current = null;
      resize?.disconnect();
      element.remove();
      void finished.catch(() => {}).then(() => { api?.purge(element); });
    };
  }, [src, visible, attempt]);

  const animate = async (names: string[], play = false) => {
    const current = runtime.current;
    if (!current) return;
    const id = ++command.current;
    setPlaying(play);
    setPlaybackError(false);
    try {
      await current.api.animate(current.element, names, {
        mode: 'immediate', frame: { duration: play ? 100 : 0, redraw: true }, transition: { duration: 0 },
      });
      if (id === command.current) setPlaying(false);
    } catch {
      if (id === command.current) { setPlaying(false); setPlaybackError(true); }
    }
  };

  return <div ref={container} className="plotly-gallery-item nodrag nopan nowheel" aria-label={label}>
    <div ref={host} className="plotly-gallery-canvas" />
    {status !== 'ready' && <div className="plotly-gallery-status" role={status === 'error' ? 'alert' : 'status'}>
      {status === 'error' ? <><span>This chart could not load.</span><button type="button" onClick={() => setAttempt((value) => value + 1)}>Retry</button></> : 'Loading chart…'}
    </div>}
    {!!frameNames.length && <div className="plotly-gallery-playback" aria-label="Discovery animation controls">
      <button type="button" disabled={status !== 'ready'} onClick={() => {
        if (playing) { void animate([]); return; }
        const start = frameIndex === frameNames.length - 1 ? 0 : frameIndex;
        void animate(frameNames.slice(start), true);
      }}>{playing ? 'Pause' : 'Play'}</button>
      <button type="button" disabled={status !== 'ready'} onClick={() => { setFrameIndex(0); void animate([frameNames[0]]); }}>Restart</button>
      <label><span>Year <output>{frameNames[frameIndex]}</output></span>
        <input type="range" disabled={status !== 'ready'} aria-label="Discovery year" aria-valuetext={frameNames[frameIndex]}
          min={0} max={frameNames.length - 1} value={frameIndex}
          onChange={(event) => { const index = Number(event.target.value); setFrameIndex(index); void animate([frameNames[index]]); }} />
      </label>
      {playbackError && <span role="alert">Playback failed. Try again.</span>}
    </div>}
  </div>;
}
