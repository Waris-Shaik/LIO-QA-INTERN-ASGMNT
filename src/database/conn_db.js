import mongoose from "mongoose";

const ConnectToDB = async function () {
  if (!process.env.MONGO_URI || !process.env.DB_NAME) {
    console.log("Error DB_NAME, MONGO_URI is not defined in .env File");
    process.exit(1);
  }
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log(
      `Database connected successfully...🔥 host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Failed to connect to database", error.message);
    process.exit(1);
  }
};

export default ConnectToDB;
