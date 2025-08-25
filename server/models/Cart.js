const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  }
}, {
  timestamps: true
});

// Calculate cart totals
cartSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.total = this.subtotal + this.shippingCost + this.tax;
  return this.save();
};

// Add item to cart
cartSchema.methods.addItem = function(productId, quantity = 1, price) {
  const existingItem = this.items.find(item => item.product.toString() === productId.toString());
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      product: productId,
      quantity: quantity,
      price: price
    });
  }
  
  return this.calculateTotals();
};

// Remove item from cart
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => item.product.toString() !== productId.toString());
  return this.calculateTotals();
};

// Update item quantity
cartSchema.methods.updateQuantity = function(productId, quantity) {
  const item = this.items.find(item => item.product.toString() === productId.toString());
  if (item) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    item.quantity = quantity;
    return this.calculateTotals();
  }
  return Promise.resolve(this);
};

// Clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.subtotal = 0;
  this.shippingCost = 0;
  this.tax = 0;
  this.total = 0;
  return this.save();
};

// Get cart summary
cartSchema.methods.getSummary = function() {
  return {
    itemCount: this.items.length,
    totalItems: this.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: this.subtotal,
    shippingCost: this.shippingCost,
    tax: this.tax,
    total: this.total,
    currency: this.currency
  };
};

module.exports = mongoose.model('Cart', cartSchema);
