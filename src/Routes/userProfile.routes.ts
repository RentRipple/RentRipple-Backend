import * as express from "express";
import * as userProfileController from "../Controller/userProfileController";
import { verifyAccessToken } from "../Helpers/generateJWTTokens";

export const UserProfileRoutes = express.Router();

UserProfileRoutes.get(
  "/viewUserProfile",
  verifyAccessToken,
  userProfileController.viewUserProfile,
);

UserProfileRoutes.post(
  "/editUserProfile",
  verifyAccessToken,
  userProfileController.editUserProfile,
);

UserProfileRoutes.get(
  "/viewAllUsers",
  verifyAccessToken,
  userProfileController.getUsersForSidebar,
);
