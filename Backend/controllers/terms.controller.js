import { Terms } from "../models/terms.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add default terms and condition if none exists
export const ensureDefaultTerms = async () => {
    const count = await Terms.countDocuments();
    if (count === 0) {
        await Terms.create({
            title: "Default Terms", // Added title
            version: "v1.0",
            content: "Hello",
            status: "published",
            publishedBy: "System",
            publishedAt: new Date(),
            updatedAt: new Date(),
        });
    }
};

// Get current published terms, latest draft, and history for a specific title
export const getTerms = asyncHandler(async (req, res) => {
    const { title } = req.query; // Expect title in query params
    if (!title) {
        throw new ApiError(400, "Title is required to fetch terms");
    }
    const current = await Terms.findOne({ title, status: "published" }).sort({ publishedAt: -1 });
    const draft = await Terms.findOne({ title, status: "draft" }).sort({ updatedAt: -1 });
    const history = await Terms.find({ title, status: "published" }).sort({ publishedAt: -1 });
    res.status(200).json(new ApiResponse(200, { current, draft, history }, "Terms fetched successfully"));
});

// Save or update draft for a specific title
export const saveDraft = asyncHandler(async (req, res) => {
    const { title, content, version } = req.body;
    if (!title || !version) {
        throw new ApiError(400, "Title and version are required for draft");
    }
    let draft = await Terms.findOne({ title, version, status: "draft" });
    if (draft) {
        draft.content = content;
        draft.updatedAt = new Date();
        await draft.save();
    } else {
        draft = await Terms.create({ title, version, content, status: "draft", updatedAt: new Date() });
    }
    res.status(200).json(new ApiResponse(200, draft, "Draft saved successfully"));
});

// Publish terms (creates new published version for a specific title)
export const publishTerms = asyncHandler(async (req, res) => {
    const { title, content, version, publishedBy } = req.body;
    if (!title || !version) {
        throw new ApiError(400, "Title and version are required for publishing");
    }
    // Optionally, ensure no other version of the same title is currently a draft, or handle as needed.
    // For example, delete existing drafts for this title:
    // await Terms.deleteMany({ title, status: "draft" });

    const published = await Terms.create({
        title,
        version,
        content,
        status: "published",
        publishedBy,
        publishedAt: new Date(),
        updatedAt: new Date(),
    });
    res.status(201).json(new ApiResponse(201, published, "Terms published successfully"));
});

// Restore a previous version as draft for a specific title
export const restoreVersion = asyncHandler(async (req, res) => {
    const { version } = req.params;
    const { title } = req.query; // Expect title in query params
    if (!title) {
        throw new ApiError(400, "Title is required to restore a version");
    }
    const prev = await Terms.findOne({ title, version, status: "published" });
    if (!prev) throw new ApiError(404, "Published version not found for the given title and version");

    // Check if a draft for this title already exists, and handle (e.g., disallow, or overwrite)
    const existingDraft = await Terms.findOne({ title, status: "draft" });
    if (existingDraft) {
        // Option 1: Disallow - throw new ApiError(409, "A draft for this title already exists. Publish or delete it first.");
        // Option 2: Overwrite (or update) - for simplicity, let's create a new versioned draft
        // Or, simply delete the old draft:
        // await Terms.deleteOne({ _id: existingDraft._id });
    }

    const draft = await Terms.create({
        title,
        version: `${version}-restored-draft-${Date.now()}`,
        content: prev.content,
        status: "draft",
        updatedAt: new Date(),
    });
    res.status(201).json(new ApiResponse(201, draft, "Version restored as draft"));
});

// Delete a version for a specific title
export const deleteVersion = asyncHandler(async (req, res) => {
    const { version } = req.params;
    const { title } = req.query; // Expect title in query params
    if (!title) {
        throw new ApiError(400, "Title is required to delete a version");
    }
    const deleted = await Terms.findOneAndDelete({ title, version });
    if (!deleted) throw new ApiError(404, "Version not found for the given title");
    res.status(200).json(new ApiResponse(200, deleted, "Version deleted successfully"));
});

// Get all term documents (irrespective of title or status)
export const getAllTermDocuments = asyncHandler(async (req, res) => {
    const allTerms = await Terms.find({}).sort({ title: 1, updatedAt: -1 });
    // Returns an empty array if no terms are found, which is appropriate for this type of query.
    res.status(200).json(new ApiResponse(200, allTerms, "All terms documents fetched successfully"));
});
