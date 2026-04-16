import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@yourbank.com";
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD!;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}
if (!ADMIN_PASSWORD) {
  console.error("ADMIN_SEED_PASSWORD is not set in .env");
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  passwordHash: String,
  phone: String,
  address: String,
  dateOfBirth: String,
  role: String,
  status: String,
});

async function seed() {
  await mongoose.connect(MONGODB_URI, { dbName: "banking" });

  const User =
    mongoose.models.User || mongoose.model("User", UserSchema);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`Admin already exists: ${ADMIN_EMAIL}`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await User.create({
    firstName: "Super",
    lastName: "Admin",
    email: ADMIN_EMAIL,
    passwordHash,
    phone: "",
    address: "",
    dateOfBirth: "",
    role: "admin",
    status: "active",
  });

  console.log(`✅ Admin created: ${ADMIN_EMAIL}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
