// Requires Playwright and a Chrome/Chromium browser. See docs/plotly-gallery.md.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const base = process.env.GALLERY_BASE_URL || 'http://127.0.0.1:5176';
const slug = 'mapping-meteorites-through-geospatial-data-analytics';
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`${base}/projects/${slug}`);
      const gallery = page.locator('.project-gallery');
      await gallery.scrollIntoViewIfNeeded();
      const choose = async (index) => {
        await gallery.locator('.project-gallery-thumbnails button').nth(index).click();
        console.log('SELECT', width, index);
        if (index !== 1) await page.waitForFunction(() => document.querySelector('.project-gallery-stage .js-plotly-plot')?.calcdata && !document.querySelector('.project-gallery-stage .plotly-gallery-status'));
        const count = await gallery.locator('.project-gallery-position').boundingBox();
        assert(count.width < 65 && count.height < 30, 'Gallery counter must never cover the chart');
      };
      await choose(1);
      await page.waitForFunction(() => document.querySelector('.project-gallery-stage img')?.naturalWidth > 0);
      const original = await gallery.locator('.project-gallery-stage').boundingBox();
      await choose(2);
      const controls = gallery.locator('.plotly-gallery-playback');
      await controls.getByRole('button', { name: 'Play', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('.plotly-gallery-playback output')?.textContent !== '1803');
      await controls.getByRole('button', { name: 'Pause', exact: true }).click();
      await choose(3);
      assert(await gallery.locator('.scatterlayer .js-line').count() > 0, 'Trend lines render');
      assert(await gallery.locator('.rangeslider-container').count() > 0, 'Trend range slider renders');
      await choose(0);
      assert(await gallery.locator('.geo .choroplethlayer path').count() > 0, 'Country boundaries render from local topology');
      const globe = gallery.locator('.geo .bg');
      const geoBounds = await globe.boundingBox();
      const before = await page.evaluate(() => document.querySelector('.project-gallery-stage .js-plotly-plot')._fullLayout.geo.projection.rotation.lon);
      await page.mouse.move(geoBounds.x + geoBounds.width * 0.5, geoBounds.y + geoBounds.height * 0.5);
      await page.mouse.down();
      await page.mouse.move(geoBounds.x + geoBounds.width * 0.65, geoBounds.y + geoBounds.height * 0.5, { steps: 8 });
      await page.mouse.up();
      const after = await page.evaluate(() => document.querySelector('.project-gallery-stage .js-plotly-plot')._fullLayout.geo.projection.rotation.lon);
      assert.notEqual(before, after, 'Globe rotates on drag');
      const stage = await gallery.locator('.project-gallery-stage').boundingBox();
      assert(Math.abs(original.height - stage.height) < 1, 'Charts preserve original gallery dimensions');
      assert.equal(await gallery.locator('.project-gallery-thumbnails button').count(), 4, 'Gallery contains the four selected visualisations');
      await page.getByRole('button', { name: 'Expand Global Meteorite Distribution' }).click();
      await page.getByRole('dialog').locator('.legend').waitFor();
      await page.getByRole('button', { name: 'Close expanded gallery item' }).click();
      await gallery.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('.project-gallery-stage .js-plotly-plot')?.calcdata);
      assert.deepEqual(errors, [], 'No browser runtime errors');
      console.log(`PASS ${width}px: visible charts, playback, globe rotation, GIF, expansion and original dimensions`);
      await page.close();
    }
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    await page.goto(`${base}/projects/uncertainty-aware-depression-decision-support`);
    await page.locator('.project-gallery-stage img').waitFor();
    await page.locator('.project-gallery-expand').click();
    await page.getByRole('dialog').locator('img').waitFor();
    await page.getByRole('button', { name: 'Close expanded gallery item' }).click();
    console.log('PASS existing image gallery and expansion');
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
