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
        this.currentUser
    }

    async simpleHash(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
        return hashHex;
    }

    async fetchData() {
        const response = await fetch(`${this.apiUrl}?password=${await this.simpleHash(localStorage.getItem('password'))}&username${localStorage.getItem('username')}`)
        if (!response.ok) {
            throw new Error('response not ok')
        }
        const data = await response.json()
        return data[0]
    }

    async init() {
        try {
            this.currentUser = await this.fetchData();
            this.avatars.forEach(elem => elem.src = this.currentUser.avatar)
        } catch {}
        this.usermenu.addEventListener('click', () => {
            if (this.currentUser) {
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

document.addEventListener('DOMContentLoaded', () => {
    const check = new Check('https://6751eebad1983b9597b4dc21.mockapi.io/users')
    check.init()
})