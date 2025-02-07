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
// Lắng nghe kết nối socket từ client
io.on("connection", (socket) => {
    console.log(`Người dùng kết nối: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`Người dùng ngắt kết nối: ${socket.id}`);
    });
});

// Bắt đầu server
server.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
