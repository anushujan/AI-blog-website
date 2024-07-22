const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const fs = require("fs");
const path = require("path");

// Function to save Image Base64 in upload folder
const saveImageFromBase64 = (base64Data, fileName) => {
  try {
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      throw new Error("Invalid base64 image format");
    }
    const imageType = matches[1];
    const imageBuffer = Buffer.from(matches[2], "base64");
    const imagePath = path.join(
      __dirname,
      "..",
      "uploads",
      `${fileName}.${imageType}`
    );

    // Check if the uploads folder exists
    if (!fs.existsSync(path.join(__dirname, "..", "uploads"))) {
      fs.mkdirSync(path.join(__dirname, "..", "uploads"));
    }

    fs.writeFileSync(imagePath, imageBuffer);
    return `${fileName}.${imageType}`; // Return only the filename
  } catch (err) {
    console.error("Error saving base64 image:", err);
    return null;
  }
};

//generateToken
const generateToken = (userId) => {
  const payload = {
    userId,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expiration time (adjust as needed)
  });
  return token;
};

//function login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found or password doesn't match, return error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return user details along with token
    res.json({
      token,
      _id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error logging in" });
  }
};

// Function to get users from the database
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving users from the database" });
  }
};

// Function to create a new user in the database
const createUser = async (req, res) => {
  const {
    firstname,
    lastname,
    phone,
    address,
    email,
    role,
    password,
    confirmPassword,
    image,
  } = req.body;

  // Generate a unique filename and save the image
  const uniqueFileName = `user-${Date.now()}`;
  const savedImageName = saveImageFromBase64(image, uniqueFileName);

  // if (!savedImageName) {
  //   throw new Error("Failed to save image");
  // }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    // Check if email already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create new user
    const newUser = new User({
      firstname,
      lastname,
      phone,
      address,
      email,
      image: savedImageName,
      role,
      password,
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id);

    // Construct the URL to access the saved image
    const baseUrl = `${req.protocol}://${req.get("host")}/uploads`;
    const imageURL = `${baseUrl}/${savedImageName}`;

    // Respond with token and user data
    res.status(201).json({
      token,
      email: newUser.email,
      role: newUser.role,
      imageURL,
      // Add any other relevant user data here
    });
  } catch (err) {
    console.error("Error creating a new user:", err);
    res.status(500).json({ error: "Error creating a new user" });
  }
};

// Function to update user in the database
const updateUser = async (req, res) => {
  const { firstname, lastname, phone, address, email, role, password, image } =
    req.body;
    console.log('====================================');
    console.log(image + firstname);
    console.log('====================================');

  try {
    // Find the user by ID
    let user = await User.findById(req.params.id);

    // If user not found, return error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Update user fields
    user.firstname = firstname;
    user.lastname = lastname;
    user.phone = phone;
    user.address = address;
    user.email = email;
    user.role = role;
    user.password = password;

    // Hash and update password if provided
    // if (password) {
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   user.password = hashedPassword;
    // }
    // Save the updated user

    // Check if image is provided for update
    if (image) {
      const base64Pattern = /^data:image\/(\w+);base64,(.+)$/;
      if (base64Pattern.test(image)) {
        // Generate a unique filename and save the image
        const uniqueFileName = `user-${Date.now()}`;
        const savedImageName = saveImageFromBase64(image, uniqueFileName);

        if (!savedImageName) {
          return res.status(500).json({ error: "Failed to save image" });
        }

        // Delete old image if it exists
        if (user.image) {
          const oldImagePath = path.join(__dirname, "..", "uploads", user.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        // Update user's image field
        user.image = savedImageName;
      } else {
        // If image is not a valid base64, skip updating the image
        console.warn('Invalid base64 image format');
      }
    }

    user = await user.save();

    // Construct the URL to access the saved image
    const baseUrl = `${req.protocol}://${req.get("host")}/uploads`;
    const imageURL = user.image ? `${baseUrl}/${user.image}` : null;

    // res.json(user);
    // Respond with updated user data
    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      imageURL,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating user" });
  }
};

// Function to delete user from the database
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId)
      .populate("followers", "firstname lastname")
      .populate("following", "firstname lastname");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get counts of followers and following
    const followersCount = user.followers.length;
    const followingCount = user.following.length;

    // Prepare user details object with counts
    const userDetails = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      password: user.password,
      image: user.image,
      followersCount,
      followingCount,
      followers: user.followers, // Array of detailed follower users
      following: user.following, // Array of detailed following users
    };

    res.json(userDetails);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error, failed to fetch user" });
  }
};

const followUser = async (req, res) => {
  const { userId, followId } = req.body;
  console.log("userid" + userId);
  console.log("followid" + followId);

  try {
    // Ensure userId and followId are provided
    if (!userId || !followId) {
      return res
        .status(400)
        .json({ error: "Both userId and followId are required" });
    }

    // Update following list for current user and followers list for the user to follow
    await User.findByIdAndUpdate(userId, {
      $addToSet: { following: followId },
    });
    await User.findByIdAndUpdate(followId, {
      $addToSet: { followers: userId },
    });

    res.status(200).json({ message: "Successfully followed user" });
  } catch (err) {
    console.error("Error following user:", err);
    res.status(500).json({ error: "Server error, failed to follow user" });
  }
};

const getFollowedUsers = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).populate(
      "following",
      "firstname lastname"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.following);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  const { userId, followId } = req.body;

  try {
    const user = await User.findById(userId);
    const followUser = await User.findById(followId);

    if (!user || !followUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.following.includes(followId)) {
      return res.status(400).json({ error: "Not following this user" });
    }

    user.following = user.following.filter((id) => id.toString() !== followId);
    followUser.followers = followUser.followers.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await followUser.save();

    res.status(200).json({ message: "Successfully unfollowed user" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  login,
  followUser,
  getFollowedUsers,
  unfollowUser,
};
