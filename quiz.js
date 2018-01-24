'use strict';

(function (){
  let el = document.getElementById('username');
  el.textContent = localStorage.userName ? localStorage.userName : 'anonymous';
})();

function Question (tag, content, options, truth){
    this.tag = tag;
    this.content = content;
    this.options = options;
    this.truth = truth;
}

Question.prototype.ask = function () {
    let el = document.createElement(this.tag);
    if (this.tag === 'p') el.textContent = this.content;
    //else if (this.tag === 'img') el.src = content;//TODO test that this works.
    el.classList.add('temp','question','text')
    return el;
}

function nextQuestion () {
    let q = qs.pop();
    let el = document.getElementById('question');
    let old = document.getElementsByClassName('temp');
    while (old[0]) old[0].remove();
    el.appendChild(q.ask());
    el.appendChild(q.answers());
}

let qs = [new Question ('p', 'who are you?', ['bob', 'alice','jessica','nobody'],'nobody'),
          new Question ('p',  'how old are you?', [19,22,26,32], 26)];

Question.prototype.answers = function () {
    let list = document.getElementById('answers')
    this.options.forEach((x,y) => {
        let el = document.createElement('input');
        el.type = 'radio';
        el.name = 'ans'
        el.id = y;
        el.value = y;
        el.classList.add('temp', 'question', 'checkbox');
        let ans =  document.createElement('label');
        ans.for = y;
        ans.classList.add('temp', 'question', 'answer');
        ans.textContent = x;
        list.appendChild(el);
        list.appendChild(ans);
    });
    let el = document.createElement('button');
    el.type = 'submit';
    el.textContent = 'Submit';
    el.classList.add('temp', 'submit');
    list.appendChild(el);
    return list;
}
nextQuestion();