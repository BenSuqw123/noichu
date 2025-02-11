document.addEventListener('DOMContentLoaded', () => {
    // const socket = io('/noiChuOnl');
    const roomId = window.location.pathname.split('/').pop();  // Lấy roomId từ URL
    console.log("Room ID from URL:", roomId);  // Kiểm tra xem roomId có chính xác không

    const socket = io('/noiChuOnl', {
        query: { roomId: roomId }  // Truyền roomId qua query string
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
        console.log(turnMessage);  // In ra thông báo lượt chơi
        document.getElementById('player-turn').innerText = turnMessage;
    });

    socket.on('game-start', (message) => {
        alert(message);  // Khi game bắt đầu, hiển thị thông báo
    });
    socket.on('time-left', (timeLeft) => {
        console.log(timeLeft)
        document.getElementById('time-text').innerText = timeLeft;
    });
    socket.on('winner', (message) => {
        const modal = document.querySelector(".try-again-modal");
        modal.classList.remove("hidden"); // Loại bỏ lớp 'hidden'
        modal.classList.add("show"); // Thêm lớp 'show' để hiển thị modal

        // Cập nhật nội dung modal với tên người chiến thắng
        const winnerText = document.querySelector(".winner-text");
        winnerText.textContent = message; // Cập nhật tên người thắng
    });
    // Khi người chơi nhấn nút start
    startButton.addEventListener("click", function () {
        // Gửi sự kiện "start" đến server khi nhấn nút

        socket.emit('start');
        startButton.classList.add("hidden");

    });

    const inputField = document.getElementById('input-field');

    let wordsArray = [];  // Mảng chứa các từ trong file words.json
    let wordsUsed = new Set();  // Set lưu trữ các từ đã sử dụng

    // Tải tệp JSON và kiểm tra từ
    fetch('../JSON/words.json')
        .then(response => response.json())
        .then(data => {
            wordsArray = data.map(word => word.toLowerCase());  // Lưu tất cả từ trong JSON dưới dạng chữ thường

            // Lắng nghe sự kiện nhấn phím Enter
            inputField.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    const userInput = inputField.value.trim().toLowerCase();  // Lấy giá trị nhập vào và chuyển thành chữ thường

                    // Kiểm tra xem từ nhập vào có trong danh sách từ trong words.json và chưa được sử dụng chưa
                    if (userInput !== '' && wordsArray.includes(userInput) && !wordsUsed.has(userInput)) {
                        // Nếu từ hợp lệ và có trong danh sách, gửi từ lên server
                        socket.emit('new-word', userInput);
                        document.getElementById('previous-word').innerText = userInput;
                        lastChar = userInput.slice(-1);
                        document.getElementById('word-start').innerText = `Find the word start with ${lastChar}`;
                        wordsUsed.add(userInput);  // Thêm từ vào Set đã sử dụng
                        inputField.value = '';  // Xóa input field sau khi nhập từ

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
