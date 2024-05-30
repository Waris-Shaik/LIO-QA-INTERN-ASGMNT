import jwt from "jsonwebtoken";
import User from "../models/user.js";

const isAuthenticated = async function (req, res, next) {
  try {
    // Get the token from cookies
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Please login",
      });
    }

    // If token is present just decode it
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Assign user to req.user
    req.user = await User.findById(decode?._id).select("-Password");

    // Proceed to the next function
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      eror: error.message,
    });
  }
};

export default isAuthenticated;
