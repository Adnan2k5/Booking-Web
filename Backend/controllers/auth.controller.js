import {User} from '../models/user.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import sendEmail from '../utils/sendOTP.js';


const registerUser = asyncHandler( async (req, res) => {
    const {email, password} = req.body;
    
    if ((email?.trim() === "" || !email) || (password?.trim() === "" || !password)) {
        throw new ApiError(400, "Email and Password are Required");
    }

    const userExist = await User.findOne({email: email});

    if(userExist) {
        throw new ApiError(409, "User with this email already exists !");
    }

    const user = await User.create({
        email: email.toLowerCase(),
        password: password,
    });

    sendEmail({
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: "Account Created",
        text: `Hello ${email}, Your account has been created successfully`,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -role"
    );

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    res.status(201).
    json(
        new ApiResponse(200, {
            user: user,
        }, "User registered Succesfully"),
    );
});

export {registerUser};