const express = require('express');
const { body, query, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const upload = require('../middleware/cloudinaryUpload');
const Property = require('../models/Property');
const router = express.Router();

// Get all properties with pagination, sorting, and filtering
router.get('/', [
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be a positive number'),
  query('location').optional().isString().withMessage('location must be a string'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  query('sortBy').optional().isIn(['price', 'bedrooms', 'bathrooms']).withMessage('Invalid sort field'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('Invalid sort order')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array().map(e => e.msg).join(', ') });
  }

  try {
    const { minPrice, maxPrice, location, page = 1, limit = 10, sortBy = 'price', order = 'asc' } = req.query;
    let query = {};

    if (minPrice) query.price = { $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
    if (location) query.location = new RegExp(location, 'i');

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    const properties = await Property.find(query)
      .populate('landlord', 'name email phone')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Property.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      properties
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('landlord', 'name email phone');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create property (Landlord only)
router.post('/', auth, upload.array('images', 5), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('bedrooms').isInt({ min: 0 }).withMessage('Bedrooms must be a non-negative integer'),
  body('bathrooms').isInt({ min: 0 }).withMessage('Bathrooms must be a non-negative integer'),
  body('amenities').optional().isArray().withMessage('Amenities must be an array')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array().map(e => e.msg).join(', ') });
  }

  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({ message: 'Only landlords can create properties' });
    }

    const { title, description, location, price, bedrooms, bathrooms, amenities } = req.body;
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const property = new Property({
      title,
      description,
      location,
      price,
      bedrooms,
      bathrooms,
      amenities,
      images,
      landlord: req.user.id
    });

    await property.save();
    console.log(`Property created by landlord: ${req.user.id}`);
    res.status(201).json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update property (Landlord only)
router.put('/:id', auth, upload.array('images', 5), [
  body('title').optional().trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim().notEmpty().withMessage('Description is required'),
  body('location').optional().trim().notEmpty().withMessage('Location is required'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('bedrooms').optional().isInt({ min: 0 }).withMessage('Bedrooms must be a non-negative integer'),
  body('bathrooms').optional().isInt({ min: 0 }).withMessage('Bathrooms must be a non-negative integer'),
  body('amenities').optional().isArray().withMessage('Amenities must be an array')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array().map(e => e.msg).join(', ') });
  }

  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (req.user.role !== 'landlord' || property.landlord.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the landlord who created the property can update it' });
    }

    const { title, description, location, price, bedrooms, bathrooms, amenities } = req.body;

    if (title) property.title = title;
    if (description) property.description = description;
    if (location) property.location = location;
    if (price) property.price = price;
    if (bedrooms) property.bedrooms = bedrooms;
    if (bathrooms) property.bathrooms = bathrooms;
    if (amenities) property.amenities = amenities;

    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => `/uploads/${file.filename}`);
      property.images = images;
    }

    await property.save();
    console.log(`Property updated by landlord: ${req.user.id}`);
    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
