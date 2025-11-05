const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  guestId: {
    type: String,
    required: [true, 'Guest ID is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[A-Z0-9]{3,10}$/i.test(v);
      },
      message: 'Guest ID must be 3-10 alphanumeric characters'
    }
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    validate: {
      validator: function(v) {
        // Only allow letters, spaces, dots, hyphens, and apostrophes
        return /^[A-Za-z\s.'\-]+$/.test(v);
      },
      message: 'Name can only contain letters, spaces, dots, hyphens, and apostrophes'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Allow digits, spaces, hyphens, parentheses, and plus sign
        return /^[\d\s\-\(\)\+]{10,15}$/.test(v);
      },
      message: 'Phone number must be 10-15 digits (may include spaces, hyphens, parentheses, or +)'
    }
  },
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  checkinDate: {
    type: Date,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return v instanceof Date && !isNaN(v);
      },
      message: 'Invalid check-in date'
    }
  },
  checkoutDate: {
    type: Date,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        if (this.checkinDate && v <= this.checkinDate) {
          return false;
        }
        return v instanceof Date && !isNaN(v);
      },
      message: 'Check-out date must be after check-in date'
    }
  },
  roomType: {
    type: String,
    enum: {
      values: ['Single', 'Double', 'Suite', 'Deluxe', 'Presidential'],
      message: '{VALUE} is not a valid room type'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['Active', 'Checked-out', 'Cancelled', 'Pending'],
      message: '{VALUE} is not a valid status'
    },
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Compound Index following ESR Rule (Equality, Sort, Range)
guestSchema.index({ status: 1, checkinDate: 1, checkoutDate: 1 });
guestSchema.index({ email: 1 });

const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;
