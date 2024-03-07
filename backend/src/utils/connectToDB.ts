import mongoose from "mongoose";
export const connectToDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL as string).then(() => {
    console.log("Connected to the database: ");
  });
};
