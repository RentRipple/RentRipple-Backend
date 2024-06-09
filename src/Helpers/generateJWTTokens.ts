import * as JWT from "jsonwebtoken";
import { InternalServerError, Unauthorized } from "http-errors";
import { Request, Response, NextFunction } from "express";
import { RedisClientType, SetOptions } from "redis";
import { connectRedis } from "./connectRedis"; 


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
      throw new Unauthorized("Unauthorized");
    }
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      throw new Unauthorized("Unauthorized");
    } else {
      throw new Unauthorized(error.message);
    }
  }
};

export const verifyRefreshToken = async (refreshToken: string) => {
  try {
    if (!refreshToken) {
      throw new Unauthorized("Unauthorized");
    }
    const payload: any = JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    );
    if (!payload) {
      throw new Unauthorized("Unauthorized");
    }
    const userId = payload.aud;
    const redisClient: RedisClientType = connectRedis();
    const refreshTokenValue = await redisClient.get(userId);
    if (refreshTokenValue !== refreshToken) {
      throw new Unauthorized("Unauthorized");
    }
    return userId;
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      throw new Unauthorized("Unauthorized");
    } else {
      throw new Unauthorized(error.message);
    }
  }
};
