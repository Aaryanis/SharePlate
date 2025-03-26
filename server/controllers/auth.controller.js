const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate token
const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET || 'shareplate_secret_key', 
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, userType, phone, address, location, isAnonymous, organization } = req.body;

    // Validate required fields
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email, password and user type' 
      });
    }

    // Check if user exists
    req.db.users.findOne({ email }, async (err, userExists) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      
      if (userExists) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const newUser = {
        name,
        email,
        password: hashedPassword,
        userType, // 'donor' or 'ngo'
        phone: phone || '',
        address: address || '',
        organization: organization || '',
        isAnonymous: isAnonymous || false,
        credits: 0, // Starting credits
        rating: 0, // Starting rating
        totalDonations: 0,
        location: location || {
          type: 'Point',
          coordinates: [78.9629, 20.5937] // Default to center of India
        },
        createdAt: new Date()
      };

      req.db.users.insert(newUser, (err, user) => {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({ success: false, message: 'Server error' });
        }

        // Generate token
        const token = generateToken(user._id);

        // Return success response
        res.status(201).json({
          success: true,
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            userType: user.userType,
            phone: user.phone,
            address: user.address,
            organization: user.organization,
            isAnonymous: user.isAnonymous,
            credits: user.credits,
            rating: user.rating,
            location: user.location
          }
        });
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // Check for user
    req.db.users.findOne({ email }, async (err, user) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Check if password matches
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user._id);

      // Return success response
      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          phone: user.phone,
          address: user.address,
          organization: user.organization,
          isAnonymous: user.isAnonymous,
          credits: user.credits,
          rating: user.rating,
          location: user.location
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // User is already available in req.user from the auth middleware
    // Remove password from response
    const { password, ...userData } = req.user;
    
    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};