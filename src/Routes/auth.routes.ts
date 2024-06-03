import * as express from "express";
import { BadRequest, Unauthorized } from "http-errors";
import { loginSchema, registerationSchema } from "../Helpers/validationSchema";
import { signedAccessToken } from "../Helpers/generateJWTTokens";
import { User } from "../Models/user.model"; // Add this import statement

export const AuthRoutes = express.Router();

AuthRoutes.post(
  "/register",
  async (req: express.Request, res: express.Response, next: any) => {
    try {
      const { userName, email, password } = req.body;
      const result = registerationSchema.validate({
        userName,
        email,
        password,
      });
      if (result.error) {
        throw BadRequest(result.error.message);
      }
      const doesExist = await User.findOne({ email: result.value.email });
      if (doesExist) {
        throw BadRequest(
          `User with this email already exists: ${result.value.email}`,
        );
      }
      const user = new User(result.value);
      const savedUser = await user.save();
      const accessToken = await signedAccessToken(savedUser.id);
      res.json({ accessToken: accessToken });
    } catch (error: any) {
      if (error.isJoi === true) {
        error.status = 422;
      }
      next(error);
    }
  },
);

AuthRoutes.post(
  "/login",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        throw BadRequest("Invalid email or password");
      }

      const user = await User.findOne({ email: value.email });
      if (!user) {
        throw BadRequest("Invalid email or password");
      }

      const isMatch = await user.checkPassword(value.password);
      if (!isMatch) {
        throw BadRequest("Invalid email or password");
      }

      const accessToken = await signedAccessToken(user.id);
      res.json({ accessToken });
    } catch (error: any) {
      if (error.isJoi) {
        return next(BadRequest("Invalid email or password"));
      }
      next(error);
    }
  },
);

AuthRoutes.post(
  "/refresh-token",
  async (req: express.Request, res: express.Response) => {
    res.json({ message: "Refresh token route" });
  },
);

AuthRoutes.delete(
  "/logout",
  async (req: express.Request, res: express.Response) => {
    res.json({ message: "Logout route" });
  },
);
