import mongoose from "mongoose"

export default async function connectDb() {
  const e = process.env.DB_CONNECT 
    mongoose
  .connect(
    process.env.DB_CONNECT  // look at .env.sample
  )
  .then(() => {
    console.log("\x1b[32m%s\x1b[0m","MongoDB connected successfully");  // "\x1b[32m%s\x1b[0m" - green colour
    //
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
}


