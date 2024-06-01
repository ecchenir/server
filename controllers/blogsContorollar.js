import blogsModal from "../models/blogModal.js";
import fs from "fs";
import slugify from "slugify";
import express from "express";
const router = express.Router();

export const createBlogsController = async (req, res) => {
  try {
    // console.log(req.fields);
    const { name = "", slug, title, photo } = req.fields;

    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name required" });
      case !title:
        return res.status(500).send({ error: "title required" });

      case !photo:
        return res.status(500).send({ error: "photo required" });
    }
    const newBlog = new blogsModal({ ...req.fields, slug: slugify(name) });

    await newBlog.save();
    res.status(201).send({
      success: true,
      message: "Category Blogs Successfully Created",
      newBlog,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Create Blogs",
      error,
    });
  }
};

export const getBlogsController = async (req, res) => {
  try {
    const blogs = await blogsModal.find({}).limit(20).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      countTotal: blogs.length,
      message: "All Blogs",
      blogs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting blogs",
      error,
    });
  }
};

export const blogPhotoController = async (req, res) => {
  try {
    const blog = await blogsModal.findById(req.params.id).select("photo");
    if (blog.photo.data) {
      res.set("Content-type", blog.photo.contentType);
      return res.status(200).send(blog.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching blog photo",
      error,
    });
  }
};
