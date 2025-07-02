require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const profileRoutes = require('./routes/profile');
const ratingsRoutes = require('./routes/ratings');
const transactionsRoutes = require('./routes/transactions');
const auctionsRoutes = require('./routes/auctions');
const backgroundChecksRoutes = require('./routes/backgroundChecks');
const savedSearchesRoutes = require('./routes/savedSearches');

console.log('authRoutes type:', typeof authRoutes);
console.log('propertyRoutes type:', typeof propertyRoutes);
console.log('profileRoutes type:', typeof profileRoutes);

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Environment variable validation
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Error: Cloudinary configuration is not fully defined in environment variables.');
  process.exit(1);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/auctions', auctionsRoutes);
app.use('/api/backgroundChecks', backgroundChecksRoutes);
app.use('/api/savedSearches', savedSearchesRoutes);
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/reviews', require('./routes/reviews'));

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Test route
app.get('/', (req, res) => {
  res.send('Rentify API is running');
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('sendMessage', async (data) => {
    const { conversationId, sender, receiver, content } = data;
    const message = new Message({ conversationId, sender, receiver, content });
    await message.save();

    io.to(conversationId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
