import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Item } from "../models/item.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Review } from "../models/review.model.js";
import { getLatLongFromAddress } from "../utils/geoencoding.js";

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
    location,
    rating,
    query,
    minPrice = 0,
    maxPrice = 99999999,
    limit = 10,
    page = 1,
    lat,
    long,
    lang,
    subCategory,
  } = req.query;

  const categories = category
    ? Array.isArray(category)
      ? category
      : [category]
    : [];

  // Build the main filter
  const filter = {
    ...(categories.length > 0 && {
      $or: [
        { category: { $in: categories } },
        { category_it: { $in: categories } },
      ],
    }),
    ...(subCategory?.length > 0 && {
      $or: [
        { subCategory: { $in: subCategory } },
        { subCategory_it: { $in: subCategory } },
      ],
    }),
    ...(location && { location }),
    ...(rating && { avgRating: { $gte: Number(rating) } }),
    ...(query && {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { name_it: { $regex: query, $options: "i" } },
      ],
    }),

    price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
  };

  // If lat/long provided, use geospatial query
  if (lat && long && !isNaN(lat) && !isNaN(long)) {
    // Ensure your "Item" collection has a 2dsphere index on the geo field!
    const geoFilter = { ...filter };

    let geoItems = await Item.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(long), parseFloat(lat)],
          },
          distanceField: "distance",
          query: geoFilter,
          spherical: true,
        },
      },
      { $sort: { distance: 1 } },
      { $skip: (Number(page) - 1) * Number(limit) },
      { $limit: Number(limit) },
    ]);

    // Populate owner field after aggregation
    geoItems = await Item.populate(geoItems, { path: "owner", select: "name" });

    geoItems = geoItems.map((item) => ({
      ...item,
      name: lang === "it" ? item.name_it || item.name : item.name,
      description:
        lang === "it"
          ? item.description_it || item.description
          : item.description,
    }));

    // Get COUNT ONLY (without $geoNear, but with same filter)
    const countAggRes = await Item.aggregate([
      { $match: geoFilter },
      { $count: "total" },
    ]);
    const totalItems = countAggRes[0]?.total || 0;

    return res.status(200).json(
      new ApiResponse(200, "Items fetched successfully", {
        items: geoItems,
        totalItems,
      })
    );
  }

  // Standard query (no geo)
  const rawItems = await Item.find(filter)
    .populate("owner", "name")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  const items = rawItems.map((item) => {
    const doc = item.toObject(); // item is a Mongoose document here
    return {
      ...doc,
      name: lang === "it" ? doc.name_it || doc.name : doc.name,
      description:
        lang === "it" ? doc.description_it || doc.description : doc.description,
      category: lang === "it" ? doc.category_it || doc.category : doc.category,
    };
  });

  const totalItems = await Item.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(200, "Items fetched successfully", {
      items,
      totalItems,
    })
  );
});

export const createItem = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    subCategory,
    availableQuantity,
    location,
  } = req.body;

  if (
    !name ||
    !description ||
    !price ||
    !category ||
    !availableQuantity ||
    !location
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

  const { lat, lng } = await getLatLongFromAddress(location);

  if (!lat || !lng) {
    throw new ApiError(400, "Invalid location provided");
  }

  const item = await Item.create({
    name,
    description,
    price,
    category,
    subCategory,
    images: mediasUrl,
    status: "available",
    bookings: [],
    availableQuantity,
    location: {
      type: "Point",
      coordinates: [lng, lat],
    },
    owner: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, "Item created successfully", item));
});

export const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, availableQuantity, location } =
    req.body;

  if (!id) {
    throw new ApiError(400, "Item ID is required");
  }

  const itemExists = await Item.findById(id);
  if (!itemExists) {
    throw new ApiError(404, "Item not found");
  }

  if (itemExists.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this item");
  }

  const updatedFields = {};

  if (name !== undefined) updatedFields.name = name;
  if (description !== undefined) updatedFields.description = description;
  if (price !== undefined) updatedFields.price = price;
  if (category !== undefined) updatedFields.category = category;
  if (req.files.images !== undefined) {
    await Promise.all(
      itemExists.images.map(async (image) => {
        const link = await deleteFromCloudinary(image);
      })
    );

    const mediasUrl = await Promise.all(
      req.files.images.map(async (image) => {
        const link = await uploadOnCloudinary(image.path);
        return link.url;
      })
    );
    updatedFields.images = mediasUrl;
  }
  if (availableQuantity !== undefined)
    updatedFields.availableQuantity = availableQuantity;
  if (location !== undefined) {
    let geoLocation = location;
    // Accept GeoJSON object as-is
    if (
      typeof location === "object" &&
      location.type === "Point" &&
      Array.isArray(location.coordinates) &&
      location.coordinates.length === 2
    ) {
      geoLocation = location;
    }
    // Parse string "lat,lng"
    else if (typeof location === "string" && location.includes(",")) {
      const [lat, lng] = location.split(",").map(Number);
      geoLocation = {
        type: "Point",
        coordinates: [lng, lat],
      };
    }
    updatedFields.location = geoLocation;
  }

  const item = await Item.findByIdAndUpdate(id, updatedFields, { new: true });

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

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

  if (item.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this item");
  }

  await Promise.all(
    item.images.map(async (image) => {
      const link = await deleteFromCloudinary(image);
    })
  );

  res.status(200).json(new ApiResponse(200, "Item deleted successfully", item));
});

export const reviewItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!rating) {
    throw new ApiError(400, "Rating is required");
  }

  const item = await Item.findById(id);
  if (!item) {
    throw new ApiError(404, "Item not found");
  }
  console.log(item);
  const reviewExists = await Review.findOne({
    item: id,
    user: req.user._id,
  }).lean();
  if (reviewExists) {
    throw new ApiError(400, "You have already reviewed this item");
  }

  item.totalReviews += 1;

  item.avgRating =
    (item.avgRating * (item.totalReviews - 1) + rating) / item.totalReviews;

  const review = await Review.create({
    user: req.user._id,
    item: id,
    rating,
    comment,
  });

  await item.save();
  await review.save();

  res.status(201).json(new ApiResponse(201, "Review added successfully", item));
});

export const getItemByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const items = await Item.find({ owner: userId });
  res
    .status(201)
    .json(new ApiResponse(200, "Items fetched successfully", items));
});

export const getTopReviewedItems = asyncHandler(async (req, res) => {
  const items = await Item.find({})
    .sort({ totalReviews: -1 })
    .limit(5)
    .populate("owner", "name");
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Top 5 items with highest review count fetched successfully",
        items
      )
    );
});
