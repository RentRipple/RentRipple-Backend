import * as express from "express";
import * as propertyController from "../Controller/propertyController";
import { verifyAccessToken } from "../Helpers/generateJWTTokens";
import upload from "../Helpers/multerConfig";

export const PropertyRoutes = express.Router();

PropertyRoutes.post(
  "/add-property",
  verifyAccessToken,
  propertyController.addPropertyJson,
);

PropertyRoutes.post(
  "/add-property-images",
  verifyAccessToken,
  upload.array("images", 10),
  propertyController.addPropertyImages,
);

PropertyRoutes.get("/get-properties", propertyController.getProperties);

PropertyRoutes.get(
  "/get-properties/:propId",
  verifyAccessToken,
  propertyController.getPropertyDetailsById,
);
