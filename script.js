// Canvas width = 760, height = 460
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Repeatedly updated elements
const scoreDisplay = document.getElementById('score');
const peakDisplay = document.getElementById('peak');
const spacebar = document.getElementById("spacebar-img");
const gameCover = document.getElementById("gameOverlay");

// Game assets
const appleImg = new Image();
const snakeBodyImg = new Image();
const snakeHeadImg = new Image();
appleImg.src = "images/apple.svg"; 
snakeBodyImg.src = "images/snakebody.svg";
snakeHeadImg.src = "images/snake-head.svg";

// Declare all variables
let positionX, positionY, velocityX, velocityY, snake, apple, count, intervalId, paused, directionChanged;

// Run initializing function
restart();

// param: x and y coordinate
function drawRectangle(x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apple collision (only head can eat apple)
    if (x == apple.x && y == apple.y) {
        apple = generateApple();
        count += 1;
        scoreDisplay.textContent = count + "/874";
        if (count > parseInt(peakDisplay.textContent, 10)) {
            peakDisplay.textContent = count;
        }
    }
    ctx.drawImage(appleImg, apple.x, apple.y, 20, 20);

    // Boundary check
    if (
        positionX < 0 ||
        positionX + 20 > canvas.width ||
        positionY < 0 ||
        positionY + 20 > canvas.height
    ) {
        restart();
    }

    // Update snake body
    snake.unshift([x, y]);
    if (snake.length > (count + 1)) {
        snake.pop();
    }

    // Self-collision check (skip head)
    for (let i = 1; i < snake.length; i++) {
        if (x == snake[i][0] && y == snake[i][1]) {
            restart();
        }
    }

    // Render snake
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            // Draw head with rotation
            ctx.save();
            ctx.translate(snake[i][0] + 10, snake[i][1] + 10);
            let angle = 0;
            if (velocityX === 20) angle = 0;
            else if (velocityX === -20) angle = Math.PI;
            else if (velocityY === -20) angle = -Math.PI / 2;
            else if (velocityY === 20) angle = Math.PI / 2;
            ctx.rotate(angle);
            ctx.drawImage(snakeHeadImg, -10, -10, 26, 20);
            ctx.restore();
        } else {
            ctx.drawImage(snakeBodyImg, snake[i][0], snake[i][1], 20, 20);
        }
    }
}
// Initializes or resets all game values to their default.
function restart() {
    positionX = 200;
    positionY = 360;
    velocityX = 20;
    velocityY = 0;
    count = 0;
    snake = [[positionX, positionY]];
    apple = generateApple();
    scoreDisplay.textContent = count + "/874";
    paused = false;
}
// Generates new apple coordinates in tiled manner (760/20 = 38, 460/20 = 23 then multiply by 20) 
function generateApple() {
    return {
        x: (Math.floor(Math.random() * 38)) * 20,
        y: (Math.floor(Math.random() * 23)) * 20
    };
}
// Determines which direction the render the snake in using arrow key input and velocity.
function playerMovement(e) {
    if (directionChanged) return; // Only allow one change per frame
    switch (e.code) {
        case "ArrowLeft":
            if (velocityX !== 20) {
                velocityX = -20;
                velocityY = 0;
                directionChanged = true;
            }
            break;
        case "ArrowRight":
            if (velocityX !== -20) {
                velocityX = 20;
                velocityY = 0;
                directionChanged = true;
            }
            break;
        case "ArrowUp":
            if (velocityY !== 20) {
                velocityX = 0;
                velocityY = -20;
                directionChanged = true;
            }
            break;
        case "ArrowDown":
            if (velocityY !== -20) {
                velocityX = 0;
                velocityY = 20;
                directionChanged = true;
            }
            break;
    }
}

// Game start and stop loops
function startGameLoop() {
    if (!intervalId) {
        intervalId = setInterval(() => {
            if (!paused) {
                drawRectangle(positionX += velocityX, positionY += velocityY);
                directionChanged = false; // Allow direction change for next frame
            }
        }, 50);
    }
}

function stopGameLoop() {
    clearInterval(intervalId);
    intervalId = null;
}
// Hash map for rendering arrow keys on the interface
const keyImageMap = {
    "ArrowUp": {
        id: "arrow-up-img",
        up: "images/up-arrow-up.svg",
        down: "images/up-arrow-down.svg"
    },
    "ArrowDown": {
        id: "arrow-down-img",
        up: "images/down-arrow-up.svg",
        down: "images/down-arrow-down.svg"
    },
    "ArrowLeft": {
        id: "arrow-left-img",
        up: "images/left-arrow-up.svg",
        down: "images/left-arrow-down.svg"
    },
    "ArrowRight": {
        id: "arrow-right-img",
        up: "images/right-arrow-up.svg",
        down: "images/right-arrow-down.svg"
    }
};
// User inputs
window.addEventListener('keydown', function(e) {
    const key = e.code;
    if (keyImageMap[key]) {
        document.getElementById(keyImageMap[key].id).src = keyImageMap[key].down;
    }
    if (key === "Space") {
        paused = !paused;
        if (paused) {
            stopGameLoop();
            spacebar.src = "images/spacebar-down.svg";
            gameCover.style.display = "flex";
        } else {
            startGameLoop();
            spacebar.src = "images/spacebar-up.svg";
            gameCover.style.display = "none";
        }
    }
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        playerMovement(e);
    }
});
// Only used for rendering the arrow keys on the interface
window.addEventListener('keyup', function(e) {
    const key = e.code;
    if (keyImageMap[key]) {
        document.getElementById(keyImageMap[key].id).src = keyImageMap[key].up;
    }
});

// Start the game loop initially
startGameLoop();
