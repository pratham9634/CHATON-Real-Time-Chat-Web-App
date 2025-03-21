import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URl;

if (!MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined in environment variables.");
}

export const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            console.log("Already connected to MongoDB");
            return;
        }

        await mongoose.connect(MONGODB_URL);

        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        throw new Error("Database connection failed");
    }
};
