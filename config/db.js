const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("MySQL Connected!");
  }
});

module.exports = db;