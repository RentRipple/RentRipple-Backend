import * as express from "express";
import * as authController from "../Controllers/authController";

export const AuthRoutes = express.Router();

AuthRoutes.post("/register", authController.registerUser);

AuthRoutes.post("/login", authController.loginUser);

AuthRoutes.post("/refresh-token", authController.refreshToken);

AuthRoutes.delete("/logout", authController.logoutUser);
