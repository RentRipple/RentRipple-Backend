import { Request, Response, NextFunction } from "express";
import { BadRequest } from "http-errors";
import { Property } from "../Models/Property.model";
import { propertySchema } from "../Helpers/validationSchema";

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

    // Return the properties as the response
    res.status(200).json(properties);
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

    // Return the properties as the response
    res.status(200).json(propertyDetails);
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};
