import express from "express";

import { getHotelById, searchHotel } from "../controller/hotel.controller";
import { param } from "express-validator";

const router = express.Router();

router.get("/search", searchHotel);

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel Id is Required")],
  getHotelById
);

export default router;
