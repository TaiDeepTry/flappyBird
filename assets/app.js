//board
let board;
let boardX = 0;
let boardY;
let boardImg1;
let boardImg2;
let boardHeight = 640;
let boardWidth = 360;
let context;


// bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdRotation = 0;
let birdImg;
let birdImg1;
let birdImg2;
let birdImg3;
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}


// pipes
let pipesArray = [];
let pipeWidth = 64;
let pipeHeight = 412;
let pipeX = 0 - pipeWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

//ground
let groundsArray = [];
let groundImg;
let groundImg2;
let groundX = 0;
let groundY = boardHeight / 8 * 7;

let over;
let overImg;
let overWidth = 330;
let overHeight = 330 / 113 * 55;
let overX = boardWidth / 2 - overWidth / 2;
let overY = boardHeight / 2 - overHeight / 2

let overText;
let overTextImg;
let overTextWidth = 240;
let overTextHeight = 52.5;
let overTextY = boardHeight / 4;
let overTextX = boardWidth / 2 - overTextWidth / 2;

let medal;
let medalImg;
let medalWidth = 64;
let medalHeight = medalWidth;
let medalX = 54;
let medalY = boardHeight / 2 - medalHeight / 2 + 11;

let playButton;
let playButtonImg;
let playButtonWidth = 130;
let playButtonHeight = 72.5;
let playButtonX = boardWidth / 2 - playButtonWidth / 2;
let playButtonY = boardHeight / 2 + 100;

let flappyBirdText;
let flappyBirdTextImg;
let flappyBirdTextWidth = 250;
let flappyBirdTextHeight = flappyBirdTextWidth * 240 / 890;
let flappyBirdTextX = boardWidth / 2 - flappyBirdTextWidth / 2;
let flappyBirdTextY = boardHeight / 6;

over = {
    x: overX,
    y: overY,
    width: overWidth,
    height: overHeight
}
overText = {
    x: overTextX,
    y: overTextY,
    width: overTextWidth,
    height: overTextHeight
}
medal = {
    x: medalX,
    y: medalY,
    width: medalWidth,
    height: medalHeight
}
playButton = {
    x: playButtonX,
    y: playButtonY,
    width: playButtonWidth,
    height: playButtonHeight
}

flappyBirdText = {
    x: flappyBirdTextX,
    y: flappyBirdTextY,
    width: flappyBirdTextWidth,
    height: flappyBirdTextHeight
}

let velocityY = 0;
let velocityX = -2;
let gravity = 0.3;
let gameOver = false;
let score = 0;
let timmer = 0.8;
let flappingStatus = 10;
let play = false;
let inHomeScreen = true;

let jumpSound;
let themeSong;

window.onload = function () {
    // board
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    jumpSound = new Audio();
    jumpSound.src = "./assets/sound/wing.wav";

    themeSong = new Audio();
    themeSong.src = "./assets/sound/Free Fire Battlegrounds OST  Old Theme Song.mp3"

    boardImg1 = new Image();
    boardImg1.src = "./assets/images/flappybirdbg.png";
    boardImg2 = new Image();
    boardImg2.src = "./assets/images/flappybirdbg.png";
    // draw bird
    birdImg = new Image();
    birdImg1 = new Image();
    birdImg2 = new Image();
    birdImg3 = new Image();

    birdImg.src = "./assets/images/bird2.png"
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, birdWidth, birdHeight);
    };

    birdImg1.src = "./assets/images/bird1.png"
    birdImg1.onload = function () {
        context.drawImage(birdImg1, bird.x, bird.y, bird.width, bird.height);
    }
    birdImg2.src = "./assets/images/bird2.png"
    birdImg2.onload = function () {
        context.drawImage(birdImg2, bird.x, bird.y, bird.width, bird.height);
    }
    birdImg3.src = "./assets/images/bird3.png"
    birdImg3.onload = function () {
        context.drawImage(birdImg3, bird.x, bird.y, bird.width, bird.height);
    }

    // draw pipe
    topPipeImg = new Image();
    topPipeImg.src = "./assets/images/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./assets/images/bottompipe.png";


    // draw ground
    groundImg = new Image();
    groundImg.src = "./assets/images/ground.png"

    groundImg2 = new Image();
    groundImg2.src = "./assets/images/ground2.png"


    overImg = new Image();
    overImg.src = "./assets/images/board.png";

    overTextImg = new Image();
    overTextImg.src = "./assets/images/gameovertext.png";

    medalImg = new Image();
    medalImg.src = "./assets/images/goldmedal.png";

    playButtonImg = new Image();
    playButtonImg.src = "./assets/images/playbutton.png";

    flappyBirdTextImg = new Image();
    flappyBirdTextImg.src = "./assets/images/flappybirdtext.png";

    
    drawHomeScreen();
}




function gameLoop() {
    setInterval(increaseSpeed, 1000);
    setInterval(placePipe, 1800);
    document.addEventListener("keydown", birdJump);
    document.addEventListener("touchstart", birdJump);
    board.addEventListener("click", handleCanvasClick);
    if (!inHomeScreen) {
        requestAnimationFrame(update);
    }
}

function increaseSpeed(){
    velocityX -= 0.02;
}

function drawHomeScreen() {
    if (inHomeScreen) {
        requestAnimationFrame(homeScreen);
        board.addEventListener("click", handleCanvasClick);
    } else {
        return;
    }
}

function update() {

    requestAnimationFrame(update);

    if (gameOver || inHomeScreen) {
        play = false;
        pipeX = 0 - pipeWidth;
        drawBoard();
        return;
    }


    context.clearRect(0, 0, boardWidth, boardHeight);
    drawMoveBackground();

    // neu chim cham san thi thua
    if (bird.y > board.height / 8 * 7) {
        gameOver = true;
    }

    // draw bird
    if (!play) {
        flappingBird(bird.x, bird.y, bird.width, bird.height);
    }
    drawBird(play);


    // draw pipe
    pipesArray.forEach(element => {
        context.drawImage(element.img, element.x, element.y, element.width, element.height);
        element.x += velocityX;

        if (!element.passed && bird.x > element.x + pipeWidth && play == true) {
            score += 0.5;
            element.passed = true;
        }

        if (detectCollision(bird, element)) {
            gameOver = true;
            play = false;
        }
    });

    while (pipesArray.length > 0 && pipesArray[0].x < -pipeWidth) {
        pipesArray.shift();
    }
    // draw ground 
    groundX += velocityX
    context.drawImage(groundImg, groundX, groundY, boardWidth, boardHeight / 8);
    context.drawImage(groundImg2, groundX + boardWidth, groundY, boardWidth, boardHeight / 8);
    if (groundX + boardWidth < 0) {
        groundX = 0
    }

    let scoreStr = Math.floor(score).toString();
    let digitWidth = 20; // Độ rộng của mỗi hình ảnh số

    for (let i = 0; i < scoreStr.length; i++) {
        let digit = scoreStr.charAt(i);
        let digitImg = new Image();
        digitImg.src = "./assets/images/" + digit + ".png";
        context.drawImage(digitImg, 10 + i * digitWidth, 10, digitWidth, 30);
    }

}
function drawMoveBackground(){
    boardX += velocityX*0.3;
    context.drawImage(boardImg1, boardX, 0, 360, 640);
    context.drawImage(boardImg2, boardX + boardWidth - 1 , 0, 360, 640);
    if(boardX < -boardWidth){
        boardX = 0
    }
}

function homeScreen() {
    if (inHomeScreen) {
        requestAnimationFrame(homeScreen);
    }
    context.clearRect(0, 0, boardWidth, boardHeight);
    drawMoveBackground();


    // draw bird
    context.drawImage(flappyBirdTextImg, flappyBirdText.x, flappyBirdText.y, flappyBirdText.width, flappyBirdText.height);
    flappingBird(boardWidth / 2 - bird.width, boardHeight / 8 * 3, bird.width * 1.5, bird.height * 1.5);

    // draw ground
    groundX += velocityX
    context.drawImage(groundImg, groundX, groundY, boardWidth, boardHeight / 8);
    context.drawImage(groundImg2, groundX + boardWidth, groundY, boardWidth, boardHeight / 8);
    if (groundX + boardWidth < 0) {
        groundX = 0;
    }

    context.drawImage(playButtonImg, boardWidth / 2 - playButton.width / 1.6, playButton.y, playButton.width * 1.3, playButton.height * 1.3);

    if (!inHomeScreen) {
        context.clearRect(0, 0, boardWidth, boardHeight);
        return;
    }
}


function drawBird(isPlay) {
    if (isPlay) {
        birdRotation += 1.5;
        velocityY += gravity;
        bird.y = Math.max(bird.y + velocityY, 0);
        drawRotatedBird();
    }
}


function flappingBird(x, y, width, height) {
    flappingStatus += timmer;
    if (0 <= flappingStatus && flappingStatus < 10) {
        context.drawImage(birdImg1, x, y, width, height);
    } else if (10 <= flappingStatus && flappingStatus < 20) {
        context.drawImage(birdImg2, x, y, width, height);
    } else if (flappingStatus >= 20 && flappingStatus <= 30) {
        context.drawImage(birdImg3, x, y, width, height);
    } else {
        context.drawImage(birdImg1, x, y, width, height);
        flappingStatus = 0;
    }
}

function placePipe() {

    if (gameOver) {
        drawBoard();
        return;
    }
    if (play) {
        pipeX = boardWidth;
    } else {
        score = 0;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random(0.4, 0, 6) * (pipeHeight / 2);
    openingSpace = board.height / 4;
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipesArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: pipeHeight + openingSpace + randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipesArray.push(bottomPipe);

}

function birdJump(e) {
    if ((e.code === "Space" || e.code == "ArrowUp" || e.type === "touchstart") && gameOver == false) {
        velocityY = -6;
        birdRotation = -40;
        drawRotatedBird();
        play = true;
    }
}

function handleCanvasClick(event) {
    const rect = board.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x > playButton.x && x < playButton.x + playButton.width && y > playButton.y && y < playButton.y + playButton.height) {
        if (gameOver) {
            bird.y = birdY;
            pipesArray = [];
            score = 0;
            gameOver = false;
            play = false;
            velocityY = 0;
            velocityX = -2;
            if (play) {
                pipeX = boardWidth;
            } else {
                score = 0;
            }
        }
        else if (inHomeScreen) {
            inHomeScreen = false;
            gameLoop();
        }
    }
}

function drawBoard() {
    context.drawImage(overImg, over.x, over.y, over.width, over.height);
    context.drawImage(overTextImg, overTextX, overTextY, overTextWidth, overTextHeight);
    context.drawImage(medalImg, medal.x, medal.y, medal.width, medal.height);
    let scoreStr = score.toString();
    let digitWidth = 20;
    for (let i = 0; i < scoreStr.length; i++) {
        let digit = scoreStr.charAt(i);
        let digitImg = new Image();
        digitImg.src = "./assets/images/" + digit + ".png";
        context.drawImage(digitImg, boardWidth / 2 + 100 + i * digitWidth, boardHeight / 2 - 30  , digitWidth, 30);
    }

    context.drawImage(playButtonImg, playButton.x, playButton.y, playButton.width, playButton.height);
}

function detectCollision(bird, pipe) {
    return bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        bird.y < pipe.y + pipe.height &&
        bird.y + bird.height > pipe.y;
}

function drawRotatedBird() {
    context.save();
    context.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    context.rotate(birdRotation * Math.PI / 180);
    board.style.imageEendering = 'auto';
    flappingBird(-bird.width / 2, -bird.height / 2, bird.width, bird.height);
    context.restore();
}
