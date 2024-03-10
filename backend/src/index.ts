import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import userRoutes from "./routes/auth.routes";
import hotelRoutes from "./routes/myHotels.routes";
import cookieParser from "cookie-parser";
import { connectToDB } from "./utils/connectToDB";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
connectToDB();
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/my-hotels", hotelRoutes);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
