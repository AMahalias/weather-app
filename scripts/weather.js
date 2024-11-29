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
        ${createWeatherInfoHTML()}
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