const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get notifications for logged in user
// @access  Private
router.get('/', protect, (req, res) => {
  try {
    req.db.notifications.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .exec((err, notifications) => {
        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        res.status(200).json({
          success: true,
          count: notifications.length,
          data: notifications
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', protect, (req, res) => {
  try {
    req.db.notifications.findOne({ 
      _id: req.params.id,
      user: req.user._id
    }, (err, notification) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      
      if (!notification) {
        return res.status(404).json({ 
          success: false, 
          message: 'Notification not found' 
        });
      }
      
      req.db.notifications.update(
        { _id: req.params.id },
        { $set: { isRead: true } },
        {},
        (err) => {
          if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
          }
          
          res.status(200).json({
            success: true,
            data: { ...notification, isRead: true }
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