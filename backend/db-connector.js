/* 
The project uses the CS 340 starter code and heavily modifies it with details specific to our project, such as CRUD logic, frontend JavaScript, etc. 
*/ 

// Get an instance of mysql we can use in the app
var mysql = require("mysql");

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
  connectionLimit: 10,
  host: "classmysql.engr.oregonstate.edu",
  user: "cs340_ONID",
  password: "xxxx",
  database: "cs340_ONID",
});

// Export it for use in our application
module.exports.pool = pool;
