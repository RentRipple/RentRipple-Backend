import * as express from "express";
import * as userProfileController from "../Controller/userProfileController";

export const UserProfileRoutes = express.Router();

UserProfileRoutes.get(
  "/viewUserProfile",
  userProfileController.viewUserProfile,
);

UserProfileRoutes.put(
  "/editUserProfile",
  userProfileController.editUserProfile,
);
