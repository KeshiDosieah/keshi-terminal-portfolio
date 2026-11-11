import globeUrl from './mapping-meteorites-through-geospatial-data-analytics/global-distribution.json?url';
import fallsAnimationUrl from './mapping-meteorites-through-geospatial-data-analytics/witnessed-found-map.gif?url';
import leaderboardUrl from './mapping-meteorites-through-geospatial-data-analytics/discovery-leaderboard.json?url';
import trendsUrl from './mapping-meteorites-through-geospatial-data-analytics/historical-trends.json?url';

export type GalleryItem = {
  kind?: 'image';
  src: string;
  label: string;
} | {
  kind: 'plotly';
  src: string;
  label: string;
  title: string;
  preview: string;
};

const projectVisualisations: Record<string, GalleryItem[]> = {
  'mapping-meteorites-through-geospatial-data-analytics': [
    { kind: 'plotly', src: globeUrl, title: 'Global Meteorite Distribution', preview: 'ROTATE GLOBE', label: 'Space rocks have been busy. Give the globe a spin to explore where meteorites turned up, with country colours showing the most common land cover among their recorded finds.' },
    { kind: 'image', src: fallsAnimationUrl, label: 'Some arrived with an audience; others waited to be discovered. Watch the years flash by: pink marks witnessed falls, cyan marks later finds, and flashes spotlight each year’s arrivals and discoveries.' },
    { kind: 'plotly', src: leaderboardUrl, title: 'Meteorite Discovery Leaderboard', preview: '210 ANIMATION FRAMES', label: 'Who’s collecting the most cosmic souvenirs? Hit play to follow cumulative discoveries across the top 15 countries. Bars use a square-root scale; hover for the actual counts.' },
    { kind: 'plotly', src: trendsUrl, title: 'Historical Discovery Trends', preview: 'FILTER & ZOOM', label: 'A little cosmic history, climate by climate. Compare average yearly discoveries across the decades, then zoom in with the slider or pick a climate from the legend. The y-axis uses a log scale.' },
  ],
};
export default projectVisualisations;
