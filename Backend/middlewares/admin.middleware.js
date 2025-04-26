import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(async (req, _, next) => {
    const user = req.user;
    if (!user.isAdmin) {
        throw new ApiError(403, "Unauthorized request");
    }
    next();
});

export const verifyInstructor = asyncHandler(async (req, _, next) => {
    const user = req.user;
    if (!user.isInstructor) {
        throw new ApiError(403, "Unauthorized request");
    }
    next();
});