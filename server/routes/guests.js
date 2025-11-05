const express = require('express');
const router = express.Router();
const Guest = require('../models/Guest');

// Get all guests with filters
router.get('/', async (req, res) => {
  try {
    const { status, checkinDate, checkoutDate, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (checkinDate) query.checkinDate = { $gte: new Date(checkinDate) };
    if (checkoutDate) query.checkoutDate = { $lte: new Date(checkoutDate) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { guestId: { $regex: search, $options: 'i' } }
      ];
    }

    const guests = await Guest.find(query).sort({ createdAt: -1 });
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single guest
router.get('/:id', async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.json(guest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create guest
router.post('/', async (req, res) => {
  try {
    const guest = new Guest(req.body);
    const newGuest = await guest.save();
    res.status(201).json(newGuest);
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors 
      });
    }
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Guest ID already exists. Please use a different ID.' 
      });
    }
    res.status(400).json({ message: error.message });
  }
});

// Update guest
router.put('/:id', async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.json(guest);
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors 
      });
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete guest
router.delete('/:id', async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.json({ message: 'Guest deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
