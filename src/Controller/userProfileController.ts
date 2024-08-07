import { Request, Response, NextFunction } from "express";
import { User, IUser } from "../Models/User.model";
import { NotFound } from "http-errors";
import { StatusCodes } from "http-status-codes";
import { getUserIdFromBase64 } from "../Helpers/base64Decoder";
import { Property } from "../Models/Property.model";
import { extractAccessToken } from "../Helpers/extractAccessToken";
import mongoose from "mongoose";

interface CustomRequest extends Request {
  user?: {
    _id: mongoose.Schema.Types.ObjectId;
    // other user fields if needed
  };
}

export const viewUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = extractAccessToken(req);
    const userId = await getUserIdFromBase64(accessToken);
    const userProfile = await User.findById(userId);

    if (!userProfile) {
      throw new NotFound("User profile not found");
    }

    const properties = await Property.find({ ownerDetails: userId });

    const userProfileResponse = {
      UserDetails: {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        gender: userProfile.gender,
        number: userProfile.number,
        rating: userProfile.rating,
        profilePicture: userProfile.profilePicture,
        address: userProfile.address,
        birthDate: userProfile.birthDate,
        rentalHistory: userProfile.rentalHistory,
        preferredLocation: userProfile.preferredLocation,
      },
      propertyDetails: properties.map((property) => ({
        id: property._id,
        address_line1: property.address_line1,
        address_line2: property.address_line2,
        city: property.city,
        state: property.state,
        country: property.country,
        postal_code: property.postal_code,
        price: property.price,
        imageUrl: property.imageUrl,
      })),
    };

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "User profile view",
      userProfile: userProfileResponse,
    });
  } catch (error: any) {
    next(error);
  }
};

export const editUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = extractAccessToken(req);
    const userId = await getUserIdFromBase64(accessToken);

    const {
      firstName,
      lastName,
      gender,
      number,
      address,
      birthDate,
      profilePicture,
      preferredLocation,
    } = req.body;

    const userProfile = await User.findById(userId);

    if (!userProfile) {
      throw new NotFound("User profile not found");
    }

    userProfile.firstName = firstName || userProfile.firstName;
    userProfile.lastName = lastName || userProfile.lastName;
    userProfile.gender = gender || userProfile.gender;
    userProfile.number = number || userProfile.number;
    userProfile.profilePicture = profilePicture || userProfile.profilePicture;
    userProfile.address = address || userProfile.address;
    userProfile.birthDate = birthDate || userProfile.birthDate;
    userProfile.preferredLocation =
      preferredLocation || userProfile.preferredLocation;

    await userProfile.save();

    const userProfileResponse = {
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      gender: userProfile.gender,
      number: userProfile.number,
      profilePicture: userProfile.profilePicture,
      address: userProfile.address,
      birthDate: userProfile.birthDate,
      preferredLocation: userProfile.preferredLocation,
    };

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "User profile updated successfully",
      userProfile: userProfileResponse,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getUsersForSidebar = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  try {
    const accessToken = extractAccessToken(req);
    const loggedInUserId = await getUserIdFromBase64(accessToken);

    if (!loggedInUserId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const filteredUsers = (await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password")) as IUser[];

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", (error as Error).message);
    res.status(500).json({ error: "Internal server error" });
  }
};
