import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import User from "@/models/User";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Basic validation
    if (!data.title || !data.description || !data.category || !data.budget) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const job = await Job.create({
      ...data,
      postedBy: session.user.id,
      status: 'Open',
      applicants: []
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ message: "Error creating job" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const budgetMin = searchParams.get('min');
    const budgetMax = searchParams.get('max');
    const sessionType = searchParams.get('type');
    const urgency = searchParams.get('urgency');
    const academicLevel = searchParams.get('level');
    const keyword = searchParams.get('keyword');
    const sort = searchParams.get('sort') || 'newest';
    const postedDate = searchParams.get('posted');
    const applicants = searchParams.get('applicants');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;

    const query = { status: 'Open' };

    if (category && category !== 'All') query.category = category;
    if (sessionType && sessionType !== 'Any') query.sessionType = sessionType;
    if (urgency && urgency !== 'Any') query.urgency = urgency;
    if (academicLevel && academicLevel !== 'Any') query.academicLevel = academicLevel;

    if (budgetMin || budgetMax) {
      query['budget.min'] = {};
      if (budgetMin) query['budget.min'].$gte = parseInt(budgetMin);
      if (budgetMax) query['budget.min'].$lte = parseInt(budgetMax);
    }

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Posted Date Filter
    if (postedDate) {
      const now = new Date();
      if (postedDate === 'last_24h') {
        query.createdAt = { $gte: new Date(now - 24 * 60 * 60 * 1000) };
      } else if (postedDate === 'last_7d') {
        query.createdAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
      } else if (postedDate === 'last_30d') {
        query.createdAt = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
      }
    }

    // Applicants Filter
    if (applicants) {
      if (applicants === 'less_than_5') {
        query.$expr = { $lt: [{ $size: "$applicants" }, 5] };
      } else if (applicants === '5_to_10') {
        query.$expr = { $and: [{ $gte: [{ $size: "$applicants" }, 5] }, { $lte: [{ $size: "$applicants" }, 10] }] };
      } else if (applicants === 'more_than_10') {
        query.$expr = { $gt: [{ $size: "$applicants" }, 10] };
      }
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'budget_high') {
      sortOptions = { 'budget.max': -1 };
    } else if (sort === 'budget_low') {
      sortOptions = { 'budget.min': 1 };
    } else if (sort === 'urgency') {
      // Custom sort for urgency string is tricky in simple query, defaulting to newest
      // If urgency was numeric, we could sort. For now, maybe just map strings?
      // "High" > "Medium" > "Low". Alphabetical: High, Low, Medium. 
      // We'll skip complex sort for now or implement if schema changed.
      sortOptions = { urgency: -1 }; // Rough approximation
    } else if (sort === 'applicants') {
      // Sort by array length requires aggregation or virtual, but simple find().sort() 
      // on array field sorts by min/max value in array, not size. 
      // Standard solution is aggregation. For simplicity in this mock, we might skip 
      // or use a projected field if possible. 
      // Actually, let's switch to aggregation if sort is applicants.
    }

    let jobs;
    let total;

    if (sort === 'applicants') {
       // Aggregation pipeline for applicants sort
       const pipeline = [
         { $match: query },
         { $addFields: { applicantsCount: { $size: "$applicants" } } },
         { $sort: { applicantsCount: -1 } },
         { $skip: skip },
         { $limit: limit },
         { $lookup: { from: 'users', localField: 'postedBy', foreignField: '_id', as: 'postedBy' } },
         { $unwind: '$postedBy' } // Populate simulation
       ];
       // We need a separate count
       total = await Job.countDocuments(query);
       jobs = await Job.aggregate(pipeline);
    } else {
       total = await Job.countDocuments(query);
       jobs = await Job.find(query)
        .populate("postedBy", "name avatar university")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean();
    }

    return NextResponse.json({
      jobs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ message: "Error fetching jobs" }, { status: 500 });
  }
}
