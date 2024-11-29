const favoritesContainer = document.getElementById('favorite-blocks');
const viewFavoritesButton = document.getElementById('view-favorites');
const favoritesTab = document.getElementById('favorites');

let favoriteCities = JSON.parse(localStorage.getItem('favorites')) || [];
const MAX_BLOCKS = 5;

function updateFavoritesStorage() {
    localStorage.setItem('favorites', JSON.stringify(favoriteCities));
}

async function displayFavoriteBlocks () {
    favoritesContainer.innerHTML = '';

    favoriteCities.forEach(city => {
        const block = document.createElement('div');
        block.className = 'weather-fav-block';
        block.innerHTML = `
        <h2>${city.name}</h2>
        <div class="view-mode">
            <button id="day-view" class="view-btn active">День</button>
            <button id="week-view" class="view-btn">Тиждень</button>
        </div>
        <div class="weather-info"></div>
         <canvas class="weather-chart"></canvas>
    `;

        favoritesContainer.appendChild(block);

        const dayButton = block.querySelector('#day-view');
        const weekButton = block.querySelector('#week-view');
        const weatherInfo = block.querySelector('.weather-info');
        const chartElement = block.querySelector('.weather-chart');

        if (dayButton && weekButton) {
            dayButton.addEventListener('click', async () => {
                dayButton.classList.add('active');
                weekButton.classList.remove('active');
                await updateWeatherInfo(city, 'day', weatherInfo, chartElement);
            });

            weekButton.addEventListener('click', async () => {
                weekButton.classList.add('active');
                dayButton.classList.remove('active');
                await updateWeatherInfo(city, 'week', weatherInfo, chartElement);
            });
        }

            updateWeatherInfo(city, 'day', weatherInfo, chartElement);
        });
}

async function updateWeatherInfo(city, mode, weatherInfoElement, chartElement) {
    try {
        const weatherData = await fetchCurrentWeather(city);

        if (mode === 'day') {
            const { main: { temp, feels_like, humidity }, weather } = weatherData;
            const description = weather[0].description;

            weatherInfoElement.innerHTML = `
                <p>Temperature: ${temp}°C</p>
                <p>Feels like: ${feels_like}°C</p>
                <p>Humidity: ${humidity}%</p>
                <p>${description}</p>
            `;

            await renderChart(city, chartElement);
        } else if (mode === 'week') {
            weatherInfoElement.innerHTML = `<div>Weekly Forecast</div>`;
            await renderWeekChart(city, chartElement);
        }
    } catch (error) {
        weatherInfoElement.innerHTML = `<p>Error fetching weather data: ${error.message}</p>`;
    }
}


function toggleFavorite(blockId) {
    const block = document.getElementById(`block-${blockId}`);
    const city = JSON.parse(block.getAttribute('data-city'));

    const existingCity = favoriteCities.find(fav => fav.name === city.name);

    if (existingCity) {
        favoriteCities = favoriteCities.filter(fav => fav.name !== city.name);
    } else {
        if (favoriteCities.length >= 5) {
            modalMessage.textContent = `Для додавання видаліть місто "${favoriteCities[favoriteCities.length - 1].name}", тому що максимум 5`;
            modal.classList.remove('hidden');

            confirmDeleteButton.onclick = () => {
                favoriteCities.pop();
                favoriteCities.push(city);
                updateFavoritesStorage();
                displayFavoriteBlocks();
                modal.classList.add('hidden');
            };

            cancelDeleteButton.onclick = () => {
                modal.classList.add('hidden');
            };

            return;
        }

        favoriteCities.push(city);
    }

    updateFavoritesStorage();
    updateWeatherBlock(city);
    displayFavoriteBlocks();
}

function toggleActiveFavoriteBtn(block, name) {
    const favoriteBtn = block.querySelector('.favorite-btn');

    if (favoriteCities.some(favCity => favCity.name === name)) {
        favoriteBtn.classList.add('active');
    } else {
        favoriteBtn.classList.remove('active');
    }
}

function updateWeatherBlock(city) {
    const weatherBlocks = document.querySelectorAll('.weather-block');

    weatherBlocks.forEach(block => {
        const cityName = block.querySelector('.city-name').textContent;

        if (cityName === city.name) {
            toggleActiveFavoriteBtn(block, city.name)
        }
    });
}

// listeners
document.addEventListener('DOMContentLoaded', () => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoriteCities = storedFavorites.map(city => ({
        name: city.name,
        local_names: city.local_names || {},
        lat: city.lat,
        lon: city.lon
    }));
    displayFavoriteBlocks();

    viewFavoritesButton.addEventListener('click', () => {
        favoritesTab.classList.toggle('hidden');
    });
});