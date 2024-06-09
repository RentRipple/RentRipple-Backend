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
