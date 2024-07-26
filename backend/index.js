const express = require("express");
const connectDB = require("./config/dbconfig");

const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const queryRouter = require("./routes/queryRouter");

const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const morgan = require("morgan");

require("dotenv").config();

const corsOptions = {
  origin: 'http://localhost:3000',// Replace with your front-end URL in production
  methods: ['GET', 'POST', 'PUT','PATCH' ,'DELETE'], // Add other HTTP methods as needed
  allowedHeaders: ['Content-Type', 'Authorization'], // Include necessary headers
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan("tiny"));


//========================================
//               storage size
//========================================
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

//========================================
//              image upload
//========================================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Connect to MongoDB
connectDB();

// API routes
app.use("/api", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/query", queryRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running successfully!' });
});
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome Satkunarasa Anushujan' });
});

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
