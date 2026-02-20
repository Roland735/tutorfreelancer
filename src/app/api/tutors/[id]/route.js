import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import TutorProfile from "@/models/TutorProfile";
import User from "@/models/User";
import Review from "@/models/Review";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    // First, try to find by User ID
    let tutor = await TutorProfile.findOne({ user: id })
      .populate("user", "name avatar university location bio languages socialLinks")
      .lean();

    // If not found, try to find by TutorProfile ID (fallback)
    if (!tutor) {
      tutor = await TutorProfile.findById(id)
        .populate("user", "name avatar university location bio languages socialLinks")
        .lean();
    }

    if (!tutor) {
      return NextResponse.json({ message: "Tutor not found" }, { status: 404 });
    }

    // Fetch reviews for this tutor
    const reviews = await Review.find({ reviewee: tutor.user._id })
      .populate("reviewer", "name avatar")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({ ...tutor, reviews });
  } catch (error) {
    console.error("Error fetching tutor:", error);
    return NextResponse.json({ message: "Error fetching tutor" }, { status: 500 });
  }
}
