import { Buffer } from "buffer";
import { BadRequest } from "http-errors";

export const getUserIdFromBase64 = async (
  base64String: string,
): Promise<string> => {
  try {
    const buffer = Buffer.from(base64String, "base64");
    const decodedString = buffer.toString("utf-8");
    const userId = decodedString
      .split("aud")[1]
      .split(",")[0]
      .replace(/['":]+/g, "")
      .trim();

    if (!userId) {
      throw new BadRequest("Invalid base64 string provided");
    }

    return userId;
  } catch (error) {
    throw new BadRequest("Invalid base64 string provided");
  }
};
