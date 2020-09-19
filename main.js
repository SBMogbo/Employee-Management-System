var mysql = require("mysql");
const inquirer=require("inquirer");
​
var connection = mysql.createConnection({
  host: "localhost",
​
  // Your port;
  port: 8889,
​
  // Your username
  user: "root",
​
  // Your password
  password: "root",
  database: "greatBay_DB"
});