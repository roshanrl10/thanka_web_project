import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign, FaChartLine, FaPlus, FaEye } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // In a real implementation, you would fetch this data from your API
      // For now, we'll use mock data
      const mockStats = {
        totalProducts: 24,
        totalOrders: 156,
        totalUsers: 89,
        totalRevenue: 45600
      };
      
      const mockRecentOrders = [
        {
          _id: '1',
          user: { firstName: 'John', lastName: 'Doe' },
          total: 1200,
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          _id: '2',
          user: { firstName: 'Jane', lastName: 'Smith' },
          total: 850,
          status: 'completed',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
        },
        {
          _id: '3',
          user: { firstName: 'Mike', lastName: 'Johnson' },
          total: 2100,
          status: 'processing',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
        }
      ];

      setStats(mockStats);
      setRecentOrders(mockRecentOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      processing: 'status-processing',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's an overview of your Thanka e-commerce platform.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaBox />
            </div>
            <div className="stat-content">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FaShoppingCart />
            </div>
            <div className="stat-content">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FaDollarSign />
            </div>
            <div className="stat-content">
              <h3>${stats.totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/products" className="action-card">
              <FaPlus />
              <h3>Add New Product</h3>
              <p>Upload a new Thanka to your collection</p>
            </Link>
            
            <Link to="/admin/orders" className="action-card">
              <FaEye />
              <h3>View Orders</h3>
              <p>Manage and track customer orders</p>
            </Link>
            
            <Link to="/products" className="action-card">
              <FaBox />
              <h3>Browse Products</h3>
              <p>View and manage your product catalog</p>
            </Link>
            
            <Link to="/admin/users" className="action-card">
              <FaUsers />
              <h3>Manage Users</h3>
              <p>View and manage customer accounts</p>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="view-all-link">
              View All Orders
            </Link>
          </div>
          
          <div className="orders-table">
            <div className="table-header">
              <div className="header-cell">Order ID</div>
              <div className="header-cell">Customer</div>
              <div className="header-cell">Amount</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Date</div>
              <div className="header-cell">Actions</div>
            </div>
            
            {recentOrders.map((order) => (
              <div key={order._id} className="table-row">
                <div className="table-cell">#{order._id}</div>
                <div className="table-cell">
                  {order.user.firstName} {order.user.lastName}
                </div>
                <div className="table-cell">${order.total.toLocaleString()}</div>
                <div className="table-cell">
                  {getStatusBadge(order.status)}
                </div>
                <div className="table-cell">
                  {order.createdAt.toLocaleDateString()}
                </div>
                <div className="table-cell">
                  <Link to={`/admin/orders/${order._id}`} className="view-btn">
                    <FaEye /> View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Placeholder */}
        <div className="analytics-section">
          <h2>Analytics Overview</h2>
          <div className="analytics-placeholder">
            <FaChartLine className="analytics-icon" />
            <h3>Analytics Dashboard</h3>
            <p>Sales charts, customer insights, and performance metrics will be displayed here.</p>
            <p>Integration with analytics services like Google Analytics or custom charts can be added.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
