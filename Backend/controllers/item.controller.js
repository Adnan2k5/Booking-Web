import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Item } from "../models/item.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

export const getItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Item ID is required");
  }

  const item = await Item.findById(id).populate("owner", "name");

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  res.status(200).json(new ApiResponse(200, "Item fetched successfully", item));
});

export const discoverItems = asyncHandler(async (req, res) => {
  const {
    category,
    query,
    limit = 10,
    page = 1,
    lat,
    long,
    lang,
  } = req.query;
  //TODO: Write Controller
});

export const createItem = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    category,
    adventures,
    purchase,
    rent,
  } = req.body;

  if (
    !name ||
    !description ||
    !price ||
    !category ||
    !stock || !adventures ||
    !purchase || !rent
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!req.files || !req.files.images || req.files.images.length === 0) {
    throw new ApiError(400, "Image is required");
  }

  const mediasUrl = await Promise.all(
    req.files.images.map(async (image) => {
      const link = await uploadOnCloudinary(image.path);
      return link.url;
    })
  );

  await Item.create({
    name,
    description,
    price,
    stock,
    category,
    adventures,
    purchase,
    rent,
    images: mediasUrl,
    owner: req.user._id,
  });
  

  res.status(201).json(
    new ApiResponse(201, "Item created successfully", {}));
});

export const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    stock,
    category,
    adventures,
    purchase,
    rent,
  } = req.body;

  if (!id) {
    throw new ApiError(400, "Item ID is required");
  }

  const item = await Item.findById(id);
  if (!item) {
    throw new ApiError(404, "Item not found");
  }


  // Update fields if provided
  if (name !== undefined) item.name = name;
  if (description !== undefined) item.description = description;
  if (price !== undefined) item.price = price;
  if (stock !== undefined) item.stock = stock;
  if (category !== undefined) item.category = category;
  if (adventures !== undefined) item.adventures = adventures;
  if (purchase !== undefined) item.purchase = purchase;
  if (rent !== undefined) item.rent = rent;

  // Handle images update
  if (req.files && req.files.images && req.files.images.length > 0) {
    // Delete old images from Cloudinary
    await Promise.all(
      item.images.map(async (image) => {
        await deleteFromCloudinary(image);
      })
    );
    // Upload new images
    const mediasUrl = await Promise.all(
      req.files.images.map(async (image) => {
        const link = await uploadOnCloudinary(image.path);
        return link.url;
      })
    );
    item.images = mediasUrl;
  }

  await item.save();

  res.status(200).json(new ApiResponse(200, "Item updated successfully", item));
});

export const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Item ID is required");
  }

  const item = await Item.findByIdAndDelete(id);
  if (!item) {
    throw new ApiError(404, "Item not found");
  }


  await Promise.all(
    item.images.map(async (image) => {
      const link = await deleteFromCloudinary(image);
    })
  );

  res.status(200).json(new ApiResponse(200, "Item deleted successfully", item));
});

export const getAllItems = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const items = await Item.find({})
    .populate("adventures", "name")
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Item.countDocuments({});

  res.json(
    new ApiResponse(
      200,
      "Items fetched successfully",
      items,
      total
    )
  );
});