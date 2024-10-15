
let num_main_photo = 0;
let max_photes = 7;
let notpause = true;
function back_main_photo() {
    num_main_photo--;
    if (num_main_photo < 0){num_main_photo=max_photes;}
    document.getElementById('main').style.backgroundImage = `url('https://raw.githubusercontent.com/SuBtItRi/CityGuide/refs/heads/main/main${num_main_photo}.jpeg')`;
}
function next_main_photo() {
    num_main_photo++;
    if (num_main_photo > max_photes){num_main_photo=0;}
    document.getElementById('main').style.backgroundImage = `url('https://raw.githubusercontent.com/SuBtItRi/CityGuide/refs/heads/main/main${num_main_photo}.jpeg')`; 
}
function pause() {
    if (notpause) {
        notpause=false;
        document.getElementById('btn-pause').textContent = '⏸️'
    } else {
        notpause=true;
        document.getElementById('btn-pause').textContent = '▶️'
    }
}

window.onload = function () {
    setInterval( function () {
        if (notpause) {
            next_main_photo();
        }
    }, 7500);
}

document.addEventListener("DOMContentLoaded", function() {

});