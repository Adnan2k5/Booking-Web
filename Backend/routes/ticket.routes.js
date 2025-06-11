import { Router } from "express";
import {
  createTicket,
  getUserTickets,
  getTicketById,
  addTicketResponse,
  updateTicketStatus,
  getAllTickets,
  deleteTicket,
} from "../controllers/ticket.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { languageMiddleware } from "../middlewares/language.middleware.js";

const router = Router();

// Apply JWT verification and language middleware to all routes
router.use(verifyJWT);
router.use(languageMiddleware);

// User routes
router.post("/create", upload.array("attachments", 5), createTicket);
router.get("/my-tickets", getUserTickets);
router.get("/:ticketId", getTicketById);
router.post("/:ticketId/respond", addTicketResponse);
router.patch("/:ticketId/status", updateTicketStatus);

// Admin routes
router.get("/", getAllTickets);
router.delete("/:ticketId", verifyAdmin, deleteTicket);

export default router;
