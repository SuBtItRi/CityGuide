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

    async init() {
        const users = await this.fetchData();
        let currentUser
        if (localStorage.getItem('username')) {
            users.forEach(user => { 
                if (user.username === localStorage.getItem('username') && user.password === localStorage.getItem('password')) {
                    this.avatars.forEach(elem => elem.src = user.avatar);
                    currentUser=user
                }
            });
            
            this.usermenu.addEventListener('click', () => {
                if (currentUser) {
                    this.um_login.style.display = 'none'
                    this.um_settings.style.display = 'flex'
                    this.um_logout.style.display = 'flex'
                } else {
                    this.um_login.style.display = 'flex'
                    this.um_settings.style.display = 'none'
                    this.um_logout.style.display = 'none'
                }
            })
            this.logout_btn.addEventListener('click', () => {
                location.reload()
                localStorage.setItem('username', '')
                localStorage.setItem('password', '')
                console.log('rebotaet')
            })
        } 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const check = new Check('https://6751eebad1983b9597b4dc21.mockapi.io/users')
    check.init()
})