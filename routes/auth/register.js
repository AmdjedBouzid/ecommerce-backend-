const express = require("express");
const axios = require("axios");
const bcrypt = require("bcrypt");
const router = express.Router();
const Admin = require("../../models/Admin");
const { connectDB } = require("../../config/db");
const { registerSchema } = require("../../utils/validation");

/**
 * @method POST
 * @route http://localhost:5000/api/auth/register
 * @description Register admin for the first time
 * @access Public
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, phonenumber } = req.body;

    // Connect to the database
    await connectDB();

    // Validate request body
    const validation = registerSchema.safeParse({
      username,
      email,
      password,
      phonenumber,
    });
    console.log(validation);

    // If validation fails
    if (!validation.success) {
      return res
        .status(400)
        .json({ message: validation.error.errors[0].message });
    }

    // Verify email using external API (Hunter.io)
    const response = await axios.get(
      `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${process.env.EMAIL_VEREFICATION_API_KEY}`
    );

    // If email verification fails, send an error response
    if (response.data.data.status === "invalid") {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({});
    console.log("existingAdmin________", existingAdmin);
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const SALT_NUMBER = parseInt(process.env.SALT_NUMBER, 10);
    console.log("SALT_NUMBER", SALT_NUMBER);

    const hashedPassword = await bcrypt.hash(password, SALT_NUMBER);

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      phonenumber,
    });
    await newAdmin.save();

    // Send success response
    res.status(200).json({
      message: "Admin registered successfully",
      admin: newAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
