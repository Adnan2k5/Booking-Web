import express from "express";
import { getTerms, saveDraft, publishTerms, restoreVersion, deleteVersion } from "../controllers/terms.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// All routes require admin authentication
router.use(verifyJWT);

router.get("/", getTerms); // Get current, draft, and history
router.post("/draft", saveDraft); // Save or update draft
router.post("/publish", publishTerms); // Publish new version
router.post("/restore/:version", restoreVersion); // Restore previous version as draft
router.delete("/:version", deleteVersion); // Delete a version

export default router;
