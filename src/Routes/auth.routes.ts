import * as express from "express";
import * as authController from "../Controller/authController";

export const AuthRoutes = express.Router();

AuthRoutes.post("/register", authController.registerUser);

AuthRoutes.post("/login", authController.loginUser);

AuthRoutes.post("/refresh-token", authController.refreshToken);

AuthRoutes.post("/forgot-password", authController.forgotPassword);

AuthRoutes.post(
  "/verify-security-answers",
  authController.verifySecurityAnswers,
);

AuthRoutes.post("/reset-password", authController.resetPassword);

AuthRoutes.delete("/logout", authController.logoutUser);
