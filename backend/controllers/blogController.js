const fs = require("fs");
const path = require("path");
const Blog = require("../models/blogModel");

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

// Get all blogs with pagination
const getBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // Number of blogs per page

  try {
    const count = await Blog.countDocuments();
    const blogs = await Blog.find()
      .populate("author", "firstname lastname")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by descending creation date

    const baseUrl = `${req.protocol}://${req.get("host")}/uploads`;

    // Add full URL for image
    const blogsWithFullImageUrl = blogs.map((blog) => ({
      ...blog.toObject(),
      image: blog.image ? `${baseUrl}/${blog.image}` : null,
    }));

    res.json({
      blogs: blogsWithFullImageUrl,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalBlogs: count,
    });
  } catch (err) {
    console.error("Error retrieving blogs:", err);
    res.status(500).json({ error: "Error retrieving blogs" });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, image, content, author,classification } = req.body;

    console.log("====================================");
    console.log("create" + image);
    console.log("classification" + classification);
    console.log("====================================");

    // Validate input data
    if (!title || !image || !content || content.length === 0 || !author) {
      throw new Error("Blog title, image, content, and author are required");
    }

    // Generate a unique filename and save the image
    const uniqueFileName = `blog-${Date.now()}`;
    const savedImageName = saveImageFromBase64(image, uniqueFileName);

    if (!savedImageName) {
      throw new Error("Failed to save image");
    }

    // Create the blog
    const newBlog = new Blog({
      title,
      image: savedImageName, // Store only the filename
      content,
      author,
      classification 
    });

    await newBlog.save();

    // Construct the URL to access the saved image
    const baseUrl = `${req.protocol}://${req.get("host")}/uploads`;
    const imageURL = `${baseUrl}/${savedImageName}`;

    res.status(201).json({ ...newBlog.toObject(), imageURL });
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(400).json({ error: err.message });
  }
};

// Get a blog by ID
const getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id).populate(
      "author",
      "firstname lastname"
    );
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}/uploads`;
    const blogWithFullImageUrl = {
      ...blog.toObject(),
      image: blog.image ? `${baseUrl}/${blog.image}` : null,
    };

    res.json(blogWithFullImageUrl);
  } catch (err) {
    console.error("Error retrieving blog:", err);
    res.status(500).json({ error: "Error retrieving blog" });
  }
};

// Update a blog by ID
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, author,image } = req.body;

  // console.log("====================================");
  // console.log("update" + image);
  // console.log("====================================");

  try {
    let blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Check if the current user is authorized to update this blog
    if (blog.author.toString() !== author) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this blog" });
    }

    if (image) {
      // Generate a unique filename and save the image
      const uniqueFileName = `blog-${Date.now()}`;
      const savedImageName = saveImageFromBase64(image, uniqueFileName);

      if (!savedImageName) {
        return res.status(500).json({ error: "Failed to save image" });
      }

      // Delete old image if it exists
      if (blog.image) {
        const oldImagePath = path.join(__dirname, "..", "uploads", blog.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Update user's image field
      blog.image = savedImageName;
    }

    // Update other blog fields
    if (title) blog.title = title;
    if (content) blog.content = content; // Assign content directly

    // Save the updated blog
    await blog.save();

    // Construct the image URL
    const imageUrl = blog.image
      ? `${req.protocol}://${req.get("host")}/uploads/${blog.image}`
      : null;

    res.json({ ...blog.toObject(), imageUrl });
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ error: "Error updating blog" });
  }
};

// Delete a blog by ID
const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    let blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Delete the blog image file from uploads folder
    if (blog.image) {
      fs.unlinkSync(path.join(__dirname, "..", "uploads", blog.image));
    }

    await Blog.findByIdAndDelete(id);
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ error: "Error deleting blog" });
  }
};

module.exports = {
  getBlogs,
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
};
