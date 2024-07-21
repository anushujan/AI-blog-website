const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/userModel");
require("dotenv").config();

// Function to establish connection to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

// Function to seed admin user
const seedAdminUser = async () => {
  try {
    // Clear all existing users
    await User.deleteMany({});
    // Check if admin user exists
    const adminUser = await User.findOne({ email: "admin@gmail.com" });

    // If admin user doesn't exist, create it
    if (!adminUser) {
      const newUser = new User({
        firstname: "Admin",
        lastname: "User",
        phone: "1234567890",
        address: "jaffna",
        email: "admin@gmail.com",
        password: "password", // Change 'password' to the desired password
        role: "admin",
      });
      await newUser.save();
      console.log("Admin user created successfully");

      // Generate JWT token for the admin user
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      console.log("JWT token for admin user:", token);
    } else {
      console.log("Admin user already exists");
    }
  } catch (err) {
    console.error("Error seeding admin user:", err);
  }
};

// Function to close database connection
const closeDBConnection = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB connection closed");
  } catch (err) {
    console.error("Error closing MongoDB connection:", err.message);
    process.exit(1);
  }
};

// Connect to MongoDB, seed admin user, and then close connection
const seedDB = async () => {
  await connectDB();
  await seedAdminUser();
  await closeDBConnection();
};

// Call the seedDB function to execute the seeding process
seedDB();
