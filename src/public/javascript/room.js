document.addEventListener('DOMContentLoaded', () => {
    // const socket = io('/noiChuOnl');
    const roomId = window.location.pathname.split('/').pop();
    console.log("Room ID from URL:", roomId);

    const socket = io('/noiChuOnl', {
        query: { roomId: roomId }
    });

    socket.on('message', (message) => {
        console.log(message);
    });
    socket.on('what', (what) => {
        alert(what)
    })
    const startButton = document.getElementById("start-button");

    // Khi nhận được thông báo từ server
    socket.on('message', (msg) => {
        document.getElementById('previous-word').innerText = msg;
        const lastChar = msg.slice(-1);
        document.getElementById('word-start').innerText = `Find the word start with ${lastChar}`
    });

    socket.on('player-turn', (turnMessage) => {
        console.log(turnMessage);
        document.getElementById('player-turn').innerText = turnMessage;
    });

    socket.on('game-start', (message) => {
        alert(message);
    });
    socket.on('time-left', (timeLeft) => {
        console.log(timeLeft)
        document.getElementById('time-text').innerText = timeLeft;
    });
    socket.on('winner', (message) => {
        const modal = document.querySelector(".try-again-modal");
        modal.classList.remove("hidden");
        modal.classList.add("show");


        const winnerText = document.querySelector(".winner-text");
        winnerText.textContent = message;
    });

    startButton.addEventListener("click", function () {


        socket.emit('start');
        startButton.classList.add("hidden");

    });

    const inputField = document.getElementById('input-field');

    let wordsArray = [];
    let wordsUsed = new Set();


    fetch('../JSON/words.json')
        .then(response => response.json())
        .then(data => {
            wordsArray = data.map(word => word.toLowerCase());

            inputField.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    const userInput = inputField.value.trim().toLowerCase();


                    if (userInput !== '' && wordsArray.includes(userInput) && !wordsUsed.has(userInput)) {

                        socket.emit('new-word', userInput);
                        document.getElementById('previous-word').innerText = userInput;
                        lastChar = userInput.slice(-1);
                        document.getElementById('word-start').innerText = `Find the word start with ${lastChar}`;
                        wordsUsed.add(userInput);
                        inputField.value = '';

                    } else if (wordsUsed.has(userInput)) {
                        alert(`Sorry, ${userInput} has already been used!`);
                    } else {
                        alert(`Sorry, ${userInput} is not in the word list!`);
                    }
                }

            });
        })
        .catch(error => console.error('Error loading words.json:', error));

});
