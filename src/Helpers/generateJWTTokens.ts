import * as JWT from "jsonwebtoken";
import { BadRequest, InternalServerError, Unauthorized } from "http-errors";
import { Request, Response, NextFunction } from "express";
import { connectRedis } from "./connectRedis";
import { RedisClientType, SetOptions } from "redis";
export const signedAccessToken = async (userId: string) => {
  try {
    const payload = {};
    console.log(process.env.ACCESS_TOKEN_SECRET!);
    const options = {
      expiresIn: "40s",
      issuer: "rentripple.com",
      audience: userId,
    };
    return JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET!, options);
  } catch (error) {
    throw InternalServerError();
  }
};

export const signedRefreshToken = async (userId: string) => {
  try {
    const YEAR = 365 * 24 * 60 * 60;
    const payload = {};
    console.log(process.env.REFRESH_TOKEN_SECRET!);
    const options = {
      expiresIn: "1y",
      issuer: "rentripple.com",
      audience: userId,
    };
    const token = JWT.sign(payload, process.env.REFRESH_TOKEN_SECRET!, options);
    const redisOptions: SetOptions = YEAR ? { EX: YEAR } : {};
    const redisClient: RedisClientType = connectRedis();
    redisClient.set(userId, token, redisOptions);
    return token;
  } catch (error) {
    throw InternalServerError();
  }
};

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.headers["authorization"]) {
      throw Unauthorized("Unauthorized");
    }
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    const payload = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    if (!payload) {
      throw Unauthorized("Unauthorized");
    }
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      next(Unauthorized("Unauthorized"));
    } else {
      next(Unauthorized(error.message));
    }
  }
};

export const verifyRefreshToken = async (
  refreshToken: string,
  next: NextFunction,
) => {
  try {
    if (!refreshToken) {
      throw BadRequest("Unauthorized");
    }
    const payload: any = JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    );
    if (!payload) {
      throw Unauthorized("Unauthorized");
    }
    const userId = payload.aud;
    const redisClient: RedisClientType = connectRedis();
    const refreshTokenValue = await redisClient.get(userId);
    if (refreshTokenValue !== refreshToken) {
      throw Unauthorized("Unauthorized");
    }

    return userId;
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      next(Unauthorized("Unauthorized"));
    } else {
      next(Unauthorized(error.message));
    }
  }
};

export const generateResetToken = async (userId: string): Promise<string> => {
  const payload = { userId };
  const resetToken = JWT.sign(payload, process.env.RESET_TOKEN_SECRET!, { expiresIn: "1h" });
  return resetToken;
};

export const verifyResetToken = async (resetToken: string): Promise<string> => {
  try {
    const decoded = JWT.verify(resetToken, process.env.RESET_TOKEN_SECRET!);
    if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
      throw new Error("Invalid token");
    }
    return decoded.userId;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
