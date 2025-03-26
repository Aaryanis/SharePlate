const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get user profile
// @access  Private
router.get('/me', protect, (req, res) => {
  try {
    const { password, ...userData } = req.user;
    
    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', protect, (req, res) => {
  try {
    const { name, phone, address, organization, isAnonymous, location } = req.body;
    
    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (organization) updateData.organization = organization;
    if (isAnonymous !== undefined) updateData.isAnonymous = isAnonymous;
    if (location) updateData.location = location;
    
    req.db.users.update(
      { _id: req.user._id }, 
      { $set: updateData },
      {},
      (err) => {
        if (err) {
          console.error('Update error:', err);
          return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        // Get updated user data
        req.db.users.findOne({ _id: req.user._id }, (err, user) => {
          if (err || !user) {
            return res.status(404).json({ 
              success: false, 
              message: 'User not found' 
            });
          }
          
          // Remove password from response
          const { password, ...userData } = user;
          
          res.status(200).json({
            success: true,
            data: userData
          });
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/users/donors
// @desc    Get top donors (leaderboard)
// @access  Public
router.get('/donors', (req, res) => {
  try {
    req.db.users.find({ userType: 'donor' })
      .sort({ credits: -1 })
      .limit(10)
      .exec((err, donors) => {
        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        // Remove sensitive info
        const sanitizedDonors = donors.map(donor => {
          const { password, email, phone, ...donorData } = donor;
          
          // If donor is anonymous, remove name
          if (donor.isAnonymous) {
            donorData.name = 'Anonymous Donor';
          }
          
          return donorData;
        });
        
        res.status(200).json({
          success: true,
          count: sanitizedDonors.length,
          data: sanitizedDonors
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/users/ngos
// @desc    Get all NGOs
// @access  Public
router.get('/ngos', (req, res) => {
  try {
    req.db.users.find({ userType: 'ngo' })
      .sort({ rating: -1 })
      .exec((err, ngos) => {
        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        // Remove sensitive info
        const sanitizedNgos = ngos.map(ngo => {
          const { password, email, ...ngoData } = ngo;
          return ngoData;
        });
        
        res.status(200).json({
          success: true,
          count: sanitizedNgos.length,
          data: sanitizedNgos
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;