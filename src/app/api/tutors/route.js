import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import TutorProfile from "@/models/TutorProfile";
import User from "@/models/User";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured');
    const subject = searchParams.get('subject');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rating = searchParams.get('rating');
    const sessionType = searchParams.get('type');
    const language = searchParams.get('language');
    const badge = searchParams.get('badge');
    const sort = searchParams.get('sort') || 'rating';
    const keyword = searchParams.get('keyword');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;

    const query = {
      moderationStatus: { $ne: 'rejected' },
      verificationStatus: { $in: ['pending', 'verified'] },
    };

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (subject && subject !== 'All') {
      query['subjects.name'] = { $regex: subject, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.hourlyRate = {};
      if (minPrice) query.hourlyRate.$gte = parseInt(minPrice);
      if (maxPrice) query.hourlyRate.$lte = parseInt(maxPrice);
    }

    if (rating && rating !== 'Any') {
      query['stats.rating'] = { $gte: parseFloat(rating) };
    }

    if (sessionType && sessionType !== 'Any') {
      if (sessionType === 'Both') {
        // If user selects 'Both', they might mean tutors who support BOTH, or tutors who support EITHER.
        // Usually "Both" in UI means "Online & In-Person". 
        // But in DB, sessionType enum is ['Online', 'In-Person', 'Both'].
        // If tutor is 'Both', they show up for 'Online' and 'In-Person' searches too?
        // Let's assume exact match or coverage.
        // If I search 'Online', I want 'Online' OR 'Both'.
        // If I search 'In-Person', I want 'In-Person' OR 'Both'.
        // If I search 'Both' explicitly, I might want exact match.
        query.sessionType = sessionType;
      } else {
        query.sessionType = { $in: [sessionType, 'Both'] };
      }
    }

    if (badge && badge !== 'Any') {
      query.badges = badge;
    }

    // Language Filter (Requires User lookup)
    let languageUserIds = [];
    if (language && language !== 'All') {
      const usersWithLang = await User.find({
        languages: { $regex: language, $options: 'i' }
      }).select('_id');
      languageUserIds = usersWithLang.map(u => u._id);

      // If we already have user constraints (from keyword), we need to intersect.
      // But keyword logic is below. Let's merge logic.
      // We'll add a $and clause for user field if needed.
    }

    if (keyword) {
      // Find users matching the keyword
      const users = await User.find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { bio: { $regex: keyword, $options: 'i' } },
          { university: { $regex: keyword, $options: 'i' } }
        ]
      }).select('_id');

      const userIds = users.map(u => u._id);

      // Add to query with OR condition for subjects
      const keywordQuery = [
        { user: { $in: userIds } },
        { 'subjects.name': { $regex: keyword, $options: 'i' } }
      ];

      if (query.$or) {
        query.$and = [
          { $or: query.$or },
          { $or: keywordQuery }
        ];
        delete query.$or;
      } else {
        query.$or = keywordQuery;
      }
    }

    // Apply Language constraint
    if (language && language !== 'All') {
      if (languageUserIds.length > 0) {
        // We need to ensure query.user is in languageUserIds.
        // If query.user is already set (by keyword logic above), we need intersection.
        // This is getting complex with the OR logic above.
        // Simplified approach: Add 'user' to $and if it exists.

        // But keyword logic uses $or.
        // Let's rely on Mongoose's ability to handle implicit AND.
        // But 'user' field in keywordQuery is inside $or.

        // Strategy: If keyword logic exists, we wrap everything in $and.

        const langQuery = { user: { $in: languageUserIds } };

        if (query.$or) {
          query.$and = query.$and || [];
          query.$and.push({ $or: query.$or });
          delete query.$or;
          query.$and.push(langQuery);
        } else if (query.$and) {
          query.$and.push(langQuery);
        } else {
          query.user = { $in: languageUserIds };
        }
      } else {
        // Language specified but no users found -> No results
        return NextResponse.json({
          tutors: [],
          pagination: { total: 0, page, pages: 0 }
        });
      }
    }

    // Sorting
    let sortOptions = { "stats.rating": -1 };
    if (sort === 'price_asc') {
      sortOptions = { hourlyRate: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { hourlyRate: -1 };
    } else if (sort === 'sessions') {
      sortOptions = { "stats.totalSessions": -1 };
    }

    const total = await TutorProfile.countDocuments(query);
    const tutors = await TutorProfile.find(query)
      .populate("user", "name avatar university location bio languages accountStatus")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    const visibleTutors = tutors.filter(
      (tutor) => !['suspended', 'deleted'].includes(tutor.user?.accountStatus)
    );

    return NextResponse.json({
      tutors: visibleTutors,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching tutors:", error);
    return NextResponse.json({ message: "Error fetching tutors" }, { status: 500 });
  }
}
