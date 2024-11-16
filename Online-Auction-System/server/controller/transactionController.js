const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

module.exports = {
  getTransaction: asyncHandler(async (req, res) => {
    console.log("Received API request");

    // MySQL query syntax
    const query = `
      SELECT Transactions.*, Buyers.Username AS Buyer_Name, Sellers.Username AS Seller_Name 
      FROM Transactions 
      JOIN Buyers ON Transactions.Buyer_ID = Buyers.Buyer_ID 
      JOIN Sellers ON Transactions.Seller_ID = Sellers.Seller_ID
    `;

    // Query execution using pool.query for MySQL
    const [rows] = await pool.query(query);

    console.log("Received results from database:", rows);
    res.json({ items: rows });
  }, "Error fetching transactions"),
};
