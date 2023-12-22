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
      // Membuat user baru dengan profile default (nama dan avatar kosong)
      const newUser = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          profile: {
            // Menambahkan profil untuk user baru dengan nilai default
            create: {},
          },
        },
        include: {
          profile: true, // Mengambil data profile yang terkait dengan user yang baru dibuat
        },
      });

      return newUser;
    } catch (error) {
      throw new Error("Failed to create user in the database.");
    }
  },

  getUserById: async (id) => {
    const parsedId = parseInt(id, 10);
    return await prisma.user.findUnique({
      where: {
        id: parsedId,
      },
    });
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
    return await prisma.user.findFirst({
      where: {
        token: token,
      },
    });
  },

  updateUser: async (id, userData) => {
    try {
      const parsedId = parseInt(id, 10);
      const updatedUserData = {};

      if (userData.password) {
        const hashedPassword = hashSync(userData.password, 10);
        updatedUserData.password = hashedPassword;
      }

      const updatedUser = await prisma.user.update({
        where: { id: parsedId },
        data: updatedUserData,
      });

      return updatedUser;
    } catch (error) {
      console.error("Error while updating user:", error);
      throw new Error("Failed to update user in the database.");
    }
  },
};

module.exports = User;
