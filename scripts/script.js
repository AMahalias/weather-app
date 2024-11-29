const weatherBlocksContainer = document.getElementById('weather-blocks');
const addBlockButton = document.getElementById('add-block');
const mainTabButton = document.getElementById('view-main');
const favoritesTabButton = document.getElementById('view-favorites');
const favoritesSection = document.getElementById('favorites');

let weatherBlocks = [];

// cities list
function displayAutocomplete(cities, element, blockId) {
    element.innerHTML = '';
    cities.forEach(city => {
        const li = document.createElement('li');
        li.textContent = `${city.name}, ${city.country}`;
        li.addEventListener('click', async () => {
            const data = await fetchCurrentWeather(city);
            await displayWeather(data, city, blockId);
        });
        element.appendChild(li);
    });
}


// weather blocks
function createWeatherBlock(id) {
    const block = document.createElement('div');
    block.className = 'weather-block';
    block.id = `block-${id}`;
    const deleteButtonHTML = id !== 1 ? `<button class="delete-btn">x</button>` : '';

    block.innerHTML = `
        <input type="text" placeholder="Введіть місто..." class="city-input" />
        <ul class="autocomplete-list"></ul>
        <button class="favorite-btn">&#9733;</button>
        ${deleteButtonHTML}
        <h2 class="city-name"></h2>
        <div class="weather-info"></div>
        <canvas id="temp-chart"></canvas>
    `;

    block.querySelector('.city-input').addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        const autocompleteList = block.querySelector('.autocomplete-list');

        if (query.length < 3) {
            autocompleteList.innerHTML = '';
            return;
        }

        const cities = await fetchCities(query);
        displayAutocomplete(cities, autocompleteList, id);
    });

    if (id !== 1) {
        block.querySelector('.delete-btn').addEventListener('click', () => {
            function confirmBtnCallback () {
                deleteBlock(id)
            }

            showModal('Ви впевнені, що хочете видалити цю картку?', confirmBtnCallback, id);
        });
    }
    block.querySelector('.favorite-btn').addEventListener('click', () => toggleFavorite(id));

    weatherBlocksContainer.appendChild(block);
    weatherBlocks.push(id);

    block.scrollIntoView({ behavior: 'smooth' });
}

function deleteBlock(id) {
    const block = document.getElementById(`block-${id}`);
    block.remove();
    weatherBlocks = weatherBlocks.filter(blockId => blockId !== id);
}

// weather
async function displayWeather(data, city, blockId) {
    const block = document.getElementById(`block-${blockId}`);
    const cityInput = block.querySelector('.city-input');
    const cityName = block.querySelector('.city-name');
    const weatherInfoDiv = block.querySelector('.weather-info');
    const autocompleteList = block.querySelector('.autocomplete-list');
    const tempChartCanvas = block.querySelector('#temp-chart');

    cityInput.value = city.name;
    autocompleteList.innerHTML = '';
    const { temp, feels_like, humidity } = data.main;
    const weatherDescription = data.weather[0].description;

    const cityForDataset = {
        name: city.name,
        lon: city.lon,
        lat: city.lat,
    }
    block.setAttribute('data-city', JSON.stringify(cityForDataset));
    cityName.innerHTML = city.name;
    weatherInfoDiv.innerHTML = `Temperature: ${temp}°C, Feels like: ${feels_like}°C, ${weatherDescription}, Humidity: ${humidity}%`;

    toggleActiveFavoriteBtn(block, city.name);
    block.classList.remove('hidden');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                renderChart(city, tempChartCanvas);
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(tempChartCanvas);
    await renderChart(city, tempChartCanvas);
}

// listeners
addBlockButton.addEventListener('click', () => {
    if (weatherBlocks.length >= MAX_BLOCKS) {
        showModal(`You can only have a maximum of ${MAX_BLOCKS} weather blocks.`);
        return;
    }

    const blockId = Date.now();
    createWeatherBlock(blockId);
});

mainTabButton.addEventListener('click', () => {
    weatherBlocksContainer.classList.add('active');
    weatherBlocksContainer.classList.remove('hidden');
    favoritesSection.classList.add('hidden');
    favoritesSection.classList.remove('active');
    addBlockButton.classList.remove('hidden');
});

favoritesTabButton.addEventListener('click', () => {
    favoritesSection.classList.add('active');
    favoritesSection.classList.remove('hidden');
    weatherBlocksContainer.classList.add('hidden');
    weatherBlocksContainer.classList.remove('active');
    addBlockButton.classList.add('hidden');
});

createWeatherBlock(1);
