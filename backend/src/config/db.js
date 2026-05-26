const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log(`[DB] Connected to '${process.env.DB_NAME}' on ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    conn.release();
  } catch (err) {
    console.log(`[DB] [ERROR] DB not connected: ${err.message}`);
    process.exit(1);
  }
})();

module.exports = pool;