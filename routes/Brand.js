const express = require("express");
const router = express.Router();
const { connectDB } = require("../config/db");
const { VerifyAdmin } = require("../middleware");
const Brand = require("../models/Brand");
const { BrandSchema } = require("../utils/validation");
const { Global_Validation } = require("../utils/functions");
const Perfume = require("../models/Perfume");
const { faker } = require("@faker-js/faker");

/**
 * @method POST
 * @route http://localhost:5000/api/Brand
 * @description Add a new brand (Admin)
 * @access Private
 */
router.post("/", async (req, res) => {
  try {
    await connectDB();

    let { name, img, description } = req.body;
    name = name.trim();
    img = img.trim();
    description = description.trim();

    const valid = Global_Validation(BrandSchema, { name, img, description });
    if (!valid.status) {
      return res.status(400).json({ message: valid.message });
    }

    const existingBrand = await Brand.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
    if (existingBrand) {
      return res.status(400).json({ message: "الشركة موجودة بالفعل" });
    }

    const newBrand = new Brand({ name, img, description });
    await newBrand.save();

    res.status(201).json({ message: "تمت إضافة الشركة بنجاح", data: newBrand });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "حدث خطأ في السيرفر، فشل في إضافة الشركة" });
  }
});

/**
 * @method GET
 * @route http://localhost:5000/api/Brand
 * @description Get all brands
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    await connectDB();
    const brands = await Brand.find().populate("Perfume");

    res.status(200).json({ message: "تم جلب الشركات بنجاح", brands });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في السيرفر، فشل في جلب الشركات" });
  }
});

/**
 * @method GET
 * @route http://localhost:5000/api/Brand/:id
 * @description Get brand by ID
 * @access Public
 */
router.get("/:id", async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const brand = await Brand.findById(id).populate("Perfume");

    if (!brand) {
      return res.status(404).json({ message: "الشركة غير موجودة" });
    }

    res.status(200).json(brand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في السيرفر، فشل في جلب الشركة" });
  }
});

/**
 * @method PUT
 * @route http://localhost:5000/api/Brand/:id
 * @description Update brand by ID (Admin)
 * @access Private
 */
router.put("/:id", async (req, res) => {
  try {
    await connectDB();

    let { name, img, description } = req.body;
    name = name.trim();
    img = img.trim();
    description = description.trim();

    const { id } = req.params;

    const valid = Global_Validation(BrandSchema, { name, img, description });
    if (!valid.status) {
      return res.status(400).json({ message: valid.message });
    }

    const existingBrand = await Brand.findOne({
      _id: id,
    });
    if (!existingBrand) {
      return res.status(400).json({ message: "الشركة غير موجودة" });
    }
    similarBrand = await Brand.find({
      name: name,
    });
    if (similarBrand.length > 1) {
      console.log(similarBrand);
      return res.status(404).json({ message: "الشركة موجودة في مخزنك من قبل" });
    }
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { name, img, description },
      { new: true }
    );

    if (!updatedBrand) {
      return res.status(404).json({ message: "الشركة غير موجودة" });
    }

    res
      .status(200)
      .json({ message: "تم تحديث الشركة بنجاح", data: updatedBrand });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في السيرفر، فشل في تحديث الشركة" });
  }
});

/**
 * @method DELETE
 * @route http://localhost:5000/api/Brand/:id
 * @description Delete brand by ID (Admin)
 * @access Private
 */
router.delete("/:id", async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "الشركة غير موجودة" });
    }

    await Perfume.deleteMany({ _id: { $in: brand.Perfume } });

    await Brand.findByIdAndDelete(id);

    res.status(200).json({ message: "تم حذف الشركة بنجاح" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في السيرفر، فشل في حذف الشركة" });
  }
});

/**
 * @method DELETE
 * @route http://localhost:5000/api/Brand/delete/all
 * @description Delete all brands and their products (Admin)
 * @access Private
 */
router.delete("/delete/all", async (req, res) => {
  try {
    await connectDB();
    const brands = await Brand.find();

    for (const brand of brands) {
      await Perfume.deleteMany({ _id: { $in: brand.Perfume } });
    }

    await Brand.deleteMany();
    res.status(200).json({ message: "تم حذف جميع الشركات ومنتجاتها بنجاح" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "خطأ في السيرفر، فشل في حذف جميع الشركات" });
  }
});

router.post("/generate", async (req, res) => {
  try {
    for (let i = 0; i < 20; i++) {
      await connectDB();
      const item = {
        name: faker.company.name().trim(),
        img: faker.image.url(),
        description: faker.commerce.productDescription(),
      };
      const existBrand = await Brand.findOne({ name: item.name });
      if (!existBrand) {
        const newBrand = new Brand(item);
        await newBrand.save();
      }
    }

    return res.status(200).json({ message: "Brands generated successfully" });
  } catch (error) {
    console.error("Error in /generate route:", error);
    return res
      .status(500)
      .json({ message: "Failed to generate brands", error });
  }
});

module.exports = router;
