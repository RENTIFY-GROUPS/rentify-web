const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const Property = require('../models/Property');
const User = require('../models/User');
const SavedSearch = require('../models/SavedSearch');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'server/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadMultiple = multer({ storage }).fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 },
  { name: 'floorPlans', maxCount: 5 }
]);

// Get all properties with pagination, sorting, and filtering
router.get('/', [
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be a positive number'),
  query('location').optional().isString().withMessage('location must be a string'),
  query('bedrooms').optional().isInt({ min: 0 }).withMessage('Bedrooms must be a non-negative integer'),
  query('amenities').optional().isArray().withMessage('Amenities must be an array'),
  query('tags').optional().isArray().withMessage('Tags must be an array'),
  query('propertyType').optional().isString().withMessage('propertyType must be a string'),
  query('leaseDuration').optional().isString().withMessage('leaseDuration must be a string'),
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
    const { minPrice, maxPrice, location, bedrooms, amenities, tags, propertyType, leaseDuration, page = 1, limit = 10, sortBy = 'price', order = 'asc' } = req.query;
    let query = { status: 'approved' }; // Only show approved properties by default

    // If an admin is logged in, they can see all properties or filter by status
    if (req.user && req.user.role === 'admin') {
      if (req.query.status) {
        query.status = req.query.status; // Allow admin to filter by any status
      } else {
        delete query.status; // Admin sees all properties if no status filter is provided
      }
    }

    if (minPrice) query.price = { $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
    if (location) query.location = new RegExp(location, 'i');
    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (amenities) query.amenities = { $all: amenities };
    if (tags) query.tags = { $all: tags };
    if (propertyType) query.propertyType = propertyType;
    if (leaseDuration) query.leaseDuration = leaseDuration;

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

    // If the property is not approved and the user is not an admin, return 404
    if (property.status !== 'approved' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get nearby properties
router.get('/nearby', [
  query('latitude').isFloat().withMessage('Latitude must be a number'),
  query('longitude').isFloat().withMessage('Longitude must be a number'),
  query('radius').optional().isFloat({ min: 0 }).withMessage('Radius must be a positive number'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array().map(e => e.msg).join(', ') });
  }

  try {
    const { latitude, longitude, radius = 10 } = req.query; // Default radius 10 km
    
    // MongoDB geospatial query (assuming 2dsphere index on a 'location' field in Property model)
    // For now, we'll use a simple filter based on latitude/longitude range
    // A proper geospatial query requires a GeoJSON point field and a 2dsphere index.
    // For demonstration, we'll filter by a simple bounding box.
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const r = parseFloat(radius);

    const properties = await Property.find({
      latitude: { $gte: lat - (r / 111.2), $lte: lat + (r / 111.2) }, // Approx 1 degree lat = 111.2 km
      longitude: { $gte: lng - (r / (111.2 * Math.cos(lat * Math.PI / 180))), $lte: lng + (r / (111.2 * Math.cos(lat * Math.PI / 180))) },
    }).populate('landlord', 'name email phone');

    res.json({ properties });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create property (Landlord only)
router.post('/', auth, uploadMultiple, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('bedrooms').isInt({ min: 0 }).withMessage('Bedrooms must be a non-negative integer'),
  body('bathrooms').isInt({ min: 0 }).withMessage('Bathrooms must be a non-negative integer'),
  body('amenities').optional().isArray().withMessage('Amenities must be an array'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array().map(e => e.msg).join(', ') });
  }

  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({ message: 'Only landlords can create properties' });
    }

    const { title, description, location, price, bedrooms, bathrooms, amenities, tags } = req.body;
    const images = req.files['images'] ? req.files['images'].map(file => `/uploads/${file.filename}`) : [];
    const videos = req.files['videos'] ? req.files['videos'].map(file => `/uploads/${file.filename}`) : [];
    const floorPlans = req.files['floorPlans'] ? req.files['floorPlans'].map(file => `/uploads/${file.filename}`) : [];

    // Auto-tagging logic
    const autoTags = [];
    const text = (title + ' ' + description).toLowerCase();
    if (text.includes('pet')) autoTags.push('pet-friendly');
    if (text.includes('school')) autoTags.push('near schools');
    if (text.includes('parking')) autoTags.push('parking');
    const allTags = [...new Set([...(tags || []), ...autoTags])];

    const property = new Property({
      title,
      description,
      location,
      price,
      bedrooms,
      bathrooms,
      amenities,
      tags: allTags,
      images,
      videos,
      floorPlans,
      landlord: req.user.id,
      status: 'pending' // New properties are pending by default
    });

    await property.save();

    // Update landlord's listing progress and award badge
    const landlord = await User.findById(req.user.id);
    if (landlord && !landlord.listingProgress.firstPropertyListed) {
      landlord.listingProgress.firstPropertyListed = true;
      if (!landlord.badges.includes('First Lister')) {
        landlord.badges.push('First Lister');
      }
      await landlord.save();
    }

    console.log(`Property created by landlord: ${req.user.id}`);
    res.status(201).json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update property (Landlord only)
router.put('/:id', auth, uploadMultiple, [
  body('title').optional().trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim().notEmpty().withMessage('Description is required'),
  body('location').optional().trim().notEmpty().withMessage('Location is required'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('bedrooms').optional().isInt({ min: 0 }).withMessage('Bedrooms must be a non-negative integer'),
  body('bathrooms').optional().isInt({ min: 0 }).withMessage('Bathrooms must be a non-negative integer'),
  body('amenities').optional().isArray().withMessage('Amenities must be an array'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
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

    const { title, description, location, price, bedrooms, bathrooms, amenities, tags } = req.body;

    if (title) property.title = title;
    if (description) property.description = description;
    if (location) property.location = location;
    if (price) property.price = price;
    if (bedrooms) property.bedrooms = bedrooms;
    if (bathrooms) property.bathrooms = bathrooms;
    if (amenities) property.amenities = amenities;
    if (tags) property.tags = tags;

    if (req.files && Object.keys(req.files).length > 0) {
      if (req.files['images']) {
        property.images = req.files['images'].map(file => `/uploads/${file.filename}`);
      }
      if (req.files['videos']) {
        property.videos = req.files['videos'].map(file => `/uploads/${file.filename}`);
      }
      if (req.files['floorPlans']) {
        property.floorPlans = req.files['floorPlans'].map(file => `/uploads/${file.filename}`);
      }
    }

    await property.save();
    console.log(`Property updated by landlord: ${req.user.id}`);
    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/deals-of-the-day', async (req, res) => {
  try {
    const deals = await Property.find({ isDealOfTheDay: true })
      .populate('landlord', 'name email phone')
      .limit(5); // Limit to 5 deals
    res.json(deals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/recommendations', auth, async (req, res) => {
  try {
    const savedSearches = await SavedSearch.find({ user: req.user.id });

    if (savedSearches.length === 0) {
      return res.json([]);
    }

    // Combine filters from all saved searches
    let combinedQuery = {};
    savedSearches.forEach(search => {
      if (search.filters.location) combinedQuery.location = search.filters.location;
      if (search.filters.minPrice) combinedQuery.price = { ...combinedQuery.price, $gte: search.filters.minPrice };
      if (search.filters.maxPrice) combinedQuery.price = { ...combinedQuery.price, $lte: search.filters.maxPrice };
      if (search.filters.bedrooms) combinedQuery.bedrooms = { ...combinedQuery.bedrooms, $gte: search.filters.bedrooms };
      if (search.filters.propertyType) combinedQuery.propertyType = search.filters.propertyType;
      if (search.filters.amenities && search.filters.amenities.length > 0) {
        combinedQuery.amenities = { $all: search.filters.amenities };
      }
    });

    const recommendations = await Property.find(combinedQuery)
      .populate('landlord', 'name email phone')
      .limit(10); // Limit to 10 recommendations

    res.json(recommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// Admin: Update property status
router.put('/:id/status', auth, adminAuth, [
  body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
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

    property.status = req.body.status;
    await property.save();

    // Check for Super Landlord badge
    if (req.body.status === 'approved') {
      const landlord = await User.findById(property.landlord);
      if (landlord) {
        const approvedPropertiesCount = await Property.countDocuments({ landlord: landlord._id, status: 'approved' });
        if (approvedPropertiesCount >= 5 && !landlord.badges.includes('Super Landlord')) {
          landlord.badges.push('Super Landlord');
          await landlord.save();
          console.log(`Super Landlord badge awarded to ${landlord.email}`);
        }
      }
    }

    res.json({ message: `Property ${property.id} status updated to ${property.status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Clear property flag
router.put('/:id/clear-flag', auth, adminAuth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.flaggedReason = undefined; // Clear the flag
    // Optionally, set status back to pending if it was rejected due to flag, or keep approved
    // For now, we'll just clear the flag. Admin can manually approve/reject after.
    await property.save();

    res.json({ message: `Flag for property ${property.id} cleared.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});