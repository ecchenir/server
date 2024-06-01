import mongoose from "mongoose";

const blogsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Blogs", blogsSchema);
