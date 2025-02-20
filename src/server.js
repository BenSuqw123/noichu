const express = require("express");
require('dotenv').config();
const http = require("http");
const { Server } = require("socket.io");
const route = require('./router/web')
const configView = require('./config/configview')
const connection = require('./config/database')


const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000 // Đặt cổng server


// window.location.pathname.split('/').slice(-1)[0]
// Đảm bảo rằng bạn đã thêm middleware sau vào app.js hoặc server.js
app.use(express.urlencoded({ extended: true })); // Để xử lý dữ liệu form-urlencoded
app.use(express.json()); // Để xử lý dữ liệu JSON
//config template
configView(app)

//khai bao route
app.use('/', route)




let rooms = new Map();  // Sử dụng Map để lưu trữ trạng thái các phòng

io.of('/noiChuOnl').on('connection', async (socket) => {
    console.log('A user connected');

    const roomId = socket.handshake.query.roomId;
    console.log(`User connected to room ${roomId}`);
    let [rows, fields] = await connection.query('SELECT players FROM Users WHERE id = ?', [roomId]);
    const maxPlayers = rows && rows.length > 0 ? rows[0].players : 0;

    if (!rooms.has(roomId)) {
        rooms.set(roomId, {
            maxPlayers: maxPlayers,
            players: [],
            currentPlayer: 0,
            playersReady: 0,
            gameInProgress: false,
            gameOver: false,
            countdownInterval: null,
            timeLeft: 10
        });
    }

    // Tham gia phòng
    socket.join(roomId);
    socket.emit('message', `Bạn đã tham gia phòng ${roomId}`);

    // Thêm người chơi vào phòng
    const room = rooms.get(roomId);
    console.log(maxPlayers)
    if (room.players.length <= maxPlayers) {
        for (let i = 0; i < maxPlayers; i++) {
            if (!room.players[i]) {
                room.players[i] = socket.id;
                socket.emit('what', `Bạn là player ${i + 1}, chờ người chơi còn lại...`);
                if (room.players.length === maxPlayers) {
                    socket.emit('what', `Bạn là player ${i + 1}`);
                    io.of('/noiChuOnl').emit('message', `Phòng đã đầy người. Hay nha nut start de bắt đầu.`);
                }
                break;
            }
        }
    } else {

        socket.emit('message', 'Phòng đã đầy người. Bạn không thể tham gia.');
        socket.disconnect(true);
    }
    socket.on('start', () => {
        room.playersReady += 1;
        if (room.playersReady === maxPlayers) {
            console.log('Mọi người chơi đều đã sẵn sàng');
            io.of('/noiChuOnl').emit('game-start', 'Trò chơi bắt đầu!');
            io.of('/noiChuOnl').to(room.players[room.currentPlayer]).emit('message', 'YOU GO FIRST');
            for (let i = 0; i < room.maxPlayers; i++) {
                if (i !== room.currentPlayer) {
                    io.of('/noiChuOnl').to(room.players[i]).emit('message', `WAIT FOR PLAYER ${room.currentPlayer + 1}`);
                }
            }
            room.gameInProgress = true;
            room.gameOver = false;
            resetCountdown(roomId);
        } else {
            let otherPlayer = room.players.find(player => player !== socket.id);
            io.of('/noiChuOnl').to(otherPlayer).emit('message', 'Chờ Player còn lại nhấn Start.');
        }
    });

    socket.on('new-word', (word) => {
        console.log('Received word: ' + word);
        console.log('Current player:', room.currentPlayer);
        console.log('Players:', room.players);
        resetCountdown(roomId);

        if (socket.id === room.players[room.currentPlayer]) {
            room.currentPlayer = (room.currentPlayer + 1) % maxPlayers;
            for (let i = 0; i < room.players.length; i++) {
                io.of('/noiChuOnl').to(room.players[i]).emit('message', `${word}`);
            }
            let turn = `Player ${room.currentPlayer + 1} turn`;
            io.of('/noiChuOnl').emit('player-turn', turn);
        }
    });

    function resetCountdown(roomId) {
        const room = rooms.get(roomId);

        if (room.gameOver) return;
        if (room.countdownInterval) clearInterval(room.countdownInterval);
        room.timeLeft = 10;
        room.countdownInterval = setInterval(() => {
            if (room.timeLeft <= 0) {
                io.of('/noiChuOnl').emit('message', `Hết giờ! Player ${room.currentPlayer + 1} không thể nghĩ ra từ`);
                gameover(roomId);
            } else {
                room.timeLeft--;
                io.of('/noiChuOnl').emit('time-left', room.timeLeft);
            }
        }, 1000);
    }

    function gameover(roomId) {
        const room = rooms.get(roomId);
        io.of('/noiChuOnl').emit('winner', `Player ${room.currentPlayer + 1} lose!`);
        room.gameOver = true;
        room.gameInProgress = false;
        room.playersReady = 0;

        clearInterval(room.countdownInterval);
    }

    socket.on('disconnect', async () => {
        console.log('A user disconnected');

        // Lấy phòng hiện tại và xóa người chơi khỏi phòng
        const room = rooms.get(roomId);
        room.players = room.players.filter(player => player !== socket.id);
        console.log("Players array after disconnect:", room.players);

        if (room && Array.isArray(room.players)) {
            room.players = room.players.filter(player => player !== socket.id);

            if (room.players.length === 1) {
                io.of('/noiChuOnl').to(room.players[0]).emit('message', 'Chỉ còn bạn trong phòng, phòng sẽ bị xóa nếu không có người chơi mới tham gia.');
            }
            if (room.players.length === 0) {
                rooms.delete(roomId);
                console.log('Phòng đã bị xóa vì không còn người chơi.');
            }
        } else {
            console.log('Phòng không tồn tại hoặc players không phải là mảng.');
        }
    });
});


// io.of('/noiChuOnl').on('connection', (socket) => {
//     console.log('A user connected');

//     // Lấy roomId từ URL
//     const roomId = socket.handshake.query.roomId;
//     console.log(`User connected to room ${roomId}`);

//     // Kiểm tra nếu roomId đã tồn tại, nếu không thì tạo phòng mới
//     socket.join(roomId);
//     socket.emit('message', `Bạn đã tham gia phòng ${roomId}`);

//     // Xử lý sự kiện khi người chơi gửi từ mới
//     socket.on('new-word', (word) => {
//         console.log(`Word received in room ${roomId}: ${word}`);
//         // Xử lý logic gửi từ và chuyển lượt ở đây
//     });

//     // Khi người chơi rời phòng
//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//         socket.leave(roomId); // Rời khỏi phòng khi ngắt kết nối
//     });
// });



server.listen(port, () => {
    console.log('Server running on http://localhost:3000');
});
