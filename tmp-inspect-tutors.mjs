import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const { default: dbConnect } = await import("./src/lib/db.js");
const { default: TutorProfile } = await import("./src/models/TutorProfile.js");

await dbConnect();

const unrestricted = await TutorProfile.countDocuments({ moderationStatus: { $ne: "rejected" } });
const statusBreakdown = await TutorProfile.aggregate([
  { $group: { _id: { verificationStatus: "$verificationStatus", moderationStatus: "$moderationStatus" }, count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]);

console.log(JSON.stringify({ unrestricted, statusBreakdown }, null, 2));
