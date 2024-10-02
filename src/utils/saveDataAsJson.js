import fs from 'fs';
import path from 'path';

export async function saveDataAsJson(filePath, data) {
  try {
    const absolutePath = path.resolve(filePath) + '.json';
    await fs.promises.writeFile(absolutePath, JSON.stringify(data, null, 2));
    console.log(`File was saved successfully: ${absolutePath}`);
  } catch (err) {
    console.error(`Error saving file: ${err}`);
    throw err;
  }
}
