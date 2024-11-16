const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

module.exports = {
  getBids: asyncHandler(async (req, res) => {
    console.log("Received API request");
    
    const query = `
      SELECT Bids.*, Buyers.Username AS Bidder_Name, Items.Item_Name as Item 
      FROM Bids 
      JOIN Buyers ON Bids.Bidder_ID = Buyers.Buyer_ID 
      JOIN Items ON Bids.Item_ID = Items.Item_ID
    `;
    
    const [rows] = await pool.query(query);
    console.log("Received results from database:", rows);
    res.json({ items: rows });
  }),
};
