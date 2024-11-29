async function renderChart(city, chartElement) {
    const weatherData = await fetchHourlyOrWeeklyWeather(city, 'day');
    const { labels, data } = weatherData;
    const ctx = chartElement.getContext('2d');

    if (chartElement.chartInstance) {
        chartElement.chartInstance.destroy();
    }

    const newChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Hourly Temperature',
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
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 't (°C)',
                    },
                }
            }
        }
    });

    chartElement.chartInstance = newChart;

    return newChart;
}
