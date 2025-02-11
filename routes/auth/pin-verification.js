const express = require("express");
const router = express.Router();
const { connectDB } = require("../../config/db"); // Adjust the path as needed
const Pin = require("../../models/Pin");
const Admin = require("../../models/Admin");
const jwt = require("jsonwebtoken");

/**
 * @method POST
 * @route http://://localhost:5000/api/auth/pin-verification
 * @description التحقق من المستخدم باستخدام رمز PIN
 * @access عام
 */
router.post("/pin-verification", async (req, res) => {
  try {
    await connectDB();

    const { Code_Pink } = req.body;
    console.log(" { Code_Pink } ", { Code_Pink });

    const PINS = await Pin.find({});
    if (PINS.length > 1) {
      await Pin.deleteMany({});
      return res
        .status(500)
        .json({ message: "تم العثور على عدة أكواد PIN مخزنة!" });
    }

    if (PINS.length === 0) {
      return res
        .status(500)
        .json({ message: "لم يتم العثور على أي كود PIN مخزن!" });
    }

    const date1 = new Date(PINS[0].createdAt);
    const date2 = new Date();
    console.log("date1", date1);
    console.log("date2", date2);
    const diffInMilliseconds = date2.getTime() - date1.getTime();

    const diffInSeconds = diffInMilliseconds / 1000;
    console.log(`الفرق بالثواني: ${diffInSeconds}`);
    if (diffInSeconds > 1000) {
      await Pin.deleteMany({});
      return res.status(404).json({ message: "انتهت صلاحية الرمز!" });
    }

    if (Code_Pink === PINS[0].code) {
      await Pin.deleteMany({});
      const admin = await Admin.findOne({});

      if (!admin) {
        return res
          .status(404)
          .json({ error: "لم يتم العثور على حساب المدير!" });
      }

      const userToken = {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        phonenumber: admin.phonenumber,
      };

      const token = jwt.sign(userToken, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      return res.status(200).json({
        message: "تم تسجيل الدخول بنجاح",
        token,
      });
    } else {
      return res.status(400).json({ message: "رمز PIN غير صحيح!" });
    }
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "خطأ داخلي في الخادم!" });
  }
});

module.exports = router;
