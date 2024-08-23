const grid = document.getElementById("grid");
const ctx = grid.getContext("2d");
const gridSize = 20;

let snake;
let unVisitedCell;
let direction;
let randomIndex;
let availableFood;
let currentScore;
let highestScore;
let food;

const currentScoreDom = document.getElementsByClassName("current-score");
const highestScoreDom = document.getElementsByClassName("highest-score");
const gameOverDom = document.getElementsByClassName("game-over");

function initializeGame() {
  snake = [{ x: 240, y: 200 }];
  unVisitedCell = [];
  direction = { x: 0, y: 0 };
  randomIndex = 0;
  availableFood = false;
  currentScore = 0;
  highestScore = localStorage.getItem("highestScore")
    ? parseInt(localStorage.getItem("highestScore"))
    : 0;
  food = { x: 0, y: 0 };
  highestScoreDom[0].textContent = `Highest Score: ${highestScore}`;
  gameOverDom[0].style.display = "none";
}

function drawGrid() {
  ctx.strokeStyle = "#222738";
  for (let i = 0; i <= grid.width; i += gridSize) {
    for (let j = 0; j <= grid.height; j += gridSize) {
      ctx.strokeRect(i, j, gridSize, gridSize);
    }
  }
}

function updateSnakePosition() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);
}

function validatePosition() {
  if (snake[0].x > 480) snake[0].x = 0;
  if (snake[0].x < 0) snake[0].x = 480;
  if (snake[0].y > 380) snake[0].y = 0;
  if (snake[0].y < 0) snake[0].y = 380;
}

function updateUnvisitedCells() {
  unVisitedCell = [];
  for (let i = 0; i < grid.width; i += gridSize) {
    for (let j = 0; j < grid.height; j += gridSize) {
      let isOccupied = snake.some(
        (segment) => segment.x === i && segment.y === j
      );
      if (!isOccupied) {
        unVisitedCell.push({ x: i, y: j });
      }
    }
  }
}

function drawFood() {
  randomIndex = Math.random() * unVisitedCell.length;
  food.x = unVisitedCell[Math.floor(randomIndex)].x;
  food.y = unVisitedCell[Math.floor(randomIndex)].y;
  ctx.fillStyle = "white";
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function drawSnake() {
  validatePosition();
  ctx.strokeStyle = "#222738";
  ctx.fillStyle = "green";

  ctx.clearRect(
    snake[snake.length - 1].x,
    snake[snake.length - 1].y,
    gridSize,
    gridSize
  );
  ctx.strokeRect(
    snake[snake.length - 1].x,
    snake[snake.length - 1].y,
    gridSize,
    gridSize
  );

  snake.pop();

  if (
    snake
      .slice(1)
      .some((part) => part.x === snake[0].x && part.y === snake[0].y)
  ) {
    handleGameOver();
  }

  if (snake[0].x === food.x && snake[0].y === food.y) {
    snake.unshift({ x: snake[0].x, y: snake[0].y });
    availableFood = false;
    currentScore++;
    updateScores();
  }

  ctx.fillRect(snake[0].x, snake[0].y, gridSize, gridSize);
}

function handleGameOver() {
  const gameOver = document.getElementsByClassName("game-over")[0];
  const firstChild = gameOver.children[1];
  const lastChild = gameOver.lastElementChild;
  gameOver.style.display = "flex";
  gameOver.style.flexDirection = "column";
  gameOver.style.justifyContent = "center";
  gameOver.style.alignItems = "center";
  firstChild.textContent = `Your Score: ${currentScore}`;
  highestScore = localStorage.getItem("highestScore")
    ? parseInt(localStorage.getItem("highestScore"))
    : 0;
  lastChild.textContent = `Highest Score: ${Math.max(
    highestScore,
    currentScore
  )}`;
  clearTimeout(startGameTimeout);
}

function updateScores() {
  const newHighestScore = Math.max(currentScore, highestScore);
  localStorage.setItem("highestScore", newHighestScore);
  currentScoreDom[0].textContent = `Your score: ${currentScore}`;
  highestScoreDom[0].textContent = `Highest Score: ${newHighestScore}`;
}

let keyLock = false;

function handleKeydown(event) {
  if (keyLock) return;
  if (
    event.key === "ArrowUp" &&
    !(direction.x === 0 && direction.y === gridSize)
  )
    direction = { x: 0, y: -gridSize };
  if (
    event.key === "ArrowDown" &&
    !(direction.x === 0 && direction.y === -gridSize)
  )
    direction = { x: 0, y: gridSize };
  if (
    event.key === "ArrowLeft" &&
    !(direction.x === gridSize && direction.y === 0)
  )
    direction = { x: -gridSize, y: 0 };
  if (
    event.key === "ArrowRight" &&
    !(direction.x === -gridSize && direction.y === 0)
  )
    direction = { x: gridSize, y: 0 };
  keyLock = true;
}

function resetGame() {
  ctx.clearRect(0, 0, grid.width, grid.height);
  initializeGame();
  drawGrid();
  ctx.fillStyle = "green";
  ctx.fillRect(240, 200, gridSize, gridSize);
}

let startGameTimeout;
function startGame() {
  if (!availableFood) {
    updateUnvisitedCells();
    drawFood();
    availableFood = true;
  }
  updateSnakePosition();
  drawSnake();
  keyLock = false;
  startGameTimeout = setTimeout(startGame, 50);
}

document.addEventListener("keydown", handleKeydown);
document
  .getElementsByClassName("new-game")[0]
  .addEventListener("click", resetGame);

initializeGame();
drawGrid();
ctx.fillStyle = "green";
ctx.fillRect(240, 200, gridSize, gridSize);
startGame();
