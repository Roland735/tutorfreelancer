import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const job = await Job.findById(id)
      .populate("postedBy", "name avatar university location createdAt role accountStatus")
      .populate("applicants.user", "name avatar")
      .lean();

    if (!job || job.moderationStatus !== "visible" || ["suspended", "deleted"].includes(job.postedBy?.accountStatus)) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    // Get Poster Stats
    const totalJobsPosted = await Job.countDocuments({ postedBy: job.postedBy._id });

    // Get Similar Jobs
    const similarJobs = await Job.find({
      category: job.category,
      _id: { $ne: job._id },
      status: 'Open',
      moderationStatus: 'visible'
    })
      .select('title description budget academicLevel urgency sessionType applicants postedBy createdAt')
      .populate('postedBy', 'name avatar university')
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

    return NextResponse.json({
      ...job,
      posterStats: {
        totalJobs: totalJobsPosted,
        memberSince: job.postedBy.createdAt,
        rating: 4.8 // Mock rating for now as we don't have client reviews implemented fully
      },
      similarJobs
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ message: "Error fetching job" }, { status: 500 });
  }
}
