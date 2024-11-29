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
        <div class="view-mode">
            <button id="day-view" class="view-btn active">День</button>
            <button id="week-view" class="view-btn">Тиждень</button>
        </div>
        ${createWeatherInfoHTML()}
    `;

        favoritesContainer.appendChild(block);

        const dayButton = block.querySelector('#day-view');
        const weekButton = block.querySelector('#week-view');
        const chartElement = block.querySelector('#temp-chart');

        if (dayButton && weekButton) {
            dayButton.addEventListener('click', async () => {
                dayButton.classList.add('active');
                weekButton.classList.remove('active');
                await updateWeatherInfo(city, 'day', block, chartElement);
            });

            weekButton.addEventListener('click', async () => {
                weekButton.classList.add('active');
                dayButton.classList.remove('active');
                await updateWeatherInfo(city, 'week', block, chartElement);
            });
        }

            updateWeatherInfo(city, 'day', block, chartElement);
        });
}

async function updateWeatherInfo(city, mode, block, chartElement) {
    try {
        const weatherData = await fetchCurrentWeather(city);

        updateWeatherInfoData(block, city, weatherData);
        if (mode === 'day') {
            await renderChart(city, chartElement);
        } else if (mode === 'week') {
            await renderWeekChart(city, chartElement);
        }
    } catch (error) {
        throw new Error(`Error fetching weather data: ${error.message}`);
    }
}


function toggleFavorite(blockId) {
    const block = document.getElementById(`block-${blockId}`);
    const inputField = block.querySelector('.city-input');
    const cityName = inputField ? inputField.value.trim() : '';

    if (!cityName) {
        showModal('Не можна додати пусте місто до обраних. Введіть місто та оберіть серед запропонованих');
        return;
    }
    const city = JSON.parse(block.getAttribute('data-city'));
    const existingCity = favoriteCities.find(fav => fav.name === city.name);

    if (existingCity) {
        favoriteCities = favoriteCities.filter(fav => fav.name !== city.name);
    } else {
        if (favoriteCities.length >= 5) {
            const needDeletedCity = favoriteCities[favoriteCities.length - 1].name;
            const modalMessage = `Для додавання видаліть місто "${needDeletedCity}", тому що максимум 5`;

            function confirmDeleteBtnCallback () {
                favoriteCities.pop();
                favoriteCities.push(city);
                updateFavoritesStorage();
                displayFavoriteBlocks();
                toggleActiveFavoriteBtn(block, city.name)
            }

            showModal(modalMessage, confirmDeleteBtnCallback, blockId);
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