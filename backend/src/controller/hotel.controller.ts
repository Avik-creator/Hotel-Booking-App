import { Request, Response } from "express";
import Hotel from "../models/hotels.models";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { constructSearchQuery } from "../utils/constructSearchQuery";
import { validationResult } from "express-validator";
import Stripe from "stripe";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);

export const getAllHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

export const getHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find().sort("-lastUpdated");
    res.json(hotels);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

export const getInvididualHotel = async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

export const searchHotel = async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getHotelById = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  const id = req.params.id.toString();

  try {
    const hotel = await Hotel.findById(id);
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotel" });
  }
};

export const paymentIntent = async (req: Request, res: Response) => {
  const { numberOfNights } = req.body;
  const hotelId = req.params.hotelId;

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return res.status(400).json({ message: "Hotel not found" });
  }

  const totalCost = hotel.pricePerNight * numberOfNights;

  const paymentIntent = await STRIPE.paymentIntents.create({
    amount: totalCost * 100,
    currency: "inr",
    metadata: {
      hotelId,
      userId: req.userId,
    },
  });

  if (!paymentIntent.client_secret) {
    return res.status(500).json({ message: "Error creating payment intent" });
  }

  const response = {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret.toString(),
    totalCost,
  };

  res.send(response);
};

export const bookRoom = async (req: Request, res: Response) => {
  try {
    const paymentIntentId = req.body.paymentIntentId;

    const paymentIntent = await STRIPE.paymentIntents.retrieve(
      paymentIntentId as string
    );

    if (!paymentIntent) {
      return res.status(400).json({ message: "payment intent not found" });
    }

    if (
      paymentIntent.metadata.hotelId !== req.params.hotelId ||
      paymentIntent.metadata.userId !== req.userId
    ) {
      return res.status(400).json({ message: "payment intent mismatch" });
    }

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
      });
    }

    const newBooking: BookingType = {
      ...req.body,
      userId: req.userId,
    };

    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.hotelId },
      {
        $push: { bookings: newBooking },
      }
    );

    if (!hotel) {
      return res.status(400).json({ message: "hotel not found" });
    }

    await hotel.save();
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};
