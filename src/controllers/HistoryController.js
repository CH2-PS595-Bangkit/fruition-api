const History = require('../models/History');

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
    const { userId, fruit, fruitImg } = req.body;
    try {
      const newHistory = await History.createHistory(userId, fruit, fruitImg);
      res.status(201).json(newHistory);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create history' });
    }
  },

  // tambahkan fungsi lainnya sesuai kebutuhan
};

module.exports = HistoryController;
