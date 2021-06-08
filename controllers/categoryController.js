import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  if (req.query.pageNumber == "No Pagination") {
    const category = await Category.find({});
    res.json({ category });
  } else {
    const count = await Category.countDocuments({});
    const category = await Category.find({})
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.json({ category, page, pages: Math.ceil(count / pageSize) });
  }
});

// @desc    Fetch single cateogry
// @route   GET /api/cateogrys/:id
// @access  Private/Admin
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// @desc    Delete a category
// @route   DELETE /api/category/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await category.remove();
    res.json({ message: "Category removed" });
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// @desc    Create a cateogry
// @route   POST /api/cateogry
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const category = new Category({
    name: "Sample Category",
    image: "",
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// // @desc    Update a category
// // @route   PUT /api/category/:id
// // @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;

  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name.trim();
    category.image = image.trim();
    const categoryProduct = await category.save();
    
    res.json(categoryProduct);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

export {
  getCategory,
  getCategoryById,
  deleteCategory,
  createCategory,
  updateCategory,
};
