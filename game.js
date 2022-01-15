let canvas;
let ctx;

const initialSnakeLength = 3;
let snake = [];

let direction;
let gameSpeed;
const CELL_SIZE = 20;
let restartGame;
let isFoodExist;
let foodPosition;
let scoreElement;
let score;
let image;
const inputQueue = [];

function initCanvas() {
  canvas = document.getElementById("canvas");
  const wrapperElement = document.getElementById("canvas-container");
  canvas.setAttribute("tabindex", 1);
  canvas.style.outline = "none";
  canvas.focus();
  canvas.addEventListener("keydown", handleInput, true);
  ctx = canvas.getContext("2d");
  scoreElement = document.createElement("p");
  scoreElement.innerText = `Score: 0`;
  scoreElement.style.color = "black";
  scoreElement.style.fontSize = "32px";
  wrapperElement.appendChild(scoreElement);
  image = new Image(CELL_SIZE, CELL_SIZE);
  image.src = "apple.png";
}

function updateScore() {
  scoreElement.innerText = `Score: ${score}`;
}

function initializeGameState() {
  snake.length = 0;
  createSnake();
  direction = "right";
  gameSpeed = 120;
  restartGame = false;
  isFoodExist = true;
  foodPosition = {
    x: Math.floor(Math.random() * (canvas.width / CELL_SIZE)) * CELL_SIZE,
    y: Math.floor(Math.random() * (canvas.height / CELL_SIZE)) * CELL_SIZE,
  };
  isFoodExist = false;
  score = 0;
  updateScore();
}

function createSnake() {
  for (let i = 0; i < initialSnakeLength; i++) {
    snake.push({ x: i * CELL_SIZE, y: 0 });
  }
}

function drawGrids() {
  drawVerticalLines();
  drawHorizontalLines();
}

function advanceSnake(dest, src) {
  if (direction === "right") {
    dest.x = src.x + 20;
    dest.y = src.y;
  } else if (direction === "down") {
    dest.y = src.y + 20;
    dest.x = src.x;
  } else if (direction === "left") {
    dest.y = src.y;
    dest.x = src.x - 20;
  } else {
    dest.x = src.x;
    dest.y = src.y - 20;
  }
}

function moveSnake() {
  const head = snake[0];
  let newHead = snake.pop();
  advanceSnake(newHead, head);
  if (!checkSelfHit()) {
    snake.unshift(newHead);
    return true;
  }

  return false;
}

function handleInput(e) {
  switch (e.key) {
    case "S":
    case "s":
      {
        if (direction !== "up") direction = "down";
      }
      break;
    case "w":
    case "W":
      {
        if (direction !== "down") direction = "up";
      }
      break;

    case "D":
    case "d":
      {
        if (direction !== "left") direction = "right";
      }
      break;

    case "a":
    case "A":
      {
        if (direction !== "right") direction = "left";
      }
      break;
    default: {
    }
  }
}

function drawSnake() {
  snake.forEach((cell) => {
    ctx.fillStyle = "#7A8CBF";
    ctx.fillRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);
  });
}

function draw() {
  ctx.beginPath();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrids();
  drawSnake();
  drawFood();
}

function main() {
  if (restartGame) {
    initializeGameState();
  }
  const isMoved = moveSnake();
  if (isMoved) {
    checkBoundries();
    eatFood();
    draw();
  }
  setTimeout(main, gameSpeed);
}

function drawVerticalLines() {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#D98C5F";
  for (let w = 0; w < canvas.width; w += CELL_SIZE) {
    ctx.moveTo(0, w);
    ctx.lineTo(canvas.width, w);
  }
}

function drawHorizontalLines() {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#D98C5F";
  for (let h = 0; h < canvas.width; h += CELL_SIZE) {
    ctx.moveTo(h, 0);
    ctx.lineTo(h, canvas.height);
  }

  ctx.stroke();
}

function drawFood() {
  if (!isFoodExist) {
    foodPosition = {
      x: Math.floor(Math.random() * (canvas.width / CELL_SIZE)) * CELL_SIZE,
      y: Math.floor(Math.random() * (canvas.height / CELL_SIZE)) * CELL_SIZE,
    };
    isFoodExist = true;
  }
  // ctx.fillStyle = "#C4E1F2";
  // ctx.fillRect(foodPosition.x, foodPosition.y, CELL_SIZE, CELL_SIZE);
  ctx.drawImage(
    image,
    foodPosition.x,
    foodPosition.y,
    image.width,
    image.height
  );
}

function eatFood() {
  const head = snake[0];
  if (head.x === foodPosition.x && head.y === foodPosition.y) {
    isFoodExist = false;
    score += 10;
    updateScore();
    gameSpeed -= 2;
    addNewCell();
  }
}

function addNewCell() {
  const lastCell = snake[snake.length - 1];
  let newCell = {
    x: 0,
    y: 0,
  };
  advanceSnake(newCell, lastCell);
  snake.push(newCell);
}

function checkSelfHit() {
  const head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    console.log(snake[i].x, head.x);
    if (snake[i].x === head.x && snake[i].y === head.y) {
      restartGame = true;
      return restartGame;
    }
  }

  return false;
}

function checkBoundries() {
  const head = snake[0];
  if (direction === "left" && head.x < 0) {
    restartGame = true;
  }
  if (direction === "right" && head.x > canvas.width) {
    restartGame = true;
  }
  if (direction === "down" && head.y > canvas.height) {
    restartGame = true;
  }
  if (direction === "up" && head.y < 0) {
    restartGame = true;
  }
}

initCanvas();
initializeGameState();

setTimeout(() => {
  if (restartGame) {
    initializeGameState();
  }
  main();
}, gameSpeed);
