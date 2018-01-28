'use strict'

var f = document.getElementById('form1');
function onClick(event) {
    event.preventDefault();
    if (localStorage.quizStarted) alert ('You have already taken the quiz! No cheating!');
    else {
        localStorage.userName = event.target.name.value;
        localStorage.profemail = event.target.profemail.value;
        window.location.href ='file:///Users/brentw/Codefellows/chem-163-quiz/ready4chemistry/quiz.html';
    }
}
f.addEventListener ('submit', onClick);