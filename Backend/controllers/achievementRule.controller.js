import { AchievementRule } from "../models/achievementRule.model.js";
import { UserAdventureExperience } from "../models/userAdventureExperience.model.js";
import { Booking } from "../models/booking.model.js";
import { UserAchievement } from "../models/userAchievement.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Admin: create a rule
export const createRule = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (!payload.name && payload.title) payload.name = payload.title;
  if (!payload.title) payload.title = payload.name;
  const rule = await AchievementRule.create(payload);
  res
    .status(201)
    .json(new ApiResponse(201, rule, "Achievement rule created"));
});

// Admin: update a rule
export const updateRule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = { ...req.body };
  if (!payload.name && payload.title) payload.name = payload.title;
  if (!payload.title && payload.name) payload.title = payload.name;
  const rule = await AchievementRule.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!rule) throw new ApiError(404, "Rule not found");
  res.status(200).json(new ApiResponse(200, rule, "Achievement rule updated"));
});

// Admin: delete a rule
export const deleteRule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const rule = await AchievementRule.findByIdAndDelete(id);
  if (!rule) throw new ApiError(404, "Rule not found");
  res.status(200).json(new ApiResponse(200, rule, "Achievement rule deleted"));
});

// Public/Admin: list rules (optionally filter by adventure)
export const listRules = asyncHandler(async (req, res) => {
  const { adventure, active } = req.query;
  const filter = {};
  if (adventure) filter.adventure = adventure;
  if (active !== undefined) filter.active = active === "true";
  const rules = await AchievementRule.find(filter).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, rules, "Achievement rules list"));
});

// Internal helper (can be used by services): evaluate and award for a given user
export const evaluateAndAwardForUser = async (userId) => {
  // Load user experience per adventure
  const experiences = await UserAdventureExperience.find({ user: userId });

  // Build maps for quick checks
  const byAdventure = new Map();
  let globalCompleted = 0;
  for (const exp of experiences) {
    byAdventure.set(String(exp.adventure), exp);
    globalCompleted += exp.completedSessions || 0;
  }

  const rules = await AchievementRule.find({ active: true });

  // Preload confirmed bookings per adventure for this user (if schema supports adventure ref)
  const userBookings = await Booking.find({ user: userId, status: "confirmed" })
    .populate({ path: "session", select: "adventureId" })
    .lean();
  const confirmedByAdventure = new Map();
  let confirmedGlobal = 0;
  for (const b of userBookings) {
    const advId = String(b.session?.adventureId || "");
    if (!advId) continue;
    confirmedByAdventure.set(advId, (confirmedByAdventure.get(advId) || 0) + 1);
    confirmedGlobal += 1;
  }

  // Load or init user's achievement record
  let userAch = await UserAchievement.findOne({ userId: userId });
  if (!userAch) {
    // Create minimal doc if missing so we can push achievements
    userAch = await UserAchievement.create({
      userId,
      email: "",
      name: "",
      level: 0,
    });
  }

  const already = new Set(
    (userAch.achievements || []).map((a) => `${a.name}|${a.level || 1}`)
  );
  let newlyAwarded = [];

  for (const rule of rules) {
    let value = 0;
    if (rule.metric === "completedSessions") {
      if (rule.adventure) {
        const exp = byAdventure.get(String(rule.adventure));
        value = exp?.completedSessions || 0;
      } else {
        value = globalCompleted;
      }
    } else if (rule.metric === "confirmedBookings") {
      if (rule.adventure) {
        value = confirmedByAdventure.get(String(rule.adventure)) || 0;
      } else {
        value = confirmedGlobal;
      }
    }

    if (value >= rule.threshold) {
      const achName = rule.name || rule.title;
      const key = `${achName}|1`;
      if (!already.has(key)) {
        userAch.achievements.push({
          name: achName,
          description: rule.description,
          category: rule.label || "global",
          level: 1,
          earnedAt: new Date(),
        });
        already.add(key);
        newlyAwarded.push(rule.title);
      }
    }
  }

  if (newlyAwarded.length > 0) {
    await userAch.save();
  }

  return newlyAwarded;
};

// Authed user endpoint to evaluate and return newly awarded titles
export const evaluateMyAchievements = asyncHandler(async (req, res) => {
  const newly = await evaluateAndAwardForUser(req.user._id);
  res
    .status(200)
    .json(new ApiResponse(200, { awarded: newly }, "Achievements evaluated"));
});
