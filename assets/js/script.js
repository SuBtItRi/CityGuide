let num_main_photo = 0 
let max_photes = 7 
let notpause = true 


document.addEventListener("DOMContentLoaded", function() {
    let map0 = document.getElementById('map_monemunts');
    let map1 = document.getElementById('map_museums');
    let map2 = document.getElementById('map_parks');
    let map3 = document.getElementById('map_temples');
    let map4 = document.getElementById('map_theaters');
    let map5 = document.getElementById('map_fountains');
    let map6 = document.getElementById('map_squares');
    let map7 = document.getElementById('map_observation-decks');
    // search btn
    document.getElementById('searchButton').addEventListener('click', () => {
        document.querySelector('.header_search-container').classList.toggle('active') 
    }) 
    // maps sort
    function maps_sort() {
        map0.classList.add('hidden')
        map1.classList.add('hidden')
        map2.classList.add('hidden')
        map3.classList.add('hidden')
        map4.classList.add('hidden')
        map5.classList.add('hidden')
        map6.classList.add('hidden')
        map7.classList.add('hidden')
        selectValue = document.getElementById('maps_sort').value
        if (selectValue == 'map_monemunts') {
            map0.classList.remove('hidden')
        } if (selectValue == 'map_museums') {
            map1.classList.remove('hidden')
        } if (selectValue == 'map_parks') {
            map2.classList.remove('hidden')
        } if (selectValue == 'map_temples') {
            map3.classList.remove('hidden')
        } if (selectValue == 'map_theaters') {
            map4.classList.remove('hidden')
        } if (selectValue == 'map_fountains') {
            map5.classList.remove('hidden')
        } if (selectValue == 'map_squares') {
            map6.classList.remove('hidden')
        } if (selectValue == 'map_observation-decks') {
            map7.classList.remove('hidden')
        }
    }
    document.getElementById('maps_sort').addEventListener('click', () => {
        maps_sort()
    })
    // select map footer btns
    document.querySelector('#map0').addEventListener('click', () => {
        document.querySelector('#maps_sort').value = 'map_monemunts'
        maps_sort()
    })
    document.querySelector('#map1').addEventListener('click', () => {
        document.querySelector('#maps_sort').value = 'map_museums'
        maps_sort()
    })
    document.querySelector('#map2').addEventListener('click', () => {
        document.querySelector('#maps_sort').value = 'map_parks'
        maps_sort()
    })
    document.querySelector('#map3').addEventListener('click', () => {
        document.querySelector('#maps_sort').value = 'map_temples'
        maps_sort()
    })
    document.querySelector('#map4').addEventListener('click', () => {
        document.querySelector('#maps_sort').value = 'map_theaters'
        maps_sort()
    })
    document.querySelector('#map5').addEventListener('click', () => {
        document.querySelector('#maps_sort').value = 'map_fountains'
        maps_sort()
    })
    document.querySelector('#map6').addEventListener('click', () => {
        document.querySelector('#maps_sort').value = 'map_squares'
        maps_sort()
    })
    document.querySelector('#map7').addEventListener('click', () => {
        document.querySelector('#maps_sort').value = 'map_observation-decks'
        maps_sort()
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
        document.getElementById('btn-pause').textContent = '⏸️'
    } else {
        notpause=true 
        document.getElementById('btn-pause').textContent = '▶️'
    }
}
// subscribe btn
function subscribe(e) {
    e.preventDefault()
    console.log(document.querySelector('#subscribe-input').value == null)
    if (document.querySelector('#subscribe-input').value == '') {
        document.getElementById('btn-subscribe').textContent = 'Введите почту'
    }
    document.getElementById('btn-subscribe').textContent = 'Отправлено'
    setInterval( function() {
        document.getElementById('btn-subscribe').textContent = 'Подписаться'
    }, 1500) 
    document.getElementById('subscribe-window').classList.remove('hidden')
}
function accept(){
    document.getElementById('subscribe-window').classList.add('hidden')
}

window.onload = function () {
    document.querySelector('.loader_wrap').classList.add('hidden')
    document.body.classList.remove('overflow-h')
    // auto slide slider
    setInterval( function () {
        if (notpause) {
            next_main_photo() 
        }
    }, 7500) 
} 