import dotenv from "dotenv";
dotenv.config({path: "./backend/src/config/.env"})
import express from "express";
import cookieParser from "cookie-parser"
import connectDb from "./config/db.js"
import cors from 'cors'
import helmet from "helmet"
import categoriesRoutes from "./routes/categoriesRoutes.js"
import ordersRoutes from "./routes/ordersRoutes.js"
import userRoute from "./routes/userRoute.js"
import productRoute from "./routes/productRoute.js"


const app = express()

app.use(cors())

app.use(helmet())

app.use(express.json())

app.use(cookieParser());


app.use("/api/users", userRoute)
app.use("/api/products", productRoute)
app.use("/api/categories", categoriesRoutes)
app.use("/api/orders", ordersRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`)
    connectDb()
})