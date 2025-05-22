import { Hotel } from "../models/hotel.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sendEmail from "../utils/sendOTP.js";
import { Otp } from "../models/otp.model.js";

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
    noRoom: Number(rooms),
    description,
    amenities: Array.isArray(amenities) ? amenities : [amenities],
    logo: profileImageUrl,
    medias: hotelImagesUrls,
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
  const hotel = await Hotel.find({ owner: id });
  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, { hotel }, "Hotel retrieved successfully"));
});

export const getHotel = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const hotels = await Hotel.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate("owner", "name email");
  const total = await Hotel.countDocuments(query);
  res.status(200).json({
    hotels,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  });
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
