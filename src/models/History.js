// src/model/History.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const History = {
  getAllHistories: async () => {
    return await prisma.history.findMany();
  },

  getAllHistoriesByUserId: async (userId) => {
    return await prisma.history.findMany({
      where: {
        userId: userId,
      },
    });
  },

  createHistory: async ({ userId, fruit, imagePath, accuracy }) => {
    return await prisma.history.create({
      data: {
        userId,
        fruit,
        accuracy,
        imagePath,
      },
    });
  },

  deleteHistoryById: async (historyId) => {
    const parsedId = parseInt(historyId, 10); // Parse historyId ke tipe data Integer
    return await prisma.history.delete({
      where: {
        id: parsedId,
      },
    });
  },
  
  
  getHistoryById: async (historyId) => {
    const parsedId = parseInt(historyId, 10); // Parse historyId ke tipe data Integer
    return await prisma.history.findUnique({
      where: {
        id: parsedId,
      },
    });
  },

  // Menambahkan fungsi-fungsi lain sesuai kebutuhan
};

module.exports = History;
