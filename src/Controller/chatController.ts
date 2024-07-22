import { Request, Response } from "express";
import Conversation from "../Models/Conversation.model";
import Message, { IMessage } from "../Models/Message.model";
import { getReceiverSocketId, io } from "../Helpers/Socket";
import { IUser } from "../Models/User.model"; // Adjust the import path as necessary
import { getUserIdFromBase64 } from "../Helpers/base64Decoder";
import { extractAccessToken } from "../Helpers/extractAccessToken";

// Type for request object including user information
interface IRequest extends Request {
  user?: IUser;
}

export const sendMessage = async (req: IRequest, res: Response) => {
  try {
    const accessToken = extractAccessToken(req);
    const loggedInUserId = await getUserIdFromBase64(accessToken);

    if (!loggedInUserId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = loggedInUserId;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    }) as IMessage;

    if (newMessage) {
      conversation.messages.push(newMessage._id as any);
    }

    // Save the conversation and message in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    // Emit the new message to the receiver's socket if available
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error: any) {
    console.error("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req: IRequest, res: Response) => {
  try {
    const accessToken = extractAccessToken(req);
    const loggedInUserId = await getUserIdFromBase64(accessToken);

    if (!loggedInUserId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const { id: userToChatId } = req.params;
    const senderId = loggedInUserId;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages as any;

    res.status(200).json(messages);
  } catch (error: any) {
    console.error("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
