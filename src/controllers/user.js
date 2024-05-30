import User from "../models/user.js";
import { passwordCritera, HashPassword } from "../utils/check_password.js";
import bcrypt from "bcrypt";
import sendCookie from "../utils/send_cookie.js";

export const register = async (req, res) => {
  try {
    // Get the data from req.body
    const { FirstName, LastName, UserName, Email, Password } = req.body;
    // Validate reuired fields
    if (!FirstName || !LastName || !UserName || !Email || !Password) {
      return res.status(400).json({
        success: false,
        error: "Please fill all requried fields",
      });
    }

    // Check if user exists
    let user = await User.findOne({ $or: [{ UserName }, { Email }] });
    if (user) {
      return res.status(409).json({
        success: false,
        error: "User already exists, Please login",
      });
    }

    // Check password criteria
    const passwordCriteraResult = passwordCritera(Password);
    if (!passwordCriteraResult.success) {
      return res.status(400).json(passwordCriteraResult);
    }

    // Hash and set the password
    const hashedPassword = await HashPassword(Password);
    const createUser = {
      FirstName,
      LastName,
      UserName,
      Email,
      Password: hashedPassword,
    };

    user = await User.create(createUser);

    // Send the cookie
    sendCookie(res, user);

    const showUser = await User.findById(user?._id).select(
      "-Password -createdAt -updatedAt"
    );

    // Return the success response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: showUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const login = async function (req, res) {
  try {
    const { text, password } = req.body;
    if (!text || !password) {
      return res.status(400).json({
        success: false,
        error: "Please fill all required fields",
      });
    }

    // Check if user not exists
    const user = await User.findOne({
      $or: [{ UserName: text }, { Email: text }],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found, Please register",
      });
    }
    // Match password
    const doesPasswordMatches = await bcrypt.compare(password, user?.Password);
    if (!doesPasswordMatches) {
      return res.status(401).json({
        success: false,
        error: "Incorrect password",
      });
    }

    // Send the cookie 🍪🍪
    sendCookie(res, user);

    // Return success response
    res.status(200).json({
      success: true,
      message: `Welcome back ${user?.UserName}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const logout = function (req, res) {
  // Clear the cookie and return the response
  res
    .cookie("token", "", {
      httponly: true,
      maxAge: 1,
      sameSite: process.env.NODE_ENV === "DEV" ? "lax" : "none",
      secure: process.env.NODE_ENV === "DEV" ? false : true,
    })
    .status(200)
    .json({
      success: true,
      message: "Successfully logged out",
    });
};

export const myProfile = async function (req, res) {
  try {
    const loggedInUser = await User.findById(req?.user?._id).select(
      "-Password"
    );
    if (!loggedInUser) {
      return res.status(404).json({
        success: false,
        error: "Please login",
      });
    }

    // Return the response
    res.status(200).json({
      success: true,
      user: loggedInUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
