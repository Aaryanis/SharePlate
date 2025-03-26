const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/donations
// @desc    Create a donation (NGO claims food)
// @access  Private (NGOs only)
router.post('/', protect, authorize('ngo'), (req, res) => {
  try {
    const { foodId, pickupTime, notes } = req.body;
    
    if (!foodId || !pickupTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide food ID and pickup time'
      });
    }
    
    // Check if food exists and is available
    req.db.food.findOne({ _id: foodId, isAvailable: true }, (err, food) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      
      if (!food) {
        return res.status(404).json({ 
          success: false, 
          message: 'Food not found or already claimed' 
        });
      }
      
      // Create donation record
      const newDonation = {
        food: foodId,
        donor: food.donor,
        ngo: req.user._id,
        ngoName: req.user.name,
        ngoOrganization: req.user.organization,
        pickupTime: new Date(pickupTime),
        notes: notes || '',
        status: 'scheduled', // scheduled, completed, cancelled
        createdAt: new Date()
      };
      
      req.db.donations.insert(newDonation, (err, donation) => {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        // Mark food as unavailable
        req.db.food.update(
          { _id: foodId },
          { $set: { isAvailable: false } },
          {},
          (err) => {
            if (err) {
              console.error('Update error:', err);
              // Don't return error, continue with donation
            }
          }
        );
        
        // Emit socket event for donation confirmation
        req.app.get('io').emit('donationConfirmed', {
          ...donation,
          foodDetails: food
        });
        
        res.status(201).json({
          success: true,
          data: {
            ...donation,
            foodDetails: food
          }
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/donations/:id/complete
// @desc    Mark donation as completed
// @access  Private (NGOs only)
router.put('/:id/complete', protect, authorize('ngo'), (req, res) => {
  try {
    // Find donation
    req.db.donations.findOne({ _id: req.params.id }, (err, donation) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      
      if (!donation) {
        return res.status(404).json({ 
          success: false, 
          message: 'Donation not found' 
        });
      }
      
      // Make sure the NGO is the one who claimed the food
      if (donation.ngo !== req.user._id) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authorized to update this donation' 
        });
      }
      
      // Update donation status
      req.db.donations.update(
        { _id: req.params.id },
        { $set: { status: 'completed', completedAt: new Date() } },
        {},
        (err) => {
          if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
          }
          
          // Get updated donation
          req.db.donations.findOne({ _id: req.params.id }, (err, updatedDonation) => {
            if (err || !updatedDonation) {
              return res.status(404).json({ 
                success: false, 
                message: 'Donation not found after update' 
              });
            }
            
            // Update donor credits
            req.db.users.update(
              { _id: updatedDonation.donor },
              { $inc: { credits: 10, totalDonations: 1 } }, // Add 10 credits per donation
              {},
              (err) => {
                if (err) {
                  console.error('Update credits error:', err);
                  // Continue even if credits update fails
                }
              }
            );
            
            // Emit socket event for donation completion
            req.app.get('io').emit('donationCompleted', updatedDonation);
            
            res.status(200).json({
              success: true,
              data: updatedDonation
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

// @route   GET /api/donations/donor
// @desc    Get all donations for logged in donor
// @access  Private (Donors only)
router.get('/donor', protect, authorize('donor'), (req, res) => {
  try {
    req.db.donations.find({ donor: req.user._id })
      .sort({ createdAt: -1 })
      .exec((err, donations) => {
        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        // Get food details for each donation
        const populatedDonations = [];
        let fetchedCount = 0;
        
        if (donations.length === 0) {
          return res.status(200).json({
            success: true,
            count: 0,
            data: []
          });
        }
        
        donations.forEach(donation => {
          req.db.food.findOne({ _id: donation.food }, (err, food) => {
            fetchedCount++;
            
            if (!err && food) {
              populatedDonations.push({
                ...donation,
                foodDetails: food
              });
            } else {
              populatedDonations.push(donation);
            }
            
            if (fetchedCount === donations.length) {
              // All food details fetched, send response
              res.status(200).json({
                success: true,
                count: populatedDonations.length,
                data: populatedDonations
              });
            }
          });
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/donations/ngo
// @desc    Get all donations for logged in NGO
// @access  Private (NGOs only)
router.get('/ngo', protect, authorize('ngo'), (req, res) => {
  try {
    req.db.donations.find({ ngo: req.user._id })
      .sort({ createdAt: -1 })
      .exec((err, donations) => {
        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        // Get food details for each donation
        const populatedDonations = [];
        let fetchedCount = 0;
        
        if (donations.length === 0) {
          return res.status(200).json({
            success: true,
            count: 0,
            data: []
          });
        }
        
        donations.forEach(donation => {
          req.db.food.findOne({ _id: donation.food }, (err, food) => {
            fetchedCount++;
            
            if (!err && food) {
              populatedDonations.push({
                ...donation,
                foodDetails: food
              });
            } else {
              populatedDonations.push(donation);
            }
            
            if (fetchedCount === donations.length) {
              // All food details fetched, send response
              res.status(200).json({
                success: true,
                count: populatedDonations.length,
                data: populatedDonations
              });
            }
          });
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;