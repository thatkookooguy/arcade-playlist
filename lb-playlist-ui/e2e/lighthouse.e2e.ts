import playwright from 'playwright';
import { playAudit } from 'playwright-lighthouse';
import { test as it } from '@playwright/test';

;

it.describe('audit example', () => {
  it('open browser', async () => {
    const browser = await playwright.chromium.launch({
      args: [ '--remote-debugging-port=9222' ]
    });
    const page = await browser.newPage();
    await page.goto('https://thatkookooguy.github.io/arcade-playlist/');

    await playAudit({
      page: page,
      port: 9222,
      thresholds: {
        performance: 92,
        accessibility: 92,
        'best-practices': 92,
        seo: 92,
        pwa: 90
      },
      reports: {
        formats: {
          json: true,
          html: true,
          csv: true
        },
        name: `arcade-playlist-lighthouse--${ new Date().getTime() }`
        // directory: 'path/to/directory' // defaults to `${process.cwd()}/lighthouse`
      }
    });

    await browser.close();
  });
});
