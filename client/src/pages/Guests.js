import React, { useState, useEffect } from 'react';
import { guestsAPI } from '../services/api';

function Guests() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [formData, setFormData] = useState({
    guestId: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    checkinDate: '',
    checkoutDate: '',
    roomType: '',
    status: 'Pending'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchGuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchGuests = async () => {
    try {
      const response = await guestsAPI.getAll(filters);
      setGuests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching guests:', error);
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Guest ID validation (3-10 alphanumeric characters)
    if (!formData.guestId.trim()) {
      newErrors.guestId = 'Guest ID is required';
    } else if (!/^[A-Z0-9]{3,10}$/i.test(formData.guestId)) {
      newErrors.guestId = 'Guest ID must be 3-10 alphanumeric characters';
    }

    // Name validation (only letters, spaces, dots, hyphens, apostrophes)
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z\s.'\-]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters, spaces, dots, hyphens, and apostrophes';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    // Phone validation (10-15 digits with optional formatting)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\(\)\+]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10-15 digits (may include spaces, hyphens, parentheses, or +)';
    }

    // Address validation (optional but max 500 chars)
    if (formData.address && formData.address.length > 500) {
      newErrors.address = 'Address cannot exceed 500 characters';
    }

    // Date validation
    if (formData.checkinDate && formData.checkoutDate) {
      const checkin = new Date(formData.checkinDate);
      const checkout = new Date(formData.checkoutDate);
      if (checkout <= checkin) {
        newErrors.checkoutDate = 'Check-out date must be after check-in date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    try {
      if (editingGuest) {
        await guestsAPI.update(editingGuest._id, formData);
      } else {
        await guestsAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      fetchGuests();
    } catch (error) {
      console.error('Error saving guest:', error);
      alert('Error saving guest: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        await guestsAPI.delete(id);
        fetchGuests();
      } catch (error) {
        console.error('Error deleting guest:', error);
      }
    }
  };

  const handleEdit = (guest) => {
    setEditingGuest(guest);
    setFormData({
      ...guest,
      checkinDate: guest.checkinDate ? new Date(guest.checkinDate).toISOString().split('T')[0] : '',
      checkoutDate: guest.checkoutDate ? new Date(guest.checkoutDate).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      guestId: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      checkinDate: '',
      checkoutDate: '',
      roomType: '',
      status: 'Pending'
    });
    setEditingGuest(null);
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (loading) return <div className="loading">Loading guests...</div>;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Guest Management</h2>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            Add New Guest
          </button>
        </div>

        <div className="filters">
          <div className="form-group">
            <label>Status</label>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Checked-out">Checked-out</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by name, email, or ID"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Guest ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Room Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest._id}>
                  <td>{guest.guestId}</td>
                  <td>{guest.name}</td>
                  <td>{guest.email}</td>
                  <td>{guest.phone}</td>
                  <td>{guest.checkinDate ? new Date(guest.checkinDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{guest.checkoutDate ? new Date(guest.checkoutDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{guest.roomType || 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${guest.status.toLowerCase()}`}>
                      {guest.status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button className="btn btn-warning" onClick={() => handleEdit(guest)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(guest._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingGuest ? 'Edit Guest' : 'Add New Guest'}</h2>
              <button className="close-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Guest ID *</label>
                <input
                  type="text"
                  required
                  value={formData.guestId}
                  onChange={(e) => handleInputChange('guestId', e.target.value.toUpperCase())}
                  disabled={editingGuest}
                  placeholder="e.g., G001, GUEST123"
                  maxLength="10"
                  style={{ borderColor: errors.guestId ? '#dc3545' : '' }}
                />
                {errors.guestId && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.guestId}</span>}
              </div>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    // Only allow letters, spaces, dots, hyphens, and apostrophes
                    const value = e.target.value;
                    if (value === '' || /^[A-Za-z\s.'\-]*$/.test(value)) {
                      handleInputChange('name', value);
                    }
                  }}
                  placeholder="e.g., John Doe"
                  maxLength="100"
                  style={{ borderColor: errors.name ? '#dc3545' : '' }}
                />
                {errors.name && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="e.g., john@example.com"
                  style={{ borderColor: errors.email ? '#dc3545' : '' }}
                />
                {errors.email && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.email}</span>}
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => {
                    // Only allow digits, spaces, hyphens, parentheses, and plus
                    const value = e.target.value;
                    if (value === '' || /^[\d\s\-\(\)\+]*$/.test(value)) {
                      handleInputChange('phone', value);
                    }
                  }}
                  placeholder="e.g., +1-234-567-8900"
                  maxLength="15"
                  style={{ borderColor: errors.phone ? '#dc3545' : '' }}
                />
                {errors.phone && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="e.g., 123 Main St, City, State"
                  maxLength="500"
                  style={{ borderColor: errors.address ? '#dc3545' : '' }}
                />
                {errors.address && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.address}</span>}
              </div>
              <div className="form-group">
                <label>Check-in Date</label>
                <input
                  type="date"
                  value={formData.checkinDate}
                  onChange={(e) => handleInputChange('checkinDate', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Check-out Date</label>
                <input
                  type="date"
                  value={formData.checkoutDate}
                  onChange={(e) => handleInputChange('checkoutDate', e.target.value)}
                  style={{ borderColor: errors.checkoutDate ? '#dc3545' : '' }}
                />
                {errors.checkoutDate && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.checkoutDate}</span>}
              </div>
              <div className="form-group">
                <label>Room Type</label>
                <select
                  value={formData.roomType}
                  onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                >
                  <option value="">Select Room Type</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Suite">Suite</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Presidential">Presidential</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Checked-out">Checked-out</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary">
                  {editingGuest ? 'Update' : 'Create'} Guest
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Guests;
