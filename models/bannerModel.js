import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: false,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Banners", bannerSchema);
