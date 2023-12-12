const History = require('../models/History');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const HistoryController = {
  getAllHistories: async (req, res) => {
    try {
      const histories = await History.getAllHistories();
      res.json(histories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch histories' });
    }
  },

  createHistory: async (req, res) => {
    const userId = req.user.id; // Accessing userId from authenticated user
    const userToken = req.user.token; // Accessing token from authenticated user

    try {
      // Define the image path
      const imagePath = './src/public/static/images/test.png'; // Replace with your image path

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

      // Create history with predicted fruit (fruit from Flask response)
      const newHistory = await History.createHistory(userId, fruit, imagePath);

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
  },

  // other functions as needed
};

module.exports = HistoryController;
