const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { default: AddDestination } = require('../clientside/src/Components/AddDestination');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'traveldb',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
});



// ---------------------------------------------------AddDestination-------------------

// POST /destinations

app.post('/destinations', (req, res) => {
  const { name, country, visit_date, notes } = req.body;
  const sql = `INSERT INTO destinations (name, country, visit_date, notes) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, country, visit_date, notes], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Error saving destination' });
    }
    res.status(201).json({ message: 'Destination saved', id: result.insertId });
  });
});





// ------------------------------------------END OF AddDestination-------------------



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
