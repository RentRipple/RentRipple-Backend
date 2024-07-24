import express, { Request, Response, NextFunction } from "express";
import { getMessages, sendMessage } from "../Controller/chatController";
import { verifyAccessToken } from "../Helpers/generateJWTTokens";

// Define the router
export const messageRouter = express.Router();

// Route to get messages for a specific chat
messageRouter.get(
  "/:id",
  verifyAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getMessages(req, res);
    } catch (error) {
      next(error);
    }
  },
);

// Route to send a message to a specific chat
messageRouter.post(
  "/send/:id",
  verifyAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await sendMessage(req, res);
    } catch (error) {
      next(error);
    }
  },
);
