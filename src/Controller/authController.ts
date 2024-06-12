import { Request, Response, NextFunction } from "express";
import { BadRequest, Unauthorized } from "http-errors";
import {
  signedAccessToken,
  signedRefreshToken,
  verifyRefreshToken,
} from "../Helpers/generateJWTTokens";
import { User } from "../Models/User.model";
import { loginSchema, registerationSchema, newPasswordSchema } from "../Helpers/validationSchema";
import { connectRedis } from "../Helpers/connectRedis";
import { RedisClientType } from "redis";
import { connectMongoDb } from "../Helpers/connectMongoDb";
//import bcrypt from "bcryptjs";

connectMongoDb();

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {  firstName,
      lastName,
      email,
      password,
      confirmPassword,
      gender,
      number,
      accountType,
      securityQuestions, } = req.body;
    // Log the request body for debugging
    console.log("Request Body:", req.body);
    const result = registerationSchema.validate({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      gender,
      number,
      accountType,
      securityQuestions,
    });
    // Log the validation result for debugging
    console.log("Validation Result:", result);
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
    const refreshToken = await signedRefreshToken(savedUser.id);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error: any) {
    if (error.isJoi === true) {
      error.status = 422;
    }
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
    const refreshToken = await signedRefreshToken(user.id);
    res.json({ accessToken, refreshToken });
  } catch (error: any) {
    if (error.isJoi) {
      return next(BadRequest("Invalid email or password"));
    }
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw BadRequest();
    }
    const userId: string = await verifyRefreshToken(refreshToken);
    const accessToken = await signedAccessToken(userId);
    const newRefreshToken = await signedRefreshToken(userId);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error: any) {
    next(error);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const redisClient: RedisClientType = connectRedis();
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw BadRequest("Invalid request");
    }
    const userId = await verifyRefreshToken(refreshToken);
    if (!userId) {
      throw BadRequest("Invalid request");
    }
    await redisClient.del(userId);
    res.sendStatus(204);
  } catch (error: any) {
    next(error);
  }
};

export const verifySecurityAnswers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, securityQuestion, securityAnswer } = req.body;
    console.log("Request Body:", req.body);
    const user = await User.findOne({ email });
    if (!user) {
      throw new Unauthorized("Unauthorized access");
    }

    const isMatch = await user.checkSecurityAnswer(securityQuestion, securityAnswer);
    if (!isMatch) {
      throw new Unauthorized("Unauthorized access");
    }
    res.json({ message: "Success" });
  } catch (error: any) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw BadRequest("Unauthorized access");
    }
    const randomIndex = Math.floor(Math.random() * user.securityQuestions.length);
    const randomQuestion = user.securityQuestions[randomIndex];

    res.json({ question: randomQuestion.question });
  } catch (error: any) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw BadRequest("Unauthorized access");
    }

    // Validate the new password against the schema
    const checkPasswordConstraints = newPasswordSchema.validate({ password: newPassword });
    console.log("Validation Result:", checkPasswordConstraints);
    if (checkPasswordConstraints.error) {
      throw BadRequest(checkPasswordConstraints.error.message);
    }

    // Check if the new password matches the old password
    const isMatch = await user.checkPassword(newPassword);
    if (isMatch) {
      throw BadRequest("Use a different password than the current one");
    }

    // Update the user's password and save the user
    user.password = newPassword;
    await user.save();

    console.log(user.password);
    res.json({ message: "Password reset successfully" });
  } catch (error: any) {
    next(error);
  }
};
