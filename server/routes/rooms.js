const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// Get all rooms with filters
router.get('/', async (req, res) => {
  try {
    const { status, type, capacity, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (capacity) query.capacity = { $gte: parseInt(capacity) };
    if (search) {
      query.$or = [
        { roomNumber: { $regex: search, $options: 'i' } },
        { roomId: { $regex: search, $options: 'i' } }
      ];
    }

    const rooms = await Room.find(query).sort({ roomNumber: 1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create room
router.post('/', async (req, res) => {
  try {
    const room = new Room(req.body);
    const newRoom = await room.save();
    res.status(201).json(newRoom);
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
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field} already exists. Please use a different value.` 
      });
    }
    res.status(400).json({ message: error.message });
  }
});

// Update room
router.put('/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
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

// Delete room
router.delete('/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk update room status
router.post('/bulk-update-status', async (req, res) => {
  try {
    const { roomIds, status } = req.body;
    const result = await Room.updateMany(
      { _id: { $in: roomIds } },
      { $set: { status } }
    );
    res.json({ message: `Updated ${result.modifiedCount} rooms`, result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
