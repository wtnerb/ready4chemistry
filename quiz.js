'use strict';

(function (){
  let el = document.getElementById('username');
  el.textContent = localStorage.userName ? localStorage.userName : 'anonymous';
})();

function Question (content, options, truth){
    this.content = content;
    this.options = options;
    this.truth = truth;
    qs.push(this);
}

Question.prototype.ask = function () {
    let el = chemifyinHTML('p', this.content);
    el.classList.add('temp','question','text');
    return el;
}

function chemifyinHTML (tag, str){
    str = str.replace (/=>/g, '\u2192').replace(/z(\d+)/g, '<<$1<<').replace(/\^(\d*[+-])/g, '<<$1<<');
    let arr = str.split('<<');
    let newEl = document.createElement(tag);
    for (let i in arr){
    if (arr[i].match(/^\d*[+-]*$/)) {
            let el = document.createElement('span');
            el.className = arr[i].match(/[+-]/) ? 'superscript' : 'subscript';
            el.textContent = arr[i];
            newEl.append(el);
        } else {
            newEl.append(arr[i]);
        }
    }
    return newEl;
}

function Results () {
    this.time = time;
    this.correct = truth;
}

function nextQuestion () {
    let q = qs[iter];
    let el = document.getElementById('question');
    let old = document.getElementsByClassName('temp');
    while (old[0]) old[0].remove();
    el.appendChild(q.ask());
    el.appendChild(q.answers());
}


Question.prototype.answers = function () {
    let list = document.getElementById('answers');
    this.options.forEach((x,y) => {
        let el = document.createElement('input');
        el.type = 'radio';
        el.name = 'ans';
        el.id = y;
        el.value = y;
        el.classList.add('temp', 'question', 'checkbox');
        let ans =  chemifyinHTML('label', x);
        ans.for = y;
        ans.classList.add('temp', 'question', 'answer');
        list.appendChild(el);
        list.appendChild(ans);
    });
    let el = document.createElement('input');
    el.type = 'submit';
    el.value = 'Save';
    el.classList.add('temp', 'submit');
    list.appendChild(el);
    document.getElementById('answers').addEventListener('submit', placeHolder);
    return list;
}

function placeHolder (event) {
    event.preventDefault();
    let i = document.getElementById('answers').ans.value;
    result.push ({userAnswer: qs[iter].options[i], time: event.time});
    result[iter].correct = result[iter].userAnswer == qs[iter].truth;
    iter++;
    if (qs[iter]) nextQuestion();
    else {
        let old = document.getElementsByClassName('temp');
        while (old[0]) old[0].remove();
        let el = document.createElement('p');
        el.textContent = 'Your result is ' + result.filter(x => x.correct).reduce(x => x + 1, 0) + ' correct out of ' + qs.length;
        document.getElementById('ask').appendChild(el);
    }
}

let qs = [];
new Question ('how old are you?', ['19','22','26','32'], '26');
new Question ('who are you?', ['bob', 'alice','jessica','nobody'],'nobody');
new Question ('SOz4^2- is called', ['sulfate', 'everclear', 'poison'], 'sulfate');
let result = [];
let iter = 0;
if (!localStorage.quizStarted) {
    //localStorage.quizStarted = true; //TODO uncomment when out of dev environment
    nextQuestion();
} else alert ('You have already taken the quiz! No retake!');