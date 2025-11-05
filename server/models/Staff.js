const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffId: {
    type: String,
    required: [true, 'Staff ID is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[A-Z0-9]{3,10}$/i.test(v);
      },
      message: 'Staff ID must be 3-10 alphanumeric characters'
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
        return /^[A-Za-z\s.'\-]+$/.test(v);
      },
      message: 'Name can only contain letters, spaces, dots, hyphens, and apostrophes'
    }
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['Manager', 'Receptionist', 'Housekeeping', 'Chef', 'Security', 'Maintenance'],
      message: '{VALUE} is not a valid role'
    }
  },
  contact: {
    type: String,
    required: [true, 'Contact is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^[\d\s\-\(\)\+]{10,15}$/.test(v);
      },
      message: 'Contact must be 10-15 digits (may include spaces, hyphens, parentheses, or +)'
    }
  },
  joinDate: {
    type: Date,
    required: [true, 'Join date is required'],
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v);
      },
      message: 'Invalid join date'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['Active', 'On Leave', 'Inactive'],
      message: '{VALUE} is not a valid status'
    },
    default: 'Active'
  }
}, {
  timestamps: true
});

staffSchema.index({ status: 1, role: 1 });

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
