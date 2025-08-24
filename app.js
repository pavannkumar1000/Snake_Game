const gameBoard = document.getElementById('gameBoard');
const context = gameBoard.getContext('2d');
const scoreText = document.getElementById('scoreVal');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');

const WIDTH = gameBoard.width;
const HEIGHT = gameBoard.height; 
const UNIT = 25;

let foodX;
let foodY;
let xVel = UNIT;
let yVel = 0;
let score = 0;
let active = true;
let started = false;
let paused = false;

let snake = [];

function initSnake(){
    snake = [
        {x: UNIT*3, y:0},
        {x: UNIT*2, y:0},
        {x: UNIT, y:0},
        {x: 0, y:0}
    ];
}

initSnake();

window.addEventListener('keydown', keyPress);

// Mobile button controls
document.getElementById('up').addEventListener('click', () => changeDirection('up'));
document.getElementById('down').addEventListener('click', () => changeDirection('down'));
document.getElementById('left').addEventListener('click', () => changeDirection('left'));
document.getElementById('right').addEventListener('click', () => changeDirection('right'));

// Action buttons
pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', restartGame);

// Mobile swipe controls
let startX, startY;
document.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});
document.addEventListener('touchend', e => {
    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let dx = endX - startX;
    let dy = endY - startY;

    if(Math.abs(dx) > Math.abs(dy)) {
        if(dx > 0) changeDirection('right');
        else changeDirection('left');
    } else {
        if(dy > 0) changeDirection('down');
        else changeDirection('up');
    }
});

startGame();

function startGame(){
    clearBoard();
    createFood();
    displayFood();
    drawSnake();
}

function clearBoard(){
    context.fillStyle = '#212121';
    context.fillRect(0,0,WIDTH,HEIGHT);
}

function createFood(){
    foodX = Math.floor(Math.random()*WIDTH/UNIT)*UNIT;
    foodY = Math.floor(Math.random()*HEIGHT/UNIT)*UNIT;
}

function displayFood(){
    context.fillStyle = 'red';
    context.fillRect(foodX,foodY,UNIT,UNIT)
}

function drawSnake(){
    context.fillStyle = 'aqua';
    context.strokeStyle = '#212121';
    snake.forEach((snakePart) => {
        context.fillRect(snakePart.x,snakePart.y,UNIT,UNIT)
        context.strokeRect(snakePart.x,snakePart.y,UNIT,UNIT)
    })
}

function moveSnake(){
    const head = {x: snake[0].x + xVel, y: snake[0].y + yVel};
    snake.unshift(head);
    if(snake[0].x === foodX && snake[0].y === foodY){
        score += 1;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function nextTick(){
    if(active && !paused){
        setTimeout(() => {
            clearBoard();
            displayFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 200);
    } else if(!active){
        clearBoard();
        context.font = "bold 50px serif";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText("Game Over!!", WIDTH/2, HEIGHT/2)
    }
}

function keyPress(event){
    if(!started){
        started = true;
        nextTick();
    }

    
    if(event.key === " " || event.code === "Space"){
        event.preventDefault(); 
    }

    const keyMap = {37:'left',38:'up',39:'right',40:'down'};
    if(keyMap[event.keyCode]){
        event.preventDefault(); 
        changeDirection(keyMap[event.keyCode]);
    }
}


function changeDirection(direction){
    switch(direction){
        case 'left':
            if(xVel !== UNIT){ xVel=-UNIT; yVel=0; }
            break;
        case 'right':
            if(xVel !== -UNIT){ xVel=UNIT; yVel=0; }
            break;
        case 'up':
            if(yVel !== UNIT){ xVel=0; yVel=-UNIT; }
            break;
        case 'down':
            if(yVel !== -UNIT){ xVel=0; yVel=UNIT; }
            break;
    }
    if(!started){
        started = true;
        nextTick();
    }
}

function togglePause(){
    if(!active) return;
    paused = !paused;
    pauseBtn.textContent = paused ? "Resume" : "Pause";
    if(!paused) nextTick();
}

function restartGame(){
    active = true;
    paused = false;
    score = 0;
    scoreText.textContent = score;
    xVel = UNIT;
    yVel = 0;
    initSnake();
    pauseBtn.textContent = "Pause";
    startGame();
    started = false;
}

function checkGameOver(){
    if(snake[0].x < 0 || snake[0].x >= WIDTH || snake[0].y < 0 || snake[0].y >= HEIGHT){
        active = false;
    }
    for(let i = 1; i < snake.length; i++){
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            active = false;
        }
    }
}
