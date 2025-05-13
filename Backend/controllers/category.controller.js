import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js";

export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});

    if (!categories) {
        throw new ApiError(404, "Categories not found");
    }

    res.status(200).json(new ApiResponse(200, "Categories fetched successfully", categories));
});

export const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new ApiError(400, "Category name is required");
    }

    const category = await Category.create({ name });

    res.status(201).json(new ApiResponse(201, "Category created successfully", category));
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Category ID is required");
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    res.status(200).json(new ApiResponse(200, "Category deleted successfully", category));
});

