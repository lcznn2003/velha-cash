const gameBoard = document.getElementById('game-board');
const statusDiv = document.getElementById('status');
const saldoDiv = document.getElementById('saldo');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let saldo = 0;
let partidasJogadas = 0;

function initializeBoard() {
    gameBoard.innerHTML = '';
    board.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.dataset.index = index;
        cellDiv.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cellDiv);
    });
    updateSaldo();
}

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (board[index] !== '') return;
    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    if (checkWinner()) {
        statusDiv.textContent = `Jogador ${currentPlayer} venceu!`;
        if (currentPlayer === 'X') {
            saldo += 5;
            updateSaldo();
        }
        setTimeout(resetGame, 2000);
        return;
    }
    if (board.every(cell => cell !== '')) {
        statusDiv.textContent = 'Empate!';
        setTimeout(resetGame, 2000);
        return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (currentPlayer === 'O') {
        makeBotMove();
    }
}

function makeBotMove() {
    let index;
    if (partidasJogadas % 3 === 2) {
        index = findBestMove();
    } else {
        do {
            index = Math.floor(Math.random() * 9);
        } while (board[index] !== '');
    }
    board[index] = 'O';
    document.querySelector(`.cell[data-index='${index}']`).textContent = 'O';
    if (checkWinner()) {
        statusDiv.textContent = 'Jogador O venceu!';
        setTimeout(resetGame, 2000);
        return;
    }
    currentPlayer = 'X';
}

function findBestMove() {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') return i;
    }
    return Math.floor(Math.random() * 9);
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === currentPlayer);
    });
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    partidasJogadas++;
    statusDiv.textContent = '';
    initializeBoard();
}

function updateSaldo() {
    saldoDiv.textContent = `Saldo: R$${saldo}`;
}

initializeBoard();
