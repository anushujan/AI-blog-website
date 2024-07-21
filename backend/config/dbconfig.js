const mongoose = require('mongoose');
require('dotenv').config();

const dbConfig = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(dbConfig, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
