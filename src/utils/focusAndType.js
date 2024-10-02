export async function focusAndType(page, selector, text) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.focus(selector);
      await page.type(selector, text, { delay: 200 });
      return;
    } catch (error) {
      console.log(`Attempt ${attempt + 1} failed: ${error}`);
      await delay(5000);
    }
  }
  throw new Error(`Failed to focus and type in ${selector}`);
}
