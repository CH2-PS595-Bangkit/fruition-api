const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { hashSync, compareSync } = require("bcrypt");

const User = {
  getAllUsers: async () => {
    return await prisma.user.findMany();
  },

  createUser: async (email, password) => {
    const hashedPassword = hashSync(password, 10);

    try {
      return await prisma.user.create({
        data: {
          email,
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

  // Add other necessary functions
};

module.exports = User;
