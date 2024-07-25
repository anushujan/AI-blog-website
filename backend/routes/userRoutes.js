const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to get users
router.get('/users', userController.getUsers);

// Route to create a new user
router.post('/users', userController.createUser);

// GET user by ID
router.get('/users/:id', userController.getUserById);

// Route to update a user
router.put('/users/:id', userController.updateUser);

// Route to delete a user
router.delete('/users/:id', userController.deleteUser);

// Route for user login
router.post('/login', userController.login);

// Route to follow a user
router.post('/users/follow', userController.followUser);

router.post('/users/unfollow', userController.unfollowUser);

// Get followed users for logged-in user
router.get('/users/:id/followed',userController.getFollowedUsers);

// In routes/blogRoutes.js or a similar file
router.get('/users/:id/blogs', userController.getUserBlogs);


module.exports = router;
