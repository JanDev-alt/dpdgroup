export async function getDataJson(link, headers = {}) {
  try {
    const response = await fetch(link, headers);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log('Faild to fetch init data', err);
    throw err;
  }
}