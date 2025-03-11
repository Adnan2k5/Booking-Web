import { User } from '../models/user.model.js';
import { Otp } from '../models/otp.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import sendEmail from '../utils/sendOTP.js';
import { OAuth2Client } from "google-auth-library";
import { getLinkedInAccessToken, verifyLinkedInToken } from '../utils/linkedinHandler.js';
import { getFacebookAccessToken, verifyFacebookToken } from '../utils/facebookHandler.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const generateAccessAndRefreshTokens = async (user) => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    }
    catch (error) {

        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

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

    otpExist.verified = true;

    await otpExist.save();

    user.verified = true;

    await user.save();

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);

    // Convert the Mongoose document to a plain JavaScript object
    const userObject = user.toObject();

    // Remove sensitive fields
    delete userObject.password;
    delete userObject.refreshToken;
    delete userObject.role;
    delete userObject.verified;
    delete userObject.createdAt;
    delete userObject.updatedAt;
    delete userObject.bookings;
    delete userObject.reviews;

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: userObject,
                    accessToken,
                },
                "User Verified Successfully",
            )
        );

});

const resendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000);
    await Otp.deleteMany({ userId: user._id });

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

    res.status(200).
        json(
            new ApiResponse(200, {
                email: email,
            }, "OTP sent Succesfully"),
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (email?.trim() === "" || !email || password?.trim() === "" || !password) {
        throw new ApiError(400, "Email and Password are Required");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.verified) {
        throw new ApiError(403, "User not verified");
    }

    const isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) {
        throw new ApiError(400, "Invalid Password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);

    // Convert the Mongoose document to a plain JavaScript object
    const userObject = user.toObject();

    // Remove sensitive fields
    delete userObject.password;
    delete userObject.refreshToken;
    delete userObject.role;
    delete userObject.verified;
    delete userObject.createdAt;
    delete userObject.updatedAt;
    delete userObject.bookings;
    delete userObject.reviews;

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: userObject,
                    accessToken,
                },
                "User logged in Successfully",
            )
        );
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (email?.trim() === "" || !email) {
        throw new ApiError(400, "Email is Required");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000);

    await Otp.deleteMany({ userId: user._id });

    await Otp.create({
        userId: user._id,
        otp: otpCode,
    });

    sendEmail({
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: "Reset Password",
        text: `Hello ${email}, Your OTP for verification is ${otpCode}`,
    });

    res.status(200).json(
        new ApiResponse(200, {
            email: email,
        }, "OTP sent Succesfully"),
    );
});

const updatePassword = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if ((email?.trim() === "" || !email) || (password?.trim() === "" || !password)) {
        throw new ApiError(400, "Email and Password are Required");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const otpExist = await Otp.findOne({ userId: user._id });

    if (!otpExist) {
        throw new ApiError(402, "User not Authorized");
    }

    if (!otpExist.verified) {
        throw new ApiError(403, "User not verified");
    }

    user.password = password;

    await user.save();

    await Otp.deleteMany({ userId: user._id });

    res.status(200).json(
        new ApiResponse(200, {
            email: email,
        }, "Password Updated Successfully"),
    );
});

const signInWithGoogle = asyncHandler(async (req, res) => {
    const { token } = req.body;

    if(!token) {
        throw new ApiError(400, "Token is Required");
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await User.find({ email: email });

        if (!user) {
            //Signing In
            const newUser = await User.create({
                email: email,
                name: name,
                verified: true,
            });

            await newUser.save();

            user = newUser;
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);

        const userObject = user.toObject();

        delete userObject.password;
        delete userObject.refreshToken;
        delete userObject.role;
        delete userObject.verified;
        delete userObject.createdAt;
        delete userObject.updatedAt;

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: userObject,
                        accessToken,
                    },
                    "User logged in Successfully",
                )
            );
    } catch (error) {
        throw new ApiError(401, "Invalid Token");
    }
});


const signInWithApple = asyncHandler(async (req, res) => {

});

const signInWithLinkedin = asyncHandler(async (req, res) => {
    const { code } = req.body;

    if(!code) {
        throw new ApiError(400, "Code is Required");
    }

    try {
        const linkedinAccessToken = await getLinkedInAccessToken(code);
        const userDetails = await verifyLinkedInToken(linkedinAccessToken);

        let user = await User.findOne({ email: userDetails.email });

        if(!user) {
            user = await User.create({
                email: userDetails.email,
                name: userDetails.name,
                verified: true,
            });

            await user.save();
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);

        const userObject = user.toObject();

        delete userObject.password;
        delete userObject.refreshToken;
        delete userObject.role;
        delete userObject.verified;
        delete userObject.createdAt;
        delete userObject.updatedAt;

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: userObject,
                        accessToken,
                    },
                    "User logged in Successfully",
                )
            );
    } catch (error) {
        throw new ApiError(401, "Invalid Token");
    }
});

const signInWithFacebook = asyncHandler(async (req, res) => {
    const { code } = req.body;
    if(!code) {
        throw new ApiError(400, "Code is Required");
    }

    try {
        const facebookAccessToken = await getFacebookAccessToken(code);
        const userDetails = await verifyFacebookToken(facebookAccessToken);

        let user = await User.findOne({ email: userDetails.email });

        if(!user) {
            user = await User.create({
                email: userDetails.email,
                name: userDetails.name,
                verified: true,
            });

            await user.save();
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);

        const userObject = user.toObject();

        delete userObject.password;
        delete userObject.refreshToken;
        delete userObject.role;
        delete userObject.verified;
        delete userObject.createdAt;
        delete userObject.updatedAt;

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: userObject,
                        accessToken,
                    },
                    "User logged in Successfully",
                )
            );
    } catch (error) {
        throw new ApiError(401, "Invalid Token");
    }
});



export {
    registerUser,
    verifyOtp,
    resendOtp,
    loginUser,
    forgotPassword,
    updatePassword,
    signInWithGoogle,
    signInWithApple,
    signInWithLinkedin,
    signInWithFacebook,
};