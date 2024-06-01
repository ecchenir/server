import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  photo: {
    type: String,
    required: true,
  },

  subCategory: [
    {
      type: String,
      required: false,
    },
  ],
});

export default mongoose.model("Category", categorySchema);
