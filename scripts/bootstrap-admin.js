import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import User from "../src/models/User.js";

const ADMIN_EMAIL = process.env.DEMO_ADMIN_EMAIL || "admin@tutorfreelance.demo";
const ADMIN_PASSWORD = process.env.DEMO_ADMIN_PASSWORD || "password123";

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local before bootstrapping the admin account.");
  }

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI);
}

async function bootstrapAdmin() {
  await connectDB();

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const adminUser = await User.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase() },
    {
      $set: {
        name: "Admin Demo",
        password: hashedPassword,
        role: "admin",
        university: "University of Zimbabwe",
        major: "Platform Operations",
        yearOfStudy: "Postgraduate",
        bio: "Demo administrator for platform operations, moderation, payouts, and analytics.",
        location: {
          city: "Harare",
          country: "Zimbabwe",
          timezone: "Africa/Harare",
        },
        languages: ["English"],
        isVerified: true,
        isOnline: true,
        isProfileComplete: true,
      },
      $setOnInsert: {
        socialLinks: {},
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  console.log("Admin demo account is ready.");
  console.log(`Email: ${adminUser.email}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
}

bootstrapAdmin()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Failed to bootstrap admin account:", error);
    if (mongoose.connection.readyState >= 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  });
