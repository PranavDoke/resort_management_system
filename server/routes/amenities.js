const express = require('express');
const router = express.Router();
const Amenity = require('../models/Amenity');

// Get all amenities
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { amenityId: { $regex: search, $options: 'i' } }
      ];
    }

    const amenities = await Amenity.find(query).sort({ name: 1 });
    res.json(amenities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single amenity
router.get('/:id', async (req, res) => {
  try {
    const amenity = await Amenity.findById(req.params.id);
    if (!amenity) {
      return res.status(404).json({ message: 'Amenity not found' });
    }
    res.json(amenity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create amenity
router.post('/', async (req, res) => {
  const amenity = new Amenity(req.body);
  try {
    const newAmenity = await amenity.save();
    res.status(201).json(newAmenity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update amenity
router.put('/:id', async (req, res) => {
  try {
    const amenity = await Amenity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!amenity) {
      return res.status(404).json({ message: 'Amenity not found' });
    }
    res.json(amenity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete amenity
router.delete('/:id', async (req, res) => {
  try {
    const amenity = await Amenity.findByIdAndDelete(req.params.id);
    if (!amenity) {
      return res.status(404).json({ message: 'Amenity not found' });
    }
    res.json({ message: 'Amenity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
