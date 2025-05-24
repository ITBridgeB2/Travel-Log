const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Search
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);

  try {
    const [rows] = await db.execute(
      `SELECT id, name, country FROM destinations 
       WHERE name LIKE ? OR country LIKE ? 
       ORDER BY created_at DESC LIMIT 5`,
      [`%${query}%`, `%${query}%`]
    );
    res.json(rows);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET all destinations
app.get('/destinations', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute('SELECT * FROM destinations ORDER BY visit_date DESC');
    await connection.end();

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});
app.delete('/destinations/:id', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute("DELETE FROM destinations WHERE id = ?", [req.params.id]);
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (error) {
    console.error("Error deleting destination:", error);
    res.status(500).json({ error: "Failed to delete destination" });
  }
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



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
