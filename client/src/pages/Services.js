import React, { useState, useEffect } from 'react';
import { servicesAPI } from '../services/api';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [filters, setFilters] = useState({ status: '', startDate: '', endDate: '' });
  const [formData, setFormData] = useState({
    serviceId: '',
    guestId: '',
    amenityId: '',
    bookingDate: '',
    status: 'Pending',
    notes: ''
  });

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getDetailed(filters);
      setServices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await servicesAPI.update(editingService._id, formData);
      } else {
        await servicesAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error saving service: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await servicesAPI.delete(id);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      serviceId: service.serviceId,
      guestId: service.guestId,
      amenityId: service.amenityId,
      bookingDate: new Date(service.bookingDate).toISOString().split('T')[0],
      status: service.status,
      notes: service.notes || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      serviceId: '',
      guestId: '',
      amenityId: '',
      bookingDate: '',
      status: 'Pending',
      notes: ''
    });
    setEditingService(null);
  };

  if (loading) return <div className="loading">Loading services...</div>;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Services Management</h2>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            Add New Service
          </button>
        </div>

        <div className="filters">
          <div className="form-group">
            <label>Status</label>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Service ID</th>
                <th>Guest Name</th>
                <th>Amenity</th>
                <th>Booking Date</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td>{service.serviceId}</td>
                  <td>{service.guestDetails?.name || service.guestId}</td>
                  <td>{service.amenityDetails?.name || service.amenityId}</td>
                  <td>{new Date(service.bookingDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${service.status.toLowerCase()}`}>
                      {service.status}
                    </span>
                  </td>
                  <td>{service.notes || 'N/A'}</td>
                  <td className="action-buttons">
                    <button className="btn btn-warning" onClick={() => handleEdit(service)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(service._id)}>Delete</button>
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
              <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
              <button className="close-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Service ID *</label>
                <input
                  type="text"
                  required
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  disabled={editingService}
                />
              </div>
              <div className="form-group">
                <label>Guest ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., G001"
                  value={formData.guestId}
                  onChange={(e) => setFormData({ ...formData, guestId: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Amenity ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., A001"
                  value={formData.amenityId}
                  onChange={(e) => setFormData({ ...formData, amenityId: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Booking Date *</label>
                <input
                  type="date"
                  required
                  value={formData.bookingDate}
                  onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                />
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary">
                  {editingService ? 'Update' : 'Create'} Service
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

export default Services;
