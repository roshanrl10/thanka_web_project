import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaHeart, FaUser, FaCog } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserOrders();
  }, []);

  const loadUserOrders = async () => {
    try {
      // For now, we'll use mock data since we haven't implemented orders yet
      setOrders([]);
      setLoading(false);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="text-center">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.firstName}!</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{orders.length}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <h3>0</h3>
          <p>Wishlist Items</p>
        </div>
        <div className="stat-card">
          <h3>0</h3>
          <p>Reviews Given</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/products" className="btn btn-primary">
          <FaShoppingCart /> Browse Products
        </Link>
        <Link to="/cart" className="btn btn-secondary">
          <FaShoppingCart /> View Cart
        </Link>
        <Link to="/profile" className="btn btn-outline-primary">
          <FaUser /> Edit Profile
        </Link>
      </div>

      <div className="orders-section">
        <h2>Recent Orders</h2>
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <Link to="/products" className="btn btn-primary">
              <FaShoppingCart /> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order._id}</h3>
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <p>Total: ${order.total}</p>
                <div className="order-actions">
                  <Link to={`/orders/${order._id}`} className="btn btn-sm btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
