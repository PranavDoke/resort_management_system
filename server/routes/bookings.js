const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Guest = require('../models/Guest');
const Room = require('../models/Room');

// Get all bookings with filters
router.get('/', async (req, res) => {
  try {
    const { status, guestId, roomId, startDate, endDate } = req.query;
    let query = {};

    if (status) query.status = status;
    if (guestId) query.guestId = guestId;
    if (roomId) query.roomId = roomId;
    if (startDate && endDate) {
      query.$or = [
        { checkinDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { checkoutDate: { $gte: new Date(startDate), $lte: new Date(endDate) } }
      ];
    }

    const bookings = await Booking.find(query).sort({ checkinDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookings with guest and room details
router.get('/detailed', async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let matchStage = {};

    if (status) matchStage.status = status;
    if (startDate && endDate) {
      matchStage.$or = [
        { checkinDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { checkoutDate: { $gte: new Date(startDate), $lte: new Date(endDate) } }
      ];
    }

    const bookings = await Booking.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'guests',
          localField: 'guestId',
          foreignField: 'guestId',
          as: 'guestDetails'
        }
      },
      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: 'roomId',
          as: 'roomDetails'
        }
      },
      { $unwind: { path: '$guestDetails', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$roomDetails', preserveNullAndEmptyArrays: true } },
      { $sort: { checkinDate: -1 } }
    ]);

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create booking
router.post('/', async (req, res) => {
  const booking = new Booking(req.body);
  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bulk create bookings
router.post('/bulk', async (req, res) => {
  try {
    const bookings = req.body.bookings;
    const result = await Booking.insertMany(bookings);
    res.status(201).json({ message: `Created ${result.length} bookings`, bookings: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check for booking clashes
router.post('/check-clash', async (req, res) => {
  try {
    const { roomId, checkinDate, checkoutDate, excludeBookingId } = req.body;
    
    let query = {
      roomId,
      status: { $nin: ['Cancelled', 'Checked-out'] },
      $or: [
        {
          checkinDate: { $lte: new Date(checkoutDate) },
          checkoutDate: { $gte: new Date(checkinDate) }
        }
      ]
    };

    if (excludeBookingId) {
      query.bookingId = { $ne: excludeBookingId };
    }

    const clashes = await Booking.find(query);
    res.json({ hasClash: clashes.length > 0, clashes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
