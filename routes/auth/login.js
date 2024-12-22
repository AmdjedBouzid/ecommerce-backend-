const express = require("express");
const axios = require("axios");
const bcrypt = require("bcrypt");
const Admin = require("../../models/Admin");
const Pin = require("../../models/Pin");
const { connectDB } = require("../../config/db");
const { registerSchema } = require("../../utils/validation");
const { generateRandomPin, Send_Email } = require("../../utils/functions");

const router = express.Router();

/**
 * @method POST
 * @route http://localhost:5000/api/auth/login
 * @description Login admin and send email with PIN code
 * @access Public
 */

router.post("/login", async (req, res) => {
  try {
    console.log("req_____________", req.body);

    await connectDB();

    // Parse the request body to get the admin data
    const { username, email, password, phonenumber } = req.body;
    console.log("request:", { username, email, password, phonenumber });

    const validation = registerSchema.safeParse({
      username,
      email,
      password,
      phonenumber,
    });

    if (!validation.success) {
      return res
        .status(400)
        .json({ message: validation.error.errors[0].message });
    }

    const response = await axios.get(
      `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${process.env.EMAIL_VEREFICATION_API_KEY}`
    );

    if (response.data.data.status === "invalid") {
      return res.status(400).json({ message: "Invalid email" });
    }

    const existingAdmin = await Admin.findOne({});
    if (!existingAdmin) {
      return res.status(403).json({ error: "No admin registered." });
    }

    const isUsernameValid = existingAdmin.username === username;
    const isEmailValid = existingAdmin.email === email;
    const isPhoneNumberValid = existingAdmin.phonenumber === phonenumber;
    const isPasswordValid = await bcrypt.compare(
      password,
      existingAdmin.password
    );

    if (
      !isUsernameValid ||
      !isEmailValid ||
      !isPhoneNumberValid ||
      !isPasswordValid
    ) {
      return res.status(403).json({ error: "Invalid login credentials." });
    }

    // Generate a random PIN code
    const pinCode = generateRandomPin();

    // Send the PIN via email
    const emailResponse = await Send_Email(email, pinCode);
    if (emailResponse.success === true) {
      try {
        // Check if there are existing PINs in the database and remove them
        const existingPins = await Pin.find({});
        if (existingPins.length > 0) {
          await Pin.deleteMany({});
        }

        // Save the new PIN
        const newPin = new Pin({ code: pinCode });
        await newPin.save();

        // Respond with success
        return res.status(200).json(emailResponse);
      } catch (error) {
        return res
          .status(404)
          .json({ message: "Error saving PIN code", error });
      }
    }

    return res.status(404).json(emailResponse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error", details: error });
  }
});

module.exports = router;
