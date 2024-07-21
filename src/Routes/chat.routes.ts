import * as express from "express";
import * as chatController from "../Controller/chatController";
import { verifyAccessToken } from "../Helpers/generateJWTTokens";

export const ChatRoutes = express.Router();

//User Chat private routes
ChatRoutes.get("/get-user-chat", verifyAccessToken, chatController.getChat);
ChatRoutes.post(
  "/send-user-message",
  verifyAccessToken,
  chatController.sendMessage,
);

//Group Chat private routes
ChatRoutes.get(
  "/get-group-chat",
  verifyAccessToken,
  chatController.getGroupChat,
);
ChatRoutes.post(
  "/send-group-message",
  verifyAccessToken,
  chatController.sendGroupMessage,
);
ChatRoutes.post("/create-group", verifyAccessToken, chatController.createGroup);
ChatRoutes.get(
  "/get-all-groups",
  verifyAccessToken,
  chatController.getAllGroups,
);

//Delete Chat private routes
ChatRoutes.delete(
  "/delete-group",
  verifyAccessToken,
  chatController.deleteGroup,
);
// ChatRoutes.delete('/delete-my-group-messages', verifyAccessToken, chatController.deleteMessageFromMe)
