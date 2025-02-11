const express = require("express");
const { connectDB } = require("../config/db");
const { VerifyAdmin } = require("../middleware");
const Brand = require("../models/Brand");
const { OrderSchemaValidation } = require("../utils/validation");
const { Global_Validation } = require("../utils/functions");
const Perfume = require("../models/Perfume");
const { faker } = require("@faker-js/faker");

const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const valid = Global_Validation(OrderSchemaValidation, req.body);
    if (!valid.status) {
      return res.status(400).json({ message: valid.message });
    }
    const {
      customerName,
      customerEmail,
      phoneNumber,
      perfumeInOrder,
      delivery,
    } = req.body;
    return res.status(200).json({ message: "hello" });
  } catch (error) {}
});
module.exports = router;
