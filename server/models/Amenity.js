const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema({
  amenityId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  availableDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }]
}, {
  timestamps: true
});

amenitySchema.index({ name: 1 });

const Amenity = mongoose.model('Amenity', amenitySchema);

module.exports = Amenity;
