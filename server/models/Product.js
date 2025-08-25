const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['Buddha', 'Bodhisattva', 'Deity', 'Mandala', 'Landscape', 'Other']
  },
  size: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: 'cm'
    }
  },
  material: {
    type: String,
    required: true
  },
  technique: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  age: {
    type: String
  },
  condition: {
    type: String,
    enum: ['Excellent', 'Very Good', 'Good', 'Fair'],
    default: 'Good'
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  shippingWeight: {
    type: Number,
    required: true
  },
  shippingDimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      default: 'cm'
    }
  }
}, {
  timestamps: true
});

// Calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalReviews = 0;
  } else {
    const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    this.averageRating = totalRating / this.ratings.length;
    this.totalReviews = this.ratings.length;
  }
  return this.save();
};

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Ensure virtuals are serialized
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
