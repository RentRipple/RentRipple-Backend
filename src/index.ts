import * as dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import YAML from "yamljs";
import createError from "http-errors";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import errorHandler from "./Helpers/errorHandler";
import { verifyAccessToken } from "./Helpers/generateJWTTokens";
import { AuthRoutes } from "./Routes/auth.routes";
import { PropertyRoutes } from "./Routes/property.routes";
import { UserProfileRoutes } from "./Routes/userProfile.routes";
import { reviewRoutes } from "./Routes/review.routes";
import { ChatRoutes } from "./Routes/chat.routes";
import { setupSocketIO } from "./Helpers/Socket";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app: Express = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server); // Pass the server to Socket.IO

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));

// Swagger setup
const swaggerDocument = YAML.load("./swagger/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Protected route example
app.get(
  "/protected",
  verifyAccessToken,
  async (req: Request, res: Response) => {
    res.json({ message: "Welcome to the API" });
  },
);

// Route definitions
app.use("/api/auth", AuthRoutes);
app.use("/api/property", PropertyRoutes);
app.use("/api/user", UserProfileRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chat", ChatRoutes);
app.use("/uploads", express.static("uploads")); // Serve static files

// 404 Error Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404, "Not Found"));
});

// Centralized Error Handler
app.use(errorHandler);

// Initialize Socket.IO
setupSocketIO(io);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
