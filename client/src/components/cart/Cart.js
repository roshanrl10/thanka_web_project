import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash, FaArrowLeft, FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [isAuthenticated, navigate]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      
      // Filter out items with missing product data
      const validCart = {
        ...response.data,
        items: response.data.items.filter(item => item.product && item.product._id)
      };
      
      setCart(validCart);
      setLoading(false);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Failed to load cart');
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(true);
      await axios.put('/api/cart/update', {
        productId,
        quantity: newQuantity
      });
      await loadCart(); // Reload cart to get updated data
      toast.success('Cart updated successfully');
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error(error.response?.data?.message || 'Failed to update cart');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdating(true);
      await axios.delete(`/api/cart/remove/${productId}`);
      await loadCart();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    
    try {
      setUpdating(true);
      await axios.delete('/api/cart/clear');
      await loadCart();
      toast.success('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <FaShoppingCart className="empty-cart-icon" />
          <h2>Your cart is empty</h2>
          <p>Start shopping to add some beautiful thankas to your cart</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <button onClick={() => navigate('/products')} className="back-button">
            <FaArrowLeft /> Continue Shopping
          </button>
          <h1>Shopping Cart</h1>
          <button onClick={clearCart} className="clear-cart-btn" disabled={updating}>
            <FaTrash /> Clear Cart
          </button>
        </div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            <h2>Cart Items ({cart.items.length})</h2>
            
            {cart.items.map((item) => {
              // Skip items with missing product data
              if (!item.product) {
                return null;
              }
              
              return (
                <div key={item.product._id} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={item.product.images && item.product.images[0] ? item.product.images[0] : '/placeholder-image.jpg'} 
                      alt={item.product.name || 'Product'} 
                    />
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-name">{item.product.name || 'Product Name Unavailable'}</h3>
                    <p className="item-artist">by {item.product.artist || 'Unknown Artist'}</p>
                    <p className="item-category">{item.product.category || 'Uncategorized'}</p>
                    <p className="item-size">
                      {item.product.size && item.product.size.width && item.product.size.height 
                        ? `${item.product.size.width} × ${item.product.size.height} ${item.product.size.unit || 'cm'}`
                        : 'Size information unavailable'
                      }
                    </p>
                  </div>
                
                <div className="item-quantity">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      disabled={updating || item.quantity <= 1}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      disabled={updating || (item.product.stock && item.quantity >= item.product.stock)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <p className="stock-info">
                    {item.product.stock ? `${item.product.stock} available` : 'Stock information unavailable'}
                  </p>
                </div>
                
                <div className="item-price">
                  <span className="price">${(item.price || 0).toLocaleString()}</span>
                  <span className="total-price">
                    Total: ${((item.price || 0) * item.quantity).toLocaleString()}
                  </span>
                </div>
                
                <button
                  onClick={() => removeItem(item.product._id)}
                  disabled={updating}
                  className="remove-item-btn"
                >
                  <FaTrash />
                </button>
              </div>
            );
            })}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>${(cart.subtotal || 0).toLocaleString()}</span>
            </div>
            
            <div className="summary-item">
              <span>Shipping:</span>
              <span>${(cart.shippingCost || 0).toLocaleString()}</span>
            </div>
            
            <div className="summary-item">
              <span>Tax:</span>
              <span>${(cart.tax || 0).toLocaleString()}</span>
            </div>
            
            <div className="summary-total">
              <span>Total:</span>
              <span>${(cart.total || 0).toLocaleString()}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={updating}
              className="checkout-btn"
            >
              <FaCreditCard /> Proceed to Checkout
            </button>
            
            <div className="cart-notes">
              <p>• Free shipping on orders over $500</p>
              <p>• Secure payment processing</p>
              <p>• 30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
