import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Session from "@/models/Session";
import Job from "@/models/Job";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const sessions = await Session.find({
      tutor: session.user.id,
      status: { $in: ["Scheduled", "Completed"] },
    })
      .sort({ date: 1 })
      .limit(10)
      .populate("job", "title category")
      .populate("student", "name avatar")
      .lean();

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching tutor sessions:", error);
    return NextResponse.json({ message: "Error fetching tutor sessions" }, { status: 500 });
  }
}

