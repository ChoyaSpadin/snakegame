// Seletores de elementos da página
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const highScoresModal = document.getElementById("high-scores-modal");
const scoreDisplay = document.getElementById("score");
const finalScoreDisplay = document.getElementById("final-score");
const highScoresList = document.getElementById("high-scores-list");
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Configuração inicial
canvas.width = 800; // Largura aumentada
canvas.height = 600; // Altura aumentada
let snake;
let score;
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
let fruit;
let direction;
let gameLoop;
const tileSize = 20;
let initialSpeed = 200; // Velocidade inicial mais lenta
let speedIncreaseFactor = 0.95; // Fator de aumento de velocidade

// Função de inicialização do jogo
function startGame() {
    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    score = 0;
    direction = { x: tileSize, y: 0 };
    snake = [{ x: tileSize * 5, y: tileSize * 5 }];
    spawnFruit();

    updateScore();
    setGameSpeed(initialSpeed); // Inicia o jogo com a velocidade inicial
}

// Ajusta a velocidade do jogo com intervalo variável
function setGameSpeed(speed) {
    clearInterval(gameLoop); // Limpa o intervalo anterior, se houver
    gameLoop = setInterval(updateGame, speed); // Define um novo intervalo com a velocidade atual
}

// Atualiza o jogo em cada frame
function updateGame() {
    moveSnake();
    if (checkCollision()) {
        endGame();
        return;
    }
    if (checkFruitCollision()) {
        score += 10;
        snake.push({});
        updateScore();
        spawnFruit();

        // Aumenta a velocidade do jogo
        setGameSpeed(initialSpeed * Math.pow(speedIncreaseFactor, Math.floor(score / 50)));
    }
    renderGame();
}

// Movimenta a cobra
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    snake.pop();
}

// Checa colisões com a borda e o corpo da cobra
function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Checa colisão da cobra com a fruta
function checkFruitCollision() {
    const head = snake[0];
    return head.x === fruit.x && head.y === fruit.y;
}

// Gera a fruta em uma posição aleatória
function spawnFruit() {
    fruit = {
        x: Math.floor((Math.random() * canvas.width) / tileSize) * tileSize,
        y: Math.floor((Math.random() * canvas.height) / tileSize) * tileSize,
    };
}

// Atualiza a pontuação e exibe na tela
function updateScore() {
    scoreDisplay.innerText = score;
}

// Renderiza o jogo (cobra, fruta e score)
function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Renderiza a cobra
    ctx.fillStyle = "#4CAF50";
    snake.forEach((segment, index) => {
        ctx.fillRect(segment.x, segment.y, tileSize, tileSize);
    });

    // Renderiza a fruta
    ctx.fillStyle = "#FF6347";
    ctx.fillRect(fruit.x, fruit.y, tileSize, tileSize);
}

// Finaliza o jogo
function endGame() {
    clearInterval(gameLoop);
    finalScoreDisplay.innerText = score;
    saveHighScore(score);
    gameScreen.classList.add("hidden");
    gameOverScreen.classList.remove("hidden");
}

// Salva a pontuação mais alta no localStorage
function saveHighScore(newScore) {
    highScores.push(newScore);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5); // Apenas os 5 mais altos
    localStorage.setItem("highScores", JSON.stringify(highScores));
}

// Exibe os pontos mais altos no modal
function showHighScores() {
    highScoresList.innerHTML = highScores
        .map((score, index) => `<li>#${index + 1} - ${score}</li>`)
        .join("");
    highScoresModal.style.display = "flex";
}

// Fecha o modal de pontos mais altos
function closeHighScores() {
    highScoresModal.style.display = "none";
}

// Reinicia o jogo
function restartGame() {
    gameOverScreen.classList.add("hidden");
    startGame();
}

// Retorna à tela inicial
function returnToStart() {
    gameOverScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
}

// Controle de direção pelo teclado
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
        case "w":
            if (direction.y === 0) direction = { x: 0, y: -tileSize };
            break;
        case "ArrowDown":
        case "s":
            if (direction.y === 0) direction = { x: 0, y: tileSize };
            break;
        case "ArrowLeft":
        case "a":
            if (direction.x === 0) direction = { x: -tileSize, y: 0 };
            break;
        case "ArrowRight":
        case "d":
            if (direction.x === 0) direction = { x: tileSize, y: 0 };
            break;
    }
});
