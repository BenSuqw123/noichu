const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const route = require('./router/web')
const configView = require('./config/configview')

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3000; // Đặt cổng server




//config template
configView(app)
//khai bao route
app.use('/', route)

let players = []; // Lưu trữ danh sách người chơi
let currentPlayer = 0;  // Chỉ số người chơi hiện tại (0 cho Player 1, 1 cho Player 2)
let playersReady = 0;
let countdownInterval;
let gameOver = false;
let gameInProgress = false;

io.of('/noiChuOnl').on('connection', (socket) => {
    console.log('A user connected');
    if (gameInProgress) {
        socket.emit('message', 'Một ván chơi đã bắt đầu, vui lòng chờ ván kế tiếp!');
        return;
    }
    if (players.length < 2) {
        players.push(socket.id);
        if (players.length === 1) {
            socket.emit('message', 'Bạn là player 1, chờ người chơi còn lại...');
        } else if (players.length === 2) {
            socket.emit('message', 'Bạn là player 2');
            io.of('/noiChuOnl').to(players[0]).emit('message', 'Bạn là player 1');
        }
    }
    socket.on('start', () => {
        playersReady += 1;
        if (playersReady === 2) {
            console.log('Cả hai người chơi đều đã sẵn sàng');
            io.of('/noiChuOnl').emit('game-start', 'Trò chơi bắt đầu!');
            io.of('/noiChuOnl').to(players[currentPlayer]).emit('message', 'YOU GO FIRST');
            io.of('/noiChuOnl').to(players[currentPlayer + 1]).emit('message', 'WAIT FOR FIRST PLAYER');
            io.of('/noiChuOnl').emit('player-turn', currentPlayer === 0 ? "Player 1's turn" : "Player 2's turn");
            gameInProgress = true;
            gameOver = false;
            resetCountdown();
        }
        else {
            let otherPlayer = players[0] !== socket.id ? players[1] : players[0];
            io.of('/noiChuOnl').to(otherPlayer).emit('message', 'Chờ Player còn lại nhấn Start.');
        }
    });

    // Lắng nghe sự kiện nhập từ mới
    socket.on('new-word', (word) => {
        console.log('Received word: ' + word);
        console.log('Current player:', currentPlayer);
        console.log('Players:', players);
        resetCountdown();

        if (socket.id === players[currentPlayer]) {
            currentPlayer = (currentPlayer + 1) % 2;  // Chuyển lượt
            io.of('/noiChuOnl').to(players[currentPlayer]).emit('message', `${word}`);
            io.of('/noiChuOnl').emit('player-turn', currentPlayer === 0 ? "Player 1's turn" : "Player 2's turn");
        }
    });


    // Hàm đặt lại đồng hồ đếm ngược
    function resetCountdown() {

        if (gameOver) return;
        if (countdownInterval) clearInterval(countdownInterval);  // Dừng đồng hồ cũ
        timeLeft = 10;  // Đặt lại thời gian
        countdownInterval = setInterval(() => {
            if (timeLeft <= 0) {
                io.of('/noiChuOnl').emit('message', `Hết giờ! Player ${currentPlayer + 1} không thể nghĩ ra từ`);
                currentPlayer = (currentPlayer + 1) % 2; // Chuyển lượt
                io.of('/noiChuOnl').emit('player-turn', `Player ${currentPlayer + 1}'s turn`);
                gameover(currentPlayer);  // Truyền currentPlayer vào gameover
            } else {
                timeLeft--;
                io.of('/noiChuOnl').emit('time-left', timeLeft);  // Gửi thông tin thời gian cho tất cả người chơi
            }
        }, 1000);
    }

    function gameover(currentPlayer) {
        io.of('/noiChuOnl').emit('winner', `Player ${currentPlayer + 1} wins!`);
        gameOver = true;  // Đặt trạng thái trò chơi kết thúc
        gameInProgress = false;  // Đặt trạng thái game đã kết thúc
        playersReady = 0; // Reset người chơi sẵn sàng
        gameOver = true;  // Đặt trạng thái trò chơi kết thúc

        clearInterval(countdownInterval);  // Dừng đồng hồ đếm ngược
        return;
    }


    // Khi người chơi rời khỏi game
    socket.on('disconnect', () => {
        console.log('A user disconnected');

        // Xóa người chơi khỏi mảng
        players = players.filter(player => player !== socket.id);
        console.log("Players array after disconnect:", players);

        // Kiểm tra nếu còn 1 người chơi
        if (players.length === 1) {
            io.of('/noiChuOnl').to(players[0]).emit('message', 'Người chơi còn lại đã rời, chờ người chơi mới vào.');
        }

        // Nếu không còn ai trong game
        if (players.length === 0) {
            console.log('Không còn người chơi nào trong game.');
        }
    });
});



server.listen(port, () => {
    console.log('Server running on http://localhost:3000');
});
