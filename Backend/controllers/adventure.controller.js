import { Adventure } from "../models/adventure.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAdventure = asyncHandler(async (req, res) => {
    const { location, date, duration } = req.body;

    const adventures = await Adventure.find({ location, date, duration }).sort({ date: 1 }).select('-enrolled -instructors');

    return res.status(200).json(adventures);
})

export const createAdventure = asyncHandler(async (req, res) => {
    const { name, description, location, date, medias, exp, instructor } = req.body;

    if (!name || !description || !location || !date || !exp || !instructor) {
        throw new ApiError(400, 'All fields are required');
    }

    if (!req.files || !req.files.medias || req.files.medias.length <= 0 || !req.files.medias[0]) {
        throw new ApiError(400, 'Image is required');
    }

    // Save image to cloudinary
    const mediasUrl = await Promise.all(req.files.medias.map(async (image) => {
        const link = await uploadOnCloudinary(image.path);
        return link;
    }));


    const newAdventure = await Adventure.create({
        name,
        description,
        location,
        date,
        medias : mediasUrl,
        exp,
        instructor
    });

    await newAdventure.save();

    res.status(201).json(ApiResponse(201, newAdventure, 'Adventure created successfully'));

});

export const updateAdventure = async (req, res) => { };

export const deleteAdventure = async (req, res) => { };

export const enrollAdventure = async (req, res) => { };

export const unenrollAdventure = async (req, res) => { };

export const getEnrolledAdventures = async (req, res) => { };

export const getInstructorAdventures = async (req, res) => { };

export const getAdventureById = async (req, res) => { };