import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaSearch, FaMapMarkerAlt, FaBars, FaGlobe, FaUser, FaCaretDown } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Top Header Bar */}
      <nav className="navbar-top">
        <div className="container">
          <div className="navbar-top-left">
            <button className="menu-toggle">
              <FaBars />
              <span>All</span>
            </button>
            <Link to="/" className="nav-link">Today</Link>
          </div>
          
          <div className="navbar-top-center">
            <Link to="/" className="navbar-brand">
              <div className="brand-logo">
                <span className="logo-arrow">→</span>
                <span className="brand-text">Thanka</span>
              </div>
            </Link>
            <div className="delivery-info">
              <FaMapMarkerAlt />
              <span>Deliver to Nepal</span>
            </div>
            <div className="search-container">
              <div className="search-dropdown">
                <span>All</span>
                <FaCaretDown />
              </div>
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  <FaSearch />
                </button>
              </form>
            </div>
          </div>
          
          <div className="navbar-top-right">
            <div className="language-selector">
              <FaGlobe />
              <span>EN</span>
            </div>
            {isAuthenticated ? (
              <div className="user-menu">
                <div className="user-greeting">
                  <span>Hello, {user?.firstName}</span>
                  <div className="user-options">
                    <span>Account & Lists</span>
                    <FaCaretDown />
                  </div>
                </div>
                <div className="dropdown-menu">
                  <Link to="/dashboard">Dashboard</Link>
                  <Link to="/profile">Profile</Link>
                  <Link to="/orders">Orders</Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={onLogout}>Sign Out</button>
                </div>
              </div>
            ) : (
              <div className="guest-menu">
                <Link to="/login" className="nav-link">
                  <span>Hello, sign in</span>
                  <div className="user-options">
                    <span>Account & Lists</span>
                    <FaCaretDown />
                  </div>
                </Link>
              </div>
            )}
            <Link to="/orders" className="nav-link">
              <span>Returns</span>
              <span>& Orders</span>
            </Link>
            <Link to="/cart" className="cart-link">
              <FaShoppingCart />
              <span className="cart-count">0</span>
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Delivery Address Banner */}
      <div className="delivery-banner">
        <div className="container">
          <div className="banner-content">
            <span>We're showing you items that ship to Nepal. To see items that ship to a different country, change your delivery address.</span>
            <div className="banner-buttons">
              <button className="btn-dismiss">Dismiss</button>
              <button className="btn-change-address">Change Address</button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <Link to="/products" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                {user?.isAdmin && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>
                )}
                <button onClick={onLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
