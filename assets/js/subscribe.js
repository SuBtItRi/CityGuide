document.addEventListener('DOMContentLoaded', () => {
    // subscribe btn
    document.querySelector('.footer__subscribe_block').addEventListener('submit', (e) => {
        e.preventDefault()
        document.getElementById('btn_subscribe').textContent = 'Отправлено'
        setInterval( function() {
            document.getElementById('btn_subscribe').textContent = 'Подписаться'
        }, 1500) 
        document.getElementById('subscribe-window').classList.remove('hidden')
    })
})

function accept(){
    document.getElementById('subscribe-window').classList.add('hidden')
}