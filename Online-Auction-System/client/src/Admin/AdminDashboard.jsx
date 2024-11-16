import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Admin Dashboard Component
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [userType, setUserType] = useState('buyer'); // Added state for user type filter
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    email: '',
    address: '',
    account_balance: 0.00,
    role: 'buyer' // default role
  });

  // Fetch users based on the selected user type
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/users?role=${userType}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Add user
  const handleAddUser = async () => {
    try {
      await axios.post('http://localhost:4000/api/users', newUser);
      fetchUsers(); // Refresh the user list
      setNewUser({ username: '', password: '', email: '', address: '', account_balance: 0.00, role: 'buyer' });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:4000/api/users/${userId}`);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts or userType changes
  }, [userType]);

  return (
    <div className="text-center p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Dropdown to select user type */}
      <div className="mb-4">
        <label htmlFor="userType" className="mr-2">View: </label>
        <select id="userType" value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="buyer">Buyers</option>
          <option value="seller">Sellers</option>
        </select>
        <button onClick={fetchUsers} className="btn btn-primary ml-2">Go</button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl mb-4">Add New User</h2>
        {/* Form inputs for new user */}
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          value={newUser.address}
          onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
        />
        <input
          type="number"
          placeholder="Account Balance"
          value={newUser.account_balance}
          onChange={(e) => setNewUser({ ...newUser, account_balance: parseFloat(e.target.value) })}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button onClick={handleAddUser} className="btn btn-primary">Add User</button>
      </div>

      <h2 className="text-2xl mb-4">Manage Users</h2>

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-4">ID</th>
            <th className="border p-4">Username</th>
            <th className="border p-4">Email</th>
            <th className="border p-4">Role</th>
            <th className="border p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.Seller_ID || user.Buyer_ID}>
              <td className="border p-4">{user.Seller_ID || user.Buyer_ID}</td>
              <td className="border p-4">{user.Username}</td>
              <td className="border p-4">{user.Email}</td>
              <td className="border p-4">{user.Seller_ID ? 'Seller' : 'Buyer'}</td>
              <td className="border p-4">
                <button onClick={() => handleDeleteUser(user.Seller_ID || user.Buyer_ID)} className="btn btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
