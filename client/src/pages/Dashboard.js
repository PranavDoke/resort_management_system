import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../services/api';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await reportsAPI.getDashboard();
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Dashboard Overview</h1>
      
      <div className="dashboard-grid">
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h3>Total Guests</h3>
          <div className="stat-value">{dashboardData?.guests?.total || 0}</div>
          <div className="stat-label">Active: {dashboardData?.guests?.active || 0}</div>
        </div>
        
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <h3>Total Rooms</h3>
          <div className="stat-value">{dashboardData?.rooms?.total || 0}</div>
          <div className="stat-label">Available: {dashboardData?.rooms?.available || 0}</div>
        </div>
        
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <h3>Total Bookings</h3>
          <div className="stat-value">{dashboardData?.bookings?.total || 0}</div>
          <div className="stat-label">Active: {dashboardData?.bookings?.active || 0}</div>
        </div>
        
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
          <h3>Total Services</h3>
          <div className="stat-value">{dashboardData?.services?.total || 0}</div>
          <div className="stat-label">Pending: {dashboardData?.services?.pending || 0}</div>
        </div>
      </div>

      <div className="card">
        <h2>Recent Bookings</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest ID</th>
                <th>Room ID</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Amount Paid</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.recentBookings?.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.bookingId}</td>
                  <td>{booking.guestId}</td>
                  <td>{booking.roomId}</td>
                  <td>{new Date(booking.checkinDate).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkoutDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${booking.status.toLowerCase().replace(' ', '-')}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>${booking.paidAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
