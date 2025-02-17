const express = require("express");
const { Global_Validation } = require("../utils/functions");
const Order = require("../models/Order");
const { orderSchema } = require("../utils/validation");
const { connectDB } = require("../config/db");
const Perfume = require("../models/Perfume");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const valid = Global_Validation(orderSchema, req.body);
    if (!valid.status) {
      return res.status(400).json({ message: valid.message });
    }

    let {
      customerName,
      customerFamilyName,
      customerEmail,
      phonenumber,
      perfumeInOrder,
      delivery,
    } = req.body;
    customerName = customerName?.trim();
    customerEmail = customerEmail?.trim();
    phonenumber = phonenumber.map((pn) => pn.trim());
    customerFamilyName = customerFamilyName?.trim();
    const totalPrice = perfumeInOrder.reduce((sum, item) => {
      return (
        sum +
        item.bottles.reduce(
          (bottleSum, bottle) => bottleSum + bottle.price * bottle.quantity,
          0
        )
      );
    }, delivery.price);

    await connectDB();
    for (const pr of perfumeInOrder) {
      const existingPerfume = await Perfume.findById(pr.Perfume);

      if (!existingPerfume) {
        return res.status(404).json({
          message: "أحد العطور غير موجود في المخزون",
          perfumeId: pr.Perfume,
        });
      }
      const availableSizes = existingPerfume.bottles.map(
        (bottle) => bottle.size
      );

      for (const bottle of pr.bottles) {
        if (!availableSizes.includes(bottle.size)) {
          return res.status(400).json({
            message: `الحجم ${bottle.size} غير متوفر لهذا العطر`,
            perfumeId: pr.Perfume,
          });
        }
      }
    }

    const newOrder = new Order({
      customerName,
      customerFamilyName,
      customerEmail,
      phonenumber,
      perfumeInOrder,
      delivery,
      totalPrice,
    });
    // console.log(newOrder);
    await newOrder.save();

    return res.status(201).json({
      message: "تم إنشاء الطلب بنجاح",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error saving order:", error);
    return res.status(500).json({ message: "حدث خطأ أثناء حفظ الطلب" });
  }
});

module.exports = router;
