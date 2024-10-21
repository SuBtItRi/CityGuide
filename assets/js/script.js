let num_main_photo = 0 
let max_photes = 7 
let notpause = true 


document.addEventListener("DOMContentLoaded", function() {
    // auto slide slider
    setInterval( function () {
        if (notpause) {
            next_main_photo() 
        }
    }, 7500) 
    let map = document.getElementById('map');
    // maps sort
    document.getElementById('maps__sort').addEventListener('change', () => {
        map.src = ''
        selectValue = document.getElementById('maps__sort').value
        if (selectValue == 'map__monemunts') {
            map.src = "https://yandex.ru/map-widget/v1/?um=constructor%3A7dba4573af2fb158f5ecce2cd7410825eafb3415b6fb70d438d627a1572570fa&amp;source=constructor"
        } if (selectValue == 'map__museums') {
            map.src = "https://yandex.ru/map-widget/v1/?um=constructor%3A995291e81d14870338d522bcf2003cc3ea46a7fe6d64e601916328058bea92a6&amp;source=constructor"
        } if (selectValue == 'map__parks') {
            map.src = "https://yandex.ru/map-widget/v1/?um=constructor%3Aa025175ae9759c043175cae12055705381ac104ecd9938f66f5958ac061ef3f7&amp;source=constructor"
        } if (selectValue == 'map__temples') {
            map.src = "https://yandex.ru/map-widget/v1/?um=constructor%3Ad1a22f8f04dbcfea7a3f7dbb5e0482b4b02f64b242b5c851cb1b226ffa455b4a&amp;source=constructor"
        } if (selectValue == 'map__theaters') {
            map.src = "https://yandex.ru/map-widget/v1/?um=constructor%3Adc7a9a4c6460a8752016342f3b4f7ce1233181a51cecf5e94e1b4d873f111fc0&amp;source=constructor"
        } if (selectValue == 'map__fountains') {
            map.src = "https://yandex.ru/map-widget/v1/?um=constructor%3A216cd1be212f86b6e4349e92b94a4cb699524482488bfcb0c9e675ea6e750e6c&amp;source=constructor"
        } if (selectValue == 'map__squares') {
            map.src = "https://yandex.ru/map-widget/v1/?um=constructor%3Ac5ee0a6a9aa2b0e631988dde7fee539d3d69b3ff5137ff3ea41e3a1cb236e4c6&amp;source=constructor"
        } 
    })
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

// slide sliders hotkeys
document.addEventListener('keydown', function(event) {
  if (event.code == 'ArrowRight') {
    next_main_photo()
  }
  if (event.code == 'ArrowLeft') {
    back_main_photo()
  }
}) 

// slider btns
function back_main_photo() { 
    num_main_photo-- 
    if (num_main_photo < 0){num_main_photo=max_photes }
    document.getElementById('main').style.backgroundImage = `url('./assets/img/main${num_main_photo}.jpeg')` 
}
function next_main_photo() {
    num_main_photo++ 
    if (num_main_photo > max_photes){num_main_photo=0 }
    document.getElementById('main').style.backgroundImage = `url('./assets/img/main${num_main_photo}.jpeg')` 
}
function pause() {
    if (notpause) {
        notpause=false 
        document.getElementById('btn_pause').textContent = '⏸️'
    } else {
        notpause=true 
        document.getElementById('btn_pause').textContent = '▶️'
    }
}
function accept(){
    document.getElementById('subscribe-window').classList.add('hidden')
}