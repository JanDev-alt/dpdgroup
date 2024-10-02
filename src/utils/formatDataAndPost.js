import {
  removeEmptyKeysFromObjects,
  postDataJson,
  delay,
  saveDataAsJson,
  getFileName,
} from './index.js';
import { API_POST, MAX_RETRIES_POST } from '../constants.js';
export async function formatDataAndPost(parcels) {
  for (const par of parcels) {
    if (!par.status) {
      par.status = 'Not found';
    }
    if (par.delliveryInfo?.length === 0) {
      delete par.delliveryInfo;
    }
  }
  const parcelsFullInfo = removeEmptyKeysFromObjects(
    parcels.filter(parcel => parcel.status !== 'Order created' && parcel.status !== 'Not found')
  );

  let postStatus = false;
  let countpost = 0;
  // while (!postStatus) {
  //   try {
  //     const postResult = await postDataJson(API_POST, parcelsFullInfo);
  //     if (postResult.status === 'ok') {
  //       postStatus = true;
  //       console.log('POST status->', postResult.status);
  //     }
  //   } catch (error) {
  //     countpost++;
  //     await delay(300000);
  //     if (countpost === MAX_RETRIES_POST) {
  //       const fileName = getFileName();
  //       await saveDataAsJson(fileName, parcelsFullInfo);
  //       break;
  //     }
  //   }
  // }
}
