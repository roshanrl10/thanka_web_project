import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaStar, FaShoppingCart, FaHeart, FaShare, FaArrowLeft } from 'react-icons/fa';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product details');
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      await axios.post('/api/cart/add', {
        productId: product._id,
        quantity: quantity
      });
      toast.success('Added to cart successfully!');
      setAddingToCart(false);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={() => navigate('/products')} className="back-button">
          <FaArrowLeft /> Back to Products
        </button>

        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img src={product.images[selectedImage]} alt={product.name} />
            </div>
            {product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => handleImageClick(index)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-name">{product.name}</h1>
              <p className="product-artist">by {product.artist}</p>
              <div className="product-category">{product.category}</div>
            </div>

            <div className="product-rating">
              <div className="rating-stars">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`star ${index < Math.floor(product.averageRating) ? 'filled' : ''}`}
                  />
                ))}
              </div>
              <span className="rating-text">
                {product.averageRating.toFixed(1)} ({product.totalReviews} reviews)
              </span>
            </div>

            <div className="product-price">
              <span className="current-price">${product.price.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="original-price">${product.originalPrice.toLocaleString()}</span>
                  <span className="discount">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-details">
              <div className="detail-item">
                <span className="detail-label">Size:</span>
                <span className="detail-value">
                  {product.size.width} × {product.size.height} {product.size.unit}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Material:</span>
                <span className="detail-value">{product.material}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Technique:</span>
                <span className="detail-value">{product.technique}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Origin:</span>
                <span className="detail-value">{product.origin}</span>
              </div>
              {product.age && (
                <div className="detail-item">
                  <span className="detail-label">Age:</span>
                  <span className="detail-value">{product.age}</span>
                </div>
              )}
              <div className="detail-item">
                <span className="detail-label">Condition:</span>
                <span className="detail-value">{product.condition}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Stock:</span>
                <span className={`detail-value ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="add-to-cart-section">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="add-to-cart-btn"
                >
                  <FaShoppingCart />
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            )}

            <div className="product-actions">
              <button className="action-btn wishlist-btn">
                <FaHeart /> Add to Wishlist
              </button>
              <button className="action-btn share-btn">
                <FaShare /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.ratings && product.ratings.length > 0 && (
          <div className="reviews-section">
            <h3>Customer Reviews</h3>
            <div className="reviews-list">
              {product.ratings.map((rating, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`star ${i < rating.rating ? 'filled' : ''}`}
                        />
                      ))}
                    </div>
                    <span className="review-date">
                      {new Date(rating.date).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.review && <p className="review-text">{rating.review}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
