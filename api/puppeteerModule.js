import puppeteer from 'puppeteer';

const url = 'https://msfsaddons.com/liveries/';

const getLiveriesMsfsAddons = async () => {
  const startTime = new Date(); // Record start time

  const browser = await puppeteer.launch({
    defaultViewport: { width: 3840, height: 2160 },
    headless: true // Use headless mode
  });
  const page = await browser.newPage();

  try {
    await page.goto(url);

    // Close the cookie popup if it exists
    const cookiePopupButton = await page.waitForSelector('#ez-accept-all', {
      timeout: 5000
    });
    if (cookiePopupButton) {
      await cookiePopupButton.click();
      await page.waitForTimeout(2000);
    }
  } catch (error) {
    console.error(
      'Error navigating to the page or handling cookie popup:',
      error
    );
  }

  // Take a screenshot to check if the popup is closed
  await page.screenshot({ path: 'screenshots/checkIfCorrect.png' });

  // Add some waiting time before continuing
  await page.waitForTimeout(3000);

  console.log('Here 0');

  // Continue with your original logic
  let allMostDownloaded = [];

  let i = 0; // Declare and initialize i

  while (true) {
    try {
      await page.waitForSelector('article > div');

      // Scroll through 0%, 30%, 60%, and 100%
      for (let scrollPercentage of [0, 30, 60, 100]) {
        await page.evaluate((scrollPercentage) => {
          window.scrollTo(
            0,
            document.body.scrollHeight * (scrollPercentage / 100)
          );
        }, scrollPercentage);

        // Take a screenshot with the specified name
        const screenshotName = `Pg${
          i + 1
        }Scr${scrollPercentage}-Scraper-Test.png`;
        await page.screenshot({ path: `screenshots/${screenshotName}` });
        console.log(`Screenshot taken: ${screenshotName}`);

        await page.waitForTimeout(1500); // Add a waiting time after each scroll
      }

      const currentPageData = await page.evaluate(async () => {
        // Wait for the selector inside the page.evaluate
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const tiles = document.querySelectorAll('article > div');

        console.log('Tiles: ', tiles);

        const promises = Array.from(tiles)
          .slice(0, 50)
          .map(async (node) => {
            console.log('Node: ', node);
            const titleLink = node.querySelector(
              '.post-content-block > header > h2 > a'
            );
            const image = node.querySelector(
              '.post-img-block > figure > a > img'
            );
            console.log('Data: ', titleLink, ', ', image);

            const imageSrc = image.src;
            const titleValue = titleLink.innerHTML;
            const titleLinkHref = titleLink.href;

            return { titleValue, titleLinkHref, imageSrc };
          });

        return Promise.all(promises);
      });

      allMostDownloaded = allMostDownloaded.concat(currentPageData);

      // Click the "next" button
      const nextButton = await page.$('a.next');
      if (nextButton) {
        await nextButton.click();
        await page.waitForTimeout(3000); // Add some waiting time before continuing
        i++; // Increment i
      } else {
        console.log('No more "next" button found. Exiting loop.');
        break;
      }
    } catch (error) {
      console.error('Error during scraping:', error);
      // Add more specific error handling if needed
    }
  }

  const endTime = new Date(); // Record end time
  const duration = endTime - startTime;
  console.log(`Scraping completed in ${duration} milliseconds.`);

  // Close the browser after processing all pages
  await browser.close();

  return { allMostDownloaded, duration };
};

export default getLiveriesMsfsAddons;
