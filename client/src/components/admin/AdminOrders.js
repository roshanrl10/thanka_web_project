import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaSearch, FaFilter, FaDownload } from 'react-icons/fa';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });

  useEffect(() => {
    loadOrders();
  }, [filters]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // In a real implementation, you would fetch this data from your API
      // For now, we'll use mock data
      const mockOrders = [
        {
          _id: '1',
          user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
          items: [
            { product: { name: 'Sacred Buddha Thanka', images: ['/placeholder.jpg'] }, quantity: 1, price: 1200 }
          ],
          total: 1200,
          status: 'pending',
          paymentStatus: 'pending',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            zipCode: '10001'
          }
        },
        {
          _id: '2',
          user: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
          items: [
            { product: { name: 'Bodhisattva Thanka', images: ['/placeholder.jpg'] }, quantity: 1, price: 850 }
          ],
          total: 850,
          status: 'completed',
          paymentStatus: 'completed',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          shippingAddress: {
            firstName: 'Jane',
            lastName: 'Smith',
            address: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            country: 'USA',
            zipCode: '90210'
          }
        },
        {
          _id: '3',
          user: { firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com' },
          items: [
            { product: { name: 'Mandala Thanka', images: ['/placeholder.jpg'] }, quantity: 2, price: 1050 }
          ],
          total: 2100,
          status: 'processing',
          paymentStatus: 'completed',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          shippingAddress: {
            firstName: 'Mike',
            lastName: 'Johnson',
            address: '789 Pine St',
            city: 'Chicago',
            state: 'IL',
            country: 'USA',
            zipCode: '60601'
          }
        }
      ];

      setOrders(mockOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // In a real implementation, you would make an API call here
      await axios.put(`/api/orders/${orderId}`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusClasses = {
      pending: 'payment-pending',
      processing: 'payment-processing',
      completed: 'payment-completed',
      failed: 'payment-failed',
      refunded: 'payment-refunded'
    };
    
    return (
      <span className={`payment-badge ${statusClasses[status] || 'payment-pending'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="admin-orders-loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="container">
        <div className="orders-header">
          <div className="header-content">
            <h1>Order Management</h1>
            <p>View and manage customer orders</p>
          </div>
          <button className="export-btn">
            <FaDownload /> Export Orders
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                name="search"
                placeholder="Search orders by customer name or email..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-controls">
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="orders-table-container">
          <div className="table-header">
            <div className="header-cell">Order ID</div>
            <div className="header-cell">Customer</div>
            <div className="header-cell">Items</div>
            <div className="header-cell">Total</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Payment</div>
            <div className="header-cell">Date</div>
            <div className="header-cell">Actions</div>
          </div>
          
          {orders.length === 0 ? (
            <div className="no-orders">
              <p>No orders found</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-row">
                  <div className="order-id">
                    #{order._id}
                  </div>
                  
                  <div className="customer-info">
                    <h4>{order.user.firstName} {order.user.lastName}</h4>
                    <p>{order.user.email}</p>
                  </div>
                  
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="item-info">
                        <img src={item.product.images[0]} alt={item.product.name} />
                        <div>
                          <p className="item-name">{item.product.name}</p>
                          <p className="item-quantity">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-total">
                    ${order.total.toLocaleString()}
                  </div>
                  
                  <div className="order-status">
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <div className="payment-status">
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </div>
                  
                  <div className="order-date">
                    {order.createdAt.toLocaleDateString()}
                  </div>
                  
                  <div className="order-actions">
                    <Link to={`/admin/orders/${order._id}`} className="action-btn view-btn" title="View Details">
                      <FaEye />
                    </Link>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="orders-summary">
          <div className="summary-card">
            <h3>Total Orders</h3>
            <span className="summary-number">{orders.length}</span>
          </div>
          <div className="summary-card">
            <h3>Pending Orders</h3>
            <span className="summary-number">{orders.filter(o => o.status === 'pending').length}</span>
          </div>
          <div className="summary-card">
            <h3>Completed Orders</h3>
            <span className="summary-number">{orders.filter(o => o.status === 'delivered').length}</span>
          </div>
          <div className="summary-card">
            <h3>Total Revenue</h3>
            <span className="summary-number">
              ${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
