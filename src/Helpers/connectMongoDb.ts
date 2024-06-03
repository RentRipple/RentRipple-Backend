import mongoose, { ConnectOptions } from "mongoose";

export const connectMongoDb = async () => {
  try {
    const connection = process.env.MONGO_URL || "mongodb://localhost:27017";
    await mongoose.connect(connection, {
      dbName: process.env.DB_NAME || "rentripplemongo",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Disconnected from MongoDB");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB");
    console.error(error);
  }
};
