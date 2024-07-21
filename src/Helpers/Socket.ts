import { Server, Socket } from "socket.io";
import { User } from "../Models/User.model";
interface Payload {
  userId?: string;
  senderId?: string;
  receiverId?: string;
}

export const setupSocketIO = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    let userId: string | undefined;

    socket.on("userOnline", async (payload: Payload) => {
      userId = payload.userId;
      if (!userId) return console.log("No user Id");

      const user = await User.findById(userId);
      if (user) {
        user.online = true;
        await user.save();
        io.emit("userOnline", { userId });
      }
    });

    socket.on("disconnect", async () => {
      if (!userId) return console.log("No user Id");

      const user = await User.findById(userId);
      if (user) {
        user.online = false;
        await user.save();
        io.emit("userOffline", { userId });
      }
    });

    socket.on("sendMsg", (payload: any) => {
      io.emit("sendMsg", payload);
    });

    socket.on("userIsTyping", (payload: Payload) => {
      const { senderId, receiverId } = payload;
      io.emit("userIsTyping", { senderId, receiverId });
    });

    socket.on("userStopTyping", (payload: Payload) => {
      const { senderId, receiverId } = payload;
      io.emit("userStopTyping", { senderId, receiverId });
    });
  });
};
