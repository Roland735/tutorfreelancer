import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import TutorProfile from "@/models/TutorProfile";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id).lean();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const tutorProfile = await TutorProfile.findOne({ user: user._id }).lean();

    return NextResponse.json({
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || "",
      university: user.university || "",
      major: user.major || "",
      bio: user.bio || "",
      location: user.location || {},
      languages: user.languages || [],
      tutorProfile: tutorProfile
        ? {
          hourlyRate: tutorProfile.hourlyRate,
          sessionType: tutorProfile.sessionType,
          stats: tutorProfile.stats || {},
          subjects: tutorProfile.subjects || [],
          badges: tutorProfile.badges || [],
          isFeatured: tutorProfile.isFeatured || false,
        }
        : null,
      isProfileComplete: user.isProfileComplete || false,
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed to load profile." }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const bio = body.bio || "";
    const city = body.city || "";
    const languages = Array.isArray(body.languages) ? body.languages : [];
    const name = body.name;
    const university = body.university;
    const major = body.major;
    const country = body.country;
    const hourlyRate = body.hourlyRate;
    const subjects = Array.isArray(body.subjects) ? body.subjects : [];

    if (!bio || !city || languages.length === 0) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (name) {
      user.name = name;
    }
    if (university) {
      user.university = university;
    }
    if (major) {
      user.major = major;
    }

    user.bio = bio;
    user.location = user.location || {};
    user.location.city = city;
    if (country) {
      user.location.country = country;
    }
    user.languages = languages;
    user.isProfileComplete = true;
    await user.save();

    if (hourlyRate || subjects.length > 0) {
      const rateNumber = hourlyRate ? parseFloat(hourlyRate) : null;

      let tutorProfile = await TutorProfile.findOne({ user: user._id });
      if (!tutorProfile) {
        tutorProfile = new TutorProfile({
          user: user._id,
          hourlyRate: rateNumber || 5,
          sessionType: "Online",
          subjects: subjects.map((name) => ({
            name,
            category: "General",
            difficulty: "Intermediate",
          })),
        });
      } else {
        if (rateNumber != null && !Number.isNaN(rateNumber)) {
          tutorProfile.hourlyRate = rateNumber;
        }
        if (subjects.length > 0) {
          tutorProfile.subjects = subjects.map((name) => ({
            name,
            category: "General",
            difficulty: "Intermediate",
          }));
        }
      }
      await tutorProfile.save();
    }

    return NextResponse.json({ message: "Profile updated." });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update profile." }, { status: 500 });
  }
}
