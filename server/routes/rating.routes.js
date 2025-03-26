const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/ratings
// @desc    Create a rating
// @access  Private (NGOs only)
router.post('/', protect, authorize('ngo'), (req, res) => {
  try {
    const { donationId, rating, review } = req.body;
    
    if (!donationId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide donation ID and rating'
      });
    }
    
    // Check if donation exists and is completed
    req.db.donations.findOne({ 
      _id: donationId, 
      ngo: req.user._id,
      status: 'completed'
    }, (err, donation) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      
      if (!donation) {
        return res.status(404).json({ 
          success: false, 
          message: 'Donation not found or not completed' 
        });
      }
      
      // Check if already rated
      req.db.ratings.findOne({ donation: donationId }, (err, existingRating) => {
        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        if (existingRating) {
          return res.status(400).json({ 
            success: false, 
            message: 'You have already rated this donation' 
          });
        }
        
        // Create rating
        const newRating = {
          donation: donationId,
          donor: donation.donor,
          ngo: req.user._id,
          rating: parseInt(rating),
          review: review || '',
          createdAt: new Date()
        };
        
        req.db.ratings.insert(newRating, (err, savedRating) => {
          if (err) {
            console.error('Insert error:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
          }
          
          // Update donor's average rating
          req.db.ratings.find({ donor: donation.donor }, (err, allRatings) => {
            if (err) {
              console.error('Query error:', err);
              // Continue even if ratings fetch fails
            } else {
              // Calculate average rating
              let totalRating = 0;
              allRatings.forEach(r => {
                totalRating += r.rating;
              });
              
              const averageRating = allRatings.length > 0 ? 
                (totalRating / allRatings.length) : 0;
              
              // Update donor rating
              req.db.users.update(
                { _id: donation.donor },
                { $set: { rating: averageRating } },
                {},
                (err) => {
                  if (err) {
                    console.error('Update rating error:', err);
                  }
                }
              );
            }
          });
          
          res.status(201).json({
            success: true,
            data: savedRating
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/ratings/donor/:donorId
// @desc    Get all ratings for a donor
// @access  Public
router.get('/donor/:donorId', (req, res) => {
  try {
    req.db.ratings.find({ donor: req.params.donorId })
      .sort({ createdAt: -1 })
      .exec((err, ratings) => {
        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        // Calculate average
        let totalRating = 0;
        ratings.forEach(rating => {
          totalRating += rating.rating;
        });
        
        const averageRating = ratings.length > 0 ? 
          (totalRating / ratings.length).toFixed(1) : 0;
        
        res.status(200).json({
          success: true,
          count: ratings.length,
          averageRating,
          data: ratings
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;