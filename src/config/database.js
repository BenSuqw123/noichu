const mysql = require('mysql2/promise');

// Cấu hình kết nối đến Railway
const connection = mysql.createPool({
    host: 'maglev.proxy.rlwy.net',
    port: 43963,
    user: 'noichu_user',
    password: '123456', // Thay bằng mật khẩu đúng
    database: 'noichu',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = connection;
