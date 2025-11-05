import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../services/api';

function Reports() {
  const [occupancyData, setOccupancyData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [guestsByRoomType, setGuestsByRoomType] = useState([]);
  const [topAmenities, setTopAmenities] = useState([]);
  const [servicesSummary, setServicesSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAllReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const fetchAllReports = async () => {
    try {
      setLoading(true);
      
      const [occupancy, revenue, guests, amenities, services] = await Promise.all([
        reportsAPI.getOccupancy(dateRange),
        reportsAPI.getRevenue(dateRange),
        reportsAPI.getGuestsByRoomType(dateRange),
        reportsAPI.getTopAmenities({ ...dateRange, limit: 10 }),
        reportsAPI.getServicesSummary(dateRange)
      ]);

      setOccupancyData(occupancy.data);
      setRevenueData(revenue.data);
      setGuestsByRoomType(guests.data);
      setTopAmenities(amenities.data);
      setServicesSummary(services.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Reports & Analytics</h1>

      <div className="card">
        <h2>Date Range Filter</h2>
        <div className="filters">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>&nbsp;</label>
            <button className="btn btn-primary" onClick={fetchAllReports}>
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h3>Occupancy Rate</h3>
          <div className="stat-value">{occupancyData?.occupancyRate || 0}%</div>
          <div className="stat-label">
            {occupancyData?.occupiedRooms || 0} / {occupancyData?.totalRooms || 0} rooms occupied
          </div>
        </div>
        
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <h3>Total Revenue</h3>
          <div className="stat-value">${revenueData?.totalRevenue?.toLocaleString() || 0}</div>
          <div className="stat-label">For selected period</div>
        </div>
        
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <h3>Total Services</h3>
          <div className="stat-value">{servicesSummary?.totalServices || 0}</div>
          <div className="stat-label">Service requests</div>
        </div>
        
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
          <h3>Top Amenities</h3>
          <div className="stat-value">{topAmenities?.[0]?.amenityName || 'N/A'}</div>
          <div className="stat-label">Most used amenity</div>
        </div>
      </div>

      <div className="card">
        <h2>Revenue by Room Type</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Room Type</th>
                <th>Total Revenue</th>
                <th>Booking Count</th>
                <th>Average Revenue</th>
              </tr>
            </thead>
            <tbody>
              {revenueData?.revenueByRoomType?.map((item, idx) => (
                <tr key={idx}>
                  <td>{item._id || 'N/A'}</td>
                  <td>${item.totalRevenue?.toLocaleString()}</td>
                  <td>{item.bookingCount}</td>
                  <td>${item.avgRevenue?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Guests by Room Type</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Room Type</th>
                <th>Guest Count</th>
              </tr>
            </thead>
            <tbody>
              {guestsByRoomType?.map((item, idx) => (
                <tr key={idx}>
                  <td>{item._id || 'N/A'}</td>
                  <td>{item.guestCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Top Amenities Usage</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Amenity Name</th>
                <th>Usage Count</th>
                <th>Completed Count</th>
                <th>Price per Use</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topAmenities?.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.amenityName}</td>
                  <td>{item.usageCount}</td>
                  <td>{item.completedCount}</td>
                  <td>${item.amenityPrice}</td>
                  <td>${item.totalRevenue?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Services Summary by Status</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {servicesSummary?.byStatus?.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <span className={`status-badge status-${item._id?.toLowerCase()}`}>
                      {item._id}
                    </span>
                  </td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Top Guests by Service Usage</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Service Count</th>
              </tr>
            </thead>
            <tbody>
              {servicesSummary?.topGuestsByServiceUsage?.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.guestName}</td>
                  <td>{item.serviceCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
