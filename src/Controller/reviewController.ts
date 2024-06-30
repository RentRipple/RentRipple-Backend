import { Request, Response, NextFunction } from "express";
import { Review } from "../Models/Review.model";
import { Property } from "../Models/Property.model";
import { User } from "../Models/User.model";

import { StatusCodes } from "http-status-codes";

export const addReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { reviewer_user, reviewee_property, rating, review } = req.body;
    const reviewData = {
      reviewer_user,
      reviewee_property,
      rating,
      review,
    };
    //check if the reviewee_property exists
    const propertyExists = await Property.findById(reviewee_property);
    if (!propertyExists) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: "Property not found",
      });
    }
    //check if the reviewer_user exists
    const userExists = await User.findById(reviewer_user);
    if (!userExists) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: "User not found",
      });
    }

    const reviewInstance = new Review(reviewData);
    await reviewInstance.save();
    res.status(201).json({
      status: StatusCodes.CREATED,
      message: "Review added successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

export const getReviewsForSpecificProperty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { propertyId } = req.params;
    const reviews = await Review.find({ reviewee_property: propertyId });
    const response = {
      status: StatusCodes.OK,
      reviews,
    };
    res.status(StatusCodes.OK).json(response);
  } catch (error: any) {
    next(error);
  }
};

export const getReviewsForSpecificUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ reviewer_user: userId });
    const response = {
      status: StatusCodes.OK,
      reviews,
    };
    res.status(StatusCodes.OK).json(response);
  } catch (error: any) {
    next(error);
  }
};

export const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reviews = await Review.find();
    const response = {
      status: StatusCodes.OK,
      reviews,
    };
    res.status(StatusCodes.OK).json(response);
  } catch (error: any) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: "Review not found",
      });
    }
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Review deleted successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { reviewId } = req.params;
    const { rating, review } = req.body;
    const reviewData = {
      rating,
      review,
    };
    const reviewExists = await Review.findById(reviewId);
    if (!reviewExists) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: "Review not found",
      });
    }
    await Review.findByIdAndUpdate(reviewId, reviewData);
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Review updated successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

export const getReviewById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: "Review not found",
      });
    }
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      review,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getReviewByReviewerAndProperty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { reviewerId, propertyId } = req.params;
    const review = await Review.findOne({
      reviewer_user: reviewerId,
      reviewee_property: propertyId,
    });
    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: "Review not found",
      });
    }
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      review,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getAverageRatingForProperty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { propertyId } = req.params;
    const reviews = await Review.find({ reviewee_property: propertyId });
    let totalRating = 0;
    reviews.forEach((review) => {
      totalRating += review.rating;
    });
    const averageRating = totalRating / reviews.length;
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      averageRating,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getAverageRatingForUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ reviewer_user: userId });
    let totalRating = 0;
    reviews.forEach((review) => {
      totalRating += review.rating;
    });
    const averageRating = totalRating / reviews.length;
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      averageRating,
    });
  } catch (error: any) {
    next(error);
  }
};
