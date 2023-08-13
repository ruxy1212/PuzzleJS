//settings
var difficulty = 3;
// {level:difficulty, highScore: {3:[1,2,3,4,5], 4:[1,2,3,4,5], 5:[1,2,3,4,5], 6:[1,2,3,4,5] }}  ... 3:[], 4:[], 5:[], 6:[]
var localSetting = {level:difficulty, highScore: {3:[], 4:[], 5:[], 6:[] }}
const settings = JSON.parse(localStorage.getItem('puzzleJS'));
if (settings) {
    localSetting = settings;
}else{
    dSet = {level:difficulty, highScore: {3:[], 4:[], 5:[], 6:[] }}
    localStorage.setItem('puzzleJS', JSON.stringify(dSet));
} 
difficulty = localSetting.level;
let currentEmpty = 0, leftTopCell = difficulty*difficulty;
var bgs = ["255, 255, 255", "222, 222, 222", "231, 218, 218", "231, 225, 218", "231, 231, 218", "224, 231, 218", "218, 231, 223", "218, 231, 230", "218, 222, 231", "224, 218, 231", "231, 218, 230", "216, 180, 180", "216, 199, 180", "215, 216, 180", "194, 216, 180", "180, 216, 193", "180, 208, 216", "180, 186, 216", "192, 180, 216", "216, 180, 211"], cx;

var pcs = {
    3: ['haiyrea.jpg', 'RiriY.PNG'],
    4: ['haiyrea.jpg', 'RiriY.PNG'],
    5: ['haiyrea.jpg', 'RiriY.PNG'],
    6: ['haiyrea.jpg', 'RiriY.PNG']
};

initGame();
const cells = document.querySelectorAll('.cell');
const emptyCell = document.querySelector('.empty-cell');
let rand = Math.floor(Math.random() * 2);
let gamePic = pcs[difficulty][rand];
cells.forEach((cell) => {
    cell.style.backgroundImage = `url(img/${gamePic})`;
});
emptyCell.style.backgroundImage = `url(img/${gamePic})`;

const imageSize = 360; // Adjust based on full image size
const cellSize = imageSize/difficulty;

let cellSelected = null, froIndex, toIndex, hasMadeMove = null, timeStart = null, timeEnd = null;
let cellOrder = [...Array(difficulty*difficulty).keys()];
let winArray = [...Array(difficulty*difficulty).keys()];
shuffleArray(cellOrder);
callTimer();

function initGame(){
    fr = Math.floor(Math.random()*20)+1;
    document.body.style.background = "rgb("+bgs[fr-1]+")";

    var gameBoard = document.querySelector('.game-board');
    gameBoard.className = 'game-board';
    gameBoard.classList.add('game-'+difficulty);
    gameBoard.innerHTML = "";
    var leftTop = document.createElement('div');
    leftTop.className = 'empty-cell cell-'+difficulty;
    gameBoard.appendChild(leftTop);
    var leftText = document.createElement('div');
    leftText.className = 'text-cell-'+difficulty;
    gameBoard.appendChild(leftText);
    for(let i = 0; i < leftTopCell; i++){
        var e = document.createElement('div');
        e.className = 'cell cell-'+difficulty;
        gameBoard.appendChild(e);
    }
}

function newGame(){
    currentEmpty = 0;
    emptyCell.classList.remove("currently-empty");
    hasMadeMove = null, timeStart = null, timeEnd = null;
    shuffleArray(cellOrder);
    callTimer()
    updateCellPositions();
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
updateCellPositions();

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)+1;
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function callTimer(){
    timeStart = new Date();
    if(difficulty === 5 || difficulty === 6){
        let time = difficulty===5?360:180;
        clearInterval(cx);
        var t = document.querySelector('.timer');
        var mid = 30, end = 0;

        cx = setInterval(function() {
            end++;
            var dis = time - end;
            if (dis < 0) {
                clearInterval(cx);
                t.className = "timer";
                console.log('Game should end');
                //game should end
            } else{
                if(dis < mid){
                    t.className = "timer red";
                }else{
                    t.className = "timer";
                }
                t.innerHTML = padUp(dis,2);
            }   
        }, 1000);
    }
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
        // if(cellSelected !== null){
        //     cells[cellSelected].classList.remove('active');
        //     cellSelected = null;
        // }
        if(winArray.every((value,index) => value === cellOrder[index])){
            timeEnd = new Date();
            let distance = timeEnd.getTime() - timeStart.getTime();
            getDuration(distance);
            isHighScore(distance, localSetting.highScore[difficulty]);
            console.log('won'); //padUp(dis,2);
        } 
        else console.log('no win');
        return;
    }
    if(currentEmpty === leftTopCell){
        cells[0].classList.add("currently-empty");
        emptyCell.classList.remove("currently-empty");
        emptyCell.style.backgroundPosition = `-0px -0px`;
        currentEmpty = 0;
        return;
    }
    if(cellSelected === null && index !== currentEmpty){
        cellSelected = index;
        cells[index].classList.add("active");
    }else if(cellSelected !==null && index === currentEmpty){       
        if(!isAdjacent(difficulty, index, cellSelected)) {
            //shake and complain of "invalid move"
            console.log('shake and complain of "invalid move"');
            return
        };
        [cellOrder[index], cellOrder[cellSelected]] = [cellOrder[cellSelected], cellOrder[index]];
        cells[cellSelected].classList.remove('active');
        currentEmpty = cellSelected;
        updateCellPositions();
        cellSelected = null;
        hasMadeMove = true;
    }else if(cellSelected !== null && index === cellSelected){
        cells[index].classList.remove("active");
        cellSelected = null;
    }else{
        //shake and complain of "invalid move"
        console.log('shake and complain of "invalid move"');
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
            //new high score added
            console.log('new high score added');
        }
    }else{
        arr.push(dur);
        sortScore(arr);
        addHighScore()
        //new high score added
        console.log('new high score added');
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

// Function to check if cells are adjacent
function isAdjacent(rows, index, selectedCell) {
    let indexRow = Math.floor(index/rows);
    let indexCol = index % rows;
    let selectedRow = Math.floor(selectedCell/rows);
    let selectedCol = selectedCell % rows;
    let rowDiff = Math.abs(indexRow - selectedRow);
    let colDiff = Math.abs(indexCol - selectedCol);
    if(rows === 3) return true;
    else if(rows === 4 || rows === 5) return (rowDiff <= 1 && colDiff <= 1) && (rowDiff + colDiff > 0);
    else if(rows === 6) return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

function checkAdjacency(){
    var combos = [
        [0,1],
        [1,2],
        [3,4],
        [4,5],
        [6,7],
        [7,8],
        [0,3],
        [3,6],
        [1,4],
        [4,7],
        [2,5],
        [5,8]
    ]

    combos.forEach((combo) => {
        const [a, b] = combo;
        if(isAdjacent(3, a, b)) console.log(a+" and "+b+" isAdjacent");
    });
}
// checkAdjacency();


//levels::: timing, movement(free,adjacent,strict), size... pictures.. hint
// easy(no-time, free, 9, 5smallPics)... hint:yes
// mid(no-time, adjacent, 16, 5midPics).. hint:yes
// hard(time, adjacent, 25, 5hardPics)..300secs.. hint: yes
// Super(time, strict, 36, 5superPics)..180secs..  hint: no
//homepage:::background(level/button to start)...(info/credits button)...(highscores)
//gamescreen:::hint_btn(pop-up)...timer(top-right)...((modal pop-up))play again)::lose or win...
//other game screen buttons: go to homepage, restart..