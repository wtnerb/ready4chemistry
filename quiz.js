'use strict';

function Question (content, options, truth, category){
    this.content = content;
    randomizeOrder(options);
    this.options = options;
    this.truth = truth;
    this.category = category;
    qs.push(this);
}

Question.prototype.ask = function () {
    let el = chemifyInHTML('p', this.content);
    el.classList.add('temp','question','text');
    return el;
}

function timer (obj, i) {
    let initial = result[i - 1] ? result[i - 1].timeStamp : 0;
    obj.time = obj.timeStamp - initial;
}

function chemifyInHTML (tag, str){
    //string needs to have 'z' or '^' before sub/superscript.
    //subscripts can only be positive integers
    //in case this is refactored later, use 'z' for subscript and '^' for superscript
    //superscript must have a sign either '+' or '-', a leading '+' will be trimmed (ie 10^+6)
    let mark = '<<><~`;%@';
    let arr = str.replace (/=>/g, '\u2192').replace(/z(\d+)/g, mark + '$1' + mark ).replace(/\^([+-]?\d*[+-]?)/g, mark + '$1' + mark ).split(mark );
    let newEl = document.createElement(tag);
    for (let i in arr){
        if (arr[i].match(/^[+-]*\d*[+-]*$/)) {
            let el = document.createElement('span');
            el.className = arr[i].match(/[+-]/) ? 'superscript' : 'subscript';
            el.textContent = arr[i].replace(/^\+(\d+)/, '$1');
            newEl.append(el);
        } else newEl.append(arr[i]);
    }
    return newEl;
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
        ans.setAttribute('for', y);
        ans.classList.add('temp', 'question', 'answer');
        let brk = document.createElement('br')
        brk.className = 'temp';
        list.appendChild(el);
        list.appendChild(ans);
        list.appendChild(brk);
    });
    let el = document.createElement('input');
    el.type = 'submit';
    el.value = 'Submit answer';
    el.classList.add('temp', 'submit');
    list.appendChild(el);
    document.getElementById('answers').addEventListener('submit', answered);
    return list;
}

function answered (event) {
    event.preventDefault();
    let i = document.getElementById('answers').ans.value;
    result.push ({userAnswer: qs[iter].options[i], timeStamp: event.timeStamp});
    result[iter].correct = result[iter].userAnswer == qs[iter].truth;
    result[iter].category = qs[iter].category;
    localStorage.result = JSON.stringify(result);
    iter++;
    if (qs[iter]) nextQuestion(qs[iter]);
    else window.location.href = 'results.html';
    ;
}

function randomizeOrder (arr){
    //Inefficeint, but this application only uses small arrays. Refactor later.
    for (let i = 0; i < 2 * arr.length; i ++){
        let pair = [];
        let num  = -1
        for (let j = 0; j < 2; j++){
            do {
                num = Math.floor(arr.length* Math.random())
            } while (pair.includes(num))
            pair.push (num);
        }
        let temp = arr[pair[0]];
        arr[pair[0]] = arr[pair[1]];
        arr[pair[1]] = temp;
    }
}

let qs = [];
let result = [];
let iter = 0;
(function (){
    let el = document.getElementById('username');
    el.textContent += localStorage.userName ? localStorage.userName.toUpperCase() : 'anonymous'.toUpperCase();
    new Question ('How many moles are in 1.5g of pure ethanol, CHz3CHz2OH?', ['0.015 mol','0.033 mol','31 mol','69 mol'], '31 mol', 'Basic stoichiometry - molar mass');
    new Question ('How many moles of CuO can be produced from 0.450 mol of Cuz2O in the following reaction?\n\t2 Cuz2O(s) + Oz2(g) => 4 CuO(s)', ['0.23 mol', '0.45 mol','0.90 mol','1.8 mol'],'0.90 mol', 'Basic stoichiometry - chemical equations');
    new Question ('Write a balanced net ionic equation for the reaction of Naz2COz3(s) and HCl(aq).', [
        'Naz2COz3(s) + 2 HCl(aq) => 2 NaCl(aq) + Hz2O(l) + COz2(g)',
        '2 Na^+(aq) + COz3^2-(aq) + 2 H^+(aq) + 2 Cl^-(aq) => 2Na^+(aq) + 2 Cl^-(aq) + Hz2O(l) + COz2(g)',
        'Naz2COz3(s) + 2 H^+(aq) => 2 Na^+(aq) + Hz2O(l) + COz2(g)',
        'COz3^2-(aq) + 2 H^+(aq) => Hz2O(l) + COz2(g)'], 'COz3^2-(aq) + 2 H^+(aq) => Hz2O(l) + COz2(g)', 'Ionic equations');
    new Question ('How many milliliters of 0.26 M Naz2S are needed to react with 25mL of 3.2 M AgNOz3?\n\tNaz2S(aq) + 2 AgNOz3(aq) => 2NaNOz3(aq) + Agz2S(s)', ['15 mL', '30 mL', '41 mL', '61 mL'], '15 mL', 'Stoichiometry');
    new Question ('How many grams of CaClz2 are formed when 35 mL of 0.00237 M Ca(OH)z2 reacts with excess Clz2 gas?\n\tCa(OH)z2(aq) + 2 Clz2(g) => Ca(OCl)z2(aq) + CaClz2(aq) + 2 Hz2O(l)', ['0.0046 g', '0.0092 g', '0.018 g', '0.022 g'], '0.0046 g', 'Stoichiometry');
    new Question ('Which of the following compounds contains ionic bonds?', ['CaO', 'HF', 'NIz3', 'SiOz2'], 'CaO', 'Bond types')
    new Question ('A student weighed 3000. \u00B5g of sulfur in the lab. This is the same mass as', ['3.000 \u00D7 10^-6 g', '3.000 \u00D7 10^-3 kg', '3.000 \u00D7 10^+3 mg', '3.000 \u00D7 10^+6 ng'], '3.000 \u00D7 10^-6 g', 'SI prefixes');
    new Question ('How much heat is transferred per mole of NHz3(g) formed in the reaction shown below?\n\tNz2(g) + 3 Hz2(g) => 2 NHz3(g) \t\t\u0394H\u00B0 = - 92.2 kJ', ['92.2 kJ', '46.1 kJ', '30.7 kJ', '15.4 kJ'], '46.1 kJ', 'Thermochemistry and Stoichiometry');
    new Question ('The action of some commercial drain cleaners is based on the following reaction:\n\t2NaOH(s) + 2 Al(s) + 6 HzO(l) => 2 NaAl(OH)z4(s) + Hz2(g)\nWhat is the volume of Hz2 gas formed at STP when 4.3 g of Al reacts with excess NaOH?', ['2.4 L', '3.6 L', '5.4 L', '5.9 L'], '5.4 L', 'Gas law stoichiometry');
    new Question ('What volume of 0.72 M KBr solution is needed to provike 10.5 g of KBr?', ['7.5 mL', '15 mL', '63 mL', '120 mL'], '7.5 mL', 'Basic stoichiometry');
    new Question ('Which one of the following compounds represents a stong acid in an aqueous solution?', ['HNOz3', 'HF', 'HClOz2', 'Hz2SOz3'], 'HNOz3', 'Identifying acids');
    new Question ('When equal volumes of 0.10 M acetic acid and 0.10 M NaOH are combined what type of reaction takes place?', ['oxidation-reduction', 'single displacement', 'neutralization', 'ion-exchange'], 'neutralization', 'Identifying reaction types');
    new Question ('What is the formula for magnesium phosphate?', ['MgP', 'Mgz3Pz3', 'MgPOz4', 'Mgz3(POz4)z2', 'Mgz3POz4'], 'Mgz3(POz4)z2', 'Chemical naming to/from formula');
    new Question ('When 0.10 M acetic acid is combined with 0.10 M NaOH, what are the products of the resultant reaction?', ['acetic hydroxide + Na^+', 'water + sodium acetate', 'sodium acetate + OH^-'], 'water + sodium acetate', 'Acid-base reactions');
    new Question ('What is the initial concentration of OH^- in a reaction mixture when 30. mL 0.50 M NaOH is added to 10. mL of 0.20 M NaF?', ['0.20 M', '0.50 M', '0.38 M', '0.40 M'], '0.38 M', 'Units');
    if (!localStorage.quizStarted) {
        //localStorage.quizStarted = true; //TODO uncomment when out of dev environment
        nextQuestion(qs[0]);
    } else {alert ('You have already taken the quiz! No retakes!')};
})();