const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Get all services with filters
router.get('/', async (req, res) => {
  try {
    const { status, guestId, amenityId, startDate, endDate } = req.query;
    let query = {};

    if (status) query.status = status;
    if (guestId) query.guestId = guestId;
    if (amenityId) query.amenityId = amenityId;
    if (startDate && endDate) {
      query.bookingDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const services = await Service.find(query).sort({ bookingDate: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get services with guest and amenity details
router.get('/detailed', async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let matchStage = {};

    if (status) matchStage.status = status;
    if (startDate && endDate) {
      matchStage.bookingDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const services = await Service.aggregate([
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
          from: 'amenities',
          localField: 'amenityId',
          foreignField: 'amenityId',
          as: 'amenityDetails'
        }
      },
      { $unwind: { path: '$guestDetails', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$amenityDetails', preserveNullAndEmptyArrays: true } },
      { $sort: { bookingDate: -1 } }
    ]);

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create service
router.post('/', async (req, res) => {
  const service = new Service(req.body);
  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update service
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
