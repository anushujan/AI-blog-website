const express = require('express');
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig');

const router = express.Router();

// Get all blogs
router.get('/', blogController.getBlogs);

// Create a new blog
router.post('/', upload.single('image'), blogController.createBlog);

// Get a blog by ID
router.get('/:id', blogController.getBlogById);

// Update a blog
router.put('/:id', blogController.updateBlog);

// Delete a blog
router.delete('/:id', blogController.deleteBlog);
// router.delete('/:id', authMiddleware, blogController.deleteBlog);


module.exports = router;