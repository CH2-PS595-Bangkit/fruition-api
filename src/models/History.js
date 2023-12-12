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

  createHistory: async ({ userId, fruit, imagePath }) => {
    return await prisma.history.create({
      data: {
        userId,
        fruit,
        imagePath,
      },
    });
  },

  // Menambahkan fungsi-fungsi lain sesuai kebutuhan
};

module.exports = History;
