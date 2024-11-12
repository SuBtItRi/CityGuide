window.onload = function () {
    setInterval(() => {
        document.querySelector('.loader__wrap').classList.add('hidden')
        document.body.classList.remove('overflow-h')
    }, 200);
}