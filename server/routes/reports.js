const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Service = require('../models/Service');
const Guest = require('../models/Guest');

// Occupancy rate per period
router.get('/occupancy', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const totalRooms = await Room.countDocuments();
    
    const occupiedBookings = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['Confirmed', 'Checked-in'] },
          checkinDate: { $lte: new Date(endDate) },
          checkoutDate: { $gte: new Date(startDate) }
        }
      },
      {
        $group: {
          _id: null,
          uniqueRooms: { $addToSet: '$roomId' }
        }
      }
    ]);

    const occupiedCount = occupiedBookings.length > 0 ? occupiedBookings[0].uniqueRooms.length : 0;
    const occupancyRate = totalRooms > 0 ? ((occupiedCount / totalRooms) * 100).toFixed(2) : 0;

    res.json({
      totalRooms,
      occupiedRooms: occupiedCount,
      occupancyRate: parseFloat(occupancyRate),
      period: { startDate, endDate }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Revenue by date range and room type
router.get('/revenue', async (req, res) => {
  try {
    const { startDate, endDate, roomType } = req.query;
    
    let matchStage = {
      status: { $in: ['Confirmed', 'Checked-in', 'Checked-out'] },
      checkinDate: { $gte: new Date(startDate) },
      checkoutDate: { $lte: new Date(endDate) }
    };

    const revenueByRoom = await Booking.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: 'roomId',
          as: 'roomDetails'
        }
      },
      { $unwind: '$roomDetails' },
      ...(roomType ? [{ $match: { 'roomDetails.type': roomType } }] : []),
      {
        $group: {
          _id: '$roomDetails.type',
          totalRevenue: { $sum: '$paidAmount' },
          bookingCount: { $sum: 1 },
          avgRevenue: { $avg: '$paidAmount' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    const totalRevenue = revenueByRoom.reduce((sum, item) => sum + item.totalRevenue, 0);

    res.json({
      totalRevenue,
      revenueByRoomType: revenueByRoom,
      period: { startDate, endDate }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Guest count by room type
router.get('/guests-by-roomtype', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchStage = {};
    if (startDate && endDate) {
      matchStage.checkinDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const guestsByRoomType = await Guest.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$roomType',
          guestCount: { $sum: 1 },
          guests: { $push: { name: '$name', email: '$email', status: '$status' } }
        }
      },
      { $sort: { guestCount: -1 } }
    ]);

    res.json(guestsByRoomType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Top used amenities
router.get('/top-amenities', async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    
    let matchStage = {};
    if (startDate && endDate) {
      matchStage.bookingDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const topAmenities = await Service.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'amenities',
          localField: 'amenityId',
          foreignField: 'amenityId',
          as: 'amenityDetails'
        }
      },
      { $unwind: '$amenityDetails' },
      {
        $group: {
          _id: '$amenityId',
          amenityName: { $first: '$amenityDetails.name' },
          amenityPrice: { $first: '$amenityDetails.price' },
          usageCount: { $sum: 1 },
          totalRevenue: { $sum: '$amenityDetails.price' },
          statuses: {
            $push: '$status'
          }
        }
      },
      {
        $project: {
          amenityName: 1,
          amenityPrice: 1,
          usageCount: 1,
          totalRevenue: 1,
          completedCount: {
            $size: {
              $filter: {
                input: '$statuses',
                as: 'status',
                cond: { $eq: ['$$status', 'Completed'] }
              }
            }
          }
        }
      },
      { $sort: { usageCount: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json(topAmenities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Services summary
router.get('/services-summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchStage = {};
    if (startDate && endDate) {
      matchStage.bookingDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const servicesSummary = await Service.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const totalServices = servicesSummary.reduce((sum, item) => sum + item.count, 0);

    const summaryByGuest = await Service.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'guests',
          localField: 'guestId',
          foreignField: 'guestId',
          as: 'guestDetails'
        }
      },
      { $unwind: '$guestDetails' },
      {
        $group: {
          _id: '$guestId',
          guestName: { $first: '$guestDetails.name' },
          serviceCount: { $sum: 1 }
        }
      },
      { $sort: { serviceCount: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totalServices,
      byStatus: servicesSummary,
      topGuestsByServiceUsage: summaryByGuest,
      period: { startDate, endDate }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dashboard overview
router.get('/dashboard', async (req, res) => {
  try {
    const totalGuests = await Guest.countDocuments();
    const activeGuests = await Guest.countDocuments({ status: 'Active' });
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'Available' });
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ 
      status: { $in: ['Confirmed', 'Checked-in'] } 
    });
    const totalServices = await Service.countDocuments();
    const pendingServices = await Service.countDocuments({ status: 'Pending' });

    // Recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      guests: { total: totalGuests, active: activeGuests },
      rooms: { total: totalRooms, available: availableRooms },
      bookings: { total: totalBookings, active: activeBookings },
      services: { total: totalServices, pending: pendingServices },
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
