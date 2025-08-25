const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// @route   GET /api/products
// @desc    Get all active products with pagination and filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const category = req.query.category;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const search = req.query.search;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('ratings.user', 'firstName lastName');

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('ratings.user', 'firstName lastName');

    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('ratings.user', 'firstName lastName avatar');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/products
// @desc    Create a new product (Admin only)
// @access  Private/Admin
router.post('/', [
  auth,
  admin,
  upload.array('images', 5),
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Product description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('category').isIn(['Buddha', 'Bodhisattva', 'Deity', 'Mandala', 'Landscape', 'Other']).withMessage('Valid category is required'),
  body('material').notEmpty().withMessage('Material is required'),
  body('technique').notEmpty().withMessage('Technique is required'),
  body('artist').notEmpty().withMessage('Artist name is required'),
  body('origin').notEmpty().withMessage('Origin is required'),
  body('size[width]').isFloat({ min: 0 }).withMessage('Valid width is required'),
  body('size[height]').isFloat({ min: 0 }).withMessage('Valid height is required'),
  body('shippingWeight').isFloat({ min: 0 }).withMessage('Valid shipping weight is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one product image is required' });
    }

    const imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);

    const productData = {
      ...req.body,
      images: imageUrls,
      size: {
        width: parseFloat(req.body['size[width]'] || req.body.size?.width),
        height: parseFloat(req.body['size[height]'] || req.body.size?.height),
        unit: req.body['size[unit]'] || req.body.size?.unit || 'cm'
      },
      price: parseFloat(req.body.price),
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : undefined,
      stock: parseInt(req.body.stock) || 1,
      shippingWeight: parseFloat(req.body.shippingWeight),
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
// @access  Private/Admin
router.put('/:id', [
  auth,
  admin,
  upload.array('images', 5)
], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let imageUrls = product.images;
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
      imageUrls = req.body.replaceImages === 'true' ? newImageUrls : [...imageUrls, ...newImageUrls];
    }

    const updateData = {
      ...req.body,
      images: imageUrls
    };

    if (req.body.size) {
      updateData.size = {
        width: parseFloat(req.body.size.width),
        height: parseFloat(req.body.size.height),
        unit: req.body.size.unit || 'cm'
      };
    }

    if (req.body.price) updateData.price = parseFloat(req.body.price);
    if (req.body.originalPrice) updateData.originalPrice = parseFloat(req.body.originalPrice);
    if (req.body.shippingWeight) updateData.shippingWeight = parseFloat(req.body.shippingWeight);
    if (req.body.tags) updateData.tags = req.body.tags.split(',').map(tag => tag.trim());

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/products/:id/ratings
// @desc    Add rating and review to product
// @access  Private
router.post('/:id/ratings', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().isLength({ max: 500 }).withMessage('Review cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already rated this product
    const existingRating = product.ratings.find(rating => 
      rating.user.toString() === req.user.id
    );

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this product' });
    }

    product.ratings.push({
      user: req.user.id,
      rating: req.body.rating,
      review: req.body.review
    });

    await product.calculateAverageRating();
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
