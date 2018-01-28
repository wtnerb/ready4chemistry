'use strict'

let targetTime = 20 * 60;
let result = JSON.parse(localStorage.result);

function results (result){
    let el = document.createElement('p');
    let numCorrect = result.filter(x => x.correct).reduce(x => x + 1, 0)
    result.forEach(timer);
    el.textContent = 'You got ' + numCorrect + ' correct out of ' + qs.length // + '. ' + (numCorrect > 17/20) ? '\nDont forget that every item on this quiz is fundamental to 163, if you decide to continue your professor will assume you already know and have mastered this material.' : '\nYou should think very carefully about coninuing to 163. It is not recommended.';
    document.getElementById('grade').appendChild(el);
    let t = result.reduce((accum, x) => accum + Math.floor(x.time / 1000), 0)
    displayLearningOpportunities(result, t);
    el = document.createElement('p')
    el.textContent = 'it took you ' + formatDuration(t) + ' to complete the quiz.\nIt should take under ' + timeToComplete + ' minutes.';
    document.getElementById('ask').appendChild(el)
}

function displayLearningOpportunities (result, timeSpent) {
    let el = document.createElement('p');
    el.textContent = 'You might want to work on:';
    document.getElementById('opportunities').appendChild(el);
    el = document.createElement('ul')
    function addLi (str, target) {
        let e = document.createElement('li');
        e.textContent = str;
        target.appendChild(e); 
    }
    if (result.filter(x => !x.correct).length == 0 && targetTime < timeSpent) {
        addLi ('Nothing! you are ready for Chem 163!', el);
    }
    result.filter(x => !x.correct).forEach(x => addLi (x.content, el))
    if (targetTime >= timeSpent) addLi ('Speed/fluency at solving problems.', el);
    document.getElementById('ask').appendChild(el);
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