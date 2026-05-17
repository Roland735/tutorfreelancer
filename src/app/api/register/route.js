import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import TutorProfile from "@/models/TutorProfile";
import bcrypt from "bcryptjs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9()\-\s]{8,20}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const ROLE_VALUES = ["student", "tutor"];
const SESSION_TYPE_VALUES = ["Online", "In-Person", "Both"];

function trimValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeList(input) {
  if (Array.isArray(input)) {
    return [...new Set(input.map((value) => trimValue(value)).filter(Boolean))];
  }

  if (typeof input === "string") {
    return [...new Set(input.split(",").map((value) => value.trim()).filter(Boolean))];
  }

  return [];
}

export async function POST(req) {
  try {
    const body = await req.json();
    const name = trimValue(body.name);
    const email = trimValue(body.email).toLowerCase();
    const password = typeof body.password === "string" ? body.password : "";
    const role = trimValue(body.role);
    const university = trimValue(body.university);
    const city = trimValue(body.city);
    const phoneNumber = trimValue(body.phoneNumber);
    const referralCode = trimValue(body.referralCode);
    const country = trimValue(body.country) || "Zimbabwe";
    const languages = normalizeList(body.languages);
    const acceptedTerms = Boolean(body.acceptedTerms);

    const courseOfStudy = trimValue(body.courseOfStudy);
    const yearOfStudy = trimValue(body.yearOfStudy);
    const subjectsNeeded = normalizeList(body.subjectsNeeded);
    const preferredTutoringMode = trimValue(body.preferredTutoringMode);
    const learningGoal = trimValue(body.learningGoal);

    const subjectsTaught = normalizeList(body.subjectsTaught);
    const academicLevel = trimValue(body.academicLevel);
    const yearsOfExperience =
      body.yearsOfExperience === "" || body.yearsOfExperience == null
        ? ""
        : Number(body.yearsOfExperience);
    const tutoringMode = trimValue(body.tutoringMode);
    const tutorBio = trimValue(body.tutorBio);
    const startingPrice =
      body.startingPrice === "" || body.startingPrice == null
        ? ""
        : Number(body.startingPrice);
    const verificationDocumentName = trimValue(body.verificationDocumentName);

    const fieldErrors = {};

    if (!name) {
      fieldErrors.name = "Enter your full name.";
    }

    if (!email) {
      fieldErrors.email = "Enter your email address.";
    } else if (!EMAIL_REGEX.test(email)) {
      fieldErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      fieldErrors.password = "Create a password.";
    } else if (!PASSWORD_REGEX.test(password)) {
      fieldErrors.password = "Use at least 8 characters with at least 1 letter and 1 number.";
    }

    if (!ROLE_VALUES.includes(role)) {
      fieldErrors.role = "Choose whether you are signing up as a student or tutor.";
    }

    if (!university) {
      fieldErrors.university = "Select or enter your university.";
    }

    if (!city) {
      fieldErrors.city = "Add your city.";
    }

    if (languages.length === 0) {
      fieldErrors.languages = "Add at least one language.";
    }

    if (phoneNumber && !PHONE_REGEX.test(phoneNumber)) {
      fieldErrors.phoneNumber = "Enter a valid phone number or leave it blank.";
    }

    if (!acceptedTerms) {
      fieldErrors.acceptedTerms = "You must accept the terms and privacy policy.";
    }

    if (role === "student") {
      if (!courseOfStudy) {
        fieldErrors.courseOfStudy = "Add your course of study.";
      }
      if (!yearOfStudy) {
        fieldErrors.yearOfStudy = "Select your year of study.";
      }
      if (subjectsNeeded.length === 0) {
        fieldErrors.subjectsNeeded = "Add at least one subject you need help with.";
      }
      if (!SESSION_TYPE_VALUES.includes(preferredTutoringMode)) {
        fieldErrors.preferredTutoringMode = "Choose your preferred tutoring mode.";
      }
      if (!learningGoal) {
        fieldErrors.learningGoal = "Add a short learning goal.";
      }
    }

    if (role === "tutor") {
      if (subjectsTaught.length === 0) {
        fieldErrors.subjectsTaught = "Add at least one subject you can teach.";
      }
      if (!academicLevel) {
        fieldErrors.academicLevel = "Select your academic level.";
      }
      if (yearsOfExperience === "" || Number.isNaN(yearsOfExperience) || yearsOfExperience < 0) {
        fieldErrors.yearsOfExperience = "Enter your years of experience.";
      }
      if (!SESSION_TYPE_VALUES.includes(tutoringMode)) {
        fieldErrors.tutoringMode = "Choose how you tutor.";
      }
      if (!tutorBio) {
        fieldErrors.tutorBio = "Add a short tutor bio.";
      }
      if (startingPrice === "" || Number.isNaN(startingPrice) || startingPrice < 5) {
        fieldErrors.startingPrice = "Set a starting price of at least 5.";
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        {
          message: "Please correct the highlighted fields and try again.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      university,
      major: role === "student" ? courseOfStudy : "",
      yearOfStudy: role === "student" ? yearOfStudy : "",
      phoneNumber,
      referralCode,
      bio: role === "tutor" ? tutorBio : learningGoal,
      location: {
        city,
        country,
      },
      languages,
      studentProfile:
        role === "student"
          ? {
              courseOfStudy,
              subjectsNeeded,
              preferredTutoringMode,
              learningGoal,
            }
          : undefined,
      isProfileComplete: true,
    });

    if (role === "tutor") {
      const tutorProfile = await TutorProfile.create({
        user: user._id,
        hourlyRate: startingPrice,
        sessionType: tutoringMode,
        academicLevel,
        yearsOfExperience,
        shortBio: tutorBio,
        verificationStatus: verificationDocumentName ? "pending" : "not_submitted",
        verificationDocumentName,
        subjects: subjectsTaught.map((subject) => ({
          name: subject,
          category: "General",
          difficulty: "Intermediate",
        })),
      });

      user.tutorProfile = tutorProfile._id;
      await user.save();
    }

    return NextResponse.json(
      {
        message: "User registered successfully.",
        role: user.role,
        isProfileComplete: user.isProfileComplete,
        redirectTo: user.isProfileComplete ? "/dashboard" : "/profile-setup",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
