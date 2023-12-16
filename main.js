var time_current = 0;
var hasFetched = false;
var intervalId; // Variable to store the interval ID

function compareByNum(a, b) {
  if (a == null || b == null) {
    return 0;
  }
  const numA = parseInt((a.num || '0').replace(/,/g, '')); // Convert '539,234' to 539234
  const numB = parseInt((b.num || '0').replace(/,/g, ''));

  if (numA < numB) {
    console.log(-1);
    return -1;
  } else if (numA > numB) {
    console.log(1);
    return 1;
  } else {
    return 0;
  }
}

async function fetchDataFlightsim() {
  try {
    const response = await fetch(
      'http://localhost:3000/simadds/liveries/xplane'
    );

    if (!response.ok) {
      throw new Error(
        `Server returned ${response.status} ${response.statusText}`
      );
    }

    let data = await response.json();

    let liveryData = data.allMostDownloaded;
    console.log('Flightsim: ', liveryData);
    let time = data.duration;
    console.log('Flightsim: ', time);
    return { liveryData, time };
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function updateTime() {
  if (hasFetched) {
    clearInterval(intervalId);
    return;
  }
  document.getElementById('duration').innerHTML =
    'Time spent: ' + time_current + 's';
  time_current++;
}

intervalId = setInterval(updateTime, 1000);

async function fetchDataMsfs() {
  try {
    const { liveryData: liveryData2, time: time2 } = await fetchDataFlightsim();
    const response = await fetch(
      'http://localhost:3000/simadds/liveries/msfsAddons'
    );

    if (!response.ok) {
      throw new Error(
        `Server returned ${response.status} ${response.statusText}`
      );
    }

    console.log(response);
    let data = await response.json();

    let liveryData = data.allMostDownloaded;
    console.log(liveryData);
    let time = data.duration;
    console.log(time);
    hasFetched = true;

    await liveryData.push(...liveryData2); // Spread the elements of liveryData2 into liveryData
    time += time2;

    const liveriesList = document.getElementById('liveriesList');
    const durationSpan = document.getElementById('duration'); // Get the existing span

    durationSpan.innerHTML = 'Time spent: ' + time / 1000 + 's';

    console.log(durationSpan.innerHTML); // Update existing span

    // Sort liveryData based on the 'num' property
    liveryData.sort(compareByNum);
    console.log(liveryData);

    liveriesList.innerHTML = '';
    liveryData.forEach((livery) => {
      if (livery == null) return;
      const liveryItem = document.createElement('div');
      console.log(livery);
      liveryItem.innerHTML = `
        <h2>${livery.titleValue}</h2>
        <a href="${livery.titleLinkHref}" target="_blank">
          <img src="${livery.imageSrc}" alt="${livery.titleValue}" />
          <span>${livery.num}</span>
        </a>
      `;
      liveriesList.appendChild(liveryItem);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchDataMsfs();
