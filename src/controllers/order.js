import mongoose from "mongoose";
import Product from "../models/product.js";
import Cart from "../models/cart.js";

// Add-to-cart
export const orderProduct = async function (req, res) {
  try {
    const { productID, quantity } = req.body;

    // Validate required fields
    if (!productID && !quantity) {
      return res.status(200).json({
        success: false,
        error: "Please provide both productID and quantity",
      });
    }

    // Validate productID
    if (!productID || !mongoose.isValidObjectId(productID)) {
      return res.status(400).json({
        success: false,
        error: "Invalid productID",
      });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid quantity",
      });
    }

    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Total price
    const totalPrice = product?.Price * quantity;

    let cart = await Cart.findOne({ OrderBy: req?.user?._id });

    if (!cart) {
      console.log(cart);
      cart = await Cart.create({ OrderBy: req?.user?._id });
    }

    // Check if product already exists
    const existingProduct = cart?.Orders?.find(
      (order) => order?.ProductID.toString() === product?._id?.toString()
    );

    // if product exists just update it else push it in array
    if (existingProduct) {
      existingProduct.Quantity += quantity;
    } else {
      // Add item to cart
      cart.Orders.push({
        ProductID: product?._id,
        Name: product?.Name,
        Description: product?.Description,
        Quantity: quantity,
        Price: product?.Price,
        OrderBy: req?.user?._id,
      });
    }

    cart.TotalPrice += parseFloat(totalPrice.toFixed(2));

    await cart.save();

    // Return teh response
    res.status(200).json({
      success: true,
      message: "Added to cart successfully",
      totalPrice: cart?.TotalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Remove-from-cart
export const removeProduct = async function (req, res) {
  try {
    const { productID, quantity } = req.body;

    // Validate required fields
    if (!productID || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid productID and a positive quantity",
      });
    }

    // Validate productID
    if (!productID || !mongoose.isValidObjectId(productID)) {
      return res.status(400).json({
        success: false,
        error: "Invalid productID",
      });
    }

    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Total price
    const totalPrice = product?.Price * quantity;

    let cart = await Cart.findOne({ OrderBy: req?.user?._id });

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // Check if product already exists in the cart
    const existingProductIndex = cart?.Orders?.findIndex(
      (order) => order?.ProductID.toString() === product?._id?.toString()
    );

    // if product does not exists return error

    if (existingProductIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Product not found in the cart",
      });
    }

    // Decrease quantity or remove product from cart if quantity becomes zero
    const existingProduct = cart.Orders[existingProductIndex];

    if (quantity > existingProduct.Quantity) {
      cart.TotalPrice = 0;

      cart.Orders.splice(existingProductIndex, 1); // Remove product from cart
      await cart.save();
      // Return teh response
      return res.status(200).json({
        success: true,
        message: "Removed from cart successfully",
        totalPrice: cart?.TotalPrice,
      });
    }

    if (existingProduct.Quantity - quantity === 0) {
      cart.Orders.splice(existingProductIndex, 1); // Remove product from cart
    } else {
      existingProduct.Quantity -= quantity; // Decrease quantity
    }

    // Update total price

    cart.TotalPrice -= totalPrice.toFixed(2);

    await cart.save();

    // Return teh response
    res.status(200).json({
      success: true,
      message: "Removed from cart successfully",
      totalPrice: cart?.TotalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// See-my-cart
export const myOrders = async function (req, res) {
  try {
    const loggedInUser = await req?.user?._id;
    if (!loggedInUser) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    // Find the cart associated with the logged-in user
    const cart = await Cart.findOne({ OrderBy: loggedInUser });
    if (!cart) {
      return res.status(200).json({
        success: true,
        error: `You have 0 items in cart`,
      });
    }

    console.log(cart.Orders.length);
    if (cart.Orders.length > 0) {
      return res.status(200).json({
        success: true,
        totalPrice: cart.TotalPrice,
        status: cart.Status,
        orders: cart.Orders,
      });
    } else {
      return res.status(200).json({
        success: true,
        totalPrice: cart.TotalPrice,
        orders: cart.Orders,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
