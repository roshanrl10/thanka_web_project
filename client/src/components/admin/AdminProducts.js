import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    status: ''
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('isActive', filters.status === 'active');

      const response = await axios.get(`/api/products?${params}`);
      setProducts(response.data.products || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
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

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`/api/products/${productId}`);
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      await axios.put(`/api/products/${productId}`, {
        isActive: !currentStatus
      });
      toast.success(`Product ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      loadProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Failed to update product status');
    }
  };

  if (loading) {
    return (
      <div className="admin-products-loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="container">
        <div className="products-header">
          <div className="header-content">
            <h1>Product Management</h1>
            <p>Manage your Thanka collection and inventory</p>
          </div>
          <Link to="/admin/products/add" className="add-product-btn">
            <FaPlus /> Add New Product
          </Link>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-controls">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Categories</option>
                <option value="Buddha">Buddha</option>
                <option value="Bodhisattva">Bodhisattva</option>
                <option value="Deity">Deity</option>
                <option value="Mandala">Mandala</option>
                <option value="Landscape">Landscape</option>
                <option value="Other">Other</option>
              </select>

              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="products-table-container">
          <div className="table-header">
            <div className="header-cell">Image</div>
            <div className="header-cell">Product Info</div>
            <div className="header-cell">Category</div>
            <div className="header-cell">Price</div>
            <div className="header-cell">Stock</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Actions</div>
          </div>
          
          {products.length === 0 ? (
            <div className="no-products">
              <p>No products found</p>
              <Link to="/admin/products/add" className="btn btn-primary">
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="products-list">
              {products.map((product) => (
                <div key={product._id} className="product-row">
                  <div className="product-image">
                    <img src={product.images[0]} alt={product.name} />
                  </div>
                  
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="artist">by {product.artist}</p>
                    <p className="size">
                      {product.size.width} × {product.size.height} {product.size.unit}
                    </p>
                  </div>
                  
                  <div className="product-category">
                    <span className="category-badge">{product.category}</span>
                  </div>
                  
                  <div className="product-price">
                    <span className="current-price">${product.price.toLocaleString()}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="original-price">${product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  
                  <div className="product-stock">
                    <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  
                  <div className="product-status">
                    <button
                      onClick={() => toggleProductStatus(product._id, product.isActive)}
                      className={`status-toggle ${product.isActive ? 'active' : 'inactive'}`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  
                  <div className="product-actions">
                    <Link to={`/products/${product._id}`} className="action-btn view-btn" title="View">
                      <FaEye />
                    </Link>
                    <Link to={`/admin/products/edit/${product._id}`} className="action-btn edit-btn" title="Edit">
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="action-btn delete-btn"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="products-summary">
          <div className="summary-card">
            <h3>Total Products</h3>
            <span className="summary-number">{products.length}</span>
          </div>
          <div className="summary-card">
            <h3>Active Products</h3>
            <span className="summary-number">{products.filter(p => p.isActive).length}</span>
          </div>
          <div className="summary-card">
            <h3>Out of Stock</h3>
            <span className="summary-number">{products.filter(p => p.stock === 0).length}</span>
          </div>
          <div className="summary-card">
            <h3>Total Value</h3>
            <span className="summary-number">
              ${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
