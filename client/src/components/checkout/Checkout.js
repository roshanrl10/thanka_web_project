import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaCreditCard, FaShippingFast, FaLock } from 'react-icons/fa';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  });

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
      setCart(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Failed to load cart');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'country', 'zipCode'];
    for (let field of required) {
      if (!shippingInfo[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;
    
    try {
      setProcessing(true);
      
      // For now, we'll simulate a successful checkout
      // In a real implementation, you would integrate with Stripe here
      const orderData = {
        items: cart.items,
        shippingAddress: shippingInfo,
        paymentMethod: 'stripe',
        subtotal: cart.subtotal,
        shippingCost: cart.shippingCost,
        tax: cart.tax,
        total: cart.total
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Order placed successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error processing checkout:', error);
      toast.error('Failed to process checkout. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="spinner"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-checkout">
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart before checkout</p>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <button onClick={() => navigate('/cart')} className="back-button">
            <FaArrowLeft /> Back to Cart
          </button>
          <h1>Checkout</h1>
        </div>

        <div className="checkout-content">
          {/* Shipping Information */}
          <div className="checkout-section">
            <div className="section-header">
              <FaShippingFast className="section-icon" />
              <h2>Shipping Information</h2>
            </div>
            
            <div className="shipping-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State/Province *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country">Country *</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP/Postal Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="checkout-section">
            <div className="section-header">
              <FaCreditCard className="section-icon" />
              <h2>Payment Information</h2>
            </div>
            
            <div className="payment-info">
              <div className="payment-method">
                <div className="payment-method-header">
                  <FaCreditCard />
                  <span>Credit/Debit Card</span>
                  <FaLock className="secure-icon" />
                </div>
                <p className="payment-note">
                  Your payment information is secure and encrypted. We accept all major credit cards.
                </p>
              </div>
              
              {/* In a real implementation, you would integrate Stripe Elements here */}
              <div className="stripe-placeholder">
                <div className="card-input-placeholder">
                  <div className="card-number">•••• •••• •••• ••••</div>
                  <div className="card-details">
                    <span>MM/YY</span>
                    <span>CVC</span>
                  </div>
                </div>
                <p className="stripe-note">
                  Stripe payment integration will be implemented here
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="checkout-section">
            <div className="section-header">
              <h2>Order Summary</h2>
            </div>
            
            <div className="order-items">
              {cart.items.map((item) => (
                <div key={item.product._id} className="order-item">
                  <div className="item-info">
                    <img src={item.product.images[0]} alt={item.product.name} />
                    <div>
                      <h4>{item.product.name}</h4>
                      <p>by {item.product.artist}</p>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="item-total">
                    ${(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${cart.subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>${cart.shippingCost.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>${cart.tax.toLocaleString()}</span>
              </div>
              <div className="summary-total">
                <span>Total:</span>
                <span>${cart.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="checkout-actions">
          <button
            onClick={handleCheckout}
            disabled={processing}
            className="place-order-btn"
          >
            {processing ? (
              <>
                <div className="spinner-small"></div>
                Processing...
              </>
            ) : (
              <>
                <FaLock />
                Place Order - ${cart.total.toLocaleString()}
              </>
            )}
          </button>
          
          <div className="checkout-security">
            <FaLock />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
