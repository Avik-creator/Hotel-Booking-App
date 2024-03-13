import express from "express";

import {
  bookRoom,
  getHotelById,
  getHotels,
  paymentIntent,
  searchHotel,
} from "../controller/hotel.controller";
import { param } from "express-validator";
import { verifyToken } from "../middleware/verifyToken.middleware";

const router = express.Router();

router.get("/search", searchHotel);

router.get("/", getHotels);

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel Id is Required")],
  getHotelById
);

router.post("/:hotelId/bookings/payment-intent", verifyToken, paymentIntent);

router.post("/:hotelId/bookings", verifyToken, bookRoom);

export default router;
