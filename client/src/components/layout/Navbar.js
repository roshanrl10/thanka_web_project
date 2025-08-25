import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaShoppingCart } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const authLinks = (
    <ul className={`navbar-nav ${isMenuOpen ? 'show' : ''}`}>
      <li className="nav-item">
        <Link className="nav-link" to="/products" onClick={() => setIsMenuOpen(false)}>
          Shop
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/cart" onClick={() => setIsMenuOpen(false)}>
          <FaShoppingCart /> Cart
        </Link>
      </li>
      {user?.isAdmin && (
        <li className="nav-item">
          <Link className="nav-link" to="/admin" onClick={() => setIsMenuOpen(false)}>
            Admin
          </Link>
        </li>
      )}
      <li className="nav-item dropdown">
        <a 
          className="nav-link dropdown-toggle" 
          href="#!" 
          id="navbarDropdown" 
          role="button" 
          onClick={toggleMenu}
        >
          {user?.firstName} {user?.lastName}
        </a>
        <div className={`dropdown-menu ${isMenuOpen ? 'show' : ''}`}>
          <Link className="dropdown-item" to="/dashboard" onClick={() => setIsMenuOpen(false)}>
            Dashboard
          </Link>
          <Link className="dropdown-item" to="/profile" onClick={() => setIsMenuOpen(false)}>
            Profile
          </Link>
          <div className="dropdown-divider"></div>
          <a className="dropdown-item" href="#!" onClick={onLogout}>
            Logout
          </a>
        </div>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className={`navbar-nav ${isMenuOpen ? 'show' : ''}`}>
      <li className="nav-item">
        <Link className="nav-link" to="/products" onClick={() => setIsMenuOpen(false)}>
          Shop
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/login" onClick={() => setIsMenuOpen(false)}>
          Login
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/register" onClick={() => setIsMenuOpen(false)}>
          Register
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Sacred Thanka Gallery
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
