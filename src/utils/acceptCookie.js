import { delay } from './index.js';
import { DONOR_LINK } from '../constants.js';

export async function acceptCookie(browser) {
  try {
    const page = await browser.newPage();
    await page.goto(DONOR_LINK, {
      waitUntil: 'domcontentloaded',
    });
    await delay(8000);
    const acceptCookiesBtn = await page.$('#popin_tc_privacy_button');
    if (acceptCookiesBtn) {
      await acceptCookiesBtn.click();
    }
    await delay(2000);
    await page.close();
    await delay(2000);
  } catch (err) {
    console.error('Failed to accept cookies:', err);
  }
}
