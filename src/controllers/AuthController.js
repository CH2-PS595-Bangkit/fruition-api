const { compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const User = require('../models/User');

const AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.getUserByEmail(email);
      if (!user) {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }

      const passwordMatch = compareSync(password, user.password);
      if (passwordMatch) {
        const { id } = user;
        const token = sign({ id, email }, "your-secret-key", {
          expiresIn: "30d",
        });
        return res.json({
          success: 1,
          message: "Login successful",
          token,
        });
      } else {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Failed to perform login',
      });
    }
  },
};

module.exports = AuthController;
