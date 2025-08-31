import mongoose from "mongoose";

let isConnected = false;

export async function connectMongoDB(): Promise<mongoose.Mongoose> {
    if (isConnected) return mongoose;

    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MONGODB_URI is not defined in environment variables.");
    }

    try {
        const db = await mongoose.connect(mongoUri);
        isConnected = db.connections[0].readyState === 1;
        console.log("MongoDB Connected");
        return db;
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        throw error;
    }
}
