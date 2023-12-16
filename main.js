var time_current = 0;
var hasFetched = false;
var intervalId; // Variable to store the interval ID

function updateTime() {
  if (hasFetched) {
    clearInterval(intervalId); // Use the correct variable here
  }
  document.getElementById('duration').innerHTML =
    'Time spent: ' + time_current + 's';
  time_current++;
}

intervalId = setInterval(updateTime, 1000);

async function fetchData() {
  try {
    const response = await fetch(
      'http://localhost:3000/simadds/liveries/msfsAddons'
    );

    if (!response.ok) {
      throw new Error(
        `Server returned ${response.status} ${response.statusText}`
      );
    }

    console.log(response);
    const data = await response.json();

    const liveryData = data.allMostDownloaded;
    console.log(liveryData);
    const time = data.duration;
    console.log(time);
    hasFetched = true;

    const liveriesList = document.getElementById('liveriesList');
    const durationSpan = document.getElementById('duration'); // Get the existing span

    durationSpan.innerHTML = 'Time spent: ' + time / 1000 + 's'; // Update existing span

    liveriesList.innerHTML = '';
    liveryData.forEach((livery) => {
      const liveryItem = document.createElement('div');
      console.log(livery);
      liveryItem.innerHTML = `
            <h2>${livery.titleValue}</h2>
            <a href="${livery.titleLinkHref}" target="_blank">
              <img src="${livery.imageSrc}" alt="${livery.titleValue}" />
            </a>
          `;
      liveriesList.appendChild(liveryItem);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchData();
