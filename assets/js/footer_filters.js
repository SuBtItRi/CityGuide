document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.footer__block_subtitle').forEach(button => {
        button.addEventListener('click', function () {
            localStorage.setItem('selectedFilter', this.getAttribute('id'))
        });
    });
    document.querySelector('.footer__block_title').addEventListener('click', function() {
        localStorage.setItem('selectedFilter', this.getAttribute('id'))
    })
})