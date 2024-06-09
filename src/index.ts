import * as dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import createError from "http-errors";
import { AuthRoutes } from "./Routes/auth.routes";
import { verifyAccessToken } from "./Helpers/generateJWTTokens";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", verifyAccessToken, async (req: Request, res: Response) => {
  res.json({ message: "Welcome to the API" });
});

app.use("/auth", AuthRoutes);

// Middleware to handle 404 errors
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404, "This route does not exist!"));
});

// Error handling middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500);
  res.json({
    statusCode: error.status || 500,
    message: error.message,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  console.log(process.env.MONGO_URL);
  console.log(process.env.DB_NAME);
});
