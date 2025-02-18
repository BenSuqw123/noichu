document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("startButton").addEventListener("click", function () {
        document.querySelector(".start").style.display = "none";
        var gameElement = document.querySelector(".game");
        setTimeout(function () {
            gameElement.classList.add("show");
        }, 50);
        console.log("Game started!");


        const gameBoard = document.getElementById('game-board');
        const inputField = document.getElementById('input-field');
        const wordList = document.getElementById('word-list');
        const previousWordElement = document.getElementById('previous-word');
        const wordStartElement = document.getElementById('word-start');
        const playerTurnElement = document.getElementById('player-turn');
        const scoreBoard = document.getElementById('score-board');
        const player1ScoreElement = document.getElementById('player-1-score');
        const player2ScoreElement = document.getElementById('player-2-score');
        const countdownElement = document.getElementById('time-text');

        fetch('./JSON/words.json')
            .then(response => response.json())
            .then(data => {
                const dictionary = {};
                for (const word of data) {
                    dictionary[word.toLowerCase()] = true;
                }

                function checkWord(word) {
                    return word.toLowerCase() in dictionary;
                }

                function isWordInList(word, list) {
                    for (let i = 0; i < list.children.length; i++) {
                        if (list.children[i].textContent === word) {
                            return true;
                        }
                    }
                    return false;
                }

                let previousWord = '';
                let currentPlayer = 1;
                let scores = { 1: 0, 2: 0 };
                let timerInterval;
                let timeLeft = 10;
                let countdownInterval;
                let aiTime = Math.floor(Math.random() * (10 - 5 + 1)) + 5;

                inputField.addEventListener("keypress", function (event) {
                    if (currentPlayer == 2) {
                        inputField.disabled = true;
                        return;
                    }

                    if (event.key === "Enter") {
                        const userInput = inputField.value.trim();

                        if (userInput !== '' && checkWord(userInput)) {
                            const lastLetter = previousWord.slice(-1);

                            if (userInput.startsWith(lastLetter) || userInput.startsWith(lastLetter.toUpperCase())) {

                                if (isWordInList(userInput, wordList) || isWordInList(userInput.toLowerCase(), wordList)) {
                                    alert(`Sorry, ${userInput} has already been entered`);
                                    gameOver();
                                } else {
                                    const wordListItem = document.createElement('li');
                                    wordListItem.textContent = userInput.toLowerCase();
                                    wordList.appendChild(wordListItem);
                                    timeLeft = 10;
                                }


                                previousWord = userInput;
                                previousWordElement.textContent = `Previous word: ${previousWord}`;
                                wordStartElement.textContent = `Find word starting with ${userInput.slice(-1)}`;


                                scores[currentPlayer]++;
                                player1ScoreElement.textContent = scores[1];
                                player2ScoreElement.textContent = scores[2];


                                currentPlayer = 3 - currentPlayer;
                                playerTurnElement.textContent = `Player ${currentPlayer}'s turn`;


                                inputField.value = '';


                                clearInterval(countdownInterval);
                                countdownInterval = setInterval(() => {
                                    timeLeft--;
                                    countdownElement.textContent = `${timeLeft}`;
                                    if (currentPlayer == 2 && timeLeft == aiTime) {
                                        inputField.disabled = false;
                                        AIplay();
                                    }

                                    if (timeLeft < 0) {
                                        alert(`Time's up! Player ${currentPlayer} couldn't think of a word.`);
                                        gameOver();
                                    }
                                }, 1000);
                                aiTime = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
                            } else {
                                alert(`Sorry, ${userInput} doesn't start with ${lastLetter}`);
                            }
                        }
                    }
                });

                function gameOver() {
                    clearInterval(countdownInterval);
                    playerTurnElement.textContent = 'Game Over!';
                    scoreBoard.style.fontWeight = 'bold';
                    if (scores[1] > scores[2]) {
                        alert('Player 1 wins!');
                    } else if (scores[2] === scores[1]) {
                        alert('It\'s a tie!');
                    } else {
                        alert('Player 2 wins!');
                    }
                    var yesorno = document.querySelector(".try-again-modal")
                    setTimeout(function () {
                        yesorno.classList.add("show")
                        gameElement.classList.remove("show")

                    }, 50);
                }

                function AIplay() {
                    const lastLetter = previousWord.slice(-1).toLowerCase();
                    for (const word of data) {
                        if (word.toLowerCase().startsWith(lastLetter) && !isWordInList(word, wordList)) {
                            inputField.value = word;
                            // Giả lập nhấn Enter mà không cần sự kiện "keydown"
                            handleWordSubmission(word);
                            break;
                        }
                    }


                    setTimeout(() => {
                        inputField.disabled = false;
                    }, 1000);
                }

                function handleWordSubmission(userInput) {
                    userInput = userInput.trim();

                    if (userInput !== '' && checkWord(userInput)) {
                        const lastLetter = previousWord.slice(-1);

                        if (userInput.startsWith(lastLetter) || userInput.startsWith(lastLetter.toUpperCase())) {

                            if (isWordInList(userInput, wordList) || isWordInList(userInput.toLowerCase(), wordList)) {
                                alert(`Sorry, ${userInput} has already been entered`);
                                gameOver();
                            } else {
                                const wordListItem = document.createElement('li');
                                wordListItem.textContent = userInput.toLowerCase();
                                wordList.appendChild(wordListItem);
                                timeLeft = 10;
                            }


                            previousWord = userInput;
                            previousWordElement.textContent = `Previous word: ${previousWord}`;
                            wordStartElement.textContent = `Find word starting with ${userInput.slice(-1)}`;


                            scores[currentPlayer]++;
                            player1ScoreElement.textContent = scores[1];
                            player2ScoreElement.textContent = scores[2];


                            currentPlayer = 3 - currentPlayer;
                            playerTurnElement.textContent = `Player ${currentPlayer}'s turn`;


                            inputField.value = '';


                            clearInterval(countdownInterval);
                            countdownInterval = setInterval(() => {
                                timeLeft--;
                                countdownElement.textContent = `${timeLeft}`;
                                if (currentPlayer == 2 && timeLeft == aiTime) {
                                    inputField.disabled = false;
                                    AIplay();
                                }

                                if (timeLeft < 0) {
                                    alert(`Time's up! Player ${currentPlayer} couldn't think of a word.`);
                                    gameOver();
                                }
                            }, 1000);
                            aiTime = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
                        } else {
                            alert(`Sorry, ${userInput} doesn't start with ${lastLetter}`);
                        }
                    }
                }




                countdownInterval = setInterval(() => {
                    timeLeft--;
                    countdownElement.textContent = `${timeLeft}`;

                    if (timeLeft <= 0) {
                        alert(`Time's up! Player ${currentPlayer} couldn't think of a word.`);
                        gameOver();
                    }
                }, 1000);
            })
            .catch(error => console.error('Lỗi tải dữ liệu:', error));
    });
});
