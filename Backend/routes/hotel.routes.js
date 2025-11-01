import express from "express";

import {
  approveHotel,
  getHotel,
  getHotelById,
  HotelRegistration,
  rejectHotel,
  updateHotel,
  updateHotelPrice,
  updateHotelRating,
  verifyHotel,
} from "../controllers/hotel.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { languageMiddleware } from "../middlewares/language.middleware.js";

const router = express.Router();

// Apply language middleware to all routes
router.use(languageMiddleware);

router.route("/").post(
  upload.fields([
    { name: "businessLicense", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
    { name: "taxCertificate", maxCount: 1 },
    { name: "insuranceDocument", maxCount: 1 },
    { name: "hotelImages", maxCount: 5 },
  ]),
  HotelRegistration
);

router.route("/verify").post(verifyHotel);
router.route("/:id").get(getHotelById);
router.route("/").get(getHotel);
router.route("/approve/:id").put(approveHotel);
router.route("/reject/:id").put(rejectHotel);
router.route("/rating/:id").put(updateHotelRating);
router.route("/price/:id").put(updateHotelPrice);
router.route("/update/:id").put(
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "hotelImages", maxCount: 5 },
  ]),
  updateHotel
);

export default router;
