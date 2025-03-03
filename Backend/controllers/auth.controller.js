import { User } from '../models/user.model.js';
import { Otp } from '../models/otp.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import sendEmail from '../utils/sendOTP.js';


const registerUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if ((email?.trim() === "" || !email) || (password?.trim() === "" || !password)) {
        throw new ApiError(400, "Email and Password are Required");
    }

    const userExist = await User.findOne({ email: email });

    if (userExist) {
        throw new ApiError(409, "User with this email already exists !");
    }

    const user = await User.create({
        email: email.toLowerCase(),
        password: password,
    });

    const otpCode = Math.floor(100000 + Math.random() * 900000);

    await Otp.create({
        userId: user._id,
        otp: otpCode,
    });

    sendEmail({
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: "Verify OTP",
        text: `Hello ${email}, Your OTP for verification is ${otpCode}`,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -role"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    res.status(201).
        json(
            new ApiResponse(200, {
                user: user,
            }, "User registered Succesfully"),
        );
});

const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if ((email?.trim() === "" || !email) || (otp?.trim() === "" || !otp)) {
        throw new ApiError(400, "Email and OTP are Required");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const otpExist = await Otp.findOne({ userId: user._id });

    if (!otpExist) {
        throw new ApiError(400, "Invalid OTP");
    }

    if (otpExist.otp !== Number(otp)) {
        throw new ApiError(400, "Invalid OTP");
    }

    await Otp.deleteOne({ userId: user._id });

    user.verified = true;

    user.save();

    res.status(200).
        json(
            new ApiResponse(200, {

            }, "User verified Succesfully"),
        );

});

export { registerUser, verifyOtp };