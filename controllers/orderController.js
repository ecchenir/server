import slugify from "slugify";
import orderModel from "../models/orderModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";

export const createOrderController = async (req, res) => {
  try {
    const {
      names,
      slug,
      status,
      phone,
      deliveryCharge,
      subTotal,
      products,
      address,
      selectedDistrict,
      totalWithDelivery,
      selectedDivision,
    } = req.body;

    //validation
    switch (true) {
      case !names:
        return res.status(500).send({ error: "Name required" });
      case !phone:
        return res.status(500).send({ error: "phone required" });
      case !totalWithDelivery:
        return res.status(500).send({ error: " total required" });
      case !subTotal:
        return res.status(500).send({ error: " amount required" });
      case !selectedDistrict:
        return res.status(500).send({ error: " selectedDistrict   required" });
      case !selectedDivision:
        return res.status(500).send({ error: " selectedDivision   required" });

      case !deliveryCharge:
        return res.status(500).send({ error: "Delivery required" });
      case !address:
        return res.status(500).send({ error: "address required" });

      // case photo && photo.size > 5000000:
      //     return res
      //       .status(500)
      //       .send({ error: "photo is Required and should be less then 1mb" });
    }
    const orderProduct = new orderModel({ ...req.body, slug: slugify(names) });
    // if(photo){
    //     products.photo.data = fs.readFileSync(photo.path)
    //     products.photo.contentType = photo.type
    // }
    await orderProduct.save();
    res.status(201).send({
      success: true,
      message: "Thanks for order Successfully",
      orderProduct,
    });
  } catch (error) {
    console.log(error);
    res.send(500).send({
      success: false,
      message: "Error in Create Order",
      error,
    });
  }
};

//getOrderController

export const getOrderController = async (req, res) => {
  try {
    const product = await orderModel.find({});
    res.status(200).send({
      success: true,
      countTotal: product.length,
      message: "All Orders",

      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get orders",
      error,
    });
  }
};

//getSingleOrderController

export const getSingleOrderController = async (req, res) => {
  console.log(req.params.id);
  try {
    const SingleProduct = await orderModel.findById(req.params.id);

    console.log(SingleProduct);
    res.status(200).send({
      success: true,
      message: "Single order fetched",
      SingleProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get single orders",
      error,
    });
  }
};

//get orderPhotoController

export const orderPhotoController = async (req, res) => {
  try {
    const product = await orderModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get photo",
      error,
    });
  }
};

//deleteOrderController

export const deleteOrderController = async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Successfully Order Deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting order",
      error,
    });
  }
};

//updateOrderController

export const updateOrderController = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const updateOrder = req.body;

  try {
    // Attempt to update the order
    const updateData = await orderModel.findByIdAndUpdate(
      { _id: id },
      updateOrder,
      { new: true }
    );

    // Check if the update was successful
    if (updateData) {
      return res
        .status(200)
        .json({ message: "Order Confirmed", order: updateData });
    } else {
      return res.status(404).json({ error: "Order Not Found" });
    }
  } catch (error) {
    // Handle errors
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the order" });
  }
};
