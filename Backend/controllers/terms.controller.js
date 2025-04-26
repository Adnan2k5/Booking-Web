import { Terms } from "../models/terms.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add default terms and condition if none exists
export const ensureDefaultTerms = async () => {
    const count = await Terms.countDocuments();
    if (count === 0) {
        await Terms.create({
            version: "v1.0",
            content: "Hello",
            status: "published",
            publishedBy: "System",
            publishedAt: new Date(),
            updatedAt: new Date(),
        });
    }
};

// Get current published terms, latest draft, and history
export const getTerms = asyncHandler(async (req, res) => {
    const current = await Terms.findOne({ status: "published" }).sort({ publishedAt: -1 });
    const draft = await Terms.findOne({ status: "draft" }).sort({ updatedAt: -1 });
    const history = await Terms.find({ status: "published" }).sort({ publishedAt: -1 });
    res.status(200).json(new ApiResponse(200, { current, draft, history }, "Terms fetched successfully"));
});

// Save or update draft
export const saveDraft = asyncHandler(async (req, res) => {
    const { content, version } = req.body;
    let draft = await Terms.findOne({ version, status: "draft" });
    if (draft) {
        draft.content = content;
        draft.updatedAt = new Date();
        await draft.save();
    } else {
        draft = await Terms.create({ version, content, status: "draft", updatedAt: new Date() });
    }
    res.status(200).json(new ApiResponse(200, draft, "Draft saved successfully"));
});

// Publish terms (creates new published version)
export const publishTerms = asyncHandler(async (req, res) => {
    const { content, version, publishedBy } = req.body;
    const published = await Terms.create({
        version,
        content,
        status: "published",
        publishedBy,
        publishedAt: new Date(),
        updatedAt: new Date(),
    });
    res.status(201).json(new ApiResponse(201, published, "Terms published successfully"));
});

// Restore a previous version as draft
export const restoreVersion = asyncHandler(async (req, res) => {
    const { version } = req.params;
    const prev = await Terms.findOne({ version, status: "published" });
    if (!prev) throw new ApiError(404, "Version not found");
    const draft = await Terms.create({
        version: `${version}-restored-draft-${Date.now()}`,
        content: prev.content,
        status: "draft",
        updatedAt: new Date(),
    });
    res.status(201).json(new ApiResponse(201, draft, "Version restored as draft"));
});

// Delete a version
export const deleteVersion = asyncHandler(async (req, res) => {
    const { version } = req.params;
    const deleted = await Terms.findOneAndDelete({ version });
    if (!deleted) throw new ApiError(404, "Version not found");
    res.status(200).json(new ApiResponse(200, deleted, "Version deleted successfully"));
});
