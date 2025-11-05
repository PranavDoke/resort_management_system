// Validation utility functions for form inputs

export const validators = {
  // Name validation - only letters, spaces, dots, hyphens, apostrophes
  name: (value) => {
    if (!value || !value.trim()) {
      return 'Name is required';
    }
    if (!/^[A-Za-z\s.'\-]+$/.test(value)) {
      return 'Name can only contain letters, spaces, dots, hyphens, and apostrophes';
    }
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (value.trim().length > 100) {
      return 'Name cannot exceed 100 characters';
    }
    return '';
  },

  // Email validation
  email: (value) => {
    if (!value || !value.trim()) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please provide a valid email address';
    }
    return '';
  },

  // Phone validation - digits with optional formatting
  phone: (value) => {
    if (!value || !value.trim()) {
      return 'Phone number is required';
    }
    if (!/^[\d\s\-\(\)\+]{10,15}$/.test(value)) {
      return 'Phone must be 10-15 digits (may include spaces, hyphens, parentheses, or +)';
    }
    return '';
  },

  // Number validation - only digits
  number: (value, min = 0, max = Infinity, fieldName = 'Value') => {
    if (!value && value !== 0) {
      return `${fieldName} is required`;
    }
    const num = Number(value);
    if (isNaN(num)) {
      return `${fieldName} must be a number`;
    }
    if (num < min) {
      return `${fieldName} must be at least ${min}`;
    }
    if (num > max) {
      return `${fieldName} cannot exceed ${max}`;
    }
    return '';
  },

  // Alphanumeric validation
  alphanumeric: (value, min = 1, max = 50, fieldName = 'Field') => {
    if (!value || !value.trim()) {
      return `${fieldName} is required`;
    }
    if (!/^[A-Z0-9]+$/i.test(value)) {
      return `${fieldName} can only contain letters and numbers`;
    }
    if (value.length < min || value.length > max) {
      return `${fieldName} must be ${min}-${max} characters`;
    }
    return '';
  },

  // Date validation
  date: (value, fieldName = 'Date') => {
    if (!value) {
      return `${fieldName} is required`;
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return `Invalid ${fieldName.toLowerCase()}`;
    }
    return '';
  },

  // Date range validation
  dateRange: (startDate, endDate) => {
    if (!startDate || !endDate) {
      return '';
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      return 'End date must be after start date';
    }
    return '';
  },

  // Required field validation
  required: (value, fieldName = 'Field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return '';
  },

  // Text length validation
  textLength: (value, min = 0, max = 500, fieldName = 'Field') => {
    if (value && value.length > max) {
      return `${fieldName} cannot exceed ${max} characters`;
    }
    if (value && value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return '';
  }
};

// Input sanitizers - prevent invalid characters from being typed
export const sanitizers = {
  // Allow only letters and spaces
  lettersOnly: (value) => {
    return value.replace(/[^A-Za-z\s.'\-]/g, '');
  },

  // Allow only numbers
  numbersOnly: (value) => {
    return value.replace(/[^0-9]/g, '');
  },

  // Allow only alphanumeric
  alphanumericOnly: (value) => {
    return value.replace(/[^A-Za-z0-9]/g, '');
  },

  // Allow phone number characters
  phoneOnly: (value) => {
    return value.replace(/[^\d\s\-\(\)\+]/g, '');
  },

  // Allow decimal numbers
  decimalOnly: (value) => {
    return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
  }
};

export default { validators, sanitizers };
