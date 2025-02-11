const express = require("express");
const axios = require("axios");
const bcrypt = require("bcrypt");
const Admin = require("../../models/Admin");
const Pin = require("../../models/Pin");
const { connectDB } = require("../../config/db");
const { registerSchema } = require("../../utils/validation");
const { generateRandomPin, Send_Email } = require("../../utils/functions");
const { VerifyAdmin } = require("../../middleware");
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
      return res.status(403).json({ message: "معلومات تسجيل الدخول خاطئة" });
    }
    const pinCode = generateRandomPin();
    const emailResponse = await Send_Email(email, pinCode);
    if (emailResponse.success === true) {
      try {
        const existingPins = await Pin.find({});
        if (existingPins.length > 0) {
          await Pin.deleteMany({});
        }

        const newPin = new Pin({ code: pinCode });
        await newPin.save();

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
router.post("/me", VerifyAdmin, async (req, res) => {
  try {
    const admin = req.admin;
    const returnAdmin = {
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      phonenumber: admin.phonenumber,
      profileImg: admin.profileImg,
    };

    return res.status(200).json({ message: "admin found", admin: returnAdmin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error", details: error });
  }
});
module.exports = router;
