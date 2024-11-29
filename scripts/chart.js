async function renderChart(city, chartElement) {
    const weatherData = await fetchHourlyOrWeeklyWeather(city, 'day');
    const { labels, data } = weatherData;
    const ctx = chartElement.getContext('2d');

    if (chartElement.offsetWidth === 0 || chartElement.offsetHeight === 0) {
        requestAnimationFrame(() => renderChart(city, chartElement));
        return;
    }

    if (chartElement.chartInstance) {
        chartElement.chartInstance.destroy();
    }

    const newChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Temperature (°C)',
                data,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                fill: true,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                    },
                },
            },
        },
    });

    chartElement.chartInstance = newChart;

    return newChart;
}

async function renderWeekChart(city, chartElement) {
    const weatherData = await fetchHourlyOrWeeklyWeather(city, 'week');
    const { labels, data } = weatherData;
    const ctx = chartElement.getContext('2d');
    // const labels = daily.map(day => new Date(day.dt * 1000).toLocaleDateString());
    // const temperatures = daily.map(day => day.temp.day);

    if (chartElement.chartInstance) {
        chartElement.chartInstance.destroy();
    }

    const newChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Weekly Temperature',
                data,
                borderColor: '#36a2eb',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    chartElement.chartInstance = newChart;

    return newChart;
}
