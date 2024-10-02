import { delay, focusAndType, notFoundParcel } from './index.js';
import { DONOR_LINK } from '../constants.js';

export async function getParcelInfo(browser, parcel) {
  const { number, index } = parcel;
  if (!number) {
    return notFoundParcel(parcel);
  }
  let page;
  try {
    page = await browser.newPage();
    try {
      await page.goto(DONOR_LINK, {
        waitUntil: 'domcontentloaded',
      });
      await delay(8000);
      await focusAndType(page, '#searchParcel', number);
      await page.keyboard.press('Enter');
    } catch (error) {
      return notFoundParcel(parcel);
    }
    await delay(10000);
    try {
      const parcelInfoShortStatus = await page.evaluate(() => {
        const notFound = document.querySelector('h2.title-header')?.textContent;
        if (notFound) {
          return false;
        }
        const statusShort = [...document.querySelectorAll('.parcelStatus>.row')].reduce(
          (acc, curr) => {
            const etap = curr.querySelector('div:first-child>span')?.textContent || '';
            const completionDate = curr.querySelector('div:last-child>span')?.textContent || '';
            acc.push({ etap, time: completionDate });
            return acc;
          },
          []
        );

        return statusShort;
      });
      if (!parcelInfoShortStatus) {
        return notFoundParcel(parcel);
      }
      parcel.delliveryEtaps = parcelInfoShortStatus;
    } catch (error) {
      return notFoundParcel(parcel);
    }
    await delay(3000);
    try {
      await focusAndType(page, '#verificationCode', index);
      await page.keyboard.press('Enter');
    } catch (error) {
      return notFoundParcel(parcel);
    }
    await delay(7000);
    try {
      const parcelMainInfo = await page.evaluate(() => {
        const mainInfo = [...document.querySelectorAll('.detailsBox .grid .mb-15')].reduce(
          (acc, curr) => {
            const key = curr.querySelector('p:first-child')?.textContent?.replace(':', '') || '';
            const value = [...curr.querySelectorAll('p:not(:first-child)')]
              .map(it => it?.textContent?.replace(/\\n/g, '')?.trim() || '')
              .join('|');
            acc[key] = value;
            return acc;
          },
          {}
        );
        const parcelStatus = document.querySelector(
          '.parcel-list>li.active .gray-out>span'
        )?.innerText;
        mainInfo.status = parcelStatus;
        return mainInfo;
      });
      parcel = { ...parcel, ...parcelMainInfo };
    } catch (error) {
      delete parcel.delliveryEtaps;
      return notFoundParcel(parcel);
    }
    await delay(7000);
    const delliveryBtn = await page.$('.et_icn-ec_pst-ef_lne');
    if (delliveryBtn) {
      await delliveryBtn.click();
    }
    await delay(7000);
    const parcelDelliveryInfo = await page.evaluate(() => {
      const delliveryInfo = [...document.querySelectorAll('.content-holder>.content-item')].map(
        it => {
          const time = [...it.querySelectorAll('.content-item-time p')]
            .map(el => el?.textContent?.trim() || '')
            .join('|');
          const info = [...it.querySelectorAll('.content-item-meta p')]
            .map(el => el?.textContent?.trim().replace(/\n/g, '') || '')
            .join('|');
          console.log(time);
          console.log(info);
          return { time, info };
        }
      );
      return delliveryInfo;
    });
    parcel.delliveryInfo = parcelDelliveryInfo;
    return parcel;
  } catch (error) {
    console.log(error);
    return parcel;
  } finally {
    if (page) {
      await page.close();
    }
    await delay(10000);
  }
}
