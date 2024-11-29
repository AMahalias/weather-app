const weatherBlocksContainer = document.getElementById('weather-blocks');
const addBlockButton = document.getElementById('add-block');
const mainTabButton = document.getElementById('view-main');
const favoritesTabButton = document.getElementById('view-favorites');
const favoritesSection = document.getElementById('favorites');

let weatherBlocks = [];

function roundToHalf(value) {
    return Math.round(value * 2) / 2;
}

function createWeatherInfoHTML() {
    return `
        <h2 class="city-name"></h2>
        <div class="weather-info hidden">
            <div class="temperature">
                <span class="temp-value"></span>°C
            </div>
            <div class="temp-feels"></div>
            <div class="weather-description"></div>
            <div class="additional-info">
                <div class="wind">
                    <img src="assets/images/wind-icon.png" alt="Wind" class="wind-icon" />
                    <span class="wind-speed"></span> м/с
                </div>
                <div class="humidity">
                    <img src="assets/images/humidity-icon.png" alt="Humidity" class="humidity-icon" />
                    <span class="humidity-value"></span> %
                </div>
            </div>
        </div>
        <canvas id="temp-chart"></canvas>
    `;
}

function updateWeatherInfoData (block, city, weatherData) {
    const cityName = block.querySelector('.city-name');
    const weatherInfo = block.querySelector('.weather-info');
    const tempElement = block.querySelector('.temp-value');
    const tempFeelsElement = block.querySelector('.temp-feels');
    const descriptionElement = block.querySelector('.weather-description');
    const windElement = block.querySelector('.wind-speed');
    const humidityElement = block.querySelector('.humidity-value');

    const { temp, feels_like, humidity } = weatherData.main;
    const weatherDescription = weatherData.weather[0].description;
    cityName.innerHTML = city.name;
    tempElement.innerHTML = roundToHalf(temp);
    tempFeelsElement.innerHTML = `(feels like ${roundToHalf(feels_like)}°C)`;
    descriptionElement.innerHTML = weatherDescription;
    windElement.innerHTML = weatherData.wind.speed.toFixed(1);
    humidityElement.innerHTML = humidity;

    weatherInfo.classList.remove('hidden');
}

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

// weather
async function displayWeather(data, city, blockId) {
    const block = document.getElementById(`block-${blockId}`);
    const cityInput = block.querySelector('.city-input');
    const autocompleteList = block.querySelector('.autocomplete-list');
    const tempChartCanvas = block.querySelector('#temp-chart');

    cityInput.value = city.name;
    autocompleteList.innerHTML = '';

    const cityForDataset = {
        name: city.name,
        lon: city.lon,
        lat: city.lat,
    }
    block.setAttribute('data-city', JSON.stringify(cityForDataset));
    updateWeatherInfoData(block, city, data);

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

async function createUserWeatherBlock () {
    createWeatherBlock(1);
    const userData = await getUserLocation();
    const cityData = {
        name: userData.city,
        lat: parseFloat(userData.loc.split(',')[0]),
        lon: parseFloat(userData.loc.split(',')[1]),
    }
    const data = await fetchCurrentWeather(cityData);
    await displayWeather(data, cityData, 1);
}

createUserWeatherBlock();
