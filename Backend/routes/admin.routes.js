import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import express from "express";
import {
  createAdmin,
  deleteAdmin,
  getAllAdmins,
  updateAdmin,
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.use(verifyJWT);
adminRouter.use(verifyAdmin);

adminRouter.post("/create", createAdmin);
adminRouter.get("/", getAllAdmins);
adminRouter.put("/:id", updateAdmin);
adminRouter.delete("/:id", deleteAdmin);

export default adminRouter;
