const landmarkID = parseInt(new URLSearchParams(window.location.search).get('item'))
class DataFetcher {
    constructor(apiUrl) {
        this.apiUrl = apiUrl
    }

    async fetchData() {
        const response = await fetch(this.apiUrl)
        if (!response.ok) {
            throw new Error('response not ok')
        }
        return await response.json()
    }

    async postReview(postData) {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        if (!response.ok) {
            throw new Error('Ошибка отправки данных');
        } else {
            console.log(
                `Отзыв сохранен`, postData
            )
        }
        return await response.json();
    }

    async delReview(reviewBlock) {
        const reviewId = reviewBlock.getAttribute('id')
        const response = await fetch(`${this.apiUrl}/${reviewId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            reviewBlock.remove();
            console.log(`Отзыв с ID ${reviewId} успешно удален.`);
        } else {
            console.error('Ошибка при удалении отзыва:', response.statusText);
        }
    }
}

class Landmark {
    constructor() {
        this.currentImg = 0
        this.random_reviews = Math.floor(Math.random() * (999 - 1 + 1) + 1)
        this.itemData = new DataFetcher(`https://6728a8d3270bd0b97556a70f.mockapi.io/catalog/filters/${landmarkID}`)
        this.reviewData = new DataFetcher(`https://6751eebad1983b9597b4dc21.mockapi.io/reviews?currentLandmarkID=${landmarkID}`)
        this.usersData = new DataFetcher('https://6751eebad1983b9597b4dc21.mockapi.io/users')
        this.delReviewData = new DataFetcher(`https://6751eebad1983b9597b4dc21.mockapi.io/reviews`)
    }
    
    async init () {
        this.users = await this.usersData.fetchData()
        
        let currentUserID
        this.users.forEach(elem => {
            if (elem.username == localStorage.getItem('username')) {
                currentUserID = elem.id
            }
        })

        const getItem = await this.itemData.fetchData()
        const currentYear = new Date().getFullYear() % 100
        
        document.querySelector('.landmark__wrap').innerHTML = 
        `
        <p class="landmark__href">
            <a href="catalog.html">Каталог</a> > <a href="catalog.html?filter=${getItem.filter}&page=1" id="href_with_filter">${getItem.filter}</a> > <a href="catalog.html?page=1" id="spec_href"> ${getItem.title} </a> </span>
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
                            ${getItem.grade} | ${this.random_reviews} отзыв
                        </p>
                        <p class="landmark__window_adress">
                            ${getItem.adress}
                        </p>
                        <a href="${getItem.map}">
                            <button class="landmark__window_blue-btn">
                                Показать на карте
                            </button>
                        </a>
                    </div>
                </div>
            </div>
            <div class='reviews'>
                <h2>Отзывы</h2>
                <button class='landmark__window_blue-btn' id='add-review'>Оставить отзыв</button>
                <form class='reviews__add' id='reviewForm'>
                    <div class='reviews__up-block'>
                        <div class='reviews__user-details'>
                            <img class='header__usermenu_avatar' src='./assets/img/avatar.png' alt='user-avatar'>
                            <h3>Нужно войти в аккаунт</h3>
                        </div>
                        <div class='reviews__add-close'>
                            Закрыть
                        </div>
                    </div>
                    <div class='reviews__add_choice-reviews'>
                        <div class='reviews__add_choice-reviews_left-block'>
                            <div class='reviews__add_choice-reviews_grade'>
                                <p>Выберете оценку</p>
                                <span class='grade' id='grade1'>⭐</span>
                                <span class='grade' id='grade2'>⭐</span>
                                <span class='grade' id='grade3'>⭐</span>
                                <span class='grade' id='grade4'>⭐</span>
                                <span class='grade' id='grade5' style='opacity:1'>⭐</span>
                            </div>
                            <select name='when' class='reviews__add_choice-reviews_when'>
                                <option value='Январь ${currentYear} г.'>Январь ${currentYear} г.</option>
                                <option value='Февраль ${currentYear} г.'>Февраль ${currentYear} г.</option>
                                <option value='Март ${currentYear} г.'>Март ${currentYear} г.</option>
                                <option value='Апрель ${currentYear} г.'>Апрель ${currentYear} г.</option>
                                <option value='Май ${currentYear} г.'>Май ${currentYear} г.</option>
                                <option value='Июнь ${currentYear} г.'>Июнь ${currentYear} г.</option>
                                <option value='Июль ${currentYear} г.'>Июль ${currentYear} г.</option>
                                <option value='Август ${currentYear} г.'>Август ${currentYear} г.</option>
                                <option value='Сентябрь ${currentYear} г.'>Сентябрь ${currentYear} г.</option>
                                <option value='Октябрь ${currentYear} г.'>Октябрь ${currentYear} г.</option>
                                <option value='Ноябрь ${currentYear} г.'>Ноябрь ${currentYear} г.</option>
                                <option value='Декабрь ${currentYear} г.'>Декабрь ${currentYear} г.</option>
                            </select>
                        </div>
                        <div id='tipsForReviews' class='reviews__add_choice-reviews_right-block'>
                            Советы по написанию отзывов
                        </div>
                    </div>
                    <input type="number" name='grade' style='display:none'>
                    <input maxlength='60' type='text' name='title' class='reviews__add_review title' placeholder='Заголовок отзыва' required> 
                    <textarea minlength='100' type='text' name='review' class='reviews__add_review' placeholder='Отзыв' required></textarea>
                    <input id='postReview' type='submit' class='landmark__window_blue-btn' value='Отправить отзыв'/>
                </form>
                <div id="modal" class="modal" style="display: none;">
                    <div class="modal-content">
                        <span class="close-button">&times;</span>
                        <h2>Что самое главное в отзывах?</h2>
                        <p><strong>Что будет полезным:</strong></p>
                        <ul>
                            <li>Будьте точными: чем больше деталей, тем лучше.</li>
                            <li>Поделитесь тем, что было замечательно, что было плохо и что было приемлемо.</li>
                            <li>Поделитесь с нами тем, что вы бы рассказали своим друзьям.</li>
                            <li>Добавьте советы и рекомендации.</li>
                        </ul>
                        <p><strong>Что избегать:</strong></p>
                        <ul>
                            <li>Нецензурная лексика, угрозы или личные оскорбления.</li>
                            <li>Упоминания личной информации (адреса электронной почты и номера телефонов).</li>
                            <li>Использование ЗАГЛАВНЫХ БУКВ.</li>
                            <li>Истории о чужом опыте и мнениях.</li>
                        </ul>
                        <p>Хотите ответить на отзыв? <strong>Используйте форму ответа.</strong></p>
                    </div>
                </div>
                <div class='reviews__container'>
                    
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
                    <button class="imgs-slider__btn_prev">
                        <img src="./assets/img/arrow_l_black.svg">
                    </button>
                    <button class="imgs-slider__btn_next">
                        <img src="./assets/img/arrow_r_black.svg">
                    </button>
                </div>
            </div>
        </div>
        `
        
        try {
            document.querySelector('.reviews__user-details').innerHTML = `
            <img class='header__usermenu_avatar' src='${this.users[currentUserID-1].avatar}' alt='user-avatar'>
            <h3>${localStorage.getItem('username')}</h3>
            `
        } catch {}

        try {
            this.reviews = await this.reviewData.fetchData()
            this.reviews.forEach(review => {
                this.createReview(review.id)
            })
        } catch {}
        
        this.addReviewBtn = document.getElementById('add-review')
        this.addReviewBlock = document.querySelector('.reviews__add')
        this.closeAddReviewBlock = document.querySelector('.reviews__add-close')
        this.reviewForm = document.getElementById('reviewForm')
        this.gradesBlock = document.querySelectorAll('.grade')
        let gradeValue = document.getElementsByName('grade')[0].value
        gradeValue=1
        this.gradesBlock.forEach(grade => {
            grade.addEventListener('click', () => {
                for(let i = 1; i <= 5; i++) {
                    if (i < grade.getAttribute('id').match(/[0-9/.]+/)) {
                        document.getElementById(`grade${i}`).style.opacity = '0.3'
                        gradeValue=5-i
                    } else if (i==1) {
                        document.getElementById(`grade${i}`).style.opacity = '1'
                        gradeValue=5
                    } else {
                        document.getElementById(`grade${i}`).style.opacity = '1'
                    }
                }
            })
        })
                
        const slider_items = document.querySelectorAll(".imgs-slider__item")
        
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
        })
        
        document.querySelector(".imgs-slider__btn_next").addEventListener("click", () => {
            this.currentImg = (this.currentImg + 1) % slider_items.length 
            this.updateSlider()
        })
        
        document.querySelector(".imgs-slider__btn_prev").addEventListener("click", () => { 
            this.currentImg = (this.currentImg - 1 + slider_items.length) % slider_items.length 
            this.updateSlider()
        })

        this.addReviewBtn.addEventListener('click', () => {
            this.addReviewBlock.style.marginTop = '-7%'
            this.addReviewBlock.style.transform = 'translateY(0)'
        })

        this.closeAddReviewBlock.addEventListener('click', () => {
            this.addReviewBlock.style.transform = 'translateY(-41%)'
            this.addReviewBlock.style.marginTop = '-35%'
        })

        this.reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            this.when = document.getElementsByName('when')[0].value
            this.title = document.getElementsByName('title')[0].value
            this.review = document.getElementsByName('review')[0].value
            const postData = {
                "grade": gradeValue,
                "when": this.when,
                "title": this.title,
                "review": this.review,
                "currentUserID": this.users[currentUserID-1].id,
                "currentLandmarkID": landmarkID,
                "date":this.getFormattedDate()
            }
            await this.reviewData.postReview(postData)
            this.reviewForm.reset()
            document.getElementById('postReview').classList.add('green-btn')
            document.getElementById('postReview').value = 'Отзыв отправлен'
            
            this.reviewsContainer = document.querySelector('.reviews__container')
            this.reviewsContainer.innerHTML = ''
            try {
                this.reviews = await this.reviewData.fetchData()
                this.reviews.forEach(review => {
                    this.createReview(review.id)
                })
            } catch {}
            setTimeout(() => {
                this.closeAddReviewBlock.click()
                setTimeout(() => {
                    document.getElementById('postReview').classList.remove('green-btn')
                }, 1000);
            }, 2500);
        })



        setTimeout(() => {
            document.querySelector('.loader__wrap').classList.add('hidden')
            document.body.classList.remove('overflow-h')
        }, 500)
        
        this.updateSlider()

        const modal = document.getElementById('modal');
    const tipsButton = document.getElementById('tipsForReviews');
    const closeButton = document.querySelector('.close-button');

    // Открытие модального окна
    tipsButton.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.body.classList.add('overflow-h')
    });

    // Закрытие модального окна
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('overflow-h')
    });

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.classList.remove('overflow-h')
        }
    });
    }
    
    updateSlider() {
        document.querySelectorAll('.imgs-slider__item').forEach(item => {
        item.style = `margin-right: ${(1100-item.clientWidth)/2}px; margin-left: ${(1100-item.clientWidth)/2}px;`  
        });
        const X = -this.currentImg * 1100 //document.querySelector('.imgs-slider__item').clientWidth
        document.querySelector(".imgs-slider__wrapper").style.transform = `translateX(${X}px)`
    }

    getFormattedDate() {
        const today = new Date();
        
        const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        
        const day = today.getDate(); 
        const month = months[today.getMonth()]; 
        const year = today.getFullYear(); 
    
        return `Опубликовано ${day} ${month} ${year} г.`;
    }
    
    createReview(elemID) {
        this.reviewsContainer = document.querySelector('.reviews__container')
        this.currentReview = this.reviews[elemID-1]
        this.currentUser = this.users[this.currentReview.currentUserID-1]
        const fullReviewText = this.currentReview.review
        let reviewText = this.currentReview.review
        if(reviewText.length > 600) {
            reviewText = reviewText.slice(0, 600) + '...' + `<span id='more' class='reviews__review_more'> Подробнее </span>`
        }
        const review = document.createElement('div');
        review.classList.add('reviews__review');
        review.id = this.currentReview.id
        review.innerHTML = 
        `
        <div class='reviews__user-details'>
            <img class='header__usermenu_avatar' src='${this.currentUser.avatar}' alt='user-avatar'>
            <h3>${this.currentUser.username}</h3>
        </div>
        <p class='reviews__review_grade'> ${'⭐'.repeat(this.currentReview.grade)} </p>
        <p class='reviews__review_when'> ${this.currentReview.when} </p>
        <h2 class='reviews__review_text title'> ${this.currentReview.title} </h2>
        <p id='reviewText${elemID}' class='reviews__review_text'> ${reviewText.replace('\\n', '<br>')}  </p>
        <p class='reviews__review_when-published'> ${this.currentReview.date} </p>
        `
        this.reviewsContainer.appendChild(review);
        const reviewTextElement = document.getElementById(`reviewText${elemID}`);
        reviewTextElement.addEventListener('click', (e) => {
            if (e.target.id === 'more') {
                reviewTextElement.innerHTML = 
                `
                ${fullReviewText.replace('\\n', '<br>')} <span id='less' class='reviews__review_more'> Меньше подробностей </span>
                `
            } else if (e.target.id === 'less') {
                reviewTextElement.innerHTML = 
                `
                ${reviewText.replace('\\n', '<br>')} 
                `
            }
        })
        if (this.currentUser.username==localStorage.getItem('username')||localStorage.getItem('username')=='subtitri') { 
            const deleteReviewBtn = document.createElement('button');
            deleteReviewBtn.classList.add('reviews__review_delete');
            deleteReviewBtn.id = 'deleteReviewBtn'
            deleteReviewBtn.innerHTML = `Удалить отзыв`
            review.append(deleteReviewBtn)

            deleteReviewBtn.addEventListener('click', async (e) => {
                const reviewBlock = e.target.closest('.reviews__review');
                console.log(reviewBlock) 

                this.delReviewData.delReview(reviewBlock)
            });
        }
    }
}

function switch_slider() {
    document.querySelector('.landmark__window-main').classList.toggle('active')
    document.querySelector('.landmark__window-imgs').classList.toggle('active')
}

document.addEventListener('DOMContentLoaded',  function () {
    const landmark = new Landmark()  
    landmark.init()
})
