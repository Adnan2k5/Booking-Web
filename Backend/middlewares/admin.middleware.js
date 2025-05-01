import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(async (req, _, next) => {
    const user = req.user;
    if (!user.role == 'admin') {
        throw new ApiError(403, "Unauthorized request");
    }
    next();
});

export const verifyInstructor = asyncHandler(async (req, _, next) => {
    const user = req.user;
    if (!user.role == 'admin' && !user.role == 'instructor') {
        throw new ApiError(403, "Unauthorized request");
    }
    next();
});