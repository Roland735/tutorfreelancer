import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import Anthropic from "@anthropic-ai/sdk";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Session from "@/models/Session";
import Request from "@/models/Request";
import Review from "@/models/Review";

function buildHeuristicPrediction(metrics) {
  const completionRate = metrics.totalSessions
    ? Math.round((metrics.completedSessions / metrics.totalSessions) * 100)
    : 0;
  const riskValue =
    metrics.cancelledSessions * 15 +
    (100 - completionRate) * 0.3 +
    metrics.openRequests * 4 +
    (metrics.avgRatingGiven < 3.8 ? 12 : 0);
  const riskLevel = riskValue >= 45 ? "HIGH" : riskValue >= 22 ? "MEDIUM" : "LOW";
  const engagementScore = Math.max(0, Math.min(100, Math.round(100 - riskValue)));

  const recommendations = [
    "Keep a consistent weekly tutoring schedule to improve continuity.",
    "Prioritize tutors with high ratings and quick response times.",
    "Close open requests quickly to avoid learning delays.",
  ];

  return {
    provider: "heuristic",
    riskLevel,
    engagementScore,
    summary:
      riskLevel === "HIGH"
        ? "Student may be at risk of inconsistent progress due to cancellations and low completion trend."
        : riskLevel === "MEDIUM"
          ? "Student is making progress but could improve consistency for better outcomes."
          : "Student shows steady engagement and a strong consistency trend.",
    recommendations,
  };
}

function extractTextFromAnthropic(content) {
  if (!Array.isArray(content)) return "";
  return content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

function safeParsePrediction(rawText) {
  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const parsed = JSON.parse(cleaned);
  const riskLevel = ["LOW", "MEDIUM", "HIGH"].includes(parsed?.riskLevel)
    ? parsed.riskLevel
    : "MEDIUM";
  const engagementScore = Number.isFinite(parsed?.engagementScore)
    ? Math.max(0, Math.min(100, Math.round(parsed.engagementScore)))
    : 50;
  const summary =
    typeof parsed?.summary === "string" && parsed.summary.trim()
      ? parsed.summary.trim()
      : "Student prediction generated.";
  const recommendations = Array.isArray(parsed?.recommendations)
    ? parsed.recommendations.filter((item) => typeof item === "string").slice(0, 3)
    : [];

  return {
    provider: "anthropic",
    riskLevel,
    engagementScore,
    summary,
    recommendations,
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const studentId = session.user.id;

    const [totalSessions, completedSessions, cancelledSessions, openRequests, reviews] =
      await Promise.all([
        Session.countDocuments({ student: studentId }),
        Session.countDocuments({ student: studentId, status: "Completed" }),
        Session.countDocuments({ student: studentId, status: "Cancelled" }),
        Request.countDocuments({ requester: studentId, status: "open" }),
        Review.find({ reviewer: studentId }).select("rating").lean(),
      ]);

    const avgRatingGiven = reviews.length
      ? Number(
          (
            reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length
          ).toFixed(2)
        )
      : 0;

    const metrics = {
      totalSessions,
      completedSessions,
      cancelledSessions,
      openRequests,
      avgRatingGiven,
    };

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return NextResponse.json({
        metrics,
        prediction: buildHeuristicPrediction(metrics),
      });
    }

    const anthropic = new Anthropic({ apiKey: anthropicKey });
    const prompt = `
You are an education analytics assistant.
Given student platform metrics, return ONLY valid minified JSON with keys:
riskLevel (LOW|MEDIUM|HIGH), engagementScore (0-100 number), summary (string), recommendations (array of max 3 short strings).
Metrics:
${JSON.stringify(metrics)}
`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-latest",
      max_tokens: 300,
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = extractTextFromAnthropic(response.content);
    const prediction = safeParsePrediction(rawText);

    return NextResponse.json({ metrics, prediction });
  } catch (error) {
    console.error("Error generating student prediction:", error);
    return NextResponse.json(
      { message: "Error generating student prediction" },
      { status: 500 }
    );
  }
}
