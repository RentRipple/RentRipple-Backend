import * as express from "express";
import * as reviewController from "../Controller/reviewController";
import { verifyAccessToken } from "../Helpers/generateJWTTokens";

export const reviewRoutes = express.Router();

reviewRoutes.post("/add-review", verifyAccessToken, reviewController.addReview);

reviewRoutes.get(
  "/get-reviews/:propId",
  verifyAccessToken,
  reviewController.getReviewsForSpecificProperty,
);

reviewRoutes.get(
  "/user-reviews/:userId",
  verifyAccessToken,
  reviewController.getReviewsForSpecificUser,
);

reviewRoutes.get("/get-all-reviews", reviewController.getAllReviews);
