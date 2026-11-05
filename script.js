const BASE_URL = 'https://strapi.kitek-pg.ru'
const API_URL = `${BASE_URL}/api/phones?populate=*`
const API_TOKEN = '22cc4bc7f4df77a71a61400078777e7eb18172daf98b21c52468a8f729dc0687402b7849d1b669b144c08817070653e8014413db695f3bb8661819eb8f4ed8b61ff609e3e4ebd7c1dfc871c7ffa6293fb0a27853c24f72db0e85c848fb1fd9cf1a87d9adf1ed05f17f395482cf92868edf63465302059d5c870789eabf146bee'

function createCard(item) {
    const {maker, price, release_date, color, memory, image } = item;
    const imageUrl = image && image[0] && image[0].url ? `${BASE_URL}${image[0].url}`
        : 'https://via.placeholder.com/300x200?text=No+image'
    const formattedDate = release_date
    ? new Date(release_date).toLocaleDateString('ru-RU')
    : 'Дата не указана';
    const formattedPrice=price.toLocaleString('ru-RU');

    return `
        <article class="card">
            <img
                class="card__image"
                src="${imageUrl}"
                alt="${maker}" />
            <div class="card__body">
                <h2 class="card__title">${maker}</h2>
                <p class="card__text">Выпуск: ${formattedDate}</p>
                <div class="card__footer style ="margin-bottom: 10px;">
                    <span class="card__price">${formattedPrice}₽</span>
                    <span class="badge">${memory}</span>
                    <span class="badge">${color}</span>
                </div>
            </div>
        </article>
    `
}

async function loadCards() {
    const statusEl=document.getElementById('status');
    const cardsEl=document.getElementById('cards');
    try {
        statusEl.textContent='Загрузка...';
        const response = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
            },
        })
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`)
        }
        const result = await response.json()
        const items = result.data
        if (items.length === 0) {
            statusEl.textContent = 'Записей пока нет'
            cardsEl.innerHTML = ''
            return;
        }
        cardsEl.innerHTML = items.map(createCard).join('')
        statusEl.textContent = ''
    } catch (error) {
        console.error(error)
        cardsEl.innerHTML = ''
        statusEl.textContent = `Не удалось загрузить данные: ${error.message}`
        statusEl.classList.add('status--error')
    }
}
loadCards()