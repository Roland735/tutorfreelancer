import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Find jobs where the applicants array contains an object with user: session.user.id
    const jobs = await Job.find({ 
      'applicants.user': session.user.id 
    })
    .populate("postedBy", "name avatar university")
    .sort({ "applicants.appliedAt": -1 })
    .lean();

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return NextResponse.json({ message: "Error fetching applied jobs" }, { status: 500 });
  }
}
