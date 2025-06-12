import { Hotel } from "../models/hotel.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sendEmail from "../utils/sendOTP.js";
import { Otp } from "../models/otp.model.js";
import {
  translateObjectFields,
  translateObjectsFields,
} from "../utils/translation.js";
import { getLanguage } from "../middlewares/language.middleware.js";

export const verifyHotel = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  await Otp.create({ userId: email, otp });

  // Send OTP email
  await sendEmail({
    to: email,
    subject: "Hotel Registration OTP Verification",
    text: `Your OTP for hotel registration is: ${otp}`,
  });

  // Store registration data in session or cache (for demo, return it to client, but in production use Redis or DB)
  // For now, just acknowledge OTP sent
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { email },
        "OTP sent to email. Please verify to complete registration."
      )
    );
});

// New endpoint for OTP verification and final registration
export const HotelRegistration = asyncHandler(async (req, res) => {
  const {
    email,
    otp,
    name,
    password,
    description,
    location,
    address,
    phone,
    category,
    price,
    pricePerNight,
    rating,
    website,
    socials,
    managerName,
    rooms,
    amenities,
  } = req.body;

  // Check OTP
  const otpRecord = await Otp.findOne({ userId: email, otp, verified: false });
  if (!otpRecord) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // Mark OTP as used
  otpRecord.verified = true;
  await otpRecord.save();

  // Upload images to Cloudinary
  const files = req.files || {};
  const uploadFile = async (fileArr) => {
    if (!fileArr || !fileArr[0]) return null;
    const uploaded = await uploadOnCloudinary(fileArr[0].path);
    return uploaded?.url || null;
  };
  const uploadMultiple = async (fileArr) => {
    if (!fileArr) return [];
    const urls = [];
    for (const file of fileArr) {
      const uploaded = await uploadOnCloudinary(file.path);
      if (uploaded?.url) urls.push(uploaded.url);
    }
    return urls;
  };

  const profileImageUrl = await uploadFile(files.profileImage);
  const businessLicenseUrl = await uploadFile(files.businessLicense);
  const taxCertificateUrl = await uploadFile(files.taxCertificate);
  const insuranceDocumentUrl = await uploadFile(files.insuranceDocument);
  const hotelImagesUrls = await uploadMultiple(files.hotelImages);

  // Create user
  const user = await User.create({
    email,
    password,
    role: "hotel",
    verified: true,
  });
  // Create hotel
  const hotel = await Hotel.create({
    name,
    location,
    fullAddress: address,
    contactNo: phone,
    managerName,
    category: category,
    noRoom: Number(rooms),
    description,
    price: price,
    pricePerNight: pricePerNight ? Number(pricePerNight) : price, // Use pricePerNight if provided, otherwise fallback to price
    rating: rating ? Number(rating) : 0, // Use provided rating or default to 0
    amenities: Array.isArray(amenities) ? amenities : [amenities],
    socials: Array.isArray(socials) ? socials : [socials],
    logo: profileImageUrl,
    medias: hotelImagesUrls,
    website: website,
    license: businessLicenseUrl,
    certificate: taxCertificateUrl,
    insurance: insuranceDocumentUrl,
    owner: user._id,
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, { user, hotel }, "Hotel registered successfully")
    );
});

export const getHotelById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const language = getLanguage(req);

  // Fetch from database
  const hotelData = await Hotel.find({ owner: id })
    .populate("owner", "name email")
    .populate("location", "name");

  if (!hotelData || hotelData.length === 0) {
    throw new ApiError(404, "Hotel not found");
  }
  
  // Convert Mongoose documents to plain objects
  const plainHotelData = hotelData.map(hotel => hotel.toJSON());
  
  let hotel;
  // Translate hotel fields if language is not English
  if (language !== 'en') {
    const fieldsToTranslate = ['description', 'category', 'amenities'];
    hotel = await translateObjectsFields(plainHotelData, fieldsToTranslate, language);
  } else {
    hotel = plainHotelData;
  }

  res
    .status(200)
    .json(new ApiResponse(200, { hotel }, "Hotel retrieved successfully"));
});

export const getHotel = asyncHandler(async (req, res) => {
  const {
    search = "",
    page = 1,
    limit = 10,
    verified,
    location,
    minPrice,
    maxPrice,
    minRating,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const language = getLanguage(req);

  let query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  // Location filtering - handle both location ID and location name
  if (location) {
    // First, try to find location by name to get the ID
    const { Location } = await import("../models/location.model.js");
    const locationDoc = await Location.findOne({
      name: { $regex: location, $options: "i" },
    });

    if (locationDoc) {
      query.location = locationDoc._id;
    } else {
      // If no location found by name, try by ID (for backward compatibility)
      query.location = location;
    }
  }

  if (verified) {
    query.verified = verified;
  }

  // Price filtering
  if (minPrice || maxPrice) {
    query.pricePerNight = {};
    if (minPrice) query.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
  }

  // Rating filtering
  if (minRating) {
    query.rating = { $gte: Number(minRating) };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
  let hotels = await Hotel.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("owner", "name email")
    .populate("location", "name");

  // Convert Mongoose documents to plain objects
  const plainHotels = hotels.map(hotel => hotel.toJSON());
  const total = await Hotel.countDocuments(query);

  // Translate hotel fields if language is not English
  if (language !== 'en' && plainHotels.length > 0) {
    const fieldsToTranslate = ['description', 'category', 'amenities'];
    hotels = await translateObjectsFields(plainHotels, fieldsToTranslate, language);
  } else {
    hotels = plainHotels;
  }

  const result = {
    hotels,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };

  res.status(200).json(result);
});

export const approveHotel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hotel = await Hotel.findByIdAndUpdate(
    id,
    { verified: "approved" },
    { new: true }
  );
  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { hotel }, "Hotel approved successfully"));
});

export const rejectHotel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hotel = await Hotel.findByIdAndUpdate(
    id,
    { verified: "rejected" },
    { new: true }
  );
  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { hotel }, "Hotel rejected successfully"));
});

export const updateHotelRating = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  if (!rating || rating < 0 || rating > 5) {
    throw new ApiError(400, "Rating must be between 0 and 5");
  }

  const hotel = await Hotel.findByIdAndUpdate(
    id,
    { rating: Number(rating) },
    { new: true }
  );

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { hotel }, "Hotel rating updated successfully"));
});

export const updateHotelPrice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { pricePerNight, price } = req.body;

  const updateData = {};
  if (pricePerNight) updateData.pricePerNight = Number(pricePerNight);
  if (price) updateData.price = Number(price);

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "Please provide pricePerNight or price to update");
  }

  const hotel = await Hotel.findByIdAndUpdate(id, updateData, { new: true });

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { hotel }, "Hotel price updated successfully"));
});
