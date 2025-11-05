const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: [true, 'Room ID is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[A-Z0-9]{2,10}$/i.test(v);
      },
      message: 'Room ID must be 2-10 alphanumeric characters'
    }
  },
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[A-Z0-9\-]{1,10}$/i.test(v);
      },
      message: 'Room number must be 1-10 alphanumeric characters (hyphens allowed)'
    }
  },
  type: {
    type: String,
    required: [true, 'Room type is required'],
    enum: {
      values: ['Single', 'Double', 'Suite', 'Deluxe', 'Presidential'],
      message: '{VALUE} is not a valid room type'
    }
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [20, 'Capacity cannot exceed 20'],
    validate: {
      validator: Number.isInteger,
      message: 'Capacity must be a whole number'
    }
  },
  facilities: [{
    type: String,
    trim: true
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 1000000;
      },
      message: 'Price must be between 0 and 1,000,000'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['Available', 'Occupied', 'Maintenance', 'Reserved'],
      message: '{VALUE} is not a valid status'
    },
    default: 'Available'
  }
}, {
  timestamps: true
});

// Compound Index following ESR Rule (Equality, Sort, Range)
roomSchema.index({ status: 1, type: 1, capacity: 1 });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
