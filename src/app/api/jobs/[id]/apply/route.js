import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { coverLetter, bidAmount } = await req.json();

    if (!coverLetter || !bidAmount) {
      return NextResponse.json({ message: "Cover letter and bid amount are required" }, { status: 400 });
    }

    await dbConnect();

    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    // Check if already applied
    const alreadyApplied = job.applicants.some(
      (app) => app.user.toString() === session.user.id
    );

    if (alreadyApplied) {
      return NextResponse.json({ message: "You have already applied to this job" }, { status: 400 });
    }

    // Add applicant
    job.applicants.push({
      user: session.user.id,
      coverLetter,
      bidAmount: Number(bidAmount),
      status: "pending",
      appliedAt: new Date(),
    });

    await job.save();

    return NextResponse.json({ message: "Application submitted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error applying to job:", error);
    return NextResponse.json({ message: "Error applying to job" }, { status: 500 });
  }
}
