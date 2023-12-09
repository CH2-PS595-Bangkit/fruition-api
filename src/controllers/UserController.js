const User = require('../models/User');
const AuthController = require('./AuthController');

const UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  },

  createUser: async (req, res) => {
    const { email, password } = req.body;
    try {
      const newUser = await User.createUser(email, password);
      const { id } = newUser;
      const token = sign({ id, email }, "your-secret-key", {
        expiresIn: "1h",
      });

      return res.status(201).json({
        success: 1,
        message: "User created successfully",
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Failed to create user',
      });
    }
  },

  login: AuthController.login,

  // Add other necessary functions
};

module.exports = UserController;
