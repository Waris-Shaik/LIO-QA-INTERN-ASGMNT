import express from "express";
import {
  allProducts,
  allProductsHandler,
  deleteProduct,
  newProduct,
  singleProduct,
} from "../controllers/product.js";
import isAuthenticated from "../middlewares/auth.js";
import { myOrders, orderProduct, removeProduct } from "../controllers/order.js";

const router = express.Router();

router.get("/", allProducts); // get all products
router.post("/new", newProduct); // create  a new product (admin work not user)
router.get("/my-cart", isAuthenticated, myOrders); // get my-cart
router.post("/add-to-cart", isAuthenticated, orderProduct); // add a product to cart
router.post("/remove-from-cart", isAuthenticated, removeProduct); // remove a product from cart
router.get("/all", allProductsHandler); // read from csv file
router.get("/:productID", singleProduct); // get a single product
router.delete("/:productID", isAuthenticated, deleteProduct); // delete a product

export default router;
