import * as dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import * as http from "http-errors";
import { AuthRoutes } from "./Routes/auth.routes";
import { connectMongoDb } from "./Helpers/connectMongoDb";


dotenv.config();
connectMongoDb();
const app: Express = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/", async (req: Request, res: Response) => {
  res.json({ message: "Welcome to the API" });
});

app.use("/auth", AuthRoutes);

app.use(async (req: Request, res: Response, next: any) => {
  next(http.NotFound("This route does not exist!"));
});

app.use(async (error: any, req: Request, res: Response, next: any) => {
  const statusCode = res.statusCode;
  res.json({
    statusCode: statusCode,
    message: error.message,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
