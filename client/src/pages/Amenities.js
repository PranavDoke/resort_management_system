import React, { useState, useEffect } from 'react';
import { amenitiesAPI } from '../services/api';

function Amenities() {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [formData, setFormData] = useState({
    amenityId: '',
    name: '',
    description: '',
    price: '',
    availableDays: []
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      const response = await amenitiesAPI.getAll();
      setAmenities(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching amenities:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      if (editingAmenity) {
        await amenitiesAPI.update(editingAmenity._id, submitData);
      } else {
        await amenitiesAPI.create(submitData);
      }
      setShowModal(false);
      resetForm();
      fetchAmenities();
    } catch (error) {
      console.error('Error saving amenity:', error);
      alert('Error saving amenity: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this amenity?')) {
      try {
        await amenitiesAPI.delete(id);
        fetchAmenities();
      } catch (error) {
        console.error('Error deleting amenity:', error);
      }
    }
  };

  const handleEdit = (amenity) => {
    setEditingAmenity(amenity);
    setFormData({
      amenityId: amenity.amenityId,
      name: amenity.name,
      description: amenity.description,
      price: amenity.price,
      availableDays: amenity.availableDays || []
    });
    setShowModal(true);
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const resetForm = () => {
    setFormData({
      amenityId: '',
      name: '',
      description: '',
      price: '',
      availableDays: []
    });
    setEditingAmenity(null);
  };

  if (loading) return <div className="loading">Loading amenities...</div>;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Amenities Management</h2>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            Add New Amenity
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Amenity ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Available Days</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {amenities.map((amenity) => (
                <tr key={amenity._id}>
                  <td>{amenity.amenityId}</td>
                  <td>{amenity.name}</td>
                  <td>{amenity.description}</td>
                  <td>${amenity.price}</td>
                  <td>
                    <div className="facilities-list">
                      {amenity.availableDays?.slice(0, 3).map((day, idx) => (
                        <span key={idx} className="facility-tag">{day}</span>
                      ))}
                      {amenity.availableDays?.length > 3 && (
                        <span className="facility-tag">+{amenity.availableDays.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="action-buttons">
                    <button className="btn btn-warning" onClick={() => handleEdit(amenity)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(amenity._id)}>Delete</button>
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
              <h2>{editingAmenity ? 'Edit Amenity' : 'Add New Amenity'}</h2>
              <button className="close-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Amenity ID *</label>
                <input
                  type="text"
                  required
                  value={formData.amenityId}
                  onChange={(e) => setFormData({ ...formData, amenityId: e.target.value })}
                  disabled={editingAmenity}
                />
              </div>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Available Days</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {daysOfWeek.map(day => (
                    <label key={day} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.availableDays.includes(day)}
                        onChange={() => handleDayToggle(day)}
                        style={{ marginRight: '0.25rem' }}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary">
                  {editingAmenity ? 'Update' : 'Create'} Amenity
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

export default Amenities;
