import { Adventure } from "../models/adventure.model.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Booking } from "../models/booking.model.js";

export const getAllAdventure = asyncHandler(async (req, res) => {
    const { location, date, duration } = req.params;

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
        return link.url;
    }));


    const newAdventure = await Adventure.create({
        name,
        description,
        location,
        date,
        medias: mediasUrl,
        exp,
        instructor
    });

    await newAdventure.save();

    res.status(201).json(new ApiResponse(201, newAdventure, 'Adventure created successfully'));

});

export const updateAdventure = asyncHandler(async (req, res) => {
    const { name, description, location, date, medias, exp, instructor} = req.body;
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, 'Adventure id is required');
    }

    const adventure = await Adventure.findById(id);

    if (!adventure) {
        throw new ApiError(404, 'Adventure not found');
    }

    if(adventure.instructor !== req.user._id) {
        throw new ApiError(403, 'Unauthorized request');
    }

    if (req.files.medias && req.files.medias.length > 0 && req.files.medias[0]) {
        // Save image to cloudinary
        const mediasUrl = await Promise.all(req.files.medias.map(async (image) => {
            const link = await uploadOnCloudinary(image.path);
            return link.url;
        }));


        const oldMediaUrl = adventure.medias;

        // Delete old images from cloudinary
        await Promise.all(oldMediaUrl.map(async (url) => {
            await deleteFromCloudinary(url);
        }));

        adventure.medias = mediasUrl;
    }

    adventure.name = name || adventure.name;
    adventure.description = description || adventure.description;
    adventure.location = location || adventure.location;
    adventure.date = date || adventure.date;
    adventure.exp = exp || adventure.exp;
    adventure.instructor = instructor || adventure.instructor;

    await adventure.save();

    res.status(200).json(new ApiResponse(200, adventure, 'Adventure updated successfully'));

});

export const deleteAdventure = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if(!id) {
        throw new ApiError("Adventure ID is required");
    }

    const adventure = await Adventure.findById(id);

    if(!adventure) {
        throw new ApiError("Adventure with this ID does not exist");
    }

    if(adventure.instructor !== req.user._id) {
        throw new ApiError(403, 'Unauthorized request');
    }

    const medias = adventure.medias;

    await Promise.all(medias.map(async (url) => {
        await deleteFromCloudinary(url);
    }));

    await Adventure.deleteOne({ _id: id });

    return res.status(200).json(new ApiResponse(200, null, 'Adventure deleted successfully'));
});

export const getAdventure = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, 'Adventure id is required');
    }

    const adventure = await Adventure.findById(id);

    if (!adventure) {
        throw new ApiError(404, 'Adventure not found');
    }

    return res.status(200).json(adventure);
});

export const enrollAdventure = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, 'Adventure ID is required');
    }

    const adventure = await Adventure.findById(id);

    if (!adventure) {
        throw new ApiError(404, 'Adventure not found');
    }

    const booking = await Booking.findOne({ user: req.user._id, adventure: id });

    if (booking) {
        throw new ApiError(400, 'User already enrolled');
    }

    const newBooking = await Booking.create({
        user: req.user._id,
        adventure: id,
        amount: adventure.exp
    });

    await newBooking.save();

    adventure.enrolled.push(newBooking._id);
    await adventure.save();

    req.user.bookings.push(newBooking._id);
    await req.user.save();

    return res.status(200).json(new ApiResponse(200, null, 'User enrolled successfully'));
});

export const unenrollAdventure = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, 'Adventure ID is required');
    }

    const adventure = await Adventure.findById(id);

    if (!adventure) {
        throw new ApiError(404, 'Adventure not found');
    }

    const booking = await Booking.findOne({ user: req.user._id, adventure: id });

    if (!booking) {
        throw new ApiError(400, 'Users not enrolled');
    }

    await Booking.deleteOne({ _id: booking._id });

    adventure.enrolled.pull(booking._id);
    await adventure.save();

    req.user.bookings.pull(booking._id);
    await req.user.save();
    
    return res.status(200).json(new ApiResponse(200, null, 'User unenrolled successfully'));
});

export const getEnrolledAdventures = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate('adventure');
    return res.status(200).json(bookings);
});

export const getInstructorAdventures = asyncHandler(async (req, res) => {
    const adventures = await Adventure.find({ instructor: req.user._id });
    return res.status(200).json(adventures);
});