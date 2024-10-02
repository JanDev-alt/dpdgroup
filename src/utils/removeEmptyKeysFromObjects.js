export function removeEmptyKeysFromObjects(arr) {
  return arr.map(obj => {
    Object.keys(obj).forEach(key => {
      if (obj[key] === '') {
        delete obj[key];
      }
    });
    return obj;
  });
}
