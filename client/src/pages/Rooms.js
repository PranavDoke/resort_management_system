import React, { useState, useEffect } from 'react';
import { roomsAPI } from '../services/api';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [filters, setFilters] = useState({ status: '', type: '', search: '' });
  const [formData, setFormData] = useState({
    roomId: '',
    roomNumber: '',
    type: '',
    capacity: '',
    facilities: '',
    price: '',
    status: 'Available'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchRooms = async () => {
    try {
      const response = await roomsAPI.getAll(filters);
      setRooms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Room ID validation
    if (!formData.roomId.trim()) {
      newErrors.roomId = 'Room ID is required';
    } else if (!/^[A-Z0-9]{2,10}$/i.test(formData.roomId)) {
      newErrors.roomId = 'Room ID must be 2-10 alphanumeric characters';
    }

    // Room Number validation
    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    } else if (!/^[A-Z0-9\-]{1,10}$/i.test(formData.roomNumber)) {
      newErrors.roomNumber = 'Room number must be 1-10 alphanumeric characters (hyphens allowed)';
    }

    // Capacity validation
    const capacity = parseInt(formData.capacity);
    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
    } else if (isNaN(capacity) || capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    } else if (capacity > 20) {
      newErrors.capacity = 'Capacity cannot exceed 20';
    } else if (!Number.isInteger(capacity)) {
      newErrors.capacity = 'Capacity must be a whole number';
    }

    // Price validation
    const price = parseFloat(formData.price);
    if (!formData.price && formData.price !== 0) {
      newErrors.price = 'Price is required';
    } else if (isNaN(price) || price < 0) {
      newErrors.price = 'Price cannot be negative';
    } else if (price > 1000000) {
      newErrors.price = 'Price cannot exceed 1,000,000';
    }

    // Type validation
    if (!formData.type) {
      newErrors.type = 'Room type is required';
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
      const submitData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price),
        facilities: formData.facilities.split(',').map(f => f.trim()).filter(f => f)
      };
      
      if (editingRoom) {
        await roomsAPI.update(editingRoom._id, submitData);
      } else {
        await roomsAPI.create(submitData);
      }
      setShowModal(false);
      resetForm();
      fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
      alert('Error saving room: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await roomsAPI.delete(id);
        fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      ...room,
      facilities: Array.isArray(room.facilities) ? room.facilities.join(', ') : ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      roomId: '',
      roomNumber: '',
      type: '',
      capacity: '',
      facilities: '',
      price: '',
      status: 'Available'
    });
    setEditingRoom(null);
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (loading) return <div className="loading">Loading rooms...</div>;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Room Management</h2>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            Add New Room
          </button>
        </div>

        <div className="filters">
          <div className="form-group">
            <label>Status</label>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>
          <div className="form-group">
            <label>Room Type</label>
            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
              <option value="">All</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Presidential">Presidential</option>
            </select>
          </div>
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by room number or ID"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Room ID</th>
                <th>Room Number</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Price</th>
                <th>Facilities</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.roomId}</td>
                  <td>{room.roomNumber}</td>
                  <td>{room.type}</td>
                  <td>{room.capacity}</td>
                  <td>${room.price}</td>
                  <td>
                    <div className="facilities-list">
                      {room.facilities?.slice(0, 3).map((facility, idx) => (
                        <span key={idx} className="facility-tag">{facility}</span>
                      ))}
                      {room.facilities?.length > 3 && (
                        <span className="facility-tag">+{room.facilities.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${room.status.toLowerCase()}`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button className="btn btn-warning" onClick={() => handleEdit(room)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(room._id)}>Delete</button>
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
              <h2>{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
              <button className="close-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Room ID *</label>
                <input
                  type="text"
                  required
                  value={formData.roomId}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    if (value === '' || /^[A-Z0-9]*$/.test(value)) {
                      handleInputChange('roomId', value);
                    }
                  }}
                  disabled={editingRoom}
                  placeholder="e.g., R001, RM123"
                  maxLength="10"
                  style={{ borderColor: errors.roomId ? '#dc3545' : '' }}
                />
                {errors.roomId && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.roomId}</span>}
              </div>
              <div className="form-group">
                <label>Room Number *</label>
                <input
                  type="text"
                  required
                  value={formData.roomNumber}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    if (value === '' || /^[A-Z0-9\-]*$/.test(value)) {
                      handleInputChange('roomNumber', value);
                    }
                  }}
                  placeholder="e.g., 101, A-203"
                  maxLength="10"
                  style={{ borderColor: errors.roomNumber ? '#dc3545' : '' }}
                />
                {errors.roomNumber && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.roomNumber}</span>}
              </div>
              <div className="form-group">
                <label>Type *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  style={{ borderColor: errors.type ? '#dc3545' : '' }}
                >
                  <option value="">Select Type</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Suite">Suite</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Presidential">Presidential</option>
                </select>
                {errors.type && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.type}</span>}
              </div>
              <div className="form-group">
                <label>Capacity *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="20"
                  value={formData.capacity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d+$/.test(value)) {
                      handleInputChange('capacity', value);
                    }
                  }}
                  placeholder="e.g., 2"
                  style={{ borderColor: errors.capacity ? '#dc3545' : '' }}
                />
                {errors.capacity && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.capacity}</span>}
              </div>
              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="1000000"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="e.g., 150.00"
                  style={{ borderColor: errors.price ? '#dc3545' : '' }}
                />
                {errors.price && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.price}</span>}
              </div>
              <div className="form-group">
                <label>Facilities (comma-separated)</label>
                <input
                  type="text"
                  placeholder="WiFi, TV, Air Conditioning"
                  value={formData.facilities}
                  onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary">
                  {editingRoom ? 'Update' : 'Create'} Room
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

export default Rooms;
