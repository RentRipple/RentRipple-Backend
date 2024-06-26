import * as dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import { AuthRoutes } from "./Routes/auth.routes";
import { PropertyRoutes } from "./Routes/property.routes";
import YAML from "yamljs";
import createError from "http-errors";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import errorHandler from "./Helpers/errorHandler";
import { verifyAccessToken } from "./Helpers/generateJWTTokens";
import { UserProfileRoutes } from "./Routes/userProfile.routes";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));

const swaggerDocument = YAML.load("./swagger/swagger.yaml");

app.get(
  "/proctected",
  verifyAccessToken,
  async (req: Request, res: Response) => {
    res.json({ message: "Welcome to the API" });
  },
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", AuthRoutes);
app.use("/api/property", PropertyRoutes);
app.use("/api/user", UserProfileRoutes);

// 404 Error Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404, "Not Found"));
});

// Centralized Error Handler
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
