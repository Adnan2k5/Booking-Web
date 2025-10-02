import { UserAchievment } from "../models/userAchievment.model.js"; // ✅ Added .js extension
import { asyncHandler } from "../utils/asyncHandler.js"; // ✅ Added .js extension
import ApiResponse from "../utils/ApiResponse.js"; // ✅ Import ApiResponse
import { ApiError } from "../utils/ApiError.js"; // ✅ Import ApiError
import { updateUserAchievment } from "../utils/updateUserAchievment.js";

export const getUserAchievements = asyncHandler(async (req, res) => {
 
  const userId = req.user._id; // ✅ Fixed: req.user._id instead of req.user.user


  const userAchievement = await UserAchievment.findOne({ userId: userId }); // ✅ Added await and correct field name
  if (!userAchievement) {
    throw new ApiError(404, "User achievements not found");
  }

  // ✅ Send proper response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userAchievement,
        "User achievements retrieved successfully"
      )
    );
});
