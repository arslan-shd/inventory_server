const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
require("dotenv").config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// Get all the products
app.get("/", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, data) => {
    if (err) return res.json("An error occurred");
    return res.json(data);
  });
});

// Create a new product
app.post("/product", (req, res) => {
  const sql =
    "INSERT INTO `products` (`id`, `name`, `category`, `price`, `quantity`) VALUES (NULL, ? , ?, ?, ?);";

  db.query(
    sql,
    [req.body.name, req.body.category, req.body.price, req.body.quantity],
    (err, data) => {
      if (err) return res.json("An error occurred");
      return res.json(data);
    }
  );
});

// Delete product
app.delete("/products/:id", (req, res) => {
  const sql = "DELETE FROM products WHERE id = ?";
  const id = req.params.id;
  db.query(sql, [id], (err, data) => {
    if (err) return res.json("An error occurred");
    return res.json(data);
  });
});

app.patch("/products/:id", (req, res) => {
  const sql =
    "UPDATE products SET name = ?,category= ?,price = ?,quantity = ? WHERE id = ?";
  const id = req.params.id;

  const values = [
    req.body.updatedName,
    req.body.updatedCategory,
    req.body.updatedPrice,
    req.body.updatedQuantity,
  ];

  db.query(sql, [...values, id], (err, data) => {
    if (err) return res.json("erro message from backend" + err.message);
    return res.json(data);
  });
});

app.listen(process.env.PORT, () => {
  console.log("Listening on port " + process.env.PORT);
});
