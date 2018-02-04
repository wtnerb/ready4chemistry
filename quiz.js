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

function chemifyInHTML (tag, str){
    //string needs to have 'z' or '^' before sub/superscript.
    //subscripts can only be positive integers
    //in case this is refactored later, use 'z' for subscript and '^' for superscript
    //superscript must have a sign either '+' or '-', a leading '+' will be trimmed (ie 10^+6)
    let mark = '<<><~`;%@';
    let arr = str.replace (/=>/g, '\u2192').replace(/z(\d+)/g, mark + '$1' + mark).replace(/\^([+-]?\d*[+-]?)/g, mark + '$1' + mark).replace(/\n/g, mark + '\n' + mark).split(mark);
    let newEl = document.createElement(tag);
    for (let i in arr){
        if (arr[i].match(/^[+-]?\d*[+-]?$/)) {
            let el = document.createElement('span');
            el.className = arr[i].match(/[+-]/) ? 'superscript' : 'subscript';
            el.textContent = arr[i].replace(/^\+(\d+)/, '$1');
            newEl.append(el);
        } else if (arr[i].match(/^\n$/)) newEl.append(document.createElement('br'));
        else newEl.append(arr[i]);
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
        list.appendChild(el);
        list.appendChild(ans);
    });
    let el = document.createElement('input');
    el.type = 'submit';
    el.value = 'Submit Answer';
    el.classList.add('temp', 'submit');
    list.appendChild(el);
    document.getElementById('answers').addEventListener('submit', answered);
    return list;
}

function Result (event, question, ansIndex) {
    this.userAnswer =  question.options[ansIndex];
    this.timeStamp = event.timeStamp - time;
    time = event.timeStamp;
    this.correct = this.userAnswer == question.truth;
    this.category = question.category;
    result.push(this);
    localStorage.result = JSON.stringify(result);
}

function answered (event) {
    event.preventDefault();
    new Result (event, qs[iter], document.getElementById('answers').ans.value);
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
                num = Math.floor(arr.length * Math.random())
            } while (pair.includes(num))
            pair.push(num);
        }
        let temp = arr[pair[0]];
        arr[pair[0]] = arr[pair[1]];
        arr[pair[1]] = temp;
    }
}

function AnsObj (place, formula, distortions, units){
    distortions.push(1);
    const num = place * twoDigits();
    const answer = formula(num);
    this.arr = distortions.map(x => rendNum(x * answer) + ' ' + units);
    this.correct = this.arr[this.arr.length - 1];
    this.n = rendNum(num);

    function rendNum (n){
        //toPrecision method sometimes returned exponetial notation. Example: 1200.toPrecision(3) output was 1.20e+3
        function replacer (x,y,z){
            let s = '' + y;
            for (let i = y.length; i < z; i++) s += '0';
            return s;
        }
        return n.toPrecision(2).replace(/\.(\d*)e\+(\d+)/, replacer);
    }

    function twoDigits (){
        return 10 + Math.floor(90 * Math.random());
    }
}


let qs = [];
let result = [];
let iter = 0;
let time = 0;
(function (){
    let el = document.getElementById('username');
    el.textContent += localStorage.userName ? localStorage.userName.toUpperCase() : 'anonymous'.toUpperCase();
    let ans =  new AnsObj (.1, x => x / 46, [2, 1/2, 100], 'mol');
    new Question ('How many moles are in ' + ans.n + ' g of pure ethanol, CHz3CHz2OH?', ans.arr, ans.correct, 'Basic stoichiometry - molar mass');
    ans = new AnsObj (.01, x => x * 2, [1/2, 1/4, 2], 'mol');
    new Question ('How many moles of CuO can be produced from ' + ans.n + ' mol of Cuz2O in the following reaction?\n2 Cuz2O(s) + Oz2(g) => 4 CuO(s)',  ans.arr, ans.correct, 'Basic stoichiometry - chemical equations');
    new Question ('Write a balanced net ionic equation for the reaction of Naz2COz3(s) and HCl(aq).', [
        'Naz2COz3(s) + 2 HCl(aq) => 2 NaCl(aq) + Hz2O(l) + COz2(g)',
        '2 Na^+(aq) + COz3^2-(aq) + 2 H^+(aq) + 2 Cl^-(aq) => 2Na^+(aq) + 2 Cl^-(aq) + Hz2O(l) + COz2(g)',
        'Naz2COz3(s) + 2 H^+(aq) => 2 Na^+(aq) + Hz2O(l) + COz2(g)',
        'COz3^2-(aq) + 2 H^+(aq) => Hz2O(l) + COz2(g)'], 'COz3^2-(aq) + 2 H^+(aq) => Hz2O(l) + COz2(g)', 'Ionic equations');
    ans = new AnsObj (.01, x => 4 / x, [2, 3, 4], 'ml');
    new Question ('How many milliliters of ' + ans.n + ' M Naz2S are needed to react with 25mL of 0.32 M AgNOz3?\nNaz2S(aq) + 2 AgNOz3(aq) => 2 NaNOz3(aq) + Agz2S(s)', ans.arr, ans.correct, 'Stoichiometry');
    ans = new AnsObj (1, x => .00131 * x, [2, 1/2, 1/3], 'g');
    new Question ('How many grams of CaClz2 are formed when ' + ans.n + ' mL of 0.00237 M 2Ca(OH)z2 reacts with excess Clz2 gas?\n2 Ca(OH)z2(aq) + 2 Clz2(g) => Ca(OCl)z2(aq) + CaClz2(aq) + 2 Hz2O(l)', ans.arr, ans.correct, 'Stoichiometry');
    new Question ('Which of the following compounds contains ionic bonds?', ['CaO', 'HF', 'NIz3', 'SiOz2'], 'CaO', 'Bond types')
    new Question ('A student weighed 3000. \u00B5g of sulfur in the lab. This is the same mass as', ['3.000 \u00D7 10^-6 g', '3.000 \u00D7 10^-3 kg', '3.000 \u00D7 10^+3 mg', '3.000 \u00D7 10^+6 ng'], '3.000 \u00D7 10^+6 ng', 'SI prefixes');
    new Question ('How much heat is transferred per mole of NHz3(g) formed in the reaction shown below?\nNz2(g) + 3 Hz2(g) => 2 NHz3(g) \u0394H\u00B0 = - 92.2 kJ', ['92.2 kJ', '46.1 kJ', '30.7 kJ', '15.4 kJ'], '46.1 kJ', 'Thermochemistry and Stoichiometry');
    ans = new AnsObj (.1, x => .796 * x, [1.3, .8, 1/2], 'L');
    new Question ('The action of some commercial drain cleaners is based on the following reaction:\n2NaOH(s) + 2 Al(s) + 6 Hz2O(l) => 2 NaAl(OH)z4(s) + 3 Hz2(g)\nWhat is the volume of Hz2 gas formed at STP when ' + ans.n + ' g of Al reacts with excess NaOH?', ans.arr, ans.correct, 'Gas law stoichiometry');
    ans = new AnsObj (.01, x => 87.5 / x, [0.52, 1/8, 1/1000], 'mL');
    new Question ('What volume of ' + ans.n + ' KBr solution is needed to provide 10.5 g of KBr?', ans.arr, ans.correct, 'Basic stoichiometry');
    new Question ('Which one of the following compounds represents a stong acid in an aqueous solution?', ['HNOz3', 'HF', 'HClOz2', 'Hz2SOz3'], 'HNOz3', 'Identifying acids');
    new Question ('When equal volumes of 0.10 M acetic acid and 0.10 M NaOH are combined what type of reaction takes place?', ['oxidation-reduction', 'single displacement', 'neutralization', 'ion-exchange'], 'neutralization', 'Identifying reaction types');
    new Question ('What is the formula for magnesium phosphate?', ['MgP', 'Mgz3Pz3', 'MgPOz4', 'Mgz3(POz4)z2', 'Mgz3POz4'], 'Mgz3(POz4)z2', 'Chemical naming to/from formula');
    new Question ('When 0.10 M acetic acid is combined with 0.10 M NaOH, what are the products of the resultant reaction?', ['acetic hydroxide + Na^+', 'water + sodium acetate', 'sodium acetate + OH^-'], 'water + sodium acetate', 'Acid-base reactions');
    new Question ('What is the initial concentration of OH^- in a reaction mixture when 30. mL 0.50 M NaOH is added to 10. mL of 0.20 M NaF?', ['0.20 M', '0.50 M', '0.38 M', '0.40 M'], '0.38 M', 'Units');
    if (!localStorage.quizStarted) {
        localStorage.quizStarted = true;
        nextQuestion(qs[0]);
    } else {alert ('You have already taken the quiz! No retakes!')};
})();