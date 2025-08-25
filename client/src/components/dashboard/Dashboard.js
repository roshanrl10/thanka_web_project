import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaHeart, FaUser, FaCog, FaBox, FaStar, FaHistory } from 'react-icons/fa';
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
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Hello, {user?.firstName}!</h1>
          <p>Welcome to your Thanka Art dashboard</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <FaBox />
            </div>
            <div className="stat-info">
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FaHeart />
            </div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Wishlist Items</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FaStar />
            </div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Reviews Given</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FaHistory />
            </div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Items Viewed</p>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/products" className="action-btn primary">
              <FaShoppingCart />
              <span>Browse Products</span>
            </Link>
            <Link to="/cart" className="action-btn secondary">
              <FaShoppingCart />
              <span>View Cart</span>
            </Link>
            <Link to="/profile" className="action-btn outline">
              <FaUser />
              <span>Edit Profile</span>
            </Link>
            <Link to="/wishlist" className="action-btn outline">
              <FaHeart />
              <span>Wishlist</span>
            </Link>
          </div>
        </div>

        <div className="orders-section">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/orders" className="view-all">View all orders</Link>
          </div>
          
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FaBox />
              </div>
              <h3>No orders yet</h3>
              <p>You haven't placed any orders yet. Start shopping to see your order history here.</p>
              <Link to="/products" className="btn-primary">
                <FaShoppingCart />
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="orders-grid">
              {orders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Order #{order._id}</h3>
                      <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-details">
                    <p className="order-total">Total: ${order.total}</p>
                    <p className="order-items">{order.items?.length || 0} items</p>
                  </div>
                  <div className="order-actions">
                    <Link to={`/orders/${order._id}`} className="btn-outline">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="recommendations-section">
          <div className="section-header">
            <h2>Recommended for You</h2>
            <Link to="/products" className="view-all">View all products</Link>
          </div>
          <div className="recommendations-grid">
            <div className="recommendation-card">
              <div className="recommendation-image">
                <span>Buddha Thanka</span>
              </div>
              <div className="recommendation-info">
                <h3>Sacred Buddha Thanka</h3>
                <p>Traditional Tibetan Buddhist painting</p>
                <span className="price">$299</span>
              </div>
            </div>
            <div className="recommendation-card">
              <div className="recommendation-image">
                <span>Mandala Art</span>
              </div>
              <div className="recommendation-info">
                <h3>Sacred Mandala Thanka</h3>
                <p>Intricate geometric patterns</p>
                <span className="price">$399</span>
              </div>
            </div>
            <div className="recommendation-card">
              <div className="recommendation-image">
                <span>Bodhisattva</span>
              </div>
              <div className="recommendation-info">
                <h3>Bodhisattva Thanka</h3>
                <p>Compassionate being depiction</p>
                <span className="price">$349</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
