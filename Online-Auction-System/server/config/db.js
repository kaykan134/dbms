const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database: ", err.stack);
  } else {
    console.log("Connected to the database successfully");
    // Release the connection back to the pool
    connection.release();
  }
});

// Export the pool for use in other files
module.exports = pool;
