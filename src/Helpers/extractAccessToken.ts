import { Request } from "express";
import { BadRequest } from "http-errors";

export const extractAccessToken = (req: Request): string => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw new BadRequest("User not authenticated");
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new BadRequest("Token not provided");
  }
  return token;
};
