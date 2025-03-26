module.exports = (io) => {
  // Store connected users
  const users = {};

  io.on('connection', (socket) => {
    console.log('New client connected');

    // User joined with ID
    socket.on('userConnected', (userId) => {
      users[userId] = socket.id;
      console.log('User connected:', userId);
    });

    // New food listing notification
    socket.on('newFoodListing', async (foodData) => {
      try {
        // Find NGOs within the area
        // In a real app, we'd use a geospatial query
        socket.db.users.find({ userType: 'ngo' }, (err, ngos) => {
          if (err) {
            console.error('Error finding NGOs:', err);
            return;
          }

          // Send notification to each NGO
          ngos.forEach(ngo => {
            if (users[ngo._id]) {
              io.to(users[ngo._id]).emit('foodAvailable', {
                food: foodData,
                message: 'New food available for pickup!'
              });
            }

            // Save notification to database
            const notification = {
              user: ngo._id,
              type: 'food_available',
              message: 'New food available for pickup!',
              data: { foodId: foodData._id },
              isRead: false,
              createdAt: new Date()
            };

            socket.db.notifications.insert(notification);
          });
        });
      } catch (error) {
        console.error('Socket error:', error);
      }
    });

    // Donation confirmed notification
    socket.on('donationConfirmed', async (data) => {
      try {
        if (users[data.donorId]) {
          io.to(users[data.donorId]).emit('donationAccepted', {
            donation: data,
            message: 'Your food donation has been accepted!'
          });
        }

        // Save notification
        const notification = {
          user: data.donorId,
          type: 'donation_accepted',
          message: 'Your food donation has been accepted!',
          data: { donationId: data._id },
          isRead: false,
          createdAt: new Date()
        };

        socket.db.notifications.insert(notification);
      } catch (error) {
        console.error('Socket error:', error);
      }
    });

    // Donation completed notification
    socket.on('donationCompleted', async (data) => {
      try {
        if (users[data.donorId]) {
          io.to(users[data.donorId]).emit('donationCompleted', {
            donation: data,
            message: 'Your donation has been picked up!'
          });
        }

        // Save notification
        const notification = {
          user: data.donorId,
          type: 'donation_completed',
          message: 'Your donation has been picked up!',
          data: { donationId: data._id },
          isRead: false,
          createdAt: new Date()
        };

        socket.db.notifications.insert(notification);
      } catch (error) {
        console.error('Socket error:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      // Remove user from connected users
      Object.keys(users).forEach(userId => {
        if (users[userId] === socket.id) {
          delete users[userId];
        }
      });
      console.log('Client disconnected');
    });
  });
};