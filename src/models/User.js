const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { hashSync, compareSync } = require("bcrypt");

const User = {
  getAllUsers: async () => {
    return await prisma.user.findMany();
  },

  createUser: async (email, username, password) => {
    const hashedPassword = hashSync(password, 10);

    try {
      return await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });
    } catch (error) {
      throw new Error("Failed to create user in the database.");
    }
  },

  getUserByEmail: async (email) => {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  getUserByUsername: async (username) => {
    return await prisma.user.findUnique({
      where: {
        username,
      },
    });
  },
  
  updateUserToken: async (userId, token) => {
    return await prisma.user.update({
      where: { id: userId },
      data: { token: token },
    });
  },

  getUserByToken: async (token) => {
    return await prisma.user.findUnique({
      where: { token: token },
    });
  },
};

module.exports = User;
