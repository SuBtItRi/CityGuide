document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.contacts__btn').addEventListener('click', () => {
        document.querySelector('.contact__modal').style.display = 'flex'
        document.body.classList.add('overflow-h')
    })
    document.querySelector('.contact__modal_btn').addEventListener('click', (e) => {
        e.preventDefault()
        const email = document.getElementById('contact_email')
        const namem = document.getElementById('contact_name')
        const adress = document.getElementById('contact_adress')
        const msg = document.getElementById('contact_msg')
        end_this = false
        IsValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
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
        document.querySelector('.contact__modal').style.display = 'none'
        document.body.classList.remove('overflow-h')
        email.value = ''
        namem.value = ''
        adress.value = ''
        msg.value = ''
    })
    document.querySelector('.contact__modal_close').addEventListener('click', () => {
        document.querySelector('.contact__modal').style.display = 'none'
        document.body.classList.remove('overflow-h')
    })
})