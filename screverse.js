var difficulty = 3, localSetting = {level:difficulty, highScore: {3:[], 4:[], 5:[], 6:[] }};
const settings = JSON.parse(localStorage.getItem('puzzleJS'));
    if (settings) {
        localSetting = settings;
    }else{
        let dSet = {level:difficulty, highScore: {3:[], 4:[], 5:[], 6:[] }}
        localStorage.setItem('puzzleJS', JSON.stringify(dSet));
    }
    updateHighScoreTable();
let currentEmpty;
var difficulties = {3: 'Easy', 4: 'Medi', 5: 'Hard', 6: 'Supe'}, messages = {0:['Oops', 'YOUR TIME ELAPSED', false, 'font-tech'], 1: ['Great Job!', '0:00', true, 'font-digital']};
var bgs = ["255, 255, 255", "222, 222, 222", "231, 218, 218", "231, 225, 218", "231, 231, 218", "224, 231, 218", "218, 231, 223", "218, 231, 230", "218, 222, 231", "224, 218, 231", "231, 218, 230", "216, 180, 180", "216, 199, 180", "215, 216, 180", "194, 216, 180", "180, 216, 193", "180, 208, 216", "180, 186, 216", "192, 180, 216", "216, 180, 211"], cx;
var pcs = {
    3: ['haiyrea.jpg', 'RiriY.PNG'],
    4: ['haiyrea.jpg', 'RiriY.PNG'],
    5: ['haiyrea.jpg', 'RiriY.PNG'],
    6: ['haiyrea.jpg', 'RiriY.PNG']
};
var cells, emptyCell;

let imageSize;
let cellSize;
let cellSelected, froIndex, toIndex, hasMadeMove, timeDiff;
let confirmHome;
let cellOrder;
let winArray;

function goToGame(gameLevel){
    cellSelected = null; froIndex = null; toIndex = null; hasMadeMove = null; timeDiff = 0; confirmHome = false;
    difficulty = Number(gameLevel);

    // difficulty = localSetting.level;
    currentEmpty = 0, leftTopCell = difficulty*difficulty;
    initGame();
    insertPic();

    let bodyBottom = document.body.getBoundingClientRect().bottom, footBottom = document.querySelector('.game-foot').getBoundingClientRect().bottom;
    let allowancePT = footBottom - bodyBottom;
    if(allowancePT > 5){ 
        if(allowancePT < 20){ 
            document.querySelector('.game-page').classList.add('scale-1');
        }else if(allowancePT < 40){
            document.querySelector('.game-page').classList.add('scale-2');
        }else if(allowancePT < 60){
            document.querySelector('.game-page').classList.add('scale-3');
        }else if(allowancePT < 80){
            document.querySelector('.game-page').classList.add('scale-4');
        } else document.querySelector('.game-page').classList.add('scale-5');
    }
    if(difficulty === 5 || difficulty === 6) document.querySelector('.timer__bg').classList.remove('unsee');

    imageSize = 360; // Adjust based on full image size
    cellSize = imageSize/difficulty;

    cellOrder = [...Array(difficulty*difficulty).keys()];
    winArray = [...Array(difficulty*difficulty).keys()];
    shuffleArray(cellOrder);
    callTimer();
    updateCellPositions();
    updateTopCell();
    showGame();
}

function initGame(){
    setBodyBG();

    var gameBoard = document.querySelector('.game-board');
    gameBoard.className = 'game-board';
    gameBoard.classList.add('game-'+difficulty);
    gameBoard.innerHTML = "";
    var leftTop = document.createElement('div');
    leftTop.className = 'empty-cell cell-'+difficulty;
    gameBoard.appendChild(leftTop);
    var leftText = document.createElement('div');
    leftText.className = 'text-cell-'+difficulty+' p-sp-'+difficulty;
    leftText.innerHTML = '<h1 class="h1 text3d">PuzzleJS</h1>';
    leftText.innerHTML += `<p class="text2d"><b>Difficulty:</b> ${difficulties[difficulty]}</p>`;
    leftText.innerHTML += '<p class="text2d font-tech"><b>Time Elapsed:</b> <span class="font-digital">0.00<span></p>';
    gameBoard.appendChild(leftText);
    for(let i = 0; i < leftTopCell; i++){
        var e = document.createElement('div');
        e.className = 'cell cell-'+difficulty;
        gameBoard.appendChild(e);
    }
}

function insertPic(){
    cells = document.querySelectorAll('.cell');
    emptyCell = document.querySelector('.empty-cell');
    let rand = Math.floor(Math.random() * 2);
    let gamePic = pcs[difficulty][rand];
    cells.forEach((cell) => {
        cell.style.backgroundImage = `url(img/${gamePic})`;
    });
    emptyCell.style.backgroundImage = `url(img/${gamePic})`;
}

function setBodyBG(){
    fr = Math.floor(Math.random()*20)+1;
    document.body.style.background = "rgb("+bgs[fr-1]+")"; //querySelector('.game-page')
}

function newGame(){
    if(hasMadeMove){
        document.querySelector('.modal__container.confirm').classList.remove('unsee');
        return;
    }
    let rand = Math.floor(Math.random() * 2);
    let gamePic = pcs[difficulty][rand];
    cells.forEach((cell) => {
        cell.style.backgroundImage = `url(img/${gamePic})`;
    });
    emptyCell.style.backgroundImage = `url(img/${gamePic})`;
    setBodyBG();
    currentEmpty = 0;
    emptyCell.classList.remove("currently-empty");
    document.querySelector('.high-score').classList.add('unsee');
    hasMadeMove = null, timeDiff = 0;
    shuffleArray(cellOrder);
    callTimer()
    updateCellPositions();
    updateTopCell();
    if(difficulty === 3 || difficulty === 4) document.querySelector('.timer__bg').classList.add('unsee');
    else document.querySelector('.timer__bg').classList.remove('unsee');
}

function endRestart(boo){
    if(boo === 2){ 
        document.querySelector('.modal__container.confirm').classList.add('unsee');
        hasMadeMove = null;
        if(confirmHome) { goHome(); return; }
        newGame();
        return;
    }else if(boo === 3) {
        document.querySelector('.modal__container.confirm').classList.add('unsee');
        return;
    }
    let el = document.querySelector('.game-container');
    if(boo === 0) el.classList.remove('lose-penalty');
    else el.classList.remove('win-penalty');
    document.querySelector('.modal__container.game').classList.add('unsee');
    newGame();
}

function updateCellPositions() {
    cells.forEach((cell, index) => {
        if(index == currentEmpty) { cell.classList.add("currently-empty"); }
        else{
            const row = Math.floor(cellOrder[index] / difficulty);
            const col = cellOrder[index] % difficulty;
            const posX = col * cellSize;
            const posY = row * cellSize;
            cell.classList.remove("currently-empty");
            cell.style.backgroundPosition = `-${posX}px -${posY}px`;
        }
        cell.setAttribute("onclick", "moveCell("+index+")");
    });
    emptyCell.style.backgroundPosition = `-0px -0px`;
    emptyCell.setAttribute("onclick", "moveCell("+leftTopCell+")");
}

function updateTopCell(){
    emptyCell.classList.add("currently-empty")
    cells[0].style.backgroundPosition = `-0px -0px`;
    cells[0].classList.remove("currently-empty");
    currentEmpty = leftTopCell;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)+1;
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function shakeBoard(){
    let boardShake = document.querySelector('.game-container');
    boardShake.classList.add('area-shake');
    setTimeout(function(){
        boardShake.classList.remove('area-shake');
    }, 600);
}

function givePenalty(verdict){
    document.querySelector('.font-sha3d').innerHTML = messages[verdict][0];
    document.querySelector('.text-blink > span').className = messages[verdict][3];
    document.querySelector('.text-blink > span').innerHTML = (messages[verdict][2])?getDuration(timeDiff):messages[verdict][1];
    document.querySelector('.modal__container.game').classList.remove('unsee');
    document.querySelector('.timer__bg').classList.add('unsee');
    hasMadeMove = null;
    document.querySelector('.stone-button-chiseled[onclick="endRestart()"]').setAttribute('onclick', `endRestart(${verdict})`);
    updateHighScoreTable();
}

function callTimer(){
    let time = 0;
    clearInterval(cx);
    var t = document.querySelector('.timer');
    var mid = 30, end = 0;
    if(difficulty === 5 || difficulty === 6){
        time = difficulty===5?360:600;
    }
    cx = setInterval(function() {
        end++;
        timeDiff = end;
        document.querySelector('.font-tech > span.font-digital').innerHTML = getDuration(end);

        if(difficulty === 5 || difficulty === 6){
            var dis = time - end;
            if (dis < 0) {
                clearInterval(cx);
                t.className = "timer";
                document.querySelector('.game-container').classList.add('lose-penalty');
                givePenalty(0);
            } else{
                if(dis < mid){
                    t.className = "timer red";
                }else{
                    t.className = "timer";
                }
                t.innerHTML = padUp(dis,2);
            } 
        }       
    }, 1000);
}

function padUp(el,num){
    return el.toString().padStart(num, '0');
}

// Function to handle cell movement
function moveCell(index) {
    if(index === leftTopCell && currentEmpty === 0 && cellSelected === null){
        emptyCell.classList.add("currently-empty")
        cells[0].style.backgroundPosition = `-0px -0px`;
        cells[0].classList.remove("currently-empty");
        currentEmpty = leftTopCell;
        if(winArray.every((value,index) => value === cellOrder[index])){
            isHighScore(timeDiff, localSetting.highScore[difficulty]);
            clearInterval(cx);
            document.querySelector('.game-container').classList.add('win-penalty');
            setTimeout(function(){
                givePenalty(1);
            }, 3000);
        } 
        else shakeBoard();
        return;
    }
    if(currentEmpty === leftTopCell){
        cells[0].classList.add("currently-empty");
        emptyCell.classList.remove("currently-empty");
        emptyCell.style.backgroundPosition = `-0px -0px`;
        currentEmpty = 0;
        return;
    }
    if(cellSelected === null && index !== currentEmpty && index !== leftTopCell){
        cellSelected = index;
        cells[index].classList.add("active");
    }else if(cellSelected !==null && index === currentEmpty){       
        if(!isAdjacent(difficulty, index, cellSelected)) {
            shakeBoard();
            return;
        };
        [cellOrder[index], cellOrder[cellSelected]] = [cellOrder[cellSelected], cellOrder[index]];
        cells[cellSelected].classList.remove('active');
        currentEmpty = cellSelected;
        updateCellPositions();
        cellSelected = null;
        hasMadeMove = true;
    }else if(cellSelected !== null && index !== currentEmpty && index !== cellSelected){
        if(difficulty === 6){
            [cellOrder[index], cellOrder[cellSelected]] = [cellOrder[cellSelected], cellOrder[index]];
            cells[cellSelected].classList.remove('active');
            updateCellPositions();
            cellSelected = null;
            hasMadeMove = true;
        }else{
            shakeBoard();
            return; 
        }
    }else if(cellSelected !== null && index === cellSelected){
        cells[index].classList.remove("active");
        cellSelected = null;
    }else{
        shakeBoard();
    }
}

function getDuration(distance){
    let duration;
    let sec = distance % 60;
    let min = Math.floor(distance/60);
    let hr = "";
    if(Math.floor(min/60) !== 0 ){ hr = Math.floor(min/60)+":"; min = min % 60; }
    duration = hr+padUp(min,2)+":"+padUp(sec,2);
    return duration;
}

function isHighScore(dur, arr){
    if(isFull(arr)){
        const smallest = smallestScore(arr);
        if(dur<smallest){
            replaceSmallest(dur, smallest, arr);
            sortScore(arr);
            addHighScore()
            document.querySelector('.high-score').classList.remove('unsee');
        }
    }else{
        arr.push(dur);
        sortScore(arr);
        addHighScore()
        document.querySelector('.high-score').classList.remove('unsee');
    }
}

function addHighScore(){
    localStorage.setItem('puzzleJS', JSON.stringify(localSetting)); 
}

function isFull(array){
    return array.length === 5;
}

function smallestScore(array){
    return Math.max(...array);
}

function replaceSmallest(el, smallest, arr){
    arr.splice(arr.indexOf(smallest), 1, el);
}

function sortScore(array){
    array.sort((a, b) => a - b);
}

function isAdjacent(rows, index, selectedCell) {
    if(rows === 6 || rows === 5) return true;
    let indexRow = Math.floor(index/rows);
    let indexCol = index % rows;
    let selectedRow = Math.floor(selectedCell/rows);
    let selectedCol = selectedCell % rows;
    let rowDiff = Math.abs(indexRow - selectedRow);
    let colDiff = Math.abs(indexCol - selectedCol);
    if(rows === 4) return (rowDiff <= 1 && colDiff <= 1) && (rowDiff + colDiff > 0);
    else if(rows === 3) return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

function goHome(){ 
    if(hasMadeMove){
        confirmHome = true;
        document.querySelector('.modal__container.confirm').classList.remove('unsee');
        return;
    }
    document.querySelector('.game-page').classList.add('unsee-special');
    document.querySelector('.modal__container.game').classList.add('unsee');
    document.querySelector('.body-div').classList.remove('unsee');
    confirmHome = false;
}

function showGame(){
    document.querySelector('.game-page').classList.remove('unsee-special');
    document.querySelector('.body-div').classList.add('unsee');
}

function showHint(){
    document.querySelector('.modal__container.hint').classList.remove('unsee');
}

function showInfo(){
    document.querySelector('.modal__container.info').classList.remove('unsee');
}

function closeModal(el){
    document.querySelector('.modal__container.'+el).classList.add('unsee');
}

function updateHighScoreTable(){
    let scores = [[3,4], [5,6]];
    let tables = document.querySelectorAll('.twin-table-container table');
    tables.forEach((table, i) => {
        let rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, j) => {
            let tds = row.querySelectorAll('td');
            tds.forEach((td, k) => {
                td.innerHTML = typeof localSetting.highScore[scores[i][k]][j] === 'undefined' ? '&nbsp;' : getDuration(localSetting.highScore[scores[i][k]][j]);
            });
        });
    });
}