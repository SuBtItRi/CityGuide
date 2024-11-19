document.addEventListener('DOMContentLoaded', async function () {
    let items = []
    let itemid = localStorage.getItem('item-id')
    let getItem = []
    let currentImg = 0;
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
    document.querySelector('.landmark__wrap').innerHTML = 
    `
    <p class="landmark__href">
        <a href="catalog.html">Каталог</a> > <a href="catalog.html?filter=${getItem.filter}" id="href_with_filter">${getItem.filter}</a> > <a href="catalog.html" id="spec_href"> ${getItem.title} </a> </span>
    </p>
    <h2 class="landmark__title">${getItem.title}</h2>
    <div class="landmark__window">
        <div class="landmark__window-main">
            <div class="landmark__window_imgs">
                <img  class="imgs__item" src="./assets/img/${getItem.imgs[0]}" alt="${getItem.imgs[0]}" id="img1" onclick="switch_slider()">
                <img  class="imgs__item" src="./assets/img/${getItem.imgs[1]}" alt="${getItem.imgs[1]}" id="img2" onclick="switch_slider()">
                <img  class="imgs__item" src="./assets/img/${getItem.imgs[2]}" alt="${getItem.imgs[2]}" id="img3" onclick="switch_slider()">
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
        <div class="landmark__window-imgs">
            <div class="landmark__window_imgs-slider" data-slider="imgs-slider" data-loop="false" data-autoplay="false">
                <div class="imgs-slider__wrapper">
                    <div class="imgs-slider__items">
                        <img class="imgs-slider__item" src="./assets/img/${getItem.imgs[0]}" alt="${getItem.imgs[0]}">
                        <img class="imgs-slider__item" src="./assets/img/${getItem.imgs[1]}" alt="${getItem.imgs[1]}">
                        <img class="imgs-slider__item" src="./assets/img/${getItem.imgs[2]}" alt="${getItem.imgs[2]}">
                    </div>
                </div>
                    <button class="imgs-slider__close" onclick="switch_slider()">❌</button>
                    <button class="imgs-slider__btn_prev"><</button>
                    <button class="imgs-slider__btn_next">></button>
                </div>
            </div>
        </div>
    `
    if (getItem.imgs.length < 3) {
        document.querySelector('.landmark__window_imgs').innerHTML = 
        `
        <img class="imgs__item" src="./assets/img/${getItem.imgs[0]}" alt="${getItem.imgs[0]}">
        `
        document.querySelector('.landmark__window_imgs').style = 'display: flex'
        document.querySelector('.imgs__item').style = 'cursor: unset; border-radius: 20px'
    }
    document.querySelector('#spec_href').addEventListener('click', function () {
        localStorage.setItem('textinput', getItem.title)
        localStorage.setItem('currentPage', 1)
    })
    document.querySelector('#href_with_filter').addEventListener('click', function () {
        localStorage.setItem('currentPage', 1)
    })  
    const slider_items = document.querySelectorAll(".imgs-slider__item");
    function updateSlider() {
        const X = -currentImg * 1100;
        document.querySelector(".imgs-slider__wrapper").style.transform = `translateX(${X}px)`;
    }
    document.querySelector(".imgs-slider__btn_next").addEventListener("click", () => {
        currentImg = (currentImg + 1) % slider_items.length; 
        updateSlider();
    });
    document.querySelector(".imgs-slider__btn_prev").addEventListener("click", () => { 
        currentImg = (currentImg - 1 + slider_items.length) % slider_items.length; 
        updateSlider();
    });
    setTimeout(() => {
        document.querySelector('.loader__wrap').classList.add('hidden')
        document.body.classList.remove('overflow-h')
    }, 500);
})

function switch_slider() {
    document.querySelector('.landmark__window-main').classList.toggle('active')
    document.querySelector('.landmark__window-imgs').classList.toggle('active')
}
