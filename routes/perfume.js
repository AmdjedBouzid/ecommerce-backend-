const express = require("express");
const router = express.Router();
const { connectDB } = require("../config/db");
const { VerifyAdmin } = require("../middleware");
const Brand = require("../models/Brand");
const Perfume = require("../models/Perfume");
const { PerfumeSchema } = require("../utils/validation");
const { Global_Validation } = require("../utils/functions");
const { faker } = require("@faker-js/faker");

/**
 * @method POST
 * @route http://localhost:5000/api/Perfume
 * @description إضافة عطر جديد
 * @access خاص (للمسؤولين فقط)
 */
router.post("/", async (req, res) => {
  try {
    const valid = Global_Validation(PerfumeSchema, req.body);
    if (!valid.status) {
      return res.status(400).json({ message: valid.message });
    }

    await connectDB();
    const { name, description, bottles, images, brandId } = req.body;

    const existingPerfume = await Perfume.findOne({
      name: new RegExp(`^${name}$`, "i"),
      brandId: brandId,
    });

    if (existingPerfume) {
      return res.status(409).json({ message: "العطر موجود في مخزنك من قبل" });
    }

    const BRAND = await Brand.findById(brandId);
    if (!BRAND) {
      return res.status(404).json({ message: "لم يتم العثور على شركة المنتج" });
    }

    const newPerfume = new Perfume({
      name,
      description,
      bottles,
      images,
      brandId: brandId,
    });

    await newPerfume.save();
    BRAND.Perfume.push(newPerfume._id);
    await BRAND.save();

    return res.status(201).json({
      message: "تمت إضافة العطر بنجاح",
      Perfume: newPerfume,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "خطأ في الخادم، فشل إضافة المنتج",
      error: error.message,
    });
  }
});

/**
 * @method GET
 * @route http://localhost:5000/api/Perfume?page=1&limit=6
 * @description  الحصول على جميع العطور
 * @access خاص (للمسؤولين فقط)
 */
router.get("/", async (req, res) => {
  try {
    await connectDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const perfumes = await Perfume.find().skip(skip).limit(limit);
    return res.json(perfumes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطأ أثناء جلب العطور", error });
  }
});

/**
 * @method GET
 * @route http://localhost:5000/api/Perfume/:id
 * @description  الحصول على عطر معين عبر الـ ID
 * @access خاص (للمسؤولين فقط)
 */
router.get("/:id", async (req, res) => {
  try {
    await connectDB();
    const PerfumeId = req.params.id;
    const PerfumeFounded = await Perfume.findById(PerfumeId);

    if (!PerfumeFounded) {
      return res.status(404).json({ message: "لم يتم العثور على المنتج" });
    }

    return res
      .status(200)
      .json({ message: "تم العثور على العطر بنجاح", PerfumeFounded });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "خطأ داخلي في الخادم", error });
  }
});

/**
 * @method DELETE
 * @route http://localhost:5000/api/Perfume/:id
 * @description  حذف عطر معين عبر الـ ID
 * @access خاص (للمسؤولين فقط)
 */
router.delete("/:id", async (req, res) => {
  try {
    const PerfumeId = req.params.id;
    await connectDB();
    const PerfumeFind = await Perfume.findById(PerfumeId);
    if (!PerfumeFind) {
      return res.status(404).json({ message: "العطر غير موجود" });
    }
    const BrandId = PerfumeFind.brandId;
    const BRAND = await Brand.findById(BrandId);
    if (!BRAND) {
      return res.status(404).json({ message: "لم يتم العثور على الشركة" });
    }
    BRAND.Perfume = BRAND.Perfume.filter(
      (item) => item.toString() !== PerfumeId
    );
    await BRAND.save();
    await Perfume.deleteOne({ _id: PerfumeId });

    return res.status(200).json({ message: "تم حذف العطر بنجاح" });
  } catch (error) {
    console.error("خطأ أثناء حذف العطر:", error);
    return res.status(500).json({ message: "خطأ داخلي في الخادم", error });
  }
});

/**
 * @method PUT
 * @route http://localhost:5000/api/Perfume/:id
 * @description  تحديث بيانات العطر
 * @access خاص (للمسؤولين فقط)
 */
router.put("/:id", async (req, res) => {
  try {
    const PerfumeId = req.params.id;
    const valid = Global_Validation(PerfumeSchema, req.body);
    if (!valid.status) {
      return res.status(400).json({ message: valid.message });
    }

    await connectDB();
    const { name, description, bottles, images, brandId } = req.body;

    const existingPerfume = await Perfume.findById(PerfumeId);
    if (!existingPerfume) {
      return res.status(404).json({ message: "العطر غير موجود" });
    }

    const duplicatePerfume = await Perfume.findOne({
      name: new RegExp(`^${name}$`, "i"),
      brandId: brandId,
      _id: { $ne: PerfumeId },
    });

    if (duplicatePerfume) {
      return res
        .status(409)
        .json({ message: "يوجد بالفعل عطر بنفس الاسم في هذه الشركة" });
    }

    existingPerfume.name = name;
    existingPerfume.description = description;
    existingPerfume.bottles = bottles;
    existingPerfume.images = images;
    existingPerfume.brandId = brandId;

    await existingPerfume.save();

    return res.status(200).json({
      message: "تم تحديث العطر بنجاح",
      Perfume: existingPerfume,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "خطأ في الخادم، فشل تحديث المنتج",
      error: error.message,
    });
  }
});

/**
 * @method POST
 * @route http://localhost:5000/api/Perfume/generate
 * @description  إنشاء بيانات عطور عشوائية
 * @access خاص (للمسؤولين فقط)
 */
router.post("/generate", async (req, res) => {
  try {
    await connectDB();
    const Brands = await Brand.find();
    if (Brands.length === 0) {
      return res
        .status(400)
        .json({ message: "لا توجد شركات في قاعدة البيانات" });
    }

    for (let i = 0; i < 100; i++) {
      const randomIndex = faker.number.int({ min: 0, max: Brands.length - 1 });
      const brand = Brands[randomIndex];
      const perfumeName = faker.commerce.productName();
      const existingPerfume = await Perfume.findOne({
        name: perfumeName,
        brandId: brand._id,
      });

      if (existingPerfume) {
        console.log(
          `تخطي العطر المكرر: ${perfumeName} في الشركة ${brand.name}`
        );
        continue;
      }

      const newPerfume = await Perfume.create({
        name: perfumeName,
        description: faker.commerce.productDescription(),
        bottles: [{ size: 50, price: 100 }],
        images: [faker.image.url()],
        brandId: brand._id,
      });

      await Brand.updateOne(
        { _id: brand._id },
        { $push: { Perfume: newPerfume._id } }
      );
    }

    return res.status(200).json({ message: "تم إنشاء العطور بنجاح" });
  } catch (error) {
    console.error("خطأ في /generate:", error);
    return res.status(500).json({ message: "فشل إنشاء العطور", error });
  }
});

module.exports = router;
