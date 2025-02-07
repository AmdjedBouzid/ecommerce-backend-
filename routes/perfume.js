const express = require("express");
const router = express.Router();
const { connectDB } = require("../config/db");
const { GetAdmin } = require("../utils/functions");
const { VerifyAdmin } = require("../middleware");
const Category = require("../models/Brand");
const { categorySchema, PerfumeSchema } = require("../utils/validation");
const { Global_Validation } = require("../utils/functions");
const Product = require("../models/Perfume");
/**
 * @method POST
 * @route http://localhost:5000/api/product
 * @description  add product
 * @access private  verify admin by token
 */

router.post("/", VerifyAdmin, async (req, res) => {
  try {
    const valid = Global_Validation(productSchema, req.body);
    if (!valid.status) {
      return res.status(400).json({ message: valid.message });
    }

    await connectDB();
    const { name, price, description, sizes, images, category } = req.body;

    if (category.toLowerCase() === name.toLowerCase()) {
      return res.status(400).json({
        message: "Name of product and name of category are the same",
      });
    }

    const ExistCategoryWithSameName = await Category.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
    if (ExistCategoryWithSameName) {
      return res.status(400).json({
        message: "Category with the same name as your product already exists",
      });
    }

    const existingProduct = await Product.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
    if (existingProduct) {
      return res.status(409).json({
        message: "Product with this name already exists!",
      });
    }

    const CATEGORY = await Category.findOne({ name: category });
    if (!CATEGORY) {
      return res
        .status(404)
        .json({ message: "Category for product not found" });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      sizes,
      images,
      category,
    });

    await newProduct.save();

    CATEGORY.products.push(newProduct._id);
    await CATEGORY.save();

    return res.status(201).json({
      message: "Product added successfully!",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add product",
      error: error.message,
    });
  }
});

router.get("/many", VerifyAdmin, async (req, res) => {
  try {
    const Ids = req.body.IDs;
    await connectDB();
    if (!Ids) {
      res.status(400).json({ message: "Invalid IDs" });
    }

    for (let i = 0; i < Ids.length; i++) {
      console.log(Ids[i]);
    }
    return res.status(200).json({ message: "success to access to root", Ids });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

/**
 * @method GET
 * @route http://localhost:5000/api/product
 * @description  get all products product
 * @access private  verify admin by token
 */

router.get("/", VerifyAdmin, async (req, res) => {
  try {
    await connectDB();
    const All_Products = await Product.find();
    return res.status(200).json(All_Products);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "internal server error", error });
  }
});

/**
 * @method GET
 * @route http://localhost:5000/api/product/:id
 * @description  get single product by id
 * @access private  verify admin by token
 */

router.get("/:id", VerifyAdmin, async (req, res) => {
  try {
    await connectDB();

    const Product_Id = req.params.id;

    const Product_Finded = await Product.findById(Product_Id);

    if (!Product_Finded) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product found successfully", Product_Finded });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

/**
 * @method DELETE
 * @route http://localhost:5000/api/product/:id
 * @description  delete single product by id
 * @access private  verify admin by token
 */
router.delete("/:id", VerifyAdmin, async (req, res) => {
  try {
    const Product_Id = req.params.id;
    await connectDB();

    const Product_Finded = await Product.findById(Product_Id);

    if (!Product_Finded) {
      return res.status(404).json({ message: "Product not found" });
    }

    const category_name = Product_Finded.category;

    const category = await Category.findOne({ name: category_name });
    if (!category) {
      return res.status(404).json({ message: "Category of product not found" });
    }

    category.products = category.products.filter(
      (id) => id.toString() !== Product_Id
    );

    await category.save();

    await Product.deleteOne({ _id: Product_Id });

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

/**
 * @method DELETE
 * @route http://localhost:5000/api/product/:id
 * @description  delete single product by id
 * @access private  verify admin by token
 */
router.put("/:id", VerifyAdmin, async (req, res) => {
  try {
    const valid = Global_Validation(productSchema, req.body);
    if (!valid.status) {
      return res.status(400).json({ message: valid.message });
    }

    const Product_Id = req.params.id;
    await connectDB();

    const { name, price, description, sizes, images, category } = req.body;

    const Old_Product = await Product.findById(Product_Id);
    if (!Old_Product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const New_Product = await Product.findByIdAndUpdate(
      { _id: Product_Id },
      { $set: { name, price, description, sizes, images, category } },
      { new: true }
    );

    console.log("Old_Product", Old_Product, "New_Product", New_Product);

    if (Old_Product.category !== New_Product.category) {
      const Old_Category = await Category.findOne({
        name: Old_Product.category,
      });

      const New_Category = await Category.findOne({
        name: New_Product.category,
      });

      if (Old_Category) {
        Old_Category.products = Old_Category.products.filter(
          (p) => p.toString() !== Product_Id
        );
        await Old_Category.save();
      }

      if (New_Category) {
        New_Category.products.push(Product_Id);
        await New_Category.save();
      }
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product: New_Product,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

/**
 * @method GET
 * @route http://localhost:5000/api/product/search/:name
 * @description  delete single product by id
 * @access private  verify admin by token
 */

router.get("/search/:name", VerifyAdmin, async (req, res) => {
  try {
    await connectDB();

    const searchQuery = req.params.name;

    if (!searchQuery) {
      return res.status(400).json({ message: "Search query missing" });
    }

    const products = await Product.find({
      name: { $regex: searchQuery, $options: "i" },
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json({
      message: "Products found successfully",
      products,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

/**
 * @method GET
 * @route http://localhost:5000/api/product/many
 * @description  delete single product by id
 * @access private  verify admin by token
 */

module.exports = router;
