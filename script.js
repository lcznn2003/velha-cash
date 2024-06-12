document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelectorAll('.cell');
    const messageElement = document.getElementById('message');
    const balanceElement = document.getElementById('balance');
    const withdrawButton = document.getElementById('withdraw');
    const withdrawPanel = document.getElementById('withdraw-panel');
    const pixKeyInput = document.getElementById('pix-key');
    const confirmWithdrawButton = document.getElementById('confirm-withdraw');
    const pixOptions = document.querySelectorAll('.pix-option');

    let boardState = Array(9).fill(null);
    let isPlayerTurn = true;
    let balance = 0;
    let gameActive = true;

    board.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(index));
    });

    withdrawButton.addEventListener('click', () => {
        withdrawPanel.classList.toggle('hidden');
    });

    pixOptions.forEach(button => {
        button.addEventListener('click', () => {
            pixKeyInput.placeholder = `Insira a chave Pix (${button.dataset.type})`;
        });
    });

    confirmWithdrawButton.addEventListener('click', () => {
        const pixKey = pixKeyInput.value;
        if (pixKey) {
            alert('Saque realizado com sucesso!');
            balance = 0;
            updateBalance();
            withdrawPanel.classList.add('hidden');
        } else {
            alert('Por favor, insira uma chave Pix válida.');
        }
    });

    function handleCellClick(index) {
        if (boardState[index] || !gameActive) return;
        if (isPlayerTurn) {
            boardState[index] = 'X';
            board[index].textContent = 'X';
            isPlayerTurn = false;
            checkWinner();
            if (gameActive) {
                setTimeout(aiMove, 1000);
            }
        }
    }

    function aiMove() {
        const emptyCells = boardState
            .map((cell, index) => (cell === null ? index : null))
            .filter(index => index !== null);
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        boardState[randomIndex] = 'O';
        board[randomIndex].textContent = 'O';
        isPlayerTurn = true;
        checkWinner();
    }

    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                gameActive = false;
                if (boardState[a] === 'X') {
                    messageElement.textContent = 'Você Venceu!';
                    balance += 5;
                    updateBalance();
                } else {
                    messageElement.textContent = 'Você Perdeu!';
                }
                return;
            }
        }

        if (!boardState.includes(null)) {
            gameActive = false;
            messageElement.textContent = 'Empate!';
        }
    }

    function updateBalance() {
        balanceElement.textContent = `Saldo: R$${balance}`;
    }

    function resetGame() {
        boardState = Array(9).fill(null);
        board.forEach(cell => (cell.textContent = ''));
        isPlayerTurn = true;
        gameActive = true;
        messageElement.textContent = 'Sua Vez';
    }

    messageElement.textContent = 'Sua Vez';
    updateBalance();
});
