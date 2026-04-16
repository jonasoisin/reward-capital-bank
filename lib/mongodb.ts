import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | null;
  var _mongoosePromise: Promise<typeof mongoose> | null;
}

let cached = global._mongooseConn;
let cachedPromise = global._mongoosePromise;

if (!cached) {
  global._mongooseConn = null;
  global._mongoosePromise = null;
  cached = null;
  cachedPromise = null;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached) return cached;

  if (!cachedPromise) {
    global._mongoosePromise = mongoose.connect(MONGODB_URI, {
      dbName: "banking",
      bufferCommands: false,
    });
    cachedPromise = global._mongoosePromise;
  }

  cached = await cachedPromise;
  global._mongooseConn = cached;
  return cached;
}
