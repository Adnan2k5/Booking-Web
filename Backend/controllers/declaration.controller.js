import { Declaration } from "../models/declaration.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add default declaration if none exists
export const ensureDefaultDeclaration = async () => {
    const count = await Declaration.countDocuments();
    if (count === 0) {
        try {
            await Declaration.create({
                title: "Default Declaration",
                version: "v1.0",
                content: "Default declaration content"
            });
        } catch (error) {
            // If duplicate key error, check if default declaration already exist
            if (error.code === 11000) {
                const existingDefault = await Declaration.findOne({ title: "Default Declaration", version: "v1.0" });
                if (!existingDefault) {
                    throw error; // Re-throw if it's not what we expected
                }
                // Default declaration already exists, no need to create
            } else {
                throw error;
            }
        }
    }
};

// Get all declarations
export const getAllDeclarations = asyncHandler(async (req, res) => {
    const declarations = await Declaration.find({}).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, declarations, "Declarations fetched successfully"));
});

// Get declaration by ID
export const getDeclarationById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const declaration = await Declaration.findById(id);
    if (!declaration) {
        throw new ApiError(404, "Declaration not found");
    }
    
    res.status(200).json(new ApiResponse(200, declaration, "Declaration fetched successfully"));
});

// Get declarations by title and version
export const getDeclarationByTitleAndVersion = asyncHandler(async (req, res) => {
    const { title, version } = req.query;
    
    if (!title) {
        throw new ApiError(400, "Title is required");
    }
    
    let query = { title };
    if (version) {
        query.version = version;
    }
    
    const declarations = await Declaration.find(query).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, declarations, "Declarations fetched successfully"));
});

// Create new declaration
export const createDeclaration = asyncHandler(async (req, res) => {
    const { title, version, content } = req.body;
    
    if (!title || !version || !content) {
        throw new ApiError(400, "Title, version, and content are required");
    }
    
    // Check if declaration with same title and version already exists
    const existingDeclaration = await Declaration.findOne({ title, version });
    if (existingDeclaration) {
        throw new ApiError(409, "Declaration with this title and version already exists");
    }
    
    const declaration = await Declaration.create({
        title,
        version,
        content
    });
    
    res.status(201).json(new ApiResponse(201, declaration, "Declaration created successfully"));
});

// Update declaration
export const updateDeclaration = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, version, content } = req.body;
    
    const declaration = await Declaration.findById(id);
    if (!declaration) {
        throw new ApiError(404, "Declaration not found");
    }
    
    // Check if another declaration with same title and version exists (excluding current one)
    if (title && version) {
        const existingDeclaration = await Declaration.findOne({ 
            title, 
            version, 
            _id: { $ne: id } 
        });
        if (existingDeclaration) {
            throw new ApiError(409, "Another declaration with this title and version already exists");
        }
    }
    
    // Update fields if provided
    if (title) declaration.title = title;
    if (version) declaration.version = version;
    if (content) declaration.content = content;
    
    await declaration.save();
    
    res.status(200).json(new ApiResponse(200, declaration, "Declaration updated successfully"));
});

// Delete declaration
export const deleteDeclaration = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const declaration = await Declaration.findByIdAndDelete(id);
    if (!declaration) {
        throw new ApiError(404, "Declaration not found");
    }
    
    res.status(200).json(new ApiResponse(200, declaration, "Declaration deleted successfully"));
});

// Get latest declaration by title
export const getLatestDeclarationByTitle = asyncHandler(async (req, res) => {
    const { title } = req.params;
    
    const declaration = await Declaration.findOne({ title }).sort({ createdAt: -1 });
    if (!declaration) {
        throw new ApiError(404, "No declaration found with this title");
    }
    
    res.status(200).json(new ApiResponse(200, declaration, "Latest declaration fetched successfully"));
});

