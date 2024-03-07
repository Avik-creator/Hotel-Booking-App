import express, { Request, Response } from "express";
import { loginUser, logout, registerUser } from "../controller/auth.controller";
import { check } from "express-validator";
import { verifyToken } from "../middleware/verifyToken.middleware";

const router = express.Router();

router.post(
  "/register",
  [
    check("firstName", "First Name is Required").isString(),
    check("lastName", "Last Name is Required").isString(),
    check("email", "Email is Required").isEmail(),
    check("password", "Password is Required").isLength({ min: 6 }),
  ],
  registerUser
);

router.post(
  "/login",
  [
    check("email", "Email is Required").isEmail(),
    check("password", "Password is Required").isLength({ min: 6 }),
  ],

  loginUser
);

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).json({ message: "Token is valid", userId: req.userId });
});

router.post("/logout", logout);

export default router;
