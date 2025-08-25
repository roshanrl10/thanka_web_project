import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUpload, FaSave, FaTimes } from 'react-icons/fa';
import './AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Buddha',
    material: '',
    technique: '',
    artist: '',
    origin: '',
    age: '',
    condition: 'Excellent',
    stock: '1',
    isActive: true,
    isFeatured: false,
    tags: '',
    shippingWeight: '',
    size: {
      width: '',
      height: '',
      unit: 'cm'
    }
  });
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreview(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'artist', 'material', 'technique', 'origin'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (!formData.size.width || !formData.size.height) {
      toast.error('Please enter product dimensions');
      return;
    }

    if (!formData.shippingWeight) {
      toast.error('Please enter shipping weight');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    setLoading(true);

    try {
      const productData = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (key === 'size') {
          // Send size fields individually
          productData.append('size[width]', formData.size.width);
          productData.append('size[height]', formData.size.height);
          productData.append('size[unit]', formData.size.unit);
        } else if (key === 'tags') {
          productData.append('tags', formData.tags);
        } else {
          productData.append(key, formData[key]);
        }
      });

      // Append images
      images.forEach(image => {
        productData.append('images', image);
      });

      await axios.post('/api/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Product added successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error adding product:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        toast.error(`Validation errors: ${errorMessages}`);
      } else if (error.response?.data?.message) {
        // Handle specific error messages
        toast.error(error.response.data.message);
      } else {
        // Handle general errors
        toast.error('Failed to add product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product">
      <div className="container">
        <div className="page-header">
          <h1>Add New Product</h1>
          <p>Add a new Thanka to your collection</p>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-sections">
            {/* Basic Information */}
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="artist">Artist *</label>
                  <input
                    type="text"
                    id="artist"
                    name="artist"
                    value={formData.artist}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter artist name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="4"
                  placeholder="Enter product description"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  >
                    <option value="Buddha">Buddha</option>
                    <option value="Bodhisattva">Bodhisattva</option>
                    <option value="Deity">Deity</option>
                    <option value="Mandala">Mandala</option>
                    <option value="Landscape">Landscape</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="origin">Origin *</label>
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="e.g., Tibet, Nepal"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="form-section">
              <h3>Pricing & Inventory</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price (USD) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="originalPrice">Original Price (USD)</label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="stock">Stock Quantity *</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="1"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="shippingWeight">Shipping Weight (kg) *</label>
                  <input
                    type="number"
                    id="shippingWeight"
                    name="shippingWeight"
                    value={formData.shippingWeight}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="0.5"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="form-section">
              <h3>Product Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="material">Material *</label>
                  <input
                    type="text"
                    id="material"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="e.g., Cotton, Silk"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="technique">Technique *</label>
                  <input
                    type="text"
                    id="technique"
                    name="technique"
                    value={formData.technique}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="e.g., Hand-painted, Printed"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="text"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="e.g., 50 years old"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="condition">Condition *</label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="size.width">Width (cm) *</label>
                  <input
                    type="number"
                    id="size.width"
                    name="size.width"
                    value={formData.size.width}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="50"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="size.height">Height (cm) *</label>
                  <input
                    type="number"
                    id="size.height"
                    name="size.height"
                    value={formData.size.height}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="70"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="size.unit">Unit</label>
                  <select
                    id="size.unit"
                    name="size.unit"
                    value={formData.size.unit}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="cm">cm</option>
                    <option value="inch">inch</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>

            {/* Images */}
            <div className="form-section">
              <h3>Product Images *</h3>
              <div className="image-upload">
                <div className="upload-area">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  <label htmlFor="images" className="upload-label">
                    <FaUpload />
                    <span>Click to upload images</span>
                    <small>Upload up to 5 images (JPG, PNG, WebP)</small>
                  </label>
                </div>

                {imagePreview.length > 0 && (
                  <div className="image-previews">
                    <h4>Selected Images:</h4>
                    <div className="preview-grid">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="image-preview">
                          <img src={preview} alt={`Preview ${index + 1}`} />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="remove-image"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="form-section">
              <h3>Product Settings</h3>
              <div className="form-row">
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                    />
                    <span>Active Product</span>
                  </label>
                </div>
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                    />
                    <span>Featured Product</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="btn btn-secondary"
              disabled={loading}
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Adding Product...
                </>
              ) : (
                <>
                  <FaSave /> Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
