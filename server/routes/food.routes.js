const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../utils/fileUpload');

const router = express.Router();

// @route   POST /api/food
// @desc    Create a food listing
// @access  Private (Donors only)
router.post('/', protect, authorize('donor'), upload.array('images', 5), (req, res) => {
  try {
    const { 
      title, 
      description, 
      foodType, 
      quantity, 
      freshUntil, 
      pickupInstructions, 
      location 
    } = req.body;
    
    // Handle uploaded files
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push(file.filename);
      });
    }
    
    // Create food object
    const newFood = {
      title,
      description,
      foodType,
      quantity,
      freshUntil: new Date(freshUntil),
      images,
      location: JSON.parse(typeof location === 'string' ? location : JSON.stringify(location)),
      pickupInstructions,
      donor: req.user._id,
      isAnonymousDonor: req.user.isAnonymous,
      donorName: req.user.isAnonymous ? 'Anonymous Donor' : req.user.name,
      donorOrganization: req.user.organization,
      isAvailable: true,
      createdAt: new Date()
    };
    
    req.db.food.insert(newFood, (err, food) => {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      
      // Emit socket event for nearby NGOs
      req.app.get('io').emit('newFoodListing', food);
      
      res.status(201).json({
        success: true,
        data: food
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/food
// @desc    Get all food listings
// @access  Public
router.get('/', (req, res) => {
  try {
    const query = { isAvailable: true };
    
    // Filter by donor if specified
    if (req.query.donor) {
      query.donor = req.query.donor;
    }
    
    // Location-based query
    if (req.query.lat && req.query.lng && req.query.distance) {
      // In a full implementation, we would perform geospatial query here
      // With NeDB, we'll skip this for simplicity
    }
    
    req.db.food.find(query)
      .sort({ createdAt: -1 })
      .exec((err, foods) => {
        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        res.status(200).json({
          success: true,
          count: foods.length,
          data: foods
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/food/:id
// @desc    Get single food listing
// @access  Public
router.get('/:id', (req, res) => {
  try {
    req.db.food.findOne({ _id: req.params.id }, (err, food) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      
      if (!food) {
        return res.status(404).json({ success: false, message: 'Food not found' });
      }
      
      res.status(200).json({
        success: true,
        data: food
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/food/:id
// @desc    Update food listing
// @access  Private (Food's donor only)
router.put('/:id', protect, upload.array('images', 5), (req, res) => {
  try {
    req.db.food.findOne({ _id: req.params.id }, (err, food) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      
      if (!food) {
        return res.status(404).json({ success: false, message: 'Food not found' });
      }
      
      // Make sure user is the food's donor
      if (food.donor !== req.user._id) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authorized to update this food' 
        });
      }
      
      // Handle uploaded files
      const images = [...(food.images || [])];
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          images.push(file.filename);
        });
      }
      
      // Build update object
      const updateData = { ...req.body };
      
      if (images.length > 0) {
        updateData.images = images;
      }
      
      if (req.body.location) {
        updateData.location = JSON.parse(typeof req.body.location === 'string' ? 
          req.body.location : JSON.stringify(req.body.location));
      }
      
      if (req.body.freshUntil) {
        updateData.freshUntil = new Date(req.body.freshUntil);
      }
      
      req.db.food.update(
        { _id: req.params.id },
        { $set: updateData },
        {},
        (err) => {
          if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
          }
          
          // Get updated food data
          req.db.food.findOne({ _id: req.params.id }, (err, updatedFood) => {
            if (err || !updatedFood) {
              return res.status(404).json({ 
                success: false, 
                message: 'Food not found after update' 
              });
            }
            
            res.status(200).json({
              success: true,
              data: updatedFood
            });
          });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/food/:id/unavailable
// @desc    Mark food as unavailable
// @access  Private (Food's donor only)
router.put('/:id/unavailable', protect, (req, res) => {
  try {
    req.db.food.findOne({ _id: req.params.id }, (err, food) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      
      if (!food) {
        return res.status(404).json({ success: false, message: 'Food not found' });
      }
      
      // Make sure user is the food's donor
      if (food.donor !== req.user._id) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authorized to update this food' 
        });
      }
      
      req.db.food.update(
        { _id: req.params.id },
        { $set: { isAvailable: false } },
        {},
        (err) => {
          if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
          }
          
          // Get updated food data
          req.db.food.findOne({ _id: req.params.id }, (err, updatedFood) => {
            if (err || !updatedFood) {
              return res.status(404).json({ 
                success: false, 
                message: 'Food not found after update' 
              });
            }
            
            res.status(200).json({
              success: true,
              data: updatedFood
            });
          });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;