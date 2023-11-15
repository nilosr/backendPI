const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS sensores (id INTEGER PRIMARY KEY AUTOINCREMENT, filled BOOLEAN, pref BOOLEAN)"
  );
});

app.get("/sensores/:id", (req, res) => {
  const { id } = req.params;
  db.all("SELECT * FROM sensores WHERE id = ?", [id], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      if (rows) {
        res.json(rows);
      } else {
        res.status(404).send("Sensor not found");
      }
    }
  });
});

app.post("/sensores", (req, res) => {
  const { filled, pref } = req.body;
  db.run(
    "INSERT INTO sensores (filled, pref) VALUES (?, ?)",
    [filled, pref],
    function (err) {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.send("Sensor created with id: " + this.lastID);
      }
    }
  );
});

app.put("/sensores/:id", (req, res) => {
  const { id } = req.params;
  const { filled } = req.body;
  db.run("UPDATE sensores SET filled = ? WHERE id = ?", [filled, id], (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send("Sensor updated successfully");
    }
  });
});

app.delete("/sensores/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM sensores WHERE id = ?", [id], (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send("Sensor deleted successfully");
    }
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
