class AccountSettings {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.usermenu = document.querySelector('.header__usermenu-checkbox');
        this.um_login = document.querySelector('.usermenu__login');
        this.um_settings = document.querySelector('.usermenu__settings');
        this.avatars = document.querySelectorAll('#usermenu_avatar');
        this.logout_btn = document.querySelector('.usermenu__logout');
        this.settings__block_details = document.querySelector('.settings__block_details');
        this.setting_title = document.querySelector('.settings__title');
        this.delAccountModal = document.querySelector('.del-account__modal')
        this.delAccountModalContainer = document.querySelector('.del-account__modal_container');
        this.changePassForm = document.getElementById('changePassForm');
        this.passwordNotMatchReg = document.getElementById('passwordNotMatchReg');
        this.passwordNotMatchLog = document.getElementById('passwordNotMatchLog');
        this.accountSuccessChangePass = document.getElementById('accountSuccessChangePass');
    }

    async fetchData() {
        const response = await fetch(this.apiUrl);
        if (!response.ok) {
            throw new Error('response not ok');
        }
        return await response.json();
    }
    async getData(ApiUrl) {
        const response = await fetch(ApiUrl);
        if (!response.ok) {
            throw new Error('response not ok');
        }
        return await response.json();
    }

    async updateUser (userId, postData) {
        const response = await fetch(`${this.apiUrl}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        if (!response.ok) {
            throw new Error('Ошибка обновления данных');
        }
        return await response.json();
    }

    async delUser(userId) {
        const response = await fetch(`${this.apiUrl}/${userId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            console.log(`User с ID ${userId} успешно удален.`);
        } else {
            console.error('Ошибка при удалении user:', response.statusText);
        }
    }

    async init() {
        this.users = await this.getData('https://6751eebad1983b9597b4dc21.mockapi.io/users');
        let currentUserID;
        this.users.forEach(elem => {
            if (elem.username == localStorage.getItem('username') && elem.password == localStorage.getItem('password')) {
                currentUserID = elem.id;
            }
        });

        if (currentUserID) {
            document.getElementById('setUsername').innerHTML = `
                ${localStorage.getItem('username')}
            `;
            this.setting_title.innerHTML = `
            <h2>Аккаунт</h2>
            <button id="delAccount">Удалить аккаунт</button>
            `
            this.delAccountModalContainer.innerHTML = `
            <h3>Вы точно хотите удалить свой аккаунт?</h3>
            <button id="delAccountSuccess">Удалить аккаунт</button>
            <img src='./assets/img/close.svg' alt='close' id='hideModal'>
            `
            this.delAccount = document.getElementById('delAccount');
            this.delAccountSuccess = document.getElementById('delAccountSuccess');
            this.hideModal = document.getElementById('hideModal')
        } else {
            this.settings__block_details.innerHTML = `
                <h3>Нужно войти в аккаунт</h3>
                <a href='reglog.html'>Войти в аккаунт</a>
            `
            return
        }

        document.querySelector('.settings_change-avatar').addEventListener('keydown', async (event) => {
            if (event.key == 'Enter') {
                const newAvatarUrl = event.target.value;
                if (newAvatarUrl) {
                    await this.updateUser (currentUserID, { 'avatar': newAvatarUrl });
                    this.avatars.forEach(elem => elem.src = newAvatarUrl); 
                }
            }
        });

        document.querySelector('.settings_change-pass-btn').addEventListener('click', () => {
            this.changePassForm.style.display = 'flex';
        });

        this.changePassForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const old_pass = document.getElementsByName('old_password')[0].value;
            if (users[currentUserID - 1].password == old_pass) {
                const new_pass = document.getElementsByName('new_password')[0].value;
                const new_pass_repeat = document.getElementsByName('new_password_repeat')[0].value;
                if (new_pass == new_pass_repeat) {
                    await this.updateUser (currentUserID, { 'password': new_pass });
                    this.passwordNotMatchReg.style.display = 'none';
                    this.passwordNotMatchLog.style.display = 'none';
                    this.accountSuccessChangePass.style.display = 'flex';
                } else {
                    this.passwordNotMatchReg.style.display = 'block';
                    this.passwordNotMatchLog.style.display = 'none';
                }
            } else {
                this.passwordNotMatchReg.style.display = 'none';
                this.passwordNotMatchLog.style.display = 'block';
            }
        });

        this.delAccount.addEventListener('click', () => {
            this.delAccountModal.classList.add('show')
        })
        this.hideModal.addEventListener('click', () => {
            this.delAccountModal.classList.remove('show')
        })
        this.delAccountSuccess.addEventListener('click', async () => {
            await this.delUser(currentUserID)
            this.logout_btn.click()
        })

        this.reviewsContainer = document.querySelector('.reviews__container')
        this.reviewsContainer.innerHTML = ''
        try {
            this.reviews = await this.getData(`https://6751eebad1983b9597b4dc21.mockapi.io/reviews?currentUserID=${currentUserID}`)
            for (let i = 0; i < this.reviews.length; i++) {
                this.createReview(i, currentUserID)
            }
        } catch {
            console.log('У этого пользователя еще нет отзывов')
        }
    }
    
    createReview(elemID, currentUserID) {
        this.reviewsContainer = document.querySelector('.reviews__container')
        this.currentReview = this.reviews[elemID]
        this.currentUser = this.users[currentUserID-1]
        console.log(this.currentReview, elemID-1)
        const fullReviewText = this.currentReview.review
        let reviewText = this.currentReview.review
        if(reviewText.length > 600) {
            reviewText = reviewText.slice(0, 600) + '...' + `<span id='more' class='reviews__review_more'> Подробнее </span>`
        }
        const review = document.createElement('div');
        review.classList.add('reviews__review');
        review.id = this.currentReview.id
        review.innerHTML = `
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
                reviewTextElement.innerHTML = `
                ${fullReviewText.replace('\\n', '<br>')} <span id='less' class='reviews__review_more'> Меньше подробностей </span>
                `
            } else if (e.target.id === 'less') {
                reviewTextElement.innerHTML = `
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
                this.delReviewData.delReview(reviewBlock)
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const account = new AccountSettings('https://6751eebad1983b9597b4dc21.mockapi.io/users');
    account.init();
});