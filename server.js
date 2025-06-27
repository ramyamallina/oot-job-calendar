const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve your HTML/CSS/JS from 'public'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// SQLite setup
const db = new sqlite3.Database('./jobs.db', (err) => {
  if (err) {
    console.error('Failed to connect to database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create jobs table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    start TEXT NOT NULL,
    status TEXT NOT NULL,
    note TEXT
  )
`);

// Get all jobs
app.get('/api/jobs', (req, res) => {
  db.all('SELECT * FROM jobs', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Add a new job
app.post('/api/jobs', (req, res) => {
  const { id, title, start, status, note } = req.body;
  db.run(
    'INSERT INTO jobs (id, title, start, status, note) VALUES (?, ?, ?, ?, ?)',
    [id, title, start, status, note],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ success: true });
      }
    }
  );
});

// Update a job
app.put('/api/jobs/:id', (req, res) => {
  const { id } = req.params;
  const { title, start, status, note } = req.body;
  db.run(
    'UPDATE jobs SET title = ?, start = ?, status = ?, note = ? WHERE id = ?',
    [title, start, status, note, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ success: true });
      }
    }
  );
});

// Delete a job
app.delete('/api/jobs/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM jobs WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ success: true });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
