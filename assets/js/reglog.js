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

    async addUser (postData) {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        if (!response.ok) {
            throw new Error('response not ok')
        }
        return await response.json()
    }
}

class Form {
    constructor(apiUrl) {
        this.apiUrl = apiUrl
        this.dataFetcher = new DataFetcher(this.apiUrl)
        this.regForm = document.getElementById('regForm')
        this.usernameReg = this.regForm.elements['usernameReg']
        this.passwordReg = this.regForm.elements['passwordReg']
        this.repeatPasswordReg = this.regForm.elements['repeat_passwordReg']
        this.usernameExistsReg = document.getElementById('usernameExistsReg')
        this.passwordNotMatchReg = document.getElementById('passwordNotMatchReg')
        this.accountCreatedReg = document.getElementById('accountCreatedReg')
        this.logForm = document.getElementById('logForm')
        this.usernameLog = this.logForm.elements['usernameLog']
        this.passwordLog = this.logForm.elements['passwordLog']
        this.usernameExistsLog = document.getElementById('usernameExistsLog')
        this.passwordNotMatchLog = document.getElementById('passwordNotMatchLog')
        this.accountSuccessLog = document.getElementById('accountSuccessLog')
        this.notHaveAccount = document.getElementById('notHaveAccount')
    }

    async checkUsernameExists(username) {
        const users = await this.dataFetcher.fetchData()
        return users.some(user => user.username === username)
    }

    async init() {
        this.regForm.addEventListener('submit', async (event) => {
            event.preventDefault()
            this.usernameExistsReg.style.display = 'none' 
            this.passwordNotMatchReg.style.display = 'none' 
            this.accountCreatedReg.style.display = 'none' 

            if (this.passwordReg.value === this.repeatPasswordReg.value) {
                const usernameTaken = await this.checkUsernameExists(this.usernameReg.value)
                if (usernameTaken) {
                    this.usernameExistsReg.style.display = 'block' 
                } else {
                    const postData = {
                        username: this.usernameReg.value,
                        password: this.passwordReg.value
                    }
                    try {
                        await this.dataFetcher.addUser (postData)
                        this.accountCreatedReg.style.display = 'block' 
                    } catch (error) {
                        console.error('Ошибка при создании аккаунта:', error)
                    }
                }
            } else {
                this.passwordNotMatchReg.style.display = 'block'
            }
        })

        this.logForm.addEventListener('submit', async (event) => {
            event.preventDefault()
            this.usernameExistsLog.style.display = 'none' 
            this.passwordNotMatchLog.style.display = 'none'
            this.accountSuccessLog.style.display = 'none' 
            const users = await this.dataFetcher.fetchData()
            const user = users.find(user => user.username === this.usernameLog.value)

            if (user) {
                if (user.password === this.passwordLog.value) {
                    this.accountSuccessLog.style.display = 'block' 
                    localStorage.setItem('username', this.usernameLog.value)
                    localStorage.setItem('password', this.passwordLog.value)
                    location.reload()
                } else {
                    this.passwordNotMatchLog.style.display = 'block' 
                }
            } else {
                this.usernameExistsLog.style.display = 'block' 
            }
        })

        this.notHaveAccount.addEventListener('click', () => {
            this.regForm.style.display = 'flex'
            this.logForm.style.display = 'none'
        })
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const form = new Form('https://6751eebad1983b9597b4dc21.mockapi.io/users')
    form.init()
})