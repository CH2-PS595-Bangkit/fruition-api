const { compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const User = require("../models/User");

const AuthController = {
  login: async (req, res) => {
    const { username, email, password } = req.body;
    try {
      let user = null;
      if (username) {
        user = await User.getUserByUsername(username);
      } else if (email) {
        user = await User.getUserByEmail(email);
      }

      if (!user) {
        return res.json({
          success: 0,
          data: "Invalid email, username, or password",
        });
      }

      const passwordMatch = compareSync(password, user.password);
      if (passwordMatch) {
        const { id, username, email } = user;
        const token = sign({ id, username, email }, "your-secret-key", {
          expiresIn: "30d",
        });

        // Update user's token in the database
        await User.updateUserToken(id, token);

        return res.json({
          success: 1,
          message: "Login successful",
          token,
        });
      } else {
        return res.json({
          success: 0,
          data: "Invalid email, username, or password",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Failed to perform login",
      });
    }
  },

  authenticateToken: async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.sendStatus(401);
    }

    try {
      const user = await User.getUserByToken(token);
      if (!user) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  },
};

module.exports = AuthController;
