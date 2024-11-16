const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess, sendError } = require("../utils/responseHandler");

module.exports = {
  addProduct: asyncHandler(async (req, res) => {
    const {
      itemName,
      description,
      startingPrice,
      auctionEndTime, // Ensure this is a valid date string
      category,
      sellerID,
    } = req.body;

    const currentTime = new Date();

    // Validate auctionEndTime
    const auctionEndDate = new Date(auctionEndTime);
    if (!auctionEndTime || isNaN(auctionEndDate.getTime())) {
      return sendError(res, "Invalid auction end time.");
    }

    // Retrieve the maximum Item_ID
    const resultsItem = await pool.query(
      "SELECT IFNULL(MAX(Item_ID), 0) AS max_item_id FROM Items"
    );

    let maxItemID = resultsItem[0][0].max_item_id;
    const itemID = maxItemID + 1;

    // Determine auction status based on time comparison
    let auctionStatus = "";
    if (currentTime < auctionEndDate) {
      auctionStatus = "Pending";
    } else if (currentTime >= auctionEndDate) {
      auctionStatus = "Closed";
    } else {
      auctionStatus = "Active";
    }

    // Ensure valid number formatting for sellerID and startingPrice
    const parsedSellerID = parseInt(sellerID);
    const parsedStartingPrice = parseFloat(startingPrice);

    // Validate parsed values
    if (isNaN(parsedSellerID) || isNaN(parsedStartingPrice)) {
      return sendError(res, "Invalid seller ID or starting price.");
    }

    // Format auctionEndTime to MySQL-compatible format
    const auctionEndTimeFormatted = auctionEndDate.toISOString().slice(0, 19).replace("T", " ");
    
    // Insert into Items table
    console.log("checkpoint 1");
    
    await pool.query(
      "INSERT INTO Items (Seller_ID, Item_Name, Description, Starting_Price, Auction_End_Time, Category, Last_Bidder, Last_Bid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        parsedSellerID,  // Make sure sellerID is an integer
        itemName,
        description,
        parsedStartingPrice,  // Make sure startingPrice is a number
        auctionEndTimeFormatted,  // Format the auctionEndTime correctly
        category,
        null,  // Last bidder is initially null
        parsedStartingPrice,  // Last bid is the starting price initially
      ]
    );

    // Retrieve the maximum Auction_ID
    const resultsAuction = await pool.query(
      "SELECT IFNULL(MAX(Auction_ID), 0) AS max_auction_id FROM Auctions"
    );

    let maxAuctionID = resultsAuction[0][0].max_auction_id;
    const auctionID = maxAuctionID + 1;
    console.log("checkpoint 2");

    console.log([
      auctionID,
      itemID,
      new Date().toISOString().slice(0, 19).replace("T", " "),
      auctionEndTimeFormatted,  // Format auctionEndTime correctly
      auctionStatus,
      parsedStartingPrice,  // Reserve price as startingPrice
    ]);
    

    // Insert into Auctions table
    await pool.query(
      "INSERT INTO Auctions (Auction_ID, Item_ID, Auction_Start_Time, Auction_End_Time, Auction_Status, Reserve_Price) VALUES (?, ?, ?, ?, ?, ?)",
      [
        auctionID,
        itemID,
        new Date().toISOString().slice(0, 19).replace("T", " "),
        auctionEndTimeFormatted,  // Format auctionEndTime correctly
        auctionStatus,
        parsedStartingPrice,  // Reserve price as startingPrice
      ]
    );

    sendSuccess(res, { message: "Product added successfully" });
  }, "Failed to add product")
};
