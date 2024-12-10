class Slider {
    constructor() {
        this.num_main_photo = 0 
        this.max_photes = 7 
        this.notpause = true 
        this.map = document.getElementById('map');
        this.maps_sort = document.getElementById('maps__sort')
        this.btn_back = document.querySelector('.main__btn_back')
        this.btn_next = document.querySelector('.main__btn_next')
        this.main = document.getElementById('main')
    }

    init() {
        setInterval(() => {
            if (this.notpause) {
                this.next_main_photo() 
            }
        }, 7500) 
        
        document.addEventListener('keydown', (event) => { 
            if (event.code == 'ArrowRight') {
                this.next_main_photo()
            }
            if (event.code == 'ArrowLeft') {
                this.back_main_photo()
            }
        }) 
        
        this.maps_sort.addEventListener('change', () => {
            this.map.src = ''
            if (this.maps_sort.value == 'map__monemunts') {
                this.map.src = "https://yandex.ru/map-widget/v1/?um=constructor%3A7dba4573af2fb158f5ecce2cd7410825eafb3415b6fb70d438d627a1572570fa&amp;source=constructor"
            } if (this.maps_sort.value == 'map__museums') {
                this.map.src = "https://yandex.ru/map-widget/v1/?um=constructor%3A995291e81d14870338d522bcf2003cc3ea46a7fe6d64e601916328058bea92a6&amp;source=constructor"
            } if (this.maps_sort.value == 'map__parks') {
                this.map.src = "https://yandex.ru/map-widget/v1/?um=constructor%3Aa025175ae9759c043175cae12055705381ac104ecd9938f66f5958ac061ef3f7&amp;source=constructor"
            } if (this.maps_sort.value == 'map__temples') {
                this.map.src = "https://yandex.ru/map-widget/v1/?um=constructor%3Ad1a22f8f04dbcfea7a3f7dbb5e0482b4b02f64b242b5c851cb1b226ffa455b4a&amp;source=constructor"
            } if (this.maps_sort.value == 'map__theaters') {
                this.map.src = "https://yandex.ru/map-widget/v1/?um=constructor%3Adc7a9a4c6460a8752016342f3b4f7ce1233181a51cecf5e94e1b4d873f111fc0&amp;source=constructor"
            } if (this.maps_sort.value == 'map__fountains') {
                this.map.src = "https://yandex.ru/map-widget/v1/?um=constructor%3A216cd1be212f86b6e4349e92b94a4cb699524482488bfcb0c9e675ea6e750e6c&amp;source=constructor"
            } if (this.maps_sort.value == 'map__squares') {
                this.map.src = "https://yandex.ru/map-widget/v1/?um=constructor%3Ac5ee0a6a9aa2b0e631988dde7fee539d3d69b3ff5137ff3ea41e3a1cb236e4c6&amp;source=constructor"
            } 
        })

        this.btn_back.addEventListener('click', () => {
            this.back_main_photo()
        })

        this.btn_next.addEventListener('click', () => {
            this.next_main_photo()
        })
    }
    
    back_main_photo() { 
        this.num_main_photo-- 
        if (this.num_main_photo < 0){this.num_main_photo=this.max_photes }
        this.main.style.backgroundImage = `url('./assets/img/main${this.num_main_photo}.jpeg')` 
    }
    next_main_photo() {
        this.num_main_photo++ 
        if (this.num_main_photo > this.max_photes){this.num_main_photo=0 }
        this.main.style.backgroundImage = `url('./assets/img/main${this.num_main_photo}.jpeg')` 
    }
}


document.addEventListener("DOMContentLoaded", function() {
    const slider = new Slider()
    slider.init()
}) 