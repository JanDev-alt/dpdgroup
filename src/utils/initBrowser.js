import { connect } from 'puppeteer-real-browser';

export async function initBrowser() {
  try {
    const { browser } = await connect({
      headless: false,
      timeout: 30000,
      connectOption: {
        defaultViewport: {
          width: 1280,
          height: 1080,
        },
      },
      // args: ['--window-size=720,430'],
    });
    return browser;
  } catch (err) {
    console.log('Faild start browser', err);
    throw err;
  }
}
