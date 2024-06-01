import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import slugify from "slugify";
import express from "express";
const router = express.Router();
// Adjust the path accordingly

export const createCategoryController = async (req, res) => {
  try {
    console.log(req.fields);
    const { name, photo, subCategory } = req.fields;

    const CategoryData = {
      name,
      photo,
      subCategory,
    };

    const category = new categoryModel(CategoryData);

    await category.save();
    res.status(201).json({ message: " Category Create Successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the Banner" });
  }
};

// sub category controller

export const createSubCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    console.log(req.body);
    // Find the parent category by ID
    const parentCategory = await categoryModel.findById(id);
    if (!parentCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Parent category not found" });
    }
    // Add the subcategory to the parent category
    parentCategory.subCategory.push(name);

    // Save the updated parent category
    const updatedCategory = await parentCategory.save();

    res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//updateCategoryController
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Updating category",
      error,
    });
  }
};

//categoryController

export const categoryController = async (req, res) => {
  try {
    const category = await categoryModel.find();
    res.status(200).json(category);
  } catch (error) {
    res.status(501).json({ message: "category not found" });
  }
};

// get categoryPhotoController
export const categoryPhotoController = async (req, res) => {
  try {
    const category = await categoryModel
      .findById(req.params.id)
      .select("photo");
    if (category.photo.data) {
      res.set("Content-type", category.photo.contentType);
      return res.status(200).send(category.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "photo not found",
      error,
    });
  }
};

//singleCategoryController

export const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get Single Category Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Get error in single category",
      error,
    });
  }
};

export const singleCategoryControllerById = async (req, res) => {
  try {
    const category = await categoryModel.findById({ id: req.params.id });
    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: "category not found" });
  }
};

//deleteCategoryController

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Delete category",
      error,
    });
  }
};
