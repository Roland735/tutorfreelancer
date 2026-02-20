import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 4;
    
    const blogs = await Blog.find({})
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    // Map _id to id for frontend compatibility if needed, though usually _id is fine
    const mappedBlogs = blogs.map(blog => ({
      ...blog,
      id: blog._id.toString(),
      date: new Date(blog.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }));

    return NextResponse.json(mappedBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ message: "Error fetching blogs" }, { status: 500 });
  }
}
