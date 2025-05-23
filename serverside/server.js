// Load environment variables
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MySQL connection pool using .env
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,  // You can adjust this limit
  queueLimit: 0
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connected to MySQL using pool");
  connection.release();
});

// ✅ Filtered GET /destinations?year=2025&country=France
app.get('/destinations', (req, res) => {
  const { year, country } = req.query;

  let query = 'SELECT * FROM destinations WHERE 1';
  const values = [];

  if (year) {
    query += ' AND YEAR(visit_date) = ?';
    values.push(year);
  }

  if (country) {
    query += ' AND country = ?';
    values.push(country);
  }

  query += ' ORDER BY visit_date DESC';

  pool.query(query, values, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
