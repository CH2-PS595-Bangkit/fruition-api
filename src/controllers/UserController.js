const User = require("../models/User");
const AuthController = require("./AuthController");
const { validationResult } = require('express-validator');
const { sign } = require("jsonwebtoken");
const { sendMail } = require("../utils/emailSender");

const UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },

  createUser: async (req, res) => {
    const { email, username, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const existingUser = await User.getUserByEmail(email);
      const existingUsername = await User.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Email is already registered" });
      }
      if (existingUsername) {
        return res.status(400).json({ error: "Username is already registered" });
      }

      const newUser = await User.createUser(email, username, password);
      const { id } = newUser;

      return res.status(201).json({
        success: 1,
        message: "User created successfully",
        userId: id,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Failed to create user. Please try again later.",
      });
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Generate a new random password
      const newPassword = generateRandomPassword(); // Implement your own password generation logic

      // Update the user's password in the database
      await User.updatePassword(user.id, newPassword);

      // Send the new password to the user's email
      await sendMail({
        to: email,
        subject: "Password Reset",
        text: `Your new password is: ${newPassword}`,
      });

      return res.status(200).json({
        success: 1,
        message: "New password sent to your email",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Failed to reset password. Please try again later.",
      });
    }
  },
};

module.exports = UserController;
