import * as express from "express";
import * as propertyController from "../Controller/propertyController";

export const PropertyRoutes = express.Router();

// AuthRoutes.post("/add-property", authController.addProperty);
PropertyRoutes.post("/add-property", propertyController.addProperty);
PropertyRoutes.get("/get-properties", propertyController.getProperties);
