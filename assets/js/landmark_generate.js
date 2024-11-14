document.addEventListener('DOMContentLoaded', async function () {
    let items = []
    let itemid = localStorage.getItem('item-id')
    let getItem = []
    let random_reviews = Math.floor(Math.random() * (999 - 1 + 1) + 1)
    async function getData() {
        try {
            const response = await fetch('https://6728a8d3270bd0b97556a70f.mockapi.io/catalog/filters');
            const items_temp = await response.json(); 
            items_temp.forEach(item => {
                if (item.id == itemid) {
                    getItem = item
                }
            })
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }
    await getData()
    document.querySelector('.landmark__wrap').innerHTML = `
    <p class="landmark__href">
        <a href="catalog.html">Каталог</a> > <a href="catalog.html?filter=Памятники" id="href_with_filter">${getItem.filter}</a> > <a href="catalog.html" id="spec_href"> ${getItem.title} </a> </span>
    </p>
    <h2 class="landmark__title">${getItem.title}</h2>
    <div class="landmark__window">
        <div class="landmark__window_imgs">
            <img src="./assets/img/${getItem.imgs[0]}" alt="${getItem.imgs[0]}" id="img1">
            <img src="./assets/img/${getItem.imgs[1]}" alt="${getItem.imgs[1]}" id="img2">
            <img src="./assets/img/${getItem.imgs[2]}" alt="${getItem.imgs[2]}" id="img3">
        </div>
        <div class="landmark__window_info-block">
            <p class="landmark__window_description">${getItem.description}</p>
            <div class="landmark__window_bottom-block">
                <iframe class="map" src="${getItem.map}" width="100%" height="150px" frameborder="0"></iframe>
                <p class="landmark__window_grade">
                    ${getItem.grade} | ${random_reviews} отзыв
                </p>
                <p class="landmark__window_adress">
                    ${getItem.adress}
                </p>
                <a href="${getItem.map}">
                    <button class="landmark__window_map-src">
                        Показать на карте
                    </button>
                </a>
            </div>
        </div>
    </div>
    `
    document.querySelector('#spec_href').addEventListener('click', function () {
        localStorage.setItem('textinput', getItem.title)
    })
    document.querySelector('#href_with_filter').addEventListener('click', function () {
        localStorage.setItem('currentPage', 1)
    })
    // <p class="landmark__href">
    //     <a href="catalog.html">Каталог</a> > <a href="catalog.html?filter=${getItem.filter}">${getItem.filter}</a> > <a href="catalog.html"> ${getItem.title} </span>
    // </p>
    // <h2 class="landmark__title">${getItem.title}</h2>
    // `
})