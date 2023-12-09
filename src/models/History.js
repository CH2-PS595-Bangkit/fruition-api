// src/model/History.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const History = {
  getAllHistories: async () => {
    return await prisma.history.findMany();
  },

  createHistory: async (userId, fruit, fruitImg) => {
    return await prisma.history.create({
      data: {
        userId,
        fruit,
        fruitImg,
      },
    });
  },

  // Menambahkan fungsi-fungsi lain sesuai kebutuhan
};

module.exports = History;
