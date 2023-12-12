const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');

const History = require('../models/History');

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()); // Generating unique filenames
  },
});
const upload = multer({ storage: storage }).single('file'); // 'file' should match the field name in your form

const HistoryController = {
  getAllHistories: async (req, res) => {
    try {
      const userId = req.user.id; // Accessing userId from authenticated user

      // Retrieve histories by userId
      const histories = await History.getAllHistoriesByUserId(userId);

      res.json(histories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch histories' });
    }
  },


  createHistory: (req, res) => {
    // Handle file upload using multer middleware
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: 'Multer error' });
      } else if (err) {
        return res.status(500).json({ error: err });
      }

      const userId = req.user.id; // Accessing userId from authenticated user
      const userToken = req.user.token; // Accessing token from authenticated user

      try {
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }

        const imagePath = req.file.path;

        const formData = new FormData();
        formData.append('file', fs.createReadStream(imagePath));

        const config = {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${userToken}`,
          },
        };

        const flaskResponse = await axios.post('http://localhost:5000/predict', formData, config);

        // Extract predicted class and accuracy from Flask response JSON
        const { fruit, prediction_accuracy } = flaskResponse.data;

        // Create history with predicted fruit (fruit from Flask response) and save imagePath to database
        const newHistory = await History.createHistory({
          userId: userId,
          fruit: fruit,
          imagePath: imagePath, // Saving imagePath to the database
        });

        // Respond with the newly created history and prediction details
        res.status(201).json({
          newHistory,
          fruit,
          prediction_accuracy,
        });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to create history or get prediction' });
      }
    });
  },

  // Other functions as needed
};

module.exports = HistoryController;
