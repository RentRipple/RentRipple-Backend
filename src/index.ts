import * as dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import createError from "http-errors";
import { AuthRoutes } from "./routes/auth.routes";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";

import cors from "cors";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));

const swaggerDocument = YAML.load("./swagger/swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/api", async (req: Request, res: Response) => {
  res.json({ message: "Welcome to the API" });
});

app.use("/api/auth", AuthRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404, "This route does not exist!"));
});

// Error handling middleware
app.use((error: any, req: Request, res: Response) => {
  res.status(error.status || 500);
  res.json({
    statusCode: error.status || 500,
    message: error.message,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
