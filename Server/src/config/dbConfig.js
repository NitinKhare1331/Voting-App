import mongoose from "mongoose";
import { DB_URL } from "./serverConfig.js";

export default async function connectDB() {
    try {
        await mongoose.connect(DB_URL);
        console.log('connected to mongoDB database');
        
    } catch (error) {
        console.log('Error connecting to database', error);
    }
}