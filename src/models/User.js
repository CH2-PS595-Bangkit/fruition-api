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
    return await prisma.user.findUnique({
      where: {
        id,
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
};

module.exports = User;
