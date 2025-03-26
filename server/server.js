require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const Datastore = require('nedb');
const socketio = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const foodRoutes = require('./routes/food.routes');
const donationRoutes = require('./routes/donation.routes');
const ratingRoutes = require('./routes/rating.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Create data directory for NeDB if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Database setup - initialize NeDB collections
const db = {};
db.users = new Datastore({ filename: path.join(dataDir, 'users.db'), autoload: true });
db.food = new Datastore({ filename: path.join(dataDir, 'food.db'), autoload: true });
db.donations = new Datastore({ filename: path.join(dataDir, 'donations.db'), autoload: true });
db.ratings = new Datastore({ filename: path.join(dataDir, 'ratings.db'), autoload: true });
db.notifications = new Datastore({ filename: path.join(dataDir, 'notifications.db'), autoload: true });

// Create indexes for faster queries
db.users.ensureIndex({ fieldName: 'email', unique: true });
db.food.ensureIndex({ fieldName: 'donor' });
db.donations.ensureIndex({ fieldName: 'food' });
db.donations.ensureIndex({ fieldName: 'ngo' });
db.ratings.ensureIndex({ fieldName: 'donation' });
db.notifications.ensureIndex({ fieldName: 'user' });

// Make db accessible to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Socket.io middleware - pass db to socket handlers
io.use((socket, next) => {
  socket.db = db;
  next();
});

// Set up socket.io
require('./utils/socket')(io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/notifications', notificationRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('SharePlate API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));