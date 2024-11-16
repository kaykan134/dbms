const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

module.exports = {
  getItems: asyncHandler(async (req, res) => {
    const query = `
      SELECT Items.*, 
             Sellers.Username AS Seller_Username, 
             Sellers.Email AS Seller_Email, 
             Sellers.Address AS Seller_Address, 
             Sellers.Account_Balance AS Seller_Account_Balance, 
             Auctions.Auction_Status 
      FROM Items 
      JOIN Sellers ON Items.Seller_ID = Sellers.Seller_ID 
      JOIN Auctions ON Items.Item_ID = Auctions.Item_ID;
    `;

    const [rows] = await pool.query(query); // MySQL returns results as an array with rows in the first element
    // console.log("Received results from database:", rows);
    res.json({ items: rows });
  })
};
