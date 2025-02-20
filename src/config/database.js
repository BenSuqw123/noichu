require('dotenv').config(); // Đảm bảo bạn có dotenv để load biến môi trường
const mysql = require('mysql2/promise');

console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB_PORT);
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = connection;
