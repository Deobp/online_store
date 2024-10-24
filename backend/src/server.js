import dotenv from 'dotenv';
import express from "express";
import connectDb from "./config/db.js"
import cors from 'cors'
import helmet from 'helmet'

dotenv.config({path: "./src/config/.env"})

const app = express()

app.use(cors())

app.use(helmet())

app.use(express.json())

app.use("/api/categories", categoriesRoutes)
app.use("/api/orders", ordersRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`)
    connectDb()
})