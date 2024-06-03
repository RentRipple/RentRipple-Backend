import * as dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import { NotFound } from "http-errors";
import { AuthRoutes } from "./Routes/auth.routes";
import { connectMongoDb } from "./Helpers/connectMongoDb";
import { verifyAccessToken } from "./Helpers/generateJWTTokens";
import { connectRedis} from "./Helpers/connectRedis";
import { RedisClientType } from "redis";

dotenv.config();
connectMongoDb();
export const redisClient: RedisClientType = connectRedis();





const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", verifyAccessToken, async (req: Request, res: Response) => {
  res.json({ message: "Welcome to the API" });
});

app.use("/auth", AuthRoutes);

app.use(async (req: Request, res: Response, next: any) => {
  next(NotFound("This route does not exist!"));
});

app.use(async (error: any, req: Request, res: Response, next: any) => {
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
