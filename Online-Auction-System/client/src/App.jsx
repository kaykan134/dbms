import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/Home";
import BidProduct from "./components/BidProduct";
import Products from "./components/Products";
import LoginForm from "./components/LoginForm";
import SellerDashboard from "./SellerDashboard/SellerDashboard";
import ViewProductsSeller from "./SellerDashboard/viewProducts";
import AddProductSeller from "./SellerDashboard/addProduct";
import AdminDashboard from "./Admin/AdminDashboard";
import Auctions from "./Admin/Auctions";
import Transactions from "./Admin/Transactions";
import Bids from "./Admin/Bids";
import AccessDenied from "./components/AccessDenied";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";

function App() {
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [forceRefresh, setForceRefresh] = useState(false);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    setUserType(userType);
    setLoading(false);
  }, [forceRefresh]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const isAuthenticated = () => {
    return userType !== null;
  };

  const isSeller = () => {
    return userType === "seller";
  };

  const isAdmin = () => {
    return userType === "admin";
  };

  const isBuyer = () => {
    return userType === "buyer";
  };

  return (
    <div>
      <Nav header="Bid Items" />
      <Routes>
        {/* Home and Login Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<LoginForm setForceRefresh={setForceRefresh} />}
        />

        {/* Buyer Routes */}
        <Route
          path="/products"
          element={
            isAuthenticated() && isBuyer() ? (
              <Products />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/products/bid/:name/:price"
          element={
            isAuthenticated() && isBuyer() ? (
              <BidProduct />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/userprofile"
          element={
            isAuthenticated() && isBuyer() ? (
              <Profile />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Seller Routes */}
        {isAuthenticated() && isSeller() ? (
          <>
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/seller/products" element={<ViewProductsSeller />} />
            <Route path="/seller/add-product" element={<AddProductSeller />} />
          </>
        ) : (
          <Route path="/seller/*" element={<AccessDenied />} />
        )}

        {/* Admin Routes */}
        {isAuthenticated() && isAdmin() ? (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/auctions" element={<Auctions />} />
            <Route path="/admin/transactions" element={<Transactions />} />
            <Route path="/admin/bids" element={<Bids />} />
            {/* You can add more admin-specific routes here */}
          </>
        ) : (
          <Route path="/admin/*" element={<AccessDenied />} />
        )}

        {/* Catch-All Route for Undefined Paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
