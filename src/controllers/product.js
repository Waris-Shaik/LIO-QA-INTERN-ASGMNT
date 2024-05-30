import mongoose from "mongoose";
import Product from "../models/product.js";
import fs from "fs";
import csv from "csv-parser";

// Create a new product mainly admin cretaes products

export const newProduct = async function (req, res) {
  try {
    // Get the data from req.body
    const { Name, Description, Price } = req.body;
    // Validate required fields
    if (!Name || !Price) {
      return res.status(400).json({
        success: false,
        error: "Please fill all required fields",
      });
    }

    if (!Name && !Description) {
      return res.status(400).json({
        success: false,
        error: "Please fill all required fields",
      });
    }

    const product = await Product.create({ Name, Description, Price });
    // Return the response
    res.status(200).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Retreive all products from database
export const allProducts = async function (req, res) {
  try {
    // Retreive all the products from the database
    const products = await Product.find();
    // Return the response
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Retreive a single product from database
export const singleProduct = async function (req, res) {
  try {
    const { productID } = req.params;
    if (!productID) {
      return res.status(400).json({
        success: false,
        error: "ProductID is required",
      });
    }

    if (!mongoose.isValidObjectId(productID)) {
      return res.status(400).json({
        success: false,
        error: "ProductID is invalid",
      });
    }

    // Retreive product in the database
    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Return the success response
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Read from .csv file
export const allProductsHandler = function (req, res) {
  const products = [];

  fs.createReadStream("src/products.csv")
    .pipe(csv())
    .on("data", (row) => {
      products.push(row);
    })
    .on("end", () => {
      console.log("Product data loaded successfully...");
      console.log(products);
      res.status(200).json({
        success: true,
        products,
      });
    })
    .on("error", (err) => {
      console.log("Error reading CSV file: ", err);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    });
};

// Delete the product

export const deleteProduct = async function (req, res) {
  try {
    const { productID } = req.params;
    if (!productID) {
      return res.status(400).json({
        success: false,
        error: "ProductID is required",
      });
    }

    if (!mongoose.isValidObjectId(productID)) {
      return res.status(400).json({
        success: false,
        error: "ProductID is invalid",
      });
    }

    // Retreive product in the database
    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Delete the product
    await Product.findByIdAndDelete(productID);

    // Return the reponse
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
