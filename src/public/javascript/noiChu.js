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
                const dictionary = {}; // Tạo đối tượng dictionary
                for (const word of data) {
                    dictionary[word.toLowerCase()] = true;  // Chuyển về chữ thường để so sánh dễ dàng hơn
                }

                function checkWord(word) {
                    return word.toLowerCase() in dictionary;  // Kiểm tra từ trong dictionary
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
                let timeLeft = 10; // Cài đặt thời gian đếm ngược bắt đầu là 20 giây
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
                                    wordListItem.textContent = userInput.toLowerCase();  // Chỉ thêm một lần
                                    wordList.appendChild(wordListItem);
                                    timeLeft = 10;  // Reset lại thời gian mỗi lần nhập từ mới
                                }

                                // Cập nhật từ trước
                                previousWord = userInput;
                                previousWordElement.textContent = `Previous word: ${previousWord}`;
                                wordStartElement.textContent = `Find word starting with ${userInput.slice(-1)}`;

                                // Cập nhật điểm
                                scores[currentPlayer]++;
                                player1ScoreElement.textContent = scores[1];
                                player2ScoreElement.textContent = scores[2];

                                // Chuyển lượt chơi
                                currentPlayer = 3 - currentPlayer; // Đổi giữa 1 và 2
                                playerTurnElement.textContent = `Player ${currentPlayer}'s turn`;

                                // Xóa trường nhập liệu
                                inputField.value = '';

                                // Reset lại đồng hồ đếm ngược
                                clearInterval(countdownInterval);  // Dừng đồng hồ cũ
                                countdownInterval = setInterval(() => {
                                    timeLeft--;  // Giảm thời gian mỗi giây
                                    countdownElement.textContent = `${timeLeft}`;  // Hiển thị thời gian còn lại
                                    if (currentPlayer == 2 && timeLeft == aiTime) {
                                        inputField.disabled = false;  // Bật lại trường nhập liệu cho người chơi
                                        AIplay();
                                    }

                                    if (timeLeft < 0) {
                                        alert(`Time's up! Player ${currentPlayer} couldn't think of a word.`);
                                        gameOver();
                                    }
                                }, 1000);  // Cập nhật mỗi giây
                                aiTime = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
                            } else {
                                alert(`Sorry, ${userInput} doesn't start with ${lastLetter}`);
                            }
                        }
                    }
                });

                function gameOver() {
                    clearInterval(countdownInterval);  // Dừng đồng hồ đếm ngược khi trò chơi kết thúc
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
                    const lastLetter = previousWord.slice(-1).toLowerCase();  // Chữ cái cuối cùng của từ trước
                    for (const word of data) {
                        if (word.toLowerCase().startsWith(lastLetter) && !isWordInList(word, wordList)) {
                            inputField.value = word;  // AI tự nhập từ hợp lệ

                            // Giả lập nhấn Enter mà không cần sự kiện "keydown"
                            handleWordSubmission(word);  // Gọi trực tiếp hàm xử lý từ nhập
                            break;  // Dừng vòng lặp sau khi AI nhập một từ
                        }
                    }

                    // Sau khi AI chơi xong, bật lại trường nhập liệu cho người chơi
                    setTimeout(() => {
                        inputField.disabled = false;  // Bật lại trường nhập liệu
                    }, 1000); // Delay 1 giây để tạo hiệu ứng chuyển lượt
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
                                wordListItem.textContent = userInput.toLowerCase();  // Chỉ thêm một lần
                                wordList.appendChild(wordListItem);
                                timeLeft = 10;  // Reset lại thời gian mỗi lần nhập từ mới
                            }

                            // Cập nhật từ trước
                            previousWord = userInput;
                            previousWordElement.textContent = `Previous word: ${previousWord}`;
                            wordStartElement.textContent = `Find word starting with ${userInput.slice(-1)}`;

                            // Cập nhật điểm
                            scores[currentPlayer]++;
                            player1ScoreElement.textContent = scores[1];
                            player2ScoreElement.textContent = scores[2];

                            // Chuyển lượt chơi
                            currentPlayer = 3 - currentPlayer; // Đổi giữa 1 và 2
                            playerTurnElement.textContent = `Player ${currentPlayer}'s turn`;

                            // Xóa trường nhập liệu
                            inputField.value = '';

                            // Reset lại đồng hồ đếm ngược
                            clearInterval(countdownInterval);  // Dừng đồng hồ cũ
                            countdownInterval = setInterval(() => {
                                timeLeft--;  // Giảm thời gian mỗi giây
                                countdownElement.textContent = `${timeLeft}`;  // Hiển thị thời gian còn lại
                                if (currentPlayer == 2 && timeLeft == aiTime) {
                                    inputField.disabled = false;  // Bật lại trường nhập liệu cho người chơi
                                    AIplay();
                                }

                                if (timeLeft < 0) {
                                    alert(`Time's up! Player ${currentPlayer} couldn't think of a word.`);
                                    gameOver();
                                }
                            }, 1000);  // Cập nhật mỗi giây
                            aiTime = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
                        } else {
                            alert(`Sorry, ${userInput} doesn't start with ${lastLetter}`);
                        }
                    }
                }



                // Bắt đầu trò chơi với đồng hồ đếm ngược ban đầu
                countdownInterval = setInterval(() => {
                    timeLeft--;  // Giảm thời gian mỗi giây
                    countdownElement.textContent = `${timeLeft}`;

                    if (timeLeft <= 0) {
                        alert(`Time's up! Player ${currentPlayer} couldn't think of a word.`);
                        gameOver();
                    }
                }, 1000);  // Cập nhật mỗi giây
            })
            .catch(error => console.error('Lỗi tải dữ liệu:', error));
    });
});
