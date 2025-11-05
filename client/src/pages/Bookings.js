import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [filters, setFilters] = useState({ status: '', startDate: '', endDate: '' });
  const [formData, setFormData] = useState({
    bookingId: '',
    guestId: '',
    roomId: '',
    checkinDate: '',
    checkoutDate: '',
    status: 'Pending',
    paidAmount: ''
  });

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getDetailed(filters);
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check for clashes
      const clashCheck = await bookingsAPI.checkClash({
        roomId: formData.roomId,
        checkinDate: formData.checkinDate,
        checkoutDate: formData.checkoutDate,
        excludeBookingId: editingBooking?.bookingId
      });

      if (clashCheck.data.hasClash) {
        alert('This room is already booked for the selected dates!');
        return;
      }

      const submitData = {
        ...formData,
        paidAmount: parseFloat(formData.paidAmount)
      };
      
      if (editingBooking) {
        await bookingsAPI.update(editingBooking._id, submitData);
      } else {
        await bookingsAPI.create(submitData);
      }
      setShowModal(false);
      resetForm();
      fetchBookings();
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Error saving booking: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingsAPI.delete(id);
        fetchBookings();
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setFormData({
      bookingId: booking.bookingId,
      guestId: booking.guestId,
      roomId: booking.roomId,
      checkinDate: new Date(booking.checkinDate).toISOString().split('T')[0],
      checkoutDate: new Date(booking.checkoutDate).toISOString().split('T')[0],
      status: booking.status,
      paidAmount: booking.paidAmount
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      bookingId: '',
      guestId: '',
      roomId: '',
      checkinDate: '',
      checkoutDate: '',
      status: 'Pending',
      paidAmount: ''
    });
    setEditingBooking(null);
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Booking Management</h2>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            Add New Booking
          </button>
        </div>

        <div className="filters">
          <div className="form-group">
            <label>Status</label>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked-in">Checked-in</option>
              <option value="Checked-out">Checked-out</option>
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
                <th>Booking ID</th>
                <th>Guest Name</th>
                <th>Room Number</th>
                <th>Room Type</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Amount Paid</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.bookingId}</td>
                  <td>{booking.guestDetails?.name || booking.guestId}</td>
                  <td>{booking.roomDetails?.roomNumber || booking.roomId}</td>
                  <td>{booking.roomDetails?.type || 'N/A'}</td>
                  <td>{new Date(booking.checkinDate).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkoutDate).toLocaleDateString()}</td>
                  <td>${booking.paidAmount}</td>
                  <td>
                    <span className={`status-badge status-${booking.status.toLowerCase().replace(' ', '-')}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button className="btn btn-warning" onClick={() => handleEdit(booking)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(booking._id)}>Delete</button>
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
              <h2>{editingBooking ? 'Edit Booking' : 'Add New Booking'}</h2>
              <button className="close-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Booking ID *</label>
                <input
                  type="text"
                  required
                  value={formData.bookingId}
                  onChange={(e) => setFormData({ ...formData, bookingId: e.target.value })}
                  disabled={editingBooking}
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
                <label>Room ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., R001"
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Check-in Date *</label>
                <input
                  type="date"
                  required
                  value={formData.checkinDate}
                  onChange={(e) => setFormData({ ...formData, checkinDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Check-out Date *</label>
                <input
                  type="date"
                  required
                  value={formData.checkoutDate}
                  onChange={(e) => setFormData({ ...formData, checkoutDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Paid Amount *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.paidAmount}
                  onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
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
                  <option value="Checked-in">Checked-in</option>
                  <option value="Checked-out">Checked-out</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary">
                  {editingBooking ? 'Update' : 'Create'} Booking
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

export default Bookings;
