import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    FirstName: { type: String, required: true, trim: true },
    LastName: { type: String, required: true, trim: true },
    UserName: { type: String, required: true, lowercase: true, trim: true },
    Email: { type: String, requires: true, unique: true },
    Password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
