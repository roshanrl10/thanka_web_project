import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaShoppingCart, FaHeart, FaStar, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Sacred Thanka Art</h1>
            <p>Under $500</p>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <span>Sacred Art</span>
            </div>
          </div>
        </div>
        <div className="hero-navigation">
          <button className="nav-arrow left">
            <FaChevronLeft />
          </button>
          <button className="nav-arrow right">
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Product Category Grids */}
      <div className="main-content">
        <div className="container">
          {/* Row 1 */}
          <div className="product-grid-row">
            <div className="category-card">
              <h3>Refresh your space</h3>
              <div className="category-grid">
                <div className="category-item">
                  <div className="category-image">
                    <span>Buddha</span>
                  </div>
                  <span>Buddha</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Home</span>
                  </div>
                  <span>Home</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Kitchen</span>
                  </div>
                  <span>Kitchen</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Beauty</span>
                  </div>
                  <span>Health & Beauty</span>
                </div>
              </div>
              <Link to="/products" className="see-more">See more</Link>
            </div>

            <div className="category-card">
              <h3>Shop for your home essentials</h3>
              <div className="category-grid">
                <div className="category-item">
                  <div className="category-image">
                    <span>Tools</span>
                  </div>
                  <span>Cleaning Tools</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Storage</span>
                  </div>
                  <span>Home Storage</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Decor</span>
                  </div>
                  <span>Home Decor</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Bedding</span>
                  </div>
                  <span>Bedding</span>
                </div>
              </div>
              <Link to="/products" className="see-more">Discover more in Home</Link>
            </div>

            <div className="category-card">
              <h3>Shop Fashion for less</h3>
              <div className="category-grid">
                <div className="category-item">
                  <div className="category-image">
                    <span>Jeans</span>
                  </div>
                  <span>Jeans under $50</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Tops</span>
                  </div>
                  <span>Tops under $25</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Dresses</span>
                  </div>
                  <span>Dresses under $30</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Shoes</span>
                  </div>
                  <span>Shoes under $50</span>
                </div>
              </div>
              <Link to="/products" className="see-more">See all deals</Link>
            </div>

            <div className="category-card">
              <h3>Get your game on</h3>
              <div className="category-featured">
                <div className="featured-image">
                  <span>Gaming Setup</span>
                </div>
              </div>
              <Link to="/products" className="see-more">Shop gaming</Link>
            </div>
          </div>

          {/* Row 2 */}
          <div className="product-grid-row">
            <div className="category-card">
              <h3>New home arrivals under $50</h3>
              <div className="category-grid">
                <div className="category-item">
                  <div className="category-image">
                    <span>Kitchen</span>
                  </div>
                  <span>Kitchen & Dining</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Improvement</span>
                  </div>
                  <span>Home Improvement</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Decor</span>
                  </div>
                  <span>Décor</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Bath</span>
                  </div>
                  <span>Bedding & Bath</span>
                </div>
              </div>
              <Link to="/products" className="see-more">Shop the latest from Home</Link>
            </div>

            <div className="category-card">
              <h3>Top categories in Kitchen appliances</h3>
              <div className="category-mixed">
                <div className="featured-large">
                  <div className="category-image large">
                    <span>Cooker</span>
                  </div>
                </div>
                <div className="category-grid small">
                  <div className="category-item">
                    <div className="category-image">
                      <span>Coffee</span>
                    </div>
                    <span>Coffee</span>
                  </div>
                  <div className="category-item">
                    <div className="category-image">
                      <span>Pots</span>
                    </div>
                    <span>Pots and Pans</span>
                  </div>
                  <div className="category-item">
                    <div className="category-image">
                      <span>Kettles</span>
                    </div>
                    <span>Kettles</span>
                  </div>
                </div>
              </div>
              <Link to="/products" className="see-more">Explore all products in Kitchen</Link>
            </div>

            <div className="category-card">
              <h3>Fashion trends you like</h3>
              <div className="category-grid">
                <div className="category-item">
                  <div className="category-image">
                    <span>Dresses</span>
                  </div>
                  <span>Dresses</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Knits</span>
                  </div>
                  <span>Knits</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Jackets</span>
                  </div>
                  <span>Jackets</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Jewelry</span>
                  </div>
                  <span>Jewelry</span>
                </div>
              </div>
              <Link to="/products" className="see-more">Explore more</Link>
            </div>

            <div className="category-card">
              <h3>Easy updates for elevated spaces</h3>
              <div className="category-grid">
                <div className="category-item">
                  <div className="category-image">
                    <span>Baskets</span>
                  </div>
                  <span>Baskets & hampers</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Hardware</span>
                  </div>
                  <span>Hardware</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Furniture</span>
                  </div>
                  <span>Accent furniture</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Paint</span>
                  </div>
                  <span>Wallpaper & paint</span>
                </div>
              </div>
              <Link to="/products" className="see-more">Shop home products</Link>
            </div>
          </div>

          {/* Featured Products Carousel */}
          <div className="featured-section">
            <h2>Top Sellers in Thanka Art for you</h2>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading featured artworks...</p>
              </div>
            ) : (
              <div className="products-carousel">
                <button className="carousel-nav left">
                  <FaChevronLeft />
                </button>
                <div className="carousel-container">
                  {featuredProducts.slice(0, 8).map(product => (
                    <div key={product._id} className="product-card">
                      <div className="product-image">
                        <img src={product.images[0]} alt={product.name} />
                      </div>
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <div className="product-rating">
                          <FaStar className="star" />
                          <span>{product.averageRating?.toFixed(1) || '4.5'} ({product.totalReviews || 0})</span>
                        </div>
                        <div className="product-price">
                          <span className="price">${product.price?.toLocaleString() || '299'}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="original-price">${product.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="carousel-nav right">
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>

          {/* Electronics & Beauty Grids */}
          <div className="product-grid-row">
            <div className="category-card">
              <h3>Level up your beauty routine</h3>
              <div className="category-grid">
                <div className="category-item">
                  <div className="category-image">
                    <span>Makeup</span>
                  </div>
                  <span>Makeup</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Brushes</span>
                  </div>
                  <span>Brushes</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Sponges</span>
                  </div>
                  <span>Sponges</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Mirrors</span>
                  </div>
                  <span>Mirrors</span>
                </div>
              </div>
              <Link to="/products" className="see-more">See more</Link>
            </div>

            <div className="category-card">
              <h3>Wireless Tech</h3>
              <div className="category-grid">
                <div className="category-item">
                  <div className="category-image">
                    <span>Phones</span>
                  </div>
                  <span>Smartphones</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Watches</span>
                  </div>
                  <span>Watches</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Headphones</span>
                  </div>
                  <span>Headphones</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Tablets</span>
                  </div>
                  <span>Tablets</span>
                </div>
              </div>
              <Link to="/products" className="see-more">Discover more</Link>
            </div>

            <div className="category-card">
              <h3>Elevate your Electronics</h3>
              <div className="category-grid">
                <div className="category-item">
                  <div className="category-image">
                    <span>Headphones</span>
                  </div>
                  <span>Headphones</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Tablets</span>
                  </div>
                  <span>Tablets</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Gaming</span>
                  </div>
                  <span>Gaming</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Speakers</span>
                  </div>
                  <span>Speakers</span>
                </div>
              </div>
              <Link to="/products" className="see-more">Discover more</Link>
            </div>

            <div className="category-card">
              <h3>Level up your gaming</h3>
              <div className="category-grid">
                <div className="category-item">
                  <div className="category-image">
                    <span>PC</span>
                  </div>
                  <span>PC gaming</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Xbox</span>
                  </div>
                  <span>Xbox</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>PlayStation</span>
                  </div>
                  <span>PlayStation</span>
                </div>
                <div className="category-item">
                  <div className="category-image">
                    <span>Switch</span>
                  </div>
                  <span>Nintendo Switch</span>
                </div>
              </div>
              <Link to="/products" className="see-more">Shop the latest in gaming</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
