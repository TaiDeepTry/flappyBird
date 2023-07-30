//board
let board;
let boardHeight = 640;
let boardWidth = 360;
let context;


// bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdRotation = 0;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}
let flapState = 1;
let flapTimer = 0
const FLAP_INTERVAL = 10;


// pipes
let pipesArray = [];
let pipeWidth = 64;
let pipeHeight = 412;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

//ground
let groundsArray = [];
let groundImg;
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

let playAgain;
let playAgainImg;
let playAgainWidth = 130;
let playAgainHeight = 72.5;
let playAgainX = boardWidth / 2 - playAgainWidth / 2;
let playAgainY = boardHeight / 2 + 100;

let velocityY = 0;
let velocityX = -2;
let gravity = 0.3;
let gameOver = false;
let score = 0;

window.onload = function () {
    // board
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
    // context.imageSmoothingEnabled = false;

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

    playAgainImg = new Image();
    playAgainImg.src = "./assets/images/playbutton.png";

    setInterval(placePipe, 1500);
    document.addEventListener("keydown", birdJump);
    document.addEventListener("click", birdJump);
    document.addEventListener("touchstart", birdJump);
    board.addEventListener("click", handleCanvasClick);
    requestAnimationFrame(update);
}

function update() {

    requestAnimationFrame(update);

    if (gameOver) {
        drawBoard();
        return;
    }


    context.clearRect(0, 0, boardWidth, boardHeight);

    // draw bird
    birdRotation += 1.5;
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0)
    drawRotatedBird();   
    
    if (bird.y > board.height / 8 * 7) {
        gameOver = true;
    }

    // draw pipe
    pipesArray.forEach(element => {
        context.drawImage(element.img, element.x, element.y, element.width, element.height);
        element.x += velocityX;

        if (!element.passed && bird.x > element.x + pipeWidth) {
            score += 0.5;
            element.passed = true;
        }


        if (detectCollision(bird, element)) {
            gameOver = true;
        }
    });

    while (pipesArray.length > 0 && pipesArray[0].x < -pipeWidth) {
        pipesArray.shift();
    }

    groundX += velocityX
    context.drawImage(groundImg, groundX, groundY, boardWidth, boardHeight / 8)
    context.drawImage(groundImg2, groundX + boardWidth, groundY, boardWidth, boardHeight / 8)

    if (groundX + boardWidth < 0) {
        groundX = 0
    }
    context.fillStyle = "black";
    context.font = "45px '04b_19'";
    context.fillText(score, (boardWidth/2 - 45 / 2) + 2, 48);
    context.fillStyle = "white";
    context.font = "45px '04b_19'";
    context.fillText(score, boardWidth/2 - 45 / 2, 46);
    context.font = "10px '04b_19'";
    context.fillStyle = "black";
    context.fillText("© 2023 Nguyen Tuan Tai Dep Trai VCL. All rights reserved.", boardWidth / 9, boardHeight / 20 * 19); 
    
}

function placePipe() {

    if (gameOver) {
        drawBoard();
        return;
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
    if ((e.code === "Space" || e.code == "ArrowUp" || e.type === "click" || e.type === "touchstart")) {
        velocityY = -6;
        birdRotation = -40;
        drawRotatedBird();
    } 
}

function handleCanvasClick(event) {
    // Lấy tọa độ của điểm click trên canvas
    const rect = board.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Kiểm tra xem điểm click có nằm trong vùng hình ảnh playAgain hay không
    if (x > playAgain.x && x < playAgain.x + playAgain.width && y > playAgain.y && y < playAgain.y + playAgain.height) {
        // Thực hiện hành động khi click vào hình ảnh playAgain ở đây
        if (gameOver) {
            bird.y = birdY;
            pipesArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function drawBoard() {

    over = {
        x: overX,
        y: overY,
        width: overWidth,
        height: overHeight
    }
    overText = {
        x : overTextX,
        y : overTextY,
        width : overTextWidth,
        height : overTextHeight
    }
    medal = {
        x : medalX,
        y : medalY,
        width : medalWidth,
        height : medalHeight
    }
    playAgain = {
        x : playAgainX,
        y : playAgainY,
        width : playAgainWidth,
        height : playAgainHeight
    }
    // context.globalAlpha = 0.1;
    // context.fillStyle = "black"
    // context.fillRect(0, 0, boardWidth, boardHeight);
    // context.globalAlpha = 1;
    context.drawImage(overImg, over.x, over.y, over.width, over.height);
    context.drawImage(overTextImg, overTextX, overTextY, overTextWidth, overTextHeight);
    context.drawImage(medalImg, medal.x, medal.y, medal.width, medal.height);
    context.strokeStyle = "black";
    context.lineWidth = 3;
    context.fillStyle = "white";
    context.font = "25px '04b_19'"; 
    context.strokeText(score, boardWidth / 2 + 100, boardHeight / 2 - 13);
    context.fillText(score, boardWidth / 2 + 100, boardHeight / 2 - 13);
    context.drawImage(playAgainImg, playAgain.x, playAgain.y, playAgain.width, playAgain.height);
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
    context.drawImage(birdImg, -bird.width / 2, -bird.height / 2, bird.width, bird.height);  
    context.restore();
}
