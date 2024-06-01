import express from "express";
import formidable from "express-formidable";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  blogPhotoController,
  createBlogsController,
  getBlogsController,
} from "../controllers/blogsContorollar.js";

const router = express.Router();

//routes
//create category
router.post(
  "/create-blogs",
  requireSignIn,
  // isAdmin,
  formidable(),
  createBlogsController
);

// create sub category
router.get("/get-blogs", getBlogsController);

// get photo
router.get("/blogs-photo/:pid", blogPhotoController);

export default router;
