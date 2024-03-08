import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import userRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import { connectToDB } from "./utils/connectToDB";
import path from "path";

const app = express();
console.log(process.env.FRONTEND_URL);
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

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
