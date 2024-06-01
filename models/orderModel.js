import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    names: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    products: [
      {
        quantity: {
          type: String,
          required: false,
        },
        selectedSize: {
          type: String,
          required: false,
        },
        productNumber: {
          type: String,
          required: false,
        },
        price: {
          type: String,
          required: false,
        },
        _id: {
          type: String,
          required: false,
        },
        photo: {
          type: String,
          required: false,
        },
        discount: {
          type: String,
          required: false,
        },
      },
    ],

    status: {
      type: String,
      enum: ["pending", "complete", "cancel"],
      default: "pending", // Set a default value if needed
    },

    selectedDistrict: {
      type: String,
      required: true,
    },
    selectedDivision: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    deliveryCharge: {
      type: Number,
      required: true,
    },
    totalWithDelivery: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Orders", orderSchema);
