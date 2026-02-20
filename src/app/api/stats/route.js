import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Job from "@/models/Job";
import Session from "@/models/Session";
import Category from "@/models/Category";
import TutorProfile from "@/models/TutorProfile";

export async function GET() {
  try {
    await dbConnect();

    const [tutorsCount, sessionsCount, subjectsCount, usersCount, avgRating] = await Promise.all([
      TutorProfile.countDocuments(),
      Session.countDocuments(),
      Category.countDocuments(),
      User.countDocuments(),
      TutorProfile.aggregate([{ $group: { _id: null, avg: { $avg: "$stats.rating" } } }])
    ]);

    return NextResponse.json({
      tutors: tutorsCount,
      sessions: sessionsCount,
      subjects: subjectsCount,
      users: usersCount,
      avgRating: avgRating[0]?.avg || 0,
      countries: 12, // Mock for now or aggregate
      hours: sessionsCount * 1.5, // Mock estimate
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ message: "Error fetching stats" }, { status: 500 });
  }
}
