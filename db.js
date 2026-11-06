
const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'harshitha_petcare',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
async function testConnection() {
    try {
        const connection = await db.getConnection();

        console.log('MySQL Database Connected Successfully!');
        console.log('Database Name: harshitha_petcare');

        connection.release();

    } catch (error) {
        console.error('MySQL Connection Error:', error.message);
    }
}

testConnection();

module.exports = db;
