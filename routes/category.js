const express = require("express");
const router = express.Router();
const { connectDB } = require("../config/db");
const { GetAdmin } = require("../utils/functions");
const { VerifyAdmin } = require("../middleware");
const Category = require("../models/Category");
const { categorySchema } = require("../utils/validation");
const { Global_Validation } = require("../utils/functions");
const Product = require("../models/Product");
/**
 * @method POST
 * @route http://localhost:5000/api/category
 * @description verify admin by token
 * @access public
 */
router.post("/", async (req, res) => {
  try {
    // console.log(req);
    const { name, img, description } = req.body;
    console.log({ name, img, description });
    const valid = Global_Validation(categorySchema, {
      name,
      img,
      description,
    });

    if (!valid.status) {
      return res.status(400).json({ message: valid.message });
    }

    await connectDB();

    const existingCategory = await Category.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });

    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists" });
    }

    const newCategory = new Category({
      name,
      img,
      description,
    });

    await newCategory.save();

    res
      .status(201)
      .json({ message: "category created successfully", data: newCategory });
  } catch (error) {
    console.error(error);

    res
      .status(500)
      .json({ message: "Server error, unable to create category" });
  }
});

/**
 * @method GET
 * @route http://localhost:5000/api/category
 * @description get all categories
 * @access Private
 */

router.get("/", async (req, res) => {
  try {
    await connectDB();
    const categorys = await Category.find().populate("products");

    res.status(200).json({ message: "Success fetching categories", categorys });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, error fetching categories" });
  }
});

/**
 * @method GET
 * @route http://localhost:5000/api/category/:name
 * @description get category by name
 * @access public
 */
router.get("/:name", async (req, res) => {
  try {
    await connectDB();
    const { name } = req.params;

    // Assuming you are using a MongoDB model named 'Category'
    const category = await Category.findOne({ name }).populate("products");

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @method PUT
 * @route http://localhost:5000/api/category/:name
 * @description update category
 * @access public
 */
router.put("/:name", async (req, res) => {
  try {
    await connectDB();
    const { name, img, description } = req.body;
    console.log({ name, img, description });
    const currentName = req.params.name;
    const Current_Collection = await Category.findOne({
      name: new RegExp(`^${currentName}$`, "i"),
    });
    if (!Current_Collection) {
      return res.status(404).json({ message: "No Category found " });
    }
    const valid = Global_Validation(categorySchema, {
      name,
      img,
      description,
    });
    if (!valid.status) {
      return res.status(400).json({ message: valid.message });
    }

    const existingCategory = await Category.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });

    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists" });
    }

    var updatedCategory = await Category.findOneAndUpdate(
      { name: currentName },
      { name, img, description },
      { new: true }
    ).populate("products");

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, unable to update category" });
  }
});

/**
 * @method DELETE
 * @route http://localhost:5000/api/category/:name
 * @description DELETE category
 * @access public
 */

router.delete("/:name", async (req, res) => {
  try {
    await connectDB();
    const currentName = req.params.name;
    const Current_Collection = await Category.findOne({ name: currentName });

    if (!Current_Collection) {
      return res.status(404).json({ message: "No Category found " });
    }
    // console.log(
    //   "Current_Collection",
    //   Current_Collection.products,
    //   "______",
    //   currentName
    // );
    Current_Collection.products.forEach(async function (element, index, array) {
      await Product.deleteOne({ id: element });
    });
    await Category.deleteOne({ name: currentName });
    return res.status(200).json({ message: "category deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
});

/**
 * @method DELETE
 * @route http://localhost:5000/api/category/delete
 * @description DELETE delete all categorys
 * @access public
 */

router.delete("/delete/all", VerifyAdmin, async (req, res) => {
  try {
    await connectDB();
    const Categorys = await Category.find();
    console.log("Categorys", Categorys);

    Categorys.forEach((cat) => {
      cat.products.forEach(async (id) => {
        await Product.deleteOne({ _id: id });
      });
    });

    await Category.deleteMany();
    res.status(200).json({
      message: "All categories and their products deleted successfully",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

module.exports = router;
