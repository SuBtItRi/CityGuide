class Check {
    constructor(apiUrl) {
        this.apiUrl = apiUrl
        this.usermenu = document.querySelector('.header__usermenu-checkbox')
        this.um_login = document.querySelector('.usermenu__login')
        this.um_settings = document.querySelector('.usermenu__settings')
        this.um_logout = document.querySelector('.usermenu__logout')
        this.avatars = document.querySelectorAll('#usermenu_avatar')
        this.logout_btn = document.querySelector('.usermenu__logout')
        this.settings__block_details = document.querySelector('.settings__block_details')
        this.changePassForm = document.getElementById('changePassForm')
        this.passwordNotMatchReg = document.getElementById('passwordNotMatchReg')
        this.passwordNotMatchLog = document.getElementById('passwordNotMatchLog')
        this.accountSuccessChangePass = document.getElementById('accountSuccessChangePass')
    }

    async fetchData() {
        const response = await fetch(this.apiUrl)
        if (!response.ok) {
            throw new Error('response not ok')
        }
        return await response.json()
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

    async init() {
        const users = await this.fetchData()
        let currentUserID
        users.forEach(elem => {
            if (elem.username == localStorage.getItem('username')) {
                currentUserID = elem.id
            }
        })
        if (localStorage.getItem('username')) {
            users.forEach(user => { 
                if (user.username === localStorage.getItem('username')) {
                    this.avatars.forEach(elem => elem.src = user.avatar)
                }
            })
            try {
                document.getElementById('setUsername').innerHTML = `
                ${localStorage.getItem('username')}
                `
            } catch {}
        } else {
            try {
                this.settings__block_details.innerHTML = `
                <h3>Нужно войти в аккаунт</h3>
                <a href='reglog.html'>Войти в аккаунт</a>
                `
            } catch {}
        }
        this.usermenu.addEventListener('click', () => {
            if (localStorage.getItem('username')) {
                this.um_login.style.display = 'none'
                this.um_settings.style.display = 'flex'
                this.um_logout.style.display = 'flex'
            } else {
                this.um_login.style.display = 'flex'
                this.um_settings.style.display = 'none'
                this.um_logout.style.display = 'none'
            }
        })
        try {
            document.querySelector('.settings_change-avatar').addEventListener('keydown', async (event) => {
                if (event.key == 'Enter') {
                    const newAvatarUrl = event.target.value;
                    if (newAvatarUrl) {
                        await this.updateUser(currentUserID, {'avatar': newAvatarUrl});
                        this.avatars.forEach(elem => elem.src = newAvatarUrl); 
                    }
                }
            });
        } catch {}
        try {
            document.querySelector('.settings_change-pass-btn').addEventListener('click', () => {
                changePassForm.style.display = 'flex'
            })
        } catch {}
        try {
            this.changePassForm.addEventListener('submit', (e) => {
                e.preventDefault()
                const old_pass = document.getElementsByName('old_password')[0].value
                console.log('oldpass:', old_pass)
                console.log(old_pass, users[currentUserID-1].password)
                if (users[currentUserID-1].password == old_pass) {
                    const new_pass = document.getElementsByName('new_password')[0].value
                    const new_pass_repeat = document.getElementsByName('new_password_repeat')[0].value
                    console.log(new_pass, new_pass_repeat)
                    if (new_pass == new_pass_repeat) {
                        this.updateUser(currentUserID, {'password':new_pass})
                        passwordNotMatchReg.style.display = 'none'
                        passwordNotMatchLog.style.display = 'none'
                        accountSuccessChangePass.style.display = 'flex'
                    } else {
                        passwordNotMatchReg.style.display = 'block'
                        passwordNotMatchLog.style.display = 'none'
                    }
                } else {
                    passwordNotMatchReg.style.display = 'none'
                    passwordNotMatchLog.style.display = 'block'
                }
            })
        } catch {}
        this.logout_btn.addEventListener('click', () => {
            location.reload()
            localStorage.setItem('username', '')
            localStorage.setItem('password', '')
            console.log('rebotaet')
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const check = new Check('https://6751eebad1983b9597b4dc21.mockapi.io/users')
    check.init()
})