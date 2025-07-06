const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware

// === START OF CORS CONFIGURATION ===

// Define the list of websites that are allowed to make requests to this server
const allowedOrigins = [
  'http://localhost:8080', // For local development
  'https://moodboard-deploy-frontend.onrender.com' // Your deployed frontend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from the whitelist, and also non-browser requests (like from curl or Postman)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Use the new CORS options
app.use(cors(corsOptions));

// === END OF CORS CONFIGURATION ===

app.use(fileUpload());
app.use(express.json());

// Serve uploaded images with correct path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In-memory storage
let moodEntries = [];

// // POST /post endpoint
// app.post('/post', (req, res) => {
//   const { text } = req.body;
//   const image = req.files?.image;
//   const timestamp = new Date().toISOString();

//   let imagePath = null;
//   if (image) {
//     const filename = `${Date.now()}-${image.name}`;
//     imagePath = `/uploads/${filename}`; // Store with leading /uploads/ for consistency
//     image.mv(path.join(__dirname, 'uploads', filename), err => {
//       if (err) {
//         console.error('Error uploading image:', err);
//         return res.status(500).send('Error uploading image');
//       }
//     });
//   }

//   const entry = { text, image: imagePath, timestamp };
//   moodEntries.push(entry);
//   res.status(201).send('Mood posted successfully');
// });



app.post('/post', (req, res) => {
  const { text } = req.body;
  const image = req.files?.image;
  const timestamp = new Date().toISOString();

  // --- CASE 1: The post includes an image ---
  if (image) {
    const filename = `${Date.now()}-${image.name}`;
    const imagePath = `/uploads/${filename}`; // The public URL path for the image
    const savePath = path.join(__dirname, 'uploads', filename); // Where to save it on the server's disk

    // Move the file, and handle the response INSIDE the callback.
    // This is the critical change.
    image.mv(savePath, (err) => {
      // If saving the file fails, log it and send a server error response.
      if (err) {
        console.error('Error saving image:', err);
        return res.status(500).send('Error saving image');
      }

      // If saving succeeds, THEN create the entry, add it, and send a success response.
      const entry = { text, image: imagePath, timestamp };
      moodEntries.push(entry);
      console.log('Posted new entry with image:', entry);
      // It's good practice to send the new entry back as JSON.
      res.status(201).json(entry);
    });

  // --- CASE 2: The post has NO image ---
  } else {
    // If there's no image, the logic is simple.
    const entry = { text, image: null, timestamp };
    moodEntries.push(entry);
    console.log('Posted new entry without image:', entry);
    res.status(201).json(entry);
  }
});

// (Optional but Recommended) Add a root route for health checks.
// This will fix the "Cannot GET /" message when you visit the base URL.
app.get('/', (req, res) => {
  res.send('Moodboard API is running!');
});

// GET /feed endpoint
app.get('/feed', (req, res) => {
  res.json(moodEntries);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});