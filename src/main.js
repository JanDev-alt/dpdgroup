import {
  getDataJson,
  initBrowser,
  acceptCookie,
  getParcelInfo,
  delay,
  formatDataAndPost,
  getLastIdx,
  saveDataAsJson,
} from './utils/index.js';
import { API_GET, ITEMS_PER_SESSION, MAX_RETRIES_OPEN_BROWSER } from './constants.js';

async function main() {
  try {
    const parcels = await getDataJson(API_GET);
    const totalParcels = parcels.length;
    const totalSession = Math.ceil(totalParcels / ITEMS_PER_SESSION);
    console.log('Total parcels->', parcels.length, '\nTotal session->', totalSession);
    let session = 0;
    let retriesOpenBrowser = 0;
    while (session < totalSession) {
      try {
        const browser = await initBrowser();
        await delay(2000);
        await acceptCookie(browser);
        console.log('Session', session + 1);
        const lastIdx = getLastIdx(session, ITEMS_PER_SESSION, totalParcels);
        for (let idx = session * ITEMS_PER_SESSION; idx < lastIdx; idx++) {
          const parcel = parcels[idx];
          try {
            const parcelInfo = await getParcelInfo(browser, parcel);
            parcels[idx] = parcelInfo;
            await delay(7000);
            console.log(idx);
            console.log(parcelInfo)
          } catch (error) {
            parcel.status = 'Not found';
            continue;
          }
        }
        await browser.close();
        await delay(300000);
        session++;
      } catch (error) {
        retriesOpenBrowser++;
        if (retriesOpenBrowser === MAX_RETRIES_OPEN_BROWSER) {
          for (let idx = session * ITEMS_PER_SESSION; idx < lastIdx; idx++) {
            parcels[idx].status = 'Not found';
          }
          session++;
          retriesOpenBrowser = 0;
        }
        console.log('Faild start browser at session', error);
        await browser.close();
      }
    }
    await delay(5000);
    try {
      await formatDataAndPost(parcels);
    } catch (error) {
      console.log('post error');
    }
  } catch (error) {
    console.log('init data error');
  }
}
await main();
