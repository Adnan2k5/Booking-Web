import { UserAchievment } from "../models/userAchievment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { updateUserAchievment } from "../utils/updateUserAchievment.js";

export const getUserAchievements = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userAchievement = await UserAchievment.findOne({ userId: userId });
  if (!userAchievement) {
    throw new ApiError(404, "User achievements not found");
  }
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
