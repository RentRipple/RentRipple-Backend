import { Request, Response, NextFunction } from "express";
import { User } from "../Models/User.model";
import { BadRequest, NotFound } from "http-errors";
import { StatusCodes } from "http-status-codes";
import { base64Decoder } from "../Helpers/base64Decoder";

const getUserIdFromBase64 = async (base64String: string): Promise<string> => {
  try {
    const userId = await base64Decoder(base64String);
    if (!userId) {
      throw new BadRequest("Invalid base64 string provided");
    }
    return userId;
  } catch (error) {
    throw new BadRequest("Invalid base64 string provided");
  }
};

export const viewUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let accessToken: string | undefined = req.headers["authorization"];
    if (!accessToken) {
      throw new BadRequest("User not authenticated");
    }
    accessToken = accessToken.split(" ")[1];
    const userId = await getUserIdFromBase64(accessToken);
    const userProfile = await User.findById(userId).select(
      "-password -securityQuestions -_id -__v",
    );
    if (!userProfile) {
      throw new NotFound("User profile not found");
    }

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      userProfile,
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
    let accessToken: string | undefined = req.headers["authorization"];
    if (!accessToken) {
      throw new BadRequest("User not authenticated");
    }
    accessToken = accessToken.split(" ")[1];
    const userId = await getUserIdFromBase64(accessToken);

    const { firstName, lastName, email, gender, number } = req.body;

    const userProfile = await User.findById(userId);

    if (!userProfile) {
      throw new NotFound("User profile not found");
    }

    userProfile.firstName = firstName || userProfile.firstName;
    userProfile.lastName = lastName || userProfile.lastName;
    userProfile.email = email || userProfile.email;
    userProfile.gender = gender || userProfile.gender;
    userProfile.number = number || userProfile.number;

    await userProfile.save();

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "User profile updated successfully",
      userProfile,
    });
  } catch (error: any) {
    next(error);
  }
};