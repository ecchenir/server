import express from "express";
// import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import latestproductRoutes from "./routes/latestproductRoutes.js";
import blogRoute from "./routes/blogRoute.js";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";

const __dirname = path.resolve();

//configure env
dotenv.config();

//database config
connectDB();

//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./client/build")));
app.use(bodyParser.json({ limit: "500mb" }));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/banner", bannerRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/latestproduct", latestproductRoutes);
app.use("/api/v1/blogs", blogRoute);

// app.get("/", (req, res) => {
//   res.send("Hello, Vercel! Successfully Deploy");
// });

// rest api
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//PORT
const PORT = process.env.PORT || 7000;

//run listen
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT} successfully`);
});
