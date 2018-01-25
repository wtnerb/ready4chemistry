'use strict';

function Question (content, options, truth, category){
    this.content = content;
    this.options = options;
    this.truth = truth;
    this.category = category
    qs.push(this);
}

Question.prototype.ask = function () {
    let el = chemifyInHTML('p', this.content);
    el.classList.add('temp','question','text');
    return el;
}

function chemifyInHTML (tag, str){
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

function nextQuestion (q) {
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
        let ans =  chemifyInHTML('label', x);
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
    result.push ({userAnswer: qs[iter].options[i], time: event.timeStamp});
    result[iter].correct = result[iter].userAnswer == qs[iter].truth;
    result[iter].category = qs[iter].category;
    iter++;
    if (qs[iter]) nextQuestion(qs[iter]);
    else displayEnd(result);
}

function formatDuration (seconds) {
    //borrowed from my own code wars account
    let out = [];
    let units = [
      {name: 'second', num: 60},
      {name: 'minute', num: 60},
      {name: 'hour', num: 24},
      {name: 'day', num: 365},
      {name: 'year', num: 4294967294},
    ];
    if (seconds === 0) return 'now';
    units.forEach(x => {
      let number = seconds%x.num;
      let str = (number > 1) ? x.name + 's' : x.name;
      out.push ({name: str, num: number});
      seconds -= number;
      seconds /= x.num;
    });
    return out.filter(x => x.num > 0)
        .reverse()
        .map(x => x.num + ' ' + x.name)
        .join(', ')
        .replace(/,( \d+ \w+)$/, ' and$1')
  }

function displayEnd (result){
    let old = document.getElementsByClassName('temp');
    while (old[0]) old[0].remove();
    let el = document.createElement('p');
    el.textContent = 'Your result is ' + result.filter(x => x.correct).reduce(x => x + 1, 0) + ' correct out of ' + qs.length + '. Dont forget that every item on this quiz is fundamental to 163, if you decide to continue your professor will assume you already know and have mastered this material.';
    document.getElementById('ask').appendChild(el);
    el = document.createElement('p');
    el.textContent = 'You might want to work on:';
    document.getElementById('ask').appendChild(el);
    el = document.createElement('ul')
    if (result.filter(x => !x.correct).length == 0) {
        let e = document.createElement('li');
        e.textContent = 'Nothing! You are ready for chem 163!';
        el.appendChild(e);
    }
    result.filter(x => !x.correct).forEach(x => {
        let e = document.createElement('li');
        e.textContent = x.category
        el.appendChild(e);
    })
    document.getElementById('ask').appendChild(el);
    el = document.createElement('p')
    let t = result.reduce((accum, x) => accum + Math.floor(x.time / 1000), 0)
    el.textContent = 'it took you ' + formatDuration(t) + ' to complete the quiz. Target time is under 20 minutes -- though it really should only take 10.';
    document.getElementById('ask').appendChild(el)
}

let qs = [];
let result = [];
let iter = 0;
(function (){
    let el = document.getElementById('username');
    el.textContent = localStorage.userName ? localStorage.userName : 'anonymous';
    new Question ('how old are you?', ['19','22','26','32'], '26', 'counting');
    new Question ('who are you?', ['bob', 'alice','jessica','nobody'],'nobody', 'identification');
    new Question ('SOz4^2- is called', ['sulfate', 'everclear', 'poison'], 'sulfate', 'polyatomic ions');
    if (!localStorage.quizStarted) {
        //localStorage.quizStarted = true; //TODO uncomment when out of dev environment
        nextQuestion(qs[0]);
    } else {alert ('You have already taken the quiz! No retake!')};
})();