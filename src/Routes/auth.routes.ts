import * as express from "express";
import * as authController from "../controllers/authController";

export const AuthRoutes = express.Router();

/**
 * @openapi
 * /healthcheck:
 *  get:
 *     tags:
 *     - Healthcheck
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
AuthRoutes.post("/register", authController.registerUser);

AuthRoutes.post("/login", authController.loginUser);

AuthRoutes.post("/refresh-token", authController.refreshToken);

AuthRoutes.delete("/logout", authController.logoutUser);
