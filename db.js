<<<<<<< HEAD
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./jobs.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      start TEXT,
      status TEXT,
      note TEXT
    )
  `);
});

module.exports = {
  getAllJobs: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM jobs', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  addJob: (job) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO jobs (title, start, status, note) VALUES (?, ?, ?, ?)',
        [job.title, job.start, job.status, job.note],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...job });
        }
      );
    });
  },

  updateJob: (id, job) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE jobs SET title = ?, start = ?, status = ?, note = ? WHERE id = ?',
        [job.title, job.start, job.status, job.note, id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  },

  deleteJob: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM jobs WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};
=======
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./jobs.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      start TEXT,
      status TEXT,
      note TEXT
    )
  `);
});

module.exports = {
  getAllJobs: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM jobs', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  addJob: (job) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO jobs (title, start, status, note) VALUES (?, ?, ?, ?)',
        [job.title, job.start, job.status, job.note],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...job });
        }
      );
    });
  },

  updateJob: (id, job) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE jobs SET title = ?, start = ?, status = ?, note = ? WHERE id = ?',
        [job.title, job.start, job.status, job.note, id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  },

  deleteJob: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM jobs WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};
>>>>>>> c21832cdba14ed0f64d03daa363c8ce57c0c22e9
