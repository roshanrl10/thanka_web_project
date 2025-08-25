import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFilter, FaStar, FaShoppingCart, FaSort, FaTimes } from 'react-icons/fa';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [filters, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.search) params.append('search', filters.search);
      if (sortBy) params.append('sortBy', sortBy);

      const response = await axios.get(`/api/products?${params}`);
      
      // Ensure we always have an array
      if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
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

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    });
    setSortBy('createdAt');
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="container">
          <h1>Sacred Thanka Collection</h1>
          <p>Discover authentic Tibetan Buddhist paintings and spiritual art</p>
        </div>
      </div>

      <div className="container">
        {/* Search and Filters Bar */}
        <div className="search-filters-bar">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              name="search"
              placeholder="Search thankas..."
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              <span>Filters</span>
            </button>
            
            <div className="sort-container">
              <FaSort className="sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="createdAt">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="averageRating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-header">
              <h3>Filters</h3>
              <button onClick={() => setShowFilters(false)} className="close-filters">
                <FaTimes />
              </button>
            </div>
            
            <div className="filters-content">
              <div className="filter-group">
                <label>Category</label>
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
              </div>

              <div className="filter-group">
                <label>Price Range</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="price-input"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="price-input"
                  />
                </div>
              </div>

              <div className="filter-actions">
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear All
                </button>
                <button onClick={() => setShowFilters(false)} className="apply-filters-btn">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="products-section">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading sacred artworks...</p>
            </div>
          ) : (
            <>
              <div className="products-header-row">
                <div className="products-count">
                  {(products || []).length} thankas found
                </div>
                <div className="view-options">
                  <button className="view-btn active">Grid</button>
                  <button className="view-btn">List</button>
                </div>
              </div>
              
              <div className="products-grid">
                {(products || []).map(product => (
                  <div key={product._id} className="product-card">
                    <div className="product-image">
                      <img src={product.images[0]} alt={product.name} />
                      <div className="product-overlay">
                        <Link to={`/products/${product._id}`} className="view-details-btn">
                          View Details
                        </Link>
                      </div>
                    </div>
                    
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-artist">by {product.artist}</p>
                      
                      <div className="product-rating">
                        <FaStar className="star" />
                        <span>{product.averageRating?.toFixed(1) || '4.5'} ({product.totalReviews || 0})</span>
                      </div>
                      
                      <div className="product-price">
                        <span className="current-price">${product.price?.toLocaleString() || '299'}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="original-price">${product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      
                      <div className="product-meta">
                        <span className="product-category">{product.category}</span>
                        <span className="product-size">
                          {product.size?.width} × {product.size?.height} {product.size?.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {(products || []).length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FaSearch />
                  </div>
                  <h3>No thankas found</h3>
                  <p>Try adjusting your filters or search terms</p>
                  <button onClick={clearFilters} className="btn-primary">
                    Clear All Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
