import { asyncHandler } from "../utils/asyncHandler.js";

export const getUser = asyncHandler(async (req, res) => {
    return res.status(200).json(req.user);
});