import express from "express";

import {
  approveHotel,
  getHotel,
  getHotelById,
  HotelRegistration,
  rejectHotel,
  updateHotelPrice,
  updateHotelRating,
  verifyHotel,
} from "../controllers/hotel.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

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

export default router;
