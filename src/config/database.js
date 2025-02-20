const mysql = require('mysql2/promise')
console.log("🔍 Connecting to DB with:");
console.log("Host:", process.env.DB_HOST);
console.log("User:", process.env.DB_USER);
console.log("Database:", process.env.DB_DATABASE);
console.log("Port:", process.env.DB_PORT);

//connection database
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 10,
    connectTimeout: 10000

});
module.exports = connection