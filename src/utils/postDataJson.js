export async function postDataJson(link = '', data = []) {
  try {
    const response = await fetch(link, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res = await response.json();
    return res;
  } catch (err) {
    console.log('Faild post data', err);
    throw err;
  }
}
