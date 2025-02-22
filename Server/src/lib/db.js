import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected :"+conn.connection.host);
    } catch (error) {
        console.log("DB error:"+error);
    }
}