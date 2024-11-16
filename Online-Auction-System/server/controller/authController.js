const pool = require("../config/db.js");
const asyncHandler = require("../utils/asyncHandler");

module.exports = {
  login: asyncHandler(async (req, res) => {
    console.log("Received authentication request");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    const { username, password, userType } = req.body;
    console.log(
      `Attempting to authenticate user: ${username}, type: ${userType}`
    );

    let tableName;
    if (userType === "buyer") {
      tableName = "Buyers";
    } else if (userType === "seller") {
      tableName = "Sellers";
    } else if (userType === "admin") {
      tableName = "Admin";
    } else {
      console.log(`Invalid user type: ${userType}`);
      return res.status(400).json({ message: "Invalid user type" });
    }

    console.log(`Using table: ${tableName}`);

    // Use parameterized query syntax for MySQL
    const query = `SELECT * FROM ${tableName} WHERE Username = ?`;
    const values = [username];

    console.log(`Executing query: ${query}`);
    // Execute the query using pool
    const [rows] = await pool.query(query, values); // Adjust for MySQL format

    if (rows.length === 0) {
      console.log(`User not found: ${username}`);
      return res.status(404).json({ auth: false, message: "User not found" });
    }

    const user = rows[0];
    console.log(`User found: ${JSON.stringify(user)}`);

    // Password comparison logic
    const isAuthenticated = password === user.Password;
    console.log(`Authentication result: ${isAuthenticated}`);

    res.json({
      auth: isAuthenticated,
      buyerID: user.buyer_id,
      sellerID: user.Seller_ID,
      adminID: user.admin_id,
    });
    console.log("Authentication response sent");
  })
};
