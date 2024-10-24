import dotenv from 'dotenv';
dotenv.config({path: "./src/config/.env"})
import express from "express";
import connectDb from "./config/db.js"
import cors from 'cors'
import helmet from 'helmet'
import categoriesRoutes from "../src/routes/categoriesRoutes.js"
import ordersRoutes from "../src/routes/ordersRoutes.js"
import userRoute from "../src/routes/userRoute.js"


const app = express()

app.use(cors())

app.use(helmet())

app.use(express.json())

app.use("/api/categories", categoriesRoutes)
app.use("/api/orders", ordersRoutes)
app.use("/api/users", userRoute)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`)
    connectDb()
})