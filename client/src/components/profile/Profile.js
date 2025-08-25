import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put('/api/users/profile', formData);
      updateUser(response.data);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || ''
    });
    setEditing(false);
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account information and preferences</p>
        </div>

        <div className="profile-content">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                <FaUser />
              </div>
              <div className="avatar-info">
                <h2>{user.firstName} {user.lastName}</h2>
                <p className="username">@{user.username}</p>
                {user.isAdmin && (
                  <span className="admin-badge">Administrator</span>
                )}
              </div>
            </div>

            <div className="profile-actions">
              {!editing ? (
                <button onClick={() => setEditing(true)} className="edit-btn">
                  <FaEdit /> Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button onClick={handleSubmit} disabled={loading} className="save-btn">
                    <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button onClick={handleCancel} className="cancel-btn">
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="profile-form-container">
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section">
                <h3>Personal Information</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!editing}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!editing}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-with-icon">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!editing}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input-with-icon">
                    <FaPhone className="input-icon" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!editing}
                    rows="4"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              {/* Account Information */}
              <div className="form-section">
                <h3>Account Information</h3>
                
                <div className="info-row">
                  <div className="info-label">Username</div>
                  <div className="info-value">@{user.username}</div>
                </div>
                
                <div className="info-row">
                  <div className="info-label">Member Since</div>
                  <div className="info-value">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="info-row">
                  <div className="info-label">Last Login</div>
                  <div className="info-value">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </div>
                </div>
                
                <div className="info-row">
                  <div className="info-label">Account Type</div>
                  <div className="info-value">
                    {user.isAdmin ? 'Administrator' : 'Customer'}
                  </div>
                </div>
              </div>

              {/* Addresses */}
              {user.addresses && user.addresses.length > 0 && (
                <div className="form-section">
                  <h3>Saved Addresses</h3>
                  <div className="addresses-list">
                    {user.addresses.map((address, index) => (
                      <div key={index} className="address-card">
                        <div className="address-header">
                          <span className="address-type">{address.type}</span>
                          {address.isDefault && <span className="default-badge">Default</span>}
                        </div>
                        <div className="address-content">
                          <p>{address.firstName} {address.lastName}</p>
                          <p>{address.address}</p>
                          <p>{address.city}, {address.state} {address.zipCode}</p>
                          <p>{address.country}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
