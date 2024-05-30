import jwt from "jsonwebtoken";

const sendCookie = function (res, user) {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined in .env file");
  }

  // Create a token
  const token = jwt.sign({ _id: user?._id }, process.env.JWT_SECRET_KEY);

  // Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "DEV" ? "lax" : "none",
    secure: process.env.NODE_ENV === "DEV" ? false : true,
  });

  return token;
};

export default sendCookie;
