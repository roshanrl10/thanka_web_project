import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaShoppingCart, FaHeart, FaStar, FaSearch } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await axios.get('/api/products/featured');
      setFeaturedProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading featured products:', error);
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Sacred Thanka Art Gallery</h1>
          <p className="hero-subtitle">
            Discover authentic Tibetan Buddhist paintings and spiritual art from the Himalayas
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary btn-lg">
              <FaSearch /> Explore Collection
            </Link>
            {!isAuthenticated ? (
              <Link to="/register" className="btn btn-outline-primary btn-lg">
                Join Our Community
              </Link>
            ) : (
              <Link to="/products" className="btn btn-outline-primary btn-lg">
                Shop Now
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="categories-section">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <div className="categories-grid">
            <Link to="/products?category=Buddha" className="category-card">
              <div className="category-icon">🕉️</div>
              <h3>Buddha</h3>
              <p>Sacred depictions of the enlightened one</p>
            </Link>
            <Link to="/products?category=Bodhisattva" className="category-card">
              <div className="category-icon">🙏</div>
              <h3>Bodhisattva</h3>
              <p>Compassionate beings on the path to enlightenment</p>
            </Link>
            <Link to="/products?category=Deity" className="category-card">
              <div className="category-icon">⚡</div>
              <h3>Deity</h3>
              <p>Powerful spiritual protectors and guides</p>
            </Link>
            <Link to="/products?category=Mandala" className="category-card">
              <div className="category-icon">🌀</div>
              <h3>Mandala</h3>
              <p>Sacred geometric patterns of the universe</p>
            </Link>
            <Link to="/products?category=Landscape" className="category-card">
              <div className="category-icon">🏔️</div>
              <h3>Landscape</h3>
              <p>Breathtaking Himalayan vistas and sacred sites</p>
            </Link>
            <Link to="/products?category=Other" className="category-card">
              <div className="category-icon">✨</div>
              <h3>Other</h3>
              <p>Unique spiritual and cultural artworks</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="featured-section">
        <div className="container">
          <h2 className="section-title">Featured Thankas</h2>
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading featured artworks...</p>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.slice(0, 8).map(product => (
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
                    <h3>{product.name}</h3>
                    <p className="artist">by {product.artist}</p>
                    <div className="product-meta">
                      <span className="price">${product.price.toLocaleString()}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="original-price">${product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="product-rating">
                      <FaStar className="star" />
                      <span>{product.averageRating.toFixed(1)} ({product.totalReviews})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center">
            <Link to="/products" className="btn btn-primary btn-lg">
              View All Thankas
            </Link>
          </div>
        </div>
      </div>

      <div className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Our Thanka Collection</h2>
              <p>
                Our carefully curated collection features authentic Tibetan Buddhist paintings 
                created by skilled artisans from the Himalayan region. Each Thanka is a 
                masterpiece of spiritual art, carrying centuries of tradition and devotion.
              </p>
              <p>
                From intricate mandalas to serene Buddha depictions, our Thankas are not just 
                artworks but sacred objects that bring peace, wisdom, and spiritual connection 
                to your space.
              </p>
              <Link to="/about" className="btn btn-outline-primary">
                Learn More
              </Link>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <span>Sacred Art</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
