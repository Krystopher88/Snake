const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;

let box = Math.min(canvas.width, canvas.height) / 20;

let snake = [];
snake[0] = {
  x: 10 * box,
  y: 10 * box
};

let food = generateFoodPosition();

let score = 0;
let dir;

document.addEventListener("keydown", direction);

function direction(event) {
  if (event.keyCode === 37 && dir !== "RIGHT") {
    dir = "LEFT";
  } else if (event.keyCode === 38 && dir !== "DOWN") {
    dir = "UP";
  } else if (event.keyCode === 39 && dir !== "LEFT") {
    dir = "RIGHT";
  } else if (event.keyCode === 40 && dir !== "UP") {
    dir = "DOWN";
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const padding = 1;

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = (i === 0) ? "black" : "black";
    ctx.fillRect(snake[i].x + padding, snake[i].y + padding, box - 2 * padding, box - 2 * padding);
  }


  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 4, 0, 2 * Math.PI);
  ctx.fill();


  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (dir === "LEFT") snakeX -= box;
  if (dir === "UP") snakeY -= box;
  if (dir === "RIGHT") snakeX += box;
  if (dir === "DOWN") snakeY += box;

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = generateFoodPosition();
    updateScore();
  } else {
    snake.pop();
  }

  let newHead = {
    x: snakeX,
    y: snakeY
  };

  if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
    endGame();
    clearInterval(game);
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

function generateFoodPosition() {
  let newFoodPosition;
  do {
    newFoodPosition = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } while (collision(newFoodPosition, snake));
  return newFoodPosition;
}

function updateScore() {
  document.querySelector('.scoreDisplay').textContent = formatScore(score);
  updateGameSpeed();
}

function formatScore(score) {
  return String(score).padStart(4, '0');
}

let baseSpeed = 180;
let speedIncrement = 10;
let speedIncreaseInterval = 5;

let gameSpeed = baseSpeed;

function updateGameSpeed() {
  if (score % speedIncreaseInterval === 0 && score !== 0) {
    gameSpeed -= speedIncrement;
    clearInterval(game);
    game = setInterval(draw, gameSpeed);
  }
}

let game = setInterval(draw, gameSpeed);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.9;
  box = Math.min(canvas.width, canvas.height) / 20;
});

let timerInterval;
let timerValue = 0;
let gameStarted = false;

function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimer() {
  timerValue++;
  document.querySelector('.timerDisplay').textContent = formatTimer(timerValue);
}

function formatTimer(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}

function startGame() {
  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }
}

function endGame() {
  stopTimer();
  gameStarted = false;
}

document.addEventListener("keydown", startGame);
document.querySelector('.newGame').addEventListener('click', () => {
  location.reload();
});
