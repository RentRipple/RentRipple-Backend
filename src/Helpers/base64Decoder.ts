import { Buffer } from "buffer";

export const base64Decoder = async (base64String: string): Promise<string> => {
  const buffer = Buffer.from(base64String, "base64");
  const decodedString = buffer.toString("utf-8");
  const userId = decodedString
    .split("aud")[1]
    .split(",")[0]
    .replace(/['":]+/g, "")
    .trim();
  return userId;
};
