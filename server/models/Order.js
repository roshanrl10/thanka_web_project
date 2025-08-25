const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  shippingAddress: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['stripe', 'paypal', 'bank_transfer']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String
  },
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0
  },
  tax: {
    type: Number,
    required: true,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: {
    type: String
  },
  estimatedDelivery: {
    type: Date
  },
  notes: {
    type: String
  },
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: {
    type: String
  }
}, {
  timestamps: true
});

// Calculate totals
orderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.total = this.subtotal + this.shippingCost + this.tax;
  return this.save();
};

// Get order status timeline
orderSchema.methods.getStatusTimeline = function() {
  const timeline = [];
  
  if (this.createdAt) {
    timeline.push({
      status: 'Order Placed',
      date: this.createdAt,
      description: 'Your order has been placed successfully'
    });
  }
  
  if (this.orderStatus === 'confirmed' || this.orderStatus === 'processing' || 
      this.orderStatus === 'shipped' || this.orderStatus === 'delivered') {
    timeline.push({
      status: 'Order Confirmed',
      date: this.updatedAt,
      description: 'Your order has been confirmed and is being processed'
    });
  }
  
  if (this.orderStatus === 'shipped' || this.orderStatus === 'delivered') {
    timeline.push({
      status: 'Order Shipped',
      date: this.updatedAt,
      description: 'Your order has been shipped'
    });
  }
  
  if (this.orderStatus === 'delivered') {
    timeline.push({
      status: 'Order Delivered',
      date: this.updatedAt,
      description: 'Your order has been delivered'
    });
  }
  
  return timeline;
};

module.exports = mongoose.model('Order', orderSchema);
