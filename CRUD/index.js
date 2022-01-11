const http = require("http");
const express = require("express");
const app = express();
const bp = require("body-parser");
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "users",
  password: "harshil",
  port: 5432,
});

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.post("/api/create/", (req, res) => {
  const { name, age } = req.body;
  pool.query(
    ` INSERT INTO userdetails (name,age) VALUES('${name}',${age}) RETURNING *`,
    (errors, results) => {
      if (errors) {
        throw errors;
      } else {
        res.send(`User Succesfully Created with USERID:${results.rows[0].id}`);
      }
    }
  );
});
app.get("/api/getuser/", (req, res) => {
    const id = Number(req.params.id);
  
    pool.query(`SELECT * FROM userdetails `, (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    });
  });
app.get("/api/getuser/:id", (req, res) => {
  const id = Number(req.params.id);

  pool.query(`SELECT * FROM userdetails where id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});
app.delete("/api/delete/:id", (req, res) => {
    const id = parseInt(req.params.id)

    pool.query('DELETE FROM userdetails WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`User deleted with ID: ${id}`)
    })

});
app.put("/api/update/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const { name, age } = req.body
  
    pool.query(
      'UPDATE userdetails SET name = $1, age = $2 WHERE id = $3',
      [name, age, id],
      (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).send(`User modified with ID: ${id}`)
      }
    )

});
app.listen(3000, () => {
  console.log("App running on port 3000.");
});
