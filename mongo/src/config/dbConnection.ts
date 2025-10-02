import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const uri = process.env.DATABASE_URI;
    if (!uri) {
      throw new Error("DATABASE_URI environment variable is not defined");
    }
    await mongoose.connect(uri);
  } catch (error) {
    console.error(error);
  }
};
