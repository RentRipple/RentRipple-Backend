import mongoose,{ConnectOptions} from 'mongoose';


export const connectMongoDb = async () => {
  try {
    const connection = process.env.MONGO_URI || "mongodb://localhost:27017";
    await mongoose.connect(connection, {
      useNewUrlParser: true,
    } as ConnectOptions);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB");
    console.error(error);
  }
}
