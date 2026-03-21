import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://divijmalhotra0112_db_user:resume_builder_789@cluster0.wd3k9wy.mongodb.net/RESUME')
    .then(() => {
        console.log("DB CONNECTED")
    })
}
