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
    const jobs = await Job.find({ postedBy: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching my jobs:", error);
    return NextResponse.json({ message: "Error fetching my jobs" }, { status: 500 });
  }
}
