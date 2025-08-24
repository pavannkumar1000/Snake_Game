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

let snake = [
    {x: UNIT*3, y: 0},
    {x: UNIT*2, y: 0},
    {x: UNIT, y: 0},
    {x: 0, y: 0}
];

startGame();

window.addEventListener('keydown', keyPress);
pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', restartGame);


let touchStartX = 0;
let touchStartY = 0;

gameBoard.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, false);

gameBoard.addEventListener('touchend', (e) => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if(Math.abs(deltaX) > Math.abs(deltaY)){
        if(deltaX > 0 && xVel !== -UNIT) { xVel = UNIT; yVel = 0; } 
        else if(deltaX < 0 && xVel !== UNIT) { xVel = -UNIT; yVel = 0; }
    } else {
        if(deltaY > 0 && yVel !== -UNIT) { xVel = 0; yVel = UNIT; } 
        else if(deltaY < 0 && yVel !== UNIT) { xVel = 0; yVel = -UNIT; } 
    }

    if(!started){
        started = true;
        nextTick();
    }
}, false);


gameBoard.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

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
    foodX = Math.floor(Math.random() * WIDTH / UNIT) * UNIT;
    foodY = Math.floor(Math.random() * HEIGHT / UNIT) * UNIT;
}

function displayFood(){
    context.fillStyle = 'red';
    context.fillRect(foodX, foodY, UNIT, UNIT);
}

function drawSnake(){
    context.fillStyle = 'aqua';
    context.strokeStyle = '#212121';
    snake.forEach(part => {
        context.fillRect(part.x, part.y, UNIT, UNIT);
        context.strokeRect(part.x, part.y, UNIT, UNIT);
    });
}

function moveSnake(){
    const head = {x: snake[0].x + xVel, y: snake[0].y + yVel};
    snake.unshift(head);

    if(head.x === foodX && head.y === foodY){
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
        context.fillText("Game Over!!", WIDTH/2, HEIGHT/2);
    }
}

function keyPress(event){
    const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;

    
    if([LEFT, UP, RIGHT, DOWN, 32].includes(event.keyCode)){
        event.preventDefault();
    }

    if(!started){
        started = true;
        nextTick();
    }

    if(event.keyCode === 32){
        togglePause();
    }

    switch(true){
        case(event.keyCode === LEFT && xVel !== UNIT): xVel=-UNIT; yVel=0; break;
        case(event.keyCode === RIGHT && xVel !== -UNIT): xVel=UNIT; yVel=0; break;
        case(event.keyCode === UP && yVel !== UNIT): xVel=0; yVel=-UNIT; break;
        case(event.keyCode === DOWN && yVel !== -UNIT): xVel=0; yVel=UNIT; break;
    }
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


function togglePause(){
    paused = !paused;
    if(!paused && started) nextTick();
}


function restartGame(){
    score = 0;
    scoreText.textContent = score;
    xVel = UNIT;
    yVel = 0;
    active = true;
    paused = false;
    started = false;
    snake = [
        {x: UNIT*3, y:0},
        {x: UNIT*2, y:0},
        {x: UNIT, y:0},
        {x:0, y:0}
    ];
    startGame();
}
