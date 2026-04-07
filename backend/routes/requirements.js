const express = require('express');
const router = express.Router();
const Requirement = require('../models/Requirement');

// POST a new requirement
router.post('/', async (req, res) => {
  try {
    const { eventName, eventType, eventDate, location, venue, hiringCategory, categoryDetails } = req.body;

    // Create a new Requirement document
    const requirement = new Requirement({
      eventName,
      eventType,
      eventDate,
      location,
      venue,
      hiringCategory,
      categoryDetails
    });

    const savedRequirement = await requirement.save();

    res.status(201).json({
      message: 'Requirement posted successfully',
      data: savedRequirement
    });
  } catch (error) {
    console.error('Error saving requirement:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// GET all requirements (for testing returning records on dashboard if ever needed)
router.get('/', async (req, res) => {
  try {
    const requirements = await Requirement.find().sort({ createdAt: -1 });
    res.status(200).json(requirements);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
