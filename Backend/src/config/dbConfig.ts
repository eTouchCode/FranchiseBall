import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error("MONGO_URI is not defined in the environment variables.");
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected!");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
    process.exit(1);
  }
}

export default connectDB;