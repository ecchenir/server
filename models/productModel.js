import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    productNumber: {
      type: String,
      required: true,
    },
    selectedSubcategory: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },

    selectedOptions: [
      {
        type: String,
        required: true,
      },
    ],
    productType: {
      type: String,
      enum: ["local", "trending"],
      default: "local", // Set a default value if needed
    },

    photo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);
