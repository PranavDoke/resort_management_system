const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    required: true,
    unique: true
  },
  guestId: {
    type: String,
    required: true,
    ref: 'Guest'
  },
  amenityId: {
    type: String,
    required: true,
    ref: 'Amenity'
  },
  bookingDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Compound Index following ESR Rule (Equality, Sort, Range)
serviceSchema.index({ status: 1, guestId: 1, bookingDate: 1 });
serviceSchema.index({ amenityId: 1, bookingDate: 1 });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
