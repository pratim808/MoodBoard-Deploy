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
app.use(cors());
app.use(fileUpload());
app.use(express.json());

// Serve uploaded images with correct path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In-memory storage
let moodEntries = [];

// POST /post endpoint
app.post('/post', (req, res) => {
  const { text } = req.body;
  const image = req.files?.image;
  const timestamp = new Date().toISOString();

  let imagePath = null;
  if (image) {
    const filename = `${Date.now()}-${image.name}`;
    imagePath = `/uploads/${filename}`; // Store with leading /uploads/ for consistency
    image.mv(path.join(__dirname, 'uploads', filename), err => {
      if (err) {
        console.error('Error uploading image:', err);
        return res.status(500).send('Error uploading image');
      }
    });
  }

  const entry = { text, image: imagePath, timestamp };
  moodEntries.push(entry);
  res.status(201).send('Mood posted successfully');
});

// GET /feed endpoint
app.get('/feed', (req, res) => {
  res.json(moodEntries);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});