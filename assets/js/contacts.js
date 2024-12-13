class Conctacts {
    constructor() {
        this.contact_modal = document.querySelector('.contact__modal')
        this.contacts_btn = document.querySelector('.contacts__btn')
        this.contact_modal_btn = document.querySelector('.contact__modal_btn')
        this.contact_modal_close = document.querySelector('.contact__modal_close')

    }
    init() {
        this.contacts_btn.addEventListener('click', () => {
            this.contact_modal.style.display = 'flex'
            document.body.classList.add('overflow-h')
        })
        this.contact_modal_btn.addEventListener('click', (e) => {
            e.preventDefault()
            const email = document.getElementById('contact_email')
            const namem = document.getElementById('contact_name')
            const adress = document.getElementById('contact_adress')
            const msg = document.getElementById('contact_msg')
            let end_this = false
            const IsValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (IsValidEmail.test(email.value)) {
                email.style = 'border-bottom: 2px solid #fff'
            } else {
                email.style = 'border-bottom: 2px solid red'
                end_this = true 
            }
            if (namem.value === '') {
                namem.style = 'border-bottom: 2px solid red'
                end_this = true
            } else {
                namem.style = 'border-bottom: 2px solid #fff'
            }
            if (adress.value === '') {
                adress.style = 'border-bottom: 2px solid red'
                end_this = true
            } else {
                adress.style = 'border-bottom: 2px solid #fff'
            }
            if (msg.value === '') {
                msg.style = 'border-bottom: 2px solid red'
                end_this = true
            } else {
                msg.style = 'border-bottom: 2px solid #fff'
            }
            if (end_this == true) {
                return
            }
            this.contact_modal.style.display = 'none'
            document.body.classList.remove('overflow-h')
            email.value = ''
            namem.value = ''
            adress.value = ''
            msg.value = ''
        })
        this.contact_modal_close.addEventListener('click', () => {
            this.contact_modal.style.display = 'none'
            document.body.classList.remove('overflow-h')
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const contacts = new Conctacts()
    contacts.init()
})