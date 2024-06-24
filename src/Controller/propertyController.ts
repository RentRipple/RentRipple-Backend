import { Request, Response, NextFunction } from "express";
import { BadRequest } from "http-errors";
import { Property } from "../Models/Property.model";
import { propertySchema } from "../Helpers/validationSchema";
import { User } from "../Models/User.model";

export const addProperty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Validate the request body
    console.log(req.body);
    const { error, value } = propertySchema.validate(req.body);
    if (error) {
      throw BadRequest(error.message);
    }

    // Create a new Property instance
    const property = new Property(value);

    // Save the property to the database
    const savedProperty = await property.save();

    // Return the saved property as the response
    res.status(201).json(savedProperty);
  } catch (error: any) {
    // If the error is a Joi validation error, set status to 422 Unprocessable Entity
    if (error.isJoi) {
      error.status = 422;
    }
    // Pass the error to the error handling middleware
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
        shortDescription: property.description.slice(0, 40),
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
