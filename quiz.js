'use strict';

(function (){
  let el = document.getElementById('username');
  el.textContent = localStorage.userName ? localStorage.userName : 'anonymous';
})();

function Question (tag, content, answers, truth){
    this.tag = tag;
    this.content = content;
    this.answers = answers;
    this.truth = truth;
}

Question.prototype.ask = function () {
    let el = document.createElement(this.tag);
    if (this.tag === 'p') el.textContent = this.content;
    else if (this.tag === 'img') el.src = content;//TODO test that this works.
    return el;
}

function nextQuestion () {
    let q = qs.pop();
    let el = document.getElementById('question');
    el.firstChild.remove();
    el.appendChild(q.ask());
}

let qs = [new Question ('p', 'who are you?', ['bob', 'alice','jessica','nobody'],'nobody'),
          new Question ('p',  'how old are you?', [19,22,26,32], 26)];