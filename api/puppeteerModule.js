import puppeteer from 'puppeteer';

const getLiveriesMsfsAddons = async () => {
  const url = 'https://msfsaddons.com/liveries/';
  const startTime = new Date(); // Record start time

  const browser = await puppeteer.launch({
    defaultViewport: { width: 3840, height: 2160 },
    headless: true // Use headless mode
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, { timeout: 100000000 });

    // Close the cookie popup if it exists
    const cookiePopupButton = await page.waitForSelector('#ez-accept-all', {
      timeout: 10000000
    });
    if (cookiePopupButton) {
      await cookiePopupButton.click();
      await page.waitForTimeout(2000);
    } else {
      console.log('No cookie Popup!');
    }
  } catch (error) {
    console.error(
      'Error navigating to the page or handling cookie popup:',
      error
    );
  }

  // Take a screenshot to check if the popup is closed
  

  console.log('Here 0');

  // Continue with your original logic
  let allMostDownloaded = [];

  let i = 0; // Declare and initialize i

  while (i < 11) {
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


        await page.waitForTimeout(100); // Add a waiting time after each scroll
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
            const num = node.querySelector('.day').innerHTML;
            console.log('Data: ', titleLink, ', ', image);

            const imageSrc = image.src;
            const titleValue = titleLink.innerHTML;
            const titleLinkHref = titleLink.href;

            return { titleValue, titleLinkHref, imageSrc, num };
          });

        return Promise.all(promises);
      });

      allMostDownloaded = allMostDownloaded.concat(currentPageData);

      // Click the "next" button
      const nextButton = await page.$('a.next');
      if (nextButton) {
        await nextButton.click();
        await page.waitForSelector('.post-content-block', { timeout: 100000 });
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

const getLiveriesXplane = async () => {
  const url = 'https://forums.x-plane.org/index.php?/files/';
  const startTime = new Date(); // Record start time
  let allMostDownloaded;

  const browser = await puppeteer.launch({
    defaultViewport: { width: 3840, height: 2160 },
    headless: true // Use headless mode
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, { timeout: 100000000 });

    // Close the cookie popup if it exists
  } catch (error) {
    console.error(
      'Error navigating to the page or handling cookie popup:',
      error
    );
    // Handle the error more gracefully, e.g., retry or exit
    await browser.close();
    return { error: 'Navigation error' };
  }

  // Take a screenshot to check if the popup is closed
  await page.screenshot({ path: 'screenshots/checkIfCorrectXplane.png' });

  // Continue with your original logic

  let i = 0; // Declare and initialize i

  while (i < 11) {
    try {
      await page.waitForSelector('li.ipsCarousel_item');

      const currentPageData = await page.evaluate(async () => {
        // Wait for the selector inside the page.evaluate
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const tiles = document.querySelectorAll('li.ipsCarousel_item');

        console.log('Tiles: ', tiles);

        const promises = Array.from(tiles)
          .slice(0, 75)
          .map(async (node) => {
            console.log('Node: ', node);
            const titleLink = node.querySelector('div > h3 > a');
            const image = node.querySelector('img');
            let num = 0;
            if (
              node.querySelector(
                '.cDownloadsCarouselItem_info.ipsSpacer_top.ipsSpacer_half > .ipsType_medium > span'
              )
            ) {
              var tempElement = document.createElement('span');
              tempElement.innerHTML = node.querySelector('span').innerHTML =
                node.querySelector(
                  '.cDownloadsCarouselItem_info.ipsSpacer_top.ipsSpacer_half > .ipsType_medium > span'
                ).innerHTML;

              // Remove the <i> element from the temporary element
              var iElement = tempElement.querySelector('i');
              if (iElement) {
                iElement.parentNode.removeChild(iElement);
              }

              num = tempElement.innerHTML.replace(/\s/g, '');
            }

            if (titleLink && image) {
              const imageSrc = image.src;
              const titleValue = titleLink.innerText;
              const titleLinkHref = titleLink.href;
              console.log(imageSrc, titleValue, titleLinkHref);
              return { titleValue, titleLinkHref, imageSrc, num };
            } else {
              console.error('Title link or image not found.');
              return null;
            }
          });

        return Promise.all(promises);
      });

      allMostDownloaded = currentPageData;

      break;
    } catch (error) {
      console.error('Error during scraping:', error);
      // Add more specific error handling if needed
      break; // Break out of the loop on error
    }
  }

  const endTime = new Date(); // Record end time
  const duration = endTime - startTime;
  console.log(`Scraping completed in ${duration} milliseconds.`);

  // Close the browser after processing all pages
  await browser.close();

  return { allMostDownloaded, duration };
};

export { getLiveriesMsfsAddons, getLiveriesXplane };
