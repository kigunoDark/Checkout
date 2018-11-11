var mysql = require("mysql");

// Our DB
const connecion = mysql.createPool({
  connectionLimit: 100,
  host: "localhost",
  user: "root",
  password: "1995op1995",
  database: "checkout"
});

module.exports = connecion;
