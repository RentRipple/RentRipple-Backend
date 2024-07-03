import { Request, Response, NextFunction } from "express";
import { BadRequest } from "http-errors";
import { Property } from "../Models/Property.model";
import { propertySchema } from "../Helpers/validationSchema";
import { User } from "../Models/User.model";
import { extractAccessToken } from "../Helpers/extractAccessToken";
import { getUserIdFromBase64 } from "../Helpers/base64Decoder";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "http-errors";

// Controller function to handle JSON formatted data
export const addPropertyJson = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = extractAccessToken(req);
    const userId = await getUserIdFromBase64(accessToken);
    const userProfile = await User.findById(userId);
    if (!userProfile) {
      throw new Error("User not found");
    }

    const { error, value } = propertySchema.validate(req.body);
    if (error) {
      throw BadRequest(error.message);
    }

    const property = new Property({
      ...value,
      ownerDetails: userId,
    });

    const savedProperty = await property.save();

    return res.status(StatusCodes.OK).json(savedProperty);
  } catch (error: any) {
    if (error.isJoi) {
      error.status = 422;
    }

    next(error);
  }
};

export const addPropertyImages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const propertyId = req.body.propertyId;

    const property = await Property.findById(propertyId);
    if (!property) {
      throw NotFound("Property not found");
    }

    const imageUrls: string[] = files.map((image: any) => image.image);

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { imageUrl: imageUrls },
      { new: true },
    );

    if (!updatedProperty) {
      throw new Error("Could not update property with images");
    }

    res.json(updatedProperty);
  } catch (error: any) {
    next(error);
  }
};

export const getProperties = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Fetch all properties from the database
    const properties = await Property.find();
    const propertyCount = await Property.countDocuments();
    const response: {
      properties: {
        id: string;
        location: string;
        price: string;
        shortDescription: string;
        imageUrl: string[];
      }[];
      count: number;
    } = {
      properties: [],
      count: propertyCount,
    };
    for (const property of properties) {
      response.properties.push({
        id: property._id as string,
        location: property.location,
        price: property.price,
        imageUrl: property.imageUrl,
        shortDescription: property.description,
      });
    }

    // Return the properties as the response
    res.status(200).json(response);
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};

export const getPropertyDetailsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Extract the property ID from the request parameters
    const { propId } = req.params;

    // Fetch all properties from the database
    const propertyDetails = await Property.findById(propId);
    if (!propertyDetails) {
      throw BadRequest("Property not found");
    }
    const ownerId = propertyDetails.ownerDetails;
    const ownerDetails = await User.findById(ownerId);

    if (!ownerDetails) {
      throw BadRequest("Owner not found");
    }

    const response = {
      propertyDetails: {
        id: propertyDetails._id,
        address_line1: propertyDetails.address_line1,
        address_line2: propertyDetails.address_line2,
        city: propertyDetails.city,
        state: propertyDetails.state,
        country: propertyDetails.country,
        postal_code: propertyDetails.postal_code,
        description: propertyDetails.description,
        price: propertyDetails.price,
        leaseLength: propertyDetails.leaseLength,
        deposit: propertyDetails.deposit,
        imageUrl: propertyDetails.imageUrl,
        location: propertyDetails.location,
        extraFeatures: propertyDetails.extraFeatures,
        features: propertyDetails.features,
        utilities: propertyDetails.utilities,
      },
      ownerDetails: {
        id: ownerDetails._id,
        name: ownerDetails.firstName + " " + ownerDetails.lastName,
        email: ownerDetails.email,
        phone:
          ownerDetails.number == null ? "Not available" : ownerDetails.number,
        imageUrl:
          ownerDetails.profilePicture == "" ? "" : ownerDetails.profilePicture,
        rating: ownerDetails.rating,
      },
    };
    // Return the properties as the response
    res.status(200).json(response);
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};
