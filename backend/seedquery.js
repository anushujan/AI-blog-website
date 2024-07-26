//seedquery
const mongoose = require("mongoose");
const QueryResponse = require("./models/queryResponse");
const dotenv = require("dotenv");

dotenv.config();
// Define the data to seed
const seedData = [
  {
    query: ["hi"],
    response: "Hello How can i help you.",
  },
  {
    query: ["email"],
    response: "anushujan28@gmail.com",
  },

  {
    query: ["how to write a blog post"],
    response:
      "To write a blog post, start with an engaging title, create an outline of key points, write a compelling introduction, elaborate on each point in the body, and finish with a strong conclusion.",
  },
  {
    query: ["how to add images to a blog"],
    response:
      "To add images to your blog, use the image upload feature in the editor. Ensure images are optimized for web use and add descriptive alt text for accessibility.",
  },
  {
    query: ["how to optimize blog posts for SEO"],
    response:
      "To optimize blog posts for SEO, include relevant keywords in your title, headers, and throughout the content. Use meta descriptions, add internal and external links, and ensure your content is valuable and well-structured.",
  },
  {
    query: ["how to schedule a blog post"],
    response:
      "To schedule a blog post, use the scheduling feature in your content management system (CMS). Set the desired publish date and time, and the post will go live automatically at that time.",
  },
  {
    query: ["how to edit a blog post"],
    response:
      "To edit a blog post, go to your blog's dashboard, find the post you want to edit, click on the 'Edit' button, make the necessary changes, and save or update the post.",
  },
  {
    query: ["how to delete a blog post"],
    response:
      "To delete a blog post, go to your blog's dashboard, locate the post you wish to delete, click on the 'Delete' button, and confirm the deletion.",
  },
  {
    query: ["how to add tags to a blog post"],
    response:
      "To add tags to a blog post, use the tags feature in your blog editor. Enter relevant tags that describe the content of your post, which will help with categorization and SEO.",
  },
  {
    query: ["how to enable comments on a blog"],
    response:
      "To enable comments on your blog, go to your blog's settings and ensure the comments feature is turned on. You can also moderate comments to prevent spam and manage user interactions.",
  },
  {
    query: ["how to integrate social media with a blog"],
    response:
      "To integrate social media with your blog, use social sharing plugins or widgets that allow readers to share posts on their social media profiles. You can also add social media buttons to your blog for easier access.",
  },
  {
    query: ["how to analyze blog traffic"],
    response:
      "To analyze blog traffic, use web analytics tools such as Google Analytics. These tools provide insights into visitor behavior, traffic sources, and other key metrics to help you understand your audience.",
  },
  // Add more seed data as needed
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await QueryResponse.deleteMany({});

    // Insert seed data
    await QueryResponse.insertMany(seedData);

    console.log("Database seeded successfully");
  } catch (err) {
    console.error("Error seeding database:", err.message);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
};

// Seed the database
seedDatabase();
