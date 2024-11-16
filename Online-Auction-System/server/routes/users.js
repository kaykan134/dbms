const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'password', // Replace with your MySQL password
  database: 'auction' // Replace with your database name
});

// Route to get users based on role
router.get('/', (req, res) => {
  const role = req.query.role;
  let query = '';

  if (role === 'seller') {
    query = 'SELECT * FROM Sellers';
  } else if (role === 'buyer') {
    query = 'SELECT * FROM Buyers';
  } else {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Error fetching users' });
    }
    res.json(results);
  });
});

// Route to add a user
router.post('/', (req, res) => {
  const { username, password, email, address, account_balance, role } = req.body;
  let query = '';

  if (role === 'seller') {
    query = 'INSERT INTO Sellers (Username, Password, Email, Address, Account_Balance) VALUES (?, ?, ?, ?, ?)';
  } else if (role === 'buyer') {
    query = 'INSERT INTO Buyers (Username, Password, Email, Address, Account_Balance) VALUES (?, ?, ?, ?, ?)';
  } else {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  db.query(query, [username, password, email, address, account_balance], (err) => {
    if (err) {
      console.error('Error adding user:', err);
      return res.status(500).json({ message: 'Error adding user' });
    }
    res.status(201).json({ message: 'User added successfully' });
  });
});

// Route to delete a user by ID
router.delete('/:id', (req, res) => {
  const userId = req.params.id;

  // Check if it's a seller first
  const checkSellerQuery = 'SELECT * FROM Sellers WHERE Seller_ID = ?';
  db.query(checkSellerQuery, [userId], (err, sellerResult) => {
    if (err) {
      console.error('Error checking seller:', err);
      return res.status(500).json({ message: 'Error checking seller' });
    }

    if (sellerResult.length > 0) {
      // Delete from Sellers table
      db.query('DELETE FROM Sellers WHERE Seller_ID = ?', [userId], (err) => {
        if (err) {
          console.error('Error deleting seller:', err);
          return res.status(500).json({ message: 'Error deleting seller' });
        }
        return res.json({ message: 'Seller deleted successfully' });
      });
    } else {
      // Check if it's a buyer
      const checkBuyerQuery = 'SELECT * FROM Buyers WHERE Buyer_ID = ?';
      db.query(checkBuyerQuery, [userId], (err, buyerResult) => {
        if (err) {
          console.error('Error checking buyer:', err);
          return res.status(500).json({ message: 'Error checking buyer' });
        }

        if (buyerResult.length > 0) {
          // Delete from Buyers table
          db.query('DELETE FROM Buyers WHERE Buyer_ID = ?', [userId], (err) => {
            if (err) {
              console.error('Error deleting buyer:', err);
              return res.status(500).json({ message: 'Error deleting buyer' });
            }
            return res.json({ message: 'Buyer deleted successfully' });
          });
        } else {
          return res.status(404).json({ message: 'User not found' });
        }
      });
    }
  });
});

module.exports = router;
