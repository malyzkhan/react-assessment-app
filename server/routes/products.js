import adminAuth from "../middleware/adminAuth.js";
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/products
// Return all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
});

// POST /api/products
// Create a product
router.post("/", adminAuth, async (req, res) => {
      try {
    const { name, price, stock } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid product name is required",
      });
    }

    if (
      price === undefined ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    if (
      stock === undefined ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a non-negative whole number",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      price,
      stock,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
});


router.post("/purchase/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        stock: { $gt: 0 },
      },
      {
        $inc: { stock: -1 },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      const existingProduct = await Product.findById(req.params.id);

      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(409).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Purchase successful",
      data: product,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    console.error("Purchase failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Purchase failed",
    });
  }
});


export default router;
