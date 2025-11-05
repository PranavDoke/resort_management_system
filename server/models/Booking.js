const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: [true, 'Booking ID is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[A-Z0-9]{3,15}$/i.test(v);
      },
      message: 'Booking ID must be 3-15 alphanumeric characters'
    }
  },
  guestId: {
    type: String,
    required: [true, 'Guest ID is required'],
    ref: 'Guest',
    trim: true
  },
  roomId: {
    type: String,
    required: [true, 'Room ID is required'],
    ref: 'Room',
    trim: true
  },
  checkinDate: {
    type: Date,
    required: [true, 'Check-in date is required'],
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v);
      },
      message: 'Invalid check-in date'
    }
  },
  checkoutDate: {
    type: Date,
    required: [true, 'Check-out date is required'],
    validate: {
      validator: function(v) {
        if (!(v instanceof Date && !isNaN(v))) {
          return false;
        }
        if (this.checkinDate && v <= this.checkinDate) {
          return false;
        }
        return true;
      },
      message: 'Check-out date must be after check-in date'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['Confirmed', 'Checked-in', 'Checked-out', 'Cancelled', 'Pending'],
      message: '{VALUE} is not a valid status'
    },
    default: 'Pending'
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: [0, 'Paid amount cannot be negative'],
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 1000000;
      },
      message: 'Paid amount must be between 0 and 1,000,000'
    }
  }
}, {
  timestamps: true
});

// Compound Index following ESR Rule (Equality, Sort, Range)
bookingSchema.index({ status: 1, roomId: 1, checkinDate: 1 });
bookingSchema.index({ guestId: 1, checkinDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
