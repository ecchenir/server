import express from "express";
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
import multer from "multer"; // Corrected import

const __dirname = path.resolve();

// Configure env
dotenv.config();

// Database config
connectDB();

// Rest object
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// app.use(express.static(path.join(__dirname, "./client/build")));
app.use(bodyParser.json({ limit: "500mb" }));

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route to handle image upload
app.post("/upload-image", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a file" });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/banner", bannerRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/latestproduct", latestproductRoutes);
app.use("/api/v1/blogs", blogRoute);

// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static files for the React app
// app.use("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

// PORT
const PORT = process.env.PORT || 5000;

// Run listen
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT} successfully`);
});
