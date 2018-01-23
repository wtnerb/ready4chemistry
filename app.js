'use strict'

var button = getElementById('submit');
function onClick(event) {
    if (localStorage.results) alert ('You have already taken the quiz! No cheating!');
    else {
        window.location.href('quiz.html');
    }
}
addEventlistener ('submit', onClick);