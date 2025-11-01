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

  // Validate email
  if (!email || !email.trim()) {
    throw new ApiError(400, "Email is required");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.trim() });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  
  // Delete any existing OTP for this email
  await Otp.deleteMany({ userId: email.trim() });
  
  // Create new OTP
  await Otp.create({ userId: email.trim(), otp });

  // Send OTP email
  try {
    await sendEmail({
      to: email.trim(),
      subject: "Hotel Registration OTP Verification",
      text: `Your OTP for hotel registration is: ${otp}. This OTP is valid for 10 minutes.`,
    });
  } catch (emailError) {
    console.error("Email sending error:", emailError);
    throw new ApiError(500, "Failed to send OTP email. Please try again.");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { email: email.trim() },
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

  // Validate required fields
  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }
  
  if (!name || !password || !location || !address || !phone || !managerName || !rooms) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Validate password strength
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  // Check OTP
  const otpRecord = await Otp.findOne({ userId: email, otp, verified: false });
  if (!otpRecord) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // Check if OTP is expired (10 minutes validity)
  const otpAge = Date.now() - otpRecord.createdAt.getTime();
  if (otpAge > 10 * 60 * 1000) {
    await otpRecord.deleteOne();
    throw new ApiError(400, "OTP has expired. Please request a new one.");
  }

  // Check if user was created in the meantime
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  // Mark OTP as used
  otpRecord.verified = true;
  await otpRecord.save();

  // Upload images to Cloudinary with error handling
  const files = req.files || {};
  
  const uploadFile = async (fileArr) => {
    if (!fileArr || !fileArr[0]) return null;
    try {
      const uploaded = await uploadOnCloudinary(fileArr[0].path);
      return uploaded?.url || null;
    } catch (error) {
      console.error("File upload error:", error);
      return null;
    }
  };
  
  const uploadMultiple = async (fileArr) => {
    if (!fileArr || fileArr.length === 0) return [];
    const urls = [];
    for (const file of fileArr) {
      try {
        const uploaded = await uploadOnCloudinary(file.path);
        if (uploaded?.url) urls.push(uploaded.url);
      } catch (error) {
        console.error("File upload error:", error);
      }
    }
    return urls;
  };

  // Validate required files
  if (!files.businessLicense || !files.businessLicense[0]) {
    throw new ApiError(400, "Business license document is required");
  }
  
  if (!files.hotelImages || files.hotelImages.length === 0) {
    throw new ApiError(400, "At least one hotel image is required");
  }

  const profileImageUrl = await uploadFile(files.profileImage);
  const businessLicenseUrl = await uploadFile(files.businessLicense);
  const taxCertificateUrl = await uploadFile(files.taxCertificate);
  const insuranceDocumentUrl = await uploadFile(files.insuranceDocument);
  const hotelImagesUrls = await uploadMultiple(files.hotelImages);

  // Verify uploads
  if (!businessLicenseUrl) {
    throw new ApiError(500, "Failed to upload business license");
  }
  
  if (hotelImagesUrls.length === 0) {
    throw new ApiError(500, "Failed to upload hotel images");
  }

  // Create user
  const user = await User.create({
    email: email.trim(),
    password,
    role: "hotel",
    verified: true,
  });
  
  // Validate location exists
  const { Location } = await import("../models/location.model.js");
  const locationExists = await Location.findById(location);
  if (!locationExists) {
    await User.findByIdAndDelete(user._id); // Cleanup
    throw new ApiError(400, "Invalid location selected");
  }
  
  // Create hotel
  const hotel = await Hotel.create({
    name: name.trim(),
    location,
    fullAddress: address.trim(),
    contactNo: phone.trim(),
    managerName: managerName.trim(),
    category: category || "hotel",
    noRoom: Number(rooms),
    description: description.trim(),
    price: pricePerNight ? Number(pricePerNight) : (price ? Number(price) : 0),
    pricePerNight: pricePerNight ? Number(pricePerNight) : (price ? Number(price) : 0),
    rating: rating ? Number(rating) : 0,
    amenities: Array.isArray(amenities) ? amenities.filter(a => a) : (amenities ? [amenities] : []),
    socials: Array.isArray(socials) ? socials.filter(s => s) : (socials ? [socials] : []),
    logo: profileImageUrl,
    medias: hotelImagesUrls,
    website: website ? website.trim() : "",
    license: businessLicenseUrl,
    certificate: taxCertificateUrl,
    insurance: insuranceDocumentUrl,
    owner: user._id,
    verified: "pending", // Set initial verification status
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, { user, hotel }, "Hotel registered successfully. Please wait for admin approval.")
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
  const plainHotelData = hotelData.map((hotel) => hotel.toJSON());

  let hotel;
  // Translate hotel fields if language is not English
  if (language !== "en") {
    const fieldsToTranslate = ["description", "category", "amenities"];
    hotel = await translateObjectsFields(
      plainHotelData,
      fieldsToTranslate,
      language
    );
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
  const plainHotels = hotels.map((hotel) => hotel.toJSON());
  const total = await Hotel.countDocuments(query);

  // Translate hotel fields if language is not English
  if (language !== "en" && plainHotels.length > 0) {
    const fieldsToTranslate = ["description", "category", "amenities"];
    hotels = await translateObjectsFields(
      plainHotels,
      fieldsToTranslate,
      language
    );
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
