import {User} from './models/User.Model.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';


const registerUser = asyncHandler( async (req, res) => {
    const {emailId, password} = req.body;
    
    if ((emailId?.trim() === "" || !emailId) || (password?.trim() === "" || !password)) {
        throw new ApiError(400, "Email and Password are Required");
    }

    const userExist = await User.findOne({emailId: emailId});

    if(userExist) {
        throw new ApiError(409, "User with this email already exists !");
    }

    const user = await User.create({
        emailId: emailId.toLowerCase(),
        password: password,
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