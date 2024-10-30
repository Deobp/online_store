import dotenv from "dotenv";
dotenv.config({ path: "./src/config/.env" });
import express from "express";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import cors from "cors";
import helmet from "helmet";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import { jsonParsingErrorHandler } from "./middlewares/syntaxJsonErrorHandlers.js";

const app = express();

// security options
app.use(
  cors({
    origin: true, // * + credentials
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet());

app.use(
  express.json({
    // handling incorrect body of request
    verify: (req, res, buf) => {
      if (buf.length === 0) return; // if no body

      if (req.headers["content-type"]?.includes("application/json")) {
        // ensure that json is in headers
        JSON.parse(buf);  // parsing error is handling by middleware jsonParsingErrorHandler
      }
    },
  })
);

app.use(cookieParser());

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/categories", categoriesRoutes);
app.use("/api/orders", ordersRoutes);

// handling JSON parsing errors
app.use(jsonParsingErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
  connectDb();
});
