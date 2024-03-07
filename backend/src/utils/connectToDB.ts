import mongoose from "mongoose";
export const connectToDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL as string);
  console.log("Connected to myDB");
};
