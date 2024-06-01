import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";

export const createProductController = async (req, res) => {
  try {
    let {
      name,
      slug,
      discount,
      productNumber,
      description,
      price,
      category,
      photo,
      selectedOptions,
      productType,
      selectedSubcategory,
    } = req.fields;

    const selectedOptionArray = JSON.parse(selectedOptions);
    // console.log(selectedOptionArray);

    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name required" });
      case !photo:
        return res.status(500).send({ error: "photo is required" });
      case !description:
        return res.status(500).send({ error: "Description required" });
      case !price:
        return res.status(500).send({ error: "Price required" });
      case !discount:
        return res.status(500).send({ error: " Discount Number required" });

      case !productNumber:
        return res.status(500).send({ error: "Product Number required" });
      case !category:
        return res.status(500).send({ error: "Category required" });
      case !selectedOptions:
        return res.status(500).send({ error: "Size Selected required" });
      case !selectedSubcategory:
        return res.status(500).send({ error: "selectedSubcategory  required" });
    }
    const products = new productModel({
      ...req.fields,
      selectedOptions: selectedOptionArray,
      slug: slugify(name),
    });

    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.send(500).send({
      success: false,
      message: "Error in Create Product",
      error,
    });
  }
};

//getProductController

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .limit(20)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Products",

      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get products",
      error,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const allProduct = await productModel.find();
    res.status(200).json(allProduct);
    // console.log(allProduct);
  } catch (error) {
    res.status(501).json({ message: "product not found" });
  }
};

//getSingleProductController

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ _id: req.params.id }) // Change 'slug' to '_id' here

      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single product fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get single products",
      error,
    });
  }
};

//deleteProductController

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Successfully Product Deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//updateProductController

export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, discount, productNumber, photo, price } =
      req.fields;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name required" });
      case !description:
        return res.status(500).send({ error: "Description required" });
      case !photo:
        return res.status(500).send({ error: "photo required" });
      case !price:
        return res.status(500).send({ error: "Price required" });
      case !discount:
        return res.status(500).send({ error: " Discount Number required" });

      case !productNumber:
        return res.status(500).send({ error: "Product Number required" });
    }
    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.send(500).send({
      success: false,
      message: "Error in Update Product",
      error,
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 28;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });

    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while getting related product",
      error,
    });
  }
};

// get prdocyst by catgory

export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

// create Tending Product

export const updateTradingProduct = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const updateOrder = req.body;

  try {
    // Attempt to update the order
    const updateData = await productModel.findByIdAndUpdate(
      { _id: id },
      updateOrder,
      { new: true }
    );

    // Check if the update was successful
    if (updateData) {
      return res.status(200).json({
        message: "Create Tending Product SuccessFully",
        order: updateData,
      });
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
