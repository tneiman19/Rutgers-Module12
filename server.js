const cTable = require("console.table");
const express = require("express");
const mysql = require("mysql2");
const workbenchPwd = require("./config");

const app = express();
const PORT = process.env.PORT || 3001;

console.log(workbechPwd);
// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: workbenchPwd,
  database: "company",
});

// Run the query to fetch employee data
connection.query(`SELECT * FROM employee`, function (err, results) {
  if (err) {
    console.error(err);
    return;
  }
  console.table(results);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
