import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Request from "@/models/Request";

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { action } = await req.json();

    await dbConnect();

    const request = await Request.findById(id);

    if (!request) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    if (action === "accept") {
      if (request.status !== "open") {
        return NextResponse.json({ message: "Request is not open" }, { status: 400 });
      }
      request.status = "accepted";
      request.tutor = session.user.id;
    } else if (action === "complete") {
      // Only requester can mark as complete
      if (request.requester.toString() !== session.user.id) {
        return NextResponse.json({ message: "Only requester can complete" }, { status: 403 });
      }
      request.status = "completed";
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    await request.save();

    return NextResponse.json(request);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error updating request" }, { status: 500 });
  }
}
