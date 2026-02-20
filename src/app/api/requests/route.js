import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Review from "@/models/Review"; // Ensure Review is imported
import Request from "@/models/Request";

export async function GET(req) {
  try {
    await dbConnect();
    // Fetch requests and populate user info
    let requests = await Request.find()
      .populate("requester", "name email")
      .populate("tutor", "name email")
      .sort({ createdAt: -1 })
      .lean(); // Use lean() to get plain JS objects

    // Fetch reviews for completed requests
    const requestIds = requests.map(req => req._id);
    const reviews = await Review.find({ request: { $in: requestIds } }).lean();

    // Map reviews to requests
    requests = requests.map(req => {
      const review = reviews.find(r => r.request.toString() === req._id.toString());
      return { ...req, review: review || null };
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ message: "Error fetching requests" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { topic, description, budget, location } = await req.json();

    if (!topic || !description || !budget || !location) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await dbConnect();

    const newRequest = await Request.create({
      topic,
      description,
      budget,
      location,
      requester: session.user.id,
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error creating request" }, { status: 500 });
  }
}
