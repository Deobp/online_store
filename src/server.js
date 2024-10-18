import dotenv from 'dotenv';
import express from "express";
import connectDb from "./config/db.js"

dotenv.config({path: "./src/config/.env"})

const app = express()

app.use(express.json())



app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`)
    connectDb()
})