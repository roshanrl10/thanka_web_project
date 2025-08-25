import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFilter, FaStar, FaShoppingCart } from 'react-icons/fa';
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
      <div className="container">
        <div className="products-header">
          <h1>Sacred Thanka Collection</h1>
          <p>Discover authentic Tibetan Buddhist paintings and spiritual art</p>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                name="search"
                placeholder="Search thankas..."
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
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
                 className="filter-select"
               >
                 <option value="createdAt">Newest First</option>
                 <option value="price">Price: Low to High</option>
                 <option value="-price">Price: High to Low</option>
                 <option value="averageRating">Highest Rated</option>
               </select>

              <button onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          </div>

          <div className="price-filters">
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

        {/* Products Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading sacred artworks...</p>
          </div>
        ) : (
          <>
            <div className="products-count">
              {(products || []).length} thankas found
            </div>
            
            <div className="products-grid">
              {(products || []).map(product => (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    <img src={product.images[0]} alt={product.name} />
                    <div className="product-overlay">
                      <Link to={`/products/${product._id}`} className="btn btn-primary">
                        View Details
                      </Link>
                    </div>
                  </div>
                  
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-artist">by {product.artist}</p>
                    <p className="product-category">{product.category}</p>
                    
                    <div className="product-rating">
                      <FaStar className="star" />
                      <span>{product.averageRating.toFixed(1)} ({product.totalReviews})</span>
                    </div>
                    
                    <div className="product-price">
                      <span className="current-price">${product.price.toLocaleString()}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="original-price">${product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    
                    <div className="product-size">
                      {product.size.width} × {product.size.height} {product.size.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(products || []).length === 0 && (
              <div className="no-products">
                <h3>No thankas found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
