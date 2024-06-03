import * as JWT from "jsonwebtoken";
import * as httpErrors from "http-errors";

export const signedAccessToken = async (userId: string) => {
  try {
    const payload = {
      name: "John Doe",
    };
    console.log(process.env.ACCESS_TOKEN_SECRET!);
    const options = {
      expiresIn: "1h",
      issuer: "rentripple.com",
      audience: userId,
    };
    return JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET!, options);
  } catch (error) {
    throw httpErrors.InternalServerError();
  }
};
