'use strict'

const targetTime = 20 * 60;
const numQuestions = 15;
let result = JSON.parse(localStorage.result);
result.forEach(timer);
const timeSpent = result.reduce((accum, x) => accum + Math.floor(x.time / 1000), 0);



function results (result){
    let el = document.createElement('p');
    const numCorrect = result.filter(x => x.correct).reduce(x => x + 1, 0);
    el.textContent = 'You got ' + numCorrect + ' correct out of ' + numQuestions;
    document.getElementById('grade').appendChild(el);
    let summ = document.createElement('h4');
    const score = numCorrect/numQuestions;
    if (score > .87 && timeSpent < targetTime) summ.textContent = 'You are good to go!';
    else if (score > .73) summ.textContent = 'You should do some review work before getting deep into 163.';
    else if (score > .60) summ.textContent = 'Talk with your professor before attempting 163. A thorough review of 161 and 162 is in order.';
    else summ.textContent = 'Consider retaking chem 161 and/or 162. Continuing to 163 is not recommended.';
    el = document.createElement('p');
    el.textContent = 'It took you ' + formatDuration(timeSpent) + ' to complete the quiz.\n' + (timeSpent < targetTime ? ' Good work!': ('That is ' + formatDuration(timeSpent - targetTime) + ' longer than it should have taken.'));
    document.getElementById('summary').appendChild(summ);
    document.getElementById('summary').appendChild(el);
    displayLearningOpportunities(result, timeSpent);
}

function displayLearningOpportunities (result, timeSpent) {
    let el = document.createElement('p');
    el.textContent = 'You might want to work on:';
    document.getElementById('opportunities').appendChild(el);
    el = document.createElement('ul');
    function addLi (str, target) {
        let e = document.createElement('li');
        e.textContent = str;
        target.appendChild(e); 
    }
    if (result.filter(x => !x.correct).length == 0 && targetTime < timeSpent) {
        addLi ('Nothing! you are ready for Chem 163!', el);
    }
    result.filter(x => !x.correct).forEach(x => addLi (x.category, el));
    if (targetTime <= timeSpent) addLi ('Speed/fluency at solving problems.', el);
    document.getElementById('opportunities').appendChild(el);
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

function timer (obj, i) {
    let initial = result[i - 1] ? result[i - 1].timeStamp : 0;
    obj.time = obj.timeStamp - initial;
}

document.getElementById('name').textContent = localStorage.userName ? localStorage.userName.toUpperCase() : 'Your';
results(result);