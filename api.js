const API_KEY = '5796abbde9106b7da4febfae8c44c232';
const BASE_URL = 'https://api.openweathermap.org';

async function fetchCities(query) {
    const url = `${BASE_URL}/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;
    const response = await fetch(url);
    return response.json();
}

async function fetchCurrentWeather(city) {
    const url = `${BASE_URL}/data/2.5/weather?q=${city.name}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    return response.json();
}

async function fetchHourlyOrWeeklyWeather(city, mode) {
    const { lat, lon } = city;
    const url = `${BASE_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (mode === 'day') {
            if (!data.hourly) {
                throw new Error('Invalid weather data format');
            }

            return {
                labels: data.hourly.map(hour => {
                    const date = new Date(hour.dt * 1000);
                    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
                }),
                data: data.hourly.map(hour => hour.temp)
            };
        } else if (mode === 'week') {
            if (!data.daily) {
                throw new Error('Invalid daily weather data format');
            }

            // Обрабатываем данные на неделю (daily)
            return {
                labels: data.daily.map(day => {
                    const date = new Date(day.dt * 1000);
                    return date.toLocaleDateString();
                }),
                data: data.daily.map(day => day.temp.day)
            };
        } else {
            throw new Error('Invalid mode. Use "day" or "week".');
        }
    } catch (error) {
        console.error('Error fetching hourly weather:', error);
        return { labels: [], data: [] };
    }
}
