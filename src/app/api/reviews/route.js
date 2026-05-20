import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    const reviews = await Review.find({ rating: { $gte: 4 }, moderationStatus: "approved" })
      .populate("reviewer", "name avatar university role")
      .populate({
        path: "session",
        populate: {
          path: "job",
          select: "subject"
        }
      })
      .limit(6)
      .lean();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ message: "Error fetching reviews" }, { status: 500 });
  }
}
