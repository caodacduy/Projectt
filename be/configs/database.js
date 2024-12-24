const { Pool } = require('pg');
require('dotenv').config();

const db = {
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // Đảm bảo SSL kết nối được chấp nhận
  }
};

const pool = new Pool(db);

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected:', res.rows);
  }
});

module.exports = pool;