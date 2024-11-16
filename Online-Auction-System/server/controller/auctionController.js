const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

module.exports = {
  getAuctions: asyncHandler(async (req, res) => {
    const query = `
      SELECT Auctions.*, 
             Items.Item_Name AS Item_Name, 
             Items.Description AS Description 
      FROM Auctions 
      JOIN Items ON Auctions.Item_ID = Items.Item_ID;
    `;

    const [rows] = await pool.query(query); // MySQL result format adjustment
    console.log("Received results from database:", rows);
    res.json({ items: rows });
  }),
};
