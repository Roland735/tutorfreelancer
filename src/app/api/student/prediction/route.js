import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import Anthropic from "@anthropic-ai/sdk";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import TutorProfile from "@/models/TutorProfile";

const ALLOWED_ACTIONS = new Set(["generateQuiz", "predict"]);
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";

function extractTextFromAnthropic(content) {
  if (!Array.isArray(content)) return "";

  return content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

function cleanJsonBlock(rawText = "") {
  return rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeMarkEntry(entry, index) {
  const label =
    typeof entry?.title === "string" && entry.title.trim()
      ? entry.title.trim()
      : `Assessment ${index + 1}`;
  const score = Number(entry?.score);

  if (!Number.isFinite(score)) {
    return null;
  }

  return {
    title: label,
    score: clamp(Math.round(score), 0, 100),
  };
}

function normalizeQuizQuestions(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      const question =
        typeof item?.question === "string" && item.question.trim()
          ? item.question.trim()
          : "";
      const whyItMatters =
        typeof item?.whyItMatters === "string" && item.whyItMatters.trim()
          ? item.whyItMatters.trim()
          : "";

      if (!question) return null;

      return {
        id:
          typeof item?.id === "string" && item.id.trim()
            ? item.id.trim()
            : `q${index + 1}`,
        question,
        whyItMatters,
      };
    })
    .filter(Boolean)
    .slice(0, 5);
}

function normalizeQuizAnswers(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      const id =
        typeof item?.id === "string" && item.id.trim() ? item.id.trim() : "";
      const answer =
        typeof item?.answer === "string" && item.answer.trim()
          ? item.answer.trim()
          : "";

      if (!id) return null;

      return { id, answer };
    })
    .filter(Boolean);
}

function buildFallbackQuiz(moduleName, studyChallenges) {
  const context = studyChallenges
    ? ` especially around ${studyChallenges.toLowerCase()}`
    : "";

  return [
    {
      id: "q1",
      question: `What is the topic in ${moduleName} that currently feels least clear to you${context}?`,
      whyItMatters: "Reveals whether the student can identify the exact gap causing poor performance.",
    },
    {
      id: "q2",
      question: `Describe one recent mistake you made in ${moduleName} and how you would correct it now.`,
      whyItMatters: "Shows reflection, error awareness, and whether misconceptions are improving.",
    },
    {
      id: "q3",
      question: `How do you currently revise for ${moduleName} before tests or coursework deadlines?`,
      whyItMatters: "Assesses consistency of study routines and exam preparation habits.",
    },
    {
      id: "q4",
      question: `What kind of tutor support would help you most in ${moduleName} over the next two weeks?`,
      whyItMatters: "Helps convert the prediction into a practical support plan.",
    },
  ];
}

function buildHeuristicPrediction({
  moduleName,
  assessmentMarks,
  quizQuestions,
  quizAnswers,
  studyChallenges,
}) {
  const averageMark = assessmentMarks.length
    ? assessmentMarks.reduce((sum, item) => sum + item.score, 0) / assessmentMarks.length
    : 0;
  const answeredQuestions = quizAnswers.filter((item) => item.answer.trim()).length;
  const answerDepthScores = quizAnswers.map((item) => {
    const lengthScore = Math.min(item.answer.trim().length, 240);
    return Math.round((lengthScore / 240) * 100);
  });
  const averageAnswerDepth = answerDepthScores.length
    ? answerDepthScores.reduce((sum, score) => sum + score, 0) / answerDepthScores.length
    : 0;
  const completionScore = quizQuestions.length
    ? (answeredQuestions / quizQuestions.length) * 100
    : 0;
  const challengePenalty = studyChallenges ? 6 : 0;
  const successProbability = clamp(
    Math.round(averageMark * 0.7 + averageAnswerDepth * 0.2 + completionScore * 0.1 - challengePenalty),
    15,
    96
  );

  const riskLevel =
    successProbability >= 70 ? "LOW" : successProbability >= 50 ? "MEDIUM" : "HIGH";
  const overallComment =
    riskLevel === "LOW"
      ? `Your current pattern in ${moduleName} looks reasonably stable. The marks and quiz responses suggest you can improve further with consistent revision and targeted support.`
      : riskLevel === "MEDIUM"
        ? `You show some potential in ${moduleName}, but there are enough weak signals to suggest you may struggle without a more structured plan.`
        : `Your current signals suggest a high chance of difficulty in ${moduleName} unless you get support quickly and focus on the exact areas where performance is slipping.`;

  const strengths = [];
  const risks = [];

  if (averageMark >= 65) strengths.push("Your previous marks show a workable foundation in the module.");
  if (answeredQuestions >= Math.max(2, Math.ceil(quizQuestions.length / 2))) {
    strengths.push("You engaged with the reflection quiz rather than skipping it.");
  }
  if (averageAnswerDepth >= 50) {
    strengths.push("Your quiz answers show some depth and awareness of your learning process.");
  }

  if (averageMark < 55) {
    risks.push("Previous assessment marks are below a comfortable pass-improvement range.");
  }
  if (answeredQuestions < quizQuestions.length) {
    risks.push("Some quiz questions were left incomplete, which can signal low confidence or unclear understanding.");
  }
  if (averageAnswerDepth < 35) {
    risks.push("Short or vague answers suggest weak clarity around key problem areas.");
  }
  if (studyChallenges) {
    risks.push(`You flagged ${studyChallenges.toLowerCase()} as a challenge, which should be addressed early.`);
  }

  const recommendations = [
    `Break ${moduleName} into 2-3 specific subtopics and review one per study block this week.`,
    "Book a tutor for a diagnostic session focused on recent low-scoring assessments and misconceptions.",
    "Create a short weekly revision routine with timed practice and feedback on mistakes.",
  ];

  const tutorSearchKeywords = [
    moduleName,
    ...moduleName
      .split(/[\s/-]+/)
      .map((part) => part.trim())
      .filter((part) => part.length > 2),
  ].slice(0, 5);

  return {
    provider: "heuristic",
    riskLevel,
    successProbability,
    overallComment,
    strengths: strengths.slice(0, 3),
    risks: risks.slice(0, 4),
    recommendations,
    tutorSearchKeywords,
    recommendedTutorFocus: [
      `Explain difficult ${moduleName} concepts clearly`,
      "Review past assessments and exam technique",
      "Build a weekly revision plan",
    ],
  };
}

function safeParseQuiz(rawText, moduleName, studyChallenges) {
  try {
    const parsed = JSON.parse(cleanJsonBlock(rawText));
    const quizQuestions = normalizeQuizQuestions(parsed?.quizQuestions);

    if (quizQuestions.length) {
      return {
        provider: "anthropic",
        quizQuestions,
      };
    }
  } catch (error) {
    console.warn("Unable to parse Anthropic quiz response, using fallback quiz.", error);
  }

  return {
    provider: "heuristic",
    quizQuestions: buildFallbackQuiz(moduleName, studyChallenges),
  };
}

function safeParsePrediction(rawText, fallback) {
  try {
    const parsed = JSON.parse(cleanJsonBlock(rawText));

    return {
      provider: "anthropic",
      riskLevel: ["LOW", "MEDIUM", "HIGH"].includes(parsed?.riskLevel)
        ? parsed.riskLevel
        : fallback.riskLevel,
      successProbability: Number.isFinite(parsed?.successProbability)
        ? clamp(Math.round(parsed.successProbability), 0, 100)
        : fallback.successProbability,
      overallComment:
        typeof parsed?.overallComment === "string" && parsed.overallComment.trim()
          ? parsed.overallComment.trim()
          : fallback.overallComment,
      strengths: Array.isArray(parsed?.strengths)
        ? parsed.strengths.filter((item) => typeof item === "string").slice(0, 3)
        : fallback.strengths,
      risks: Array.isArray(parsed?.risks)
        ? parsed.risks.filter((item) => typeof item === "string").slice(0, 4)
        : fallback.risks,
      recommendations: Array.isArray(parsed?.recommendations)
        ? parsed.recommendations.filter((item) => typeof item === "string").slice(0, 4)
        : fallback.recommendations,
      tutorSearchKeywords: Array.isArray(parsed?.tutorSearchKeywords)
        ? parsed.tutorSearchKeywords.filter((item) => typeof item === "string").slice(0, 5)
        : fallback.tutorSearchKeywords,
      recommendedTutorFocus: Array.isArray(parsed?.recommendedTutorFocus)
        ? parsed.recommendedTutorFocus
          .filter((item) => typeof item === "string")
          .slice(0, 4)
        : fallback.recommendedTutorFocus,
    };
  } catch (error) {
    console.warn("Unable to parse Anthropic prediction response, using heuristic prediction.", error);
    return fallback;
  }
}

async function generateQuizWithAnthropic({
  anthropic,
  moduleName,
  assessmentMarks,
  studyChallenges,
}) {
  const response = await anthropic.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 600,
    temperature: 0.4,
    messages: [
      {
        role: "user",
        content: `
You are an academic early-warning assistant.
Generate ONLY valid JSON in this shape:
{"quizQuestions":[{"id":"q1","question":"...","whyItMatters":"..."},{"id":"q2","question":"...","whyItMatters":"..."},{"id":"q3","question":"...","whyItMatters":"..."},{"id":"q4","question":"...","whyItMatters":"..."}]}

Rules:
- Create exactly 4 short reflective questions.
- Questions must be specific to the module.
- Questions must help estimate confidence, revision habits, misconceptions, and support needs.
- Keep each question under 170 characters.
- Keep each whyItMatters under 150 characters.

Module: ${moduleName}
Previous marks: ${JSON.stringify(assessmentMarks)}
Student challenge notes: ${studyChallenges || "None supplied"}
        `.trim(),
      },
    ],
  });

  return safeParseQuiz(extractTextFromAnthropic(response.content), moduleName, studyChallenges);
}

async function generatePredictionWithAnthropic({
  anthropic,
  moduleName,
  assessmentMarks,
  quizQuestions,
  quizAnswers,
  studyChallenges,
  fallback,
  sessionContext,
}) {
  const response = await anthropic.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 900,
    temperature: 0.3,
    messages: [
      {
        role: "user",
        content: `
You are an academic support analyst.
Return ONLY valid JSON with this exact shape:
{"riskLevel":"LOW|MEDIUM|HIGH","successProbability":0,"overallComment":"...","strengths":["..."],"risks":["..."],"recommendations":["..."],"tutorSearchKeywords":["..."],"recommendedTutorFocus":["..."]}

Rules:
- Give a realistic successProbability from 0 to 100.
- Keep strengths to max 3 items.
- Keep risks to max 4 items.
- Keep recommendations to max 4 concrete actions.
- Keep tutorSearchKeywords to max 5 search phrases.
- Keep recommendedTutorFocus to max 4 items.
- Make the tone supportive but honest.

Module: ${moduleName}
Previous marks: ${JSON.stringify(assessmentMarks)}
Quiz questions: ${JSON.stringify(quizQuestions)}
Quiz answers: ${JSON.stringify(quizAnswers)}
Student challenge notes: ${studyChallenges || "None supplied"}
User context: ${JSON.stringify(sessionContext)}
Fallback heuristic: ${JSON.stringify(fallback)}
        `.trim(),
      },
    ],
  });

  return safeParsePrediction(extractTextFromAnthropic(response.content), fallback);
}

function normalizeRecommendedTutors(tutors) {
  return tutors
    .filter((tutor) => !["suspended", "deleted"].includes(tutor.user?.accountStatus))
    .slice(0, 4)
    .map((tutor) => ({
      _id: String(tutor._id),
      hourlyRate: tutor.hourlyRate,
      sessionType: tutor.sessionType,
      subjects: Array.isArray(tutor.subjects) ? tutor.subjects.slice(0, 3) : [],
      stats: {
        rating: Number(tutor.stats?.rating || 0),
        totalSessions: Number(tutor.stats?.totalSessions || 0),
      },
      user: tutor.user
        ? {
          _id: String(tutor.user._id),
          name: tutor.user.name,
          avatar: tutor.user.avatar,
          university: tutor.user.university,
        }
        : null,
    }));
}

async function queryRecommendedTutors(subjectQueries, { includeVerificationFilter = true } = {}) {
  const query = {
    moderationStatus: { $ne: "rejected" },
  };

  if (includeVerificationFilter) {
    query.verificationStatus = { $in: ["pending", "verified"] };
  }

  if (subjectQueries.length) {
    query.$or = subjectQueries;
  }

  const tutors = await TutorProfile.find(query)
    .populate("user", "name avatar university accountStatus")
    .sort({ isFeatured: -1, "stats.rating": -1, "stats.totalSessions": -1 })
    .limit(subjectQueries.length ? 8 : 4)
    .lean();

  return normalizeRecommendedTutors(tutors);
}

async function findRecommendedTutors(moduleName, tutorSearchKeywords) {
  const allKeywords = [moduleName, ...(tutorSearchKeywords || [])]
    .map((item) => item?.trim())
    .filter(Boolean)
    .slice(0, 6);

  if (!allKeywords.length) {
    return queryRecommendedTutors([], { includeVerificationFilter: false });
  }

  const searchTerms = Array.from(
    new Set([
      ...allKeywords,
      ...allKeywords.flatMap((keyword) =>
        keyword
          .split(/[\s/-]+/)
          .map((part) => part.trim())
          .filter((part) => part.length >= 3)
      ),
    ])
  ).slice(0, 12);

  const subjectQueries = searchTerms.flatMap((keyword) => [
    { "subjects.name": { $regex: escapeRegex(keyword), $options: "i" } },
    { "subjects.category": { $regex: escapeRegex(keyword), $options: "i" } },
  ]);

  // Prefer verified or pending tutors, but fall back to the broader tutor pool
  // so the feature still recommends someone when moderation data is incomplete.
  const strictMatches = await queryRecommendedTutors(subjectQueries);
  if (strictMatches.length) {
    return strictMatches;
  }

  const broadMatches = await queryRecommendedTutors(subjectQueries, {
    includeVerificationFilter: false,
  });
  if (broadMatches.length) {
    return broadMatches;
  }

  return queryRecommendedTutors([], { includeVerificationFilter: false });
}

export async function GET() {
  const session = await getServerSession(authOptions);

  return NextResponse.json({
    available: true,
    authenticated: Boolean(session),
    message:
      "Use POST with action=generateQuiz or action=predict to run the early warning system.",
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const action = typeof body?.action === "string" ? body.action : "";

    if (!ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json(
        { message: "Invalid action supplied." },
        { status: 400 }
      );
    }

    const moduleName =
      typeof body?.moduleName === "string" ? body.moduleName.trim() : "";
    const assessmentMarks = Array.isArray(body?.assessmentMarks)
      ? body.assessmentMarks.map(normalizeMarkEntry).filter(Boolean).slice(0, 6)
      : [];
    const studyChallenges =
      typeof body?.studyChallenges === "string" ? body.studyChallenges.trim() : "";
    const quizQuestions = normalizeQuizQuestions(body?.quizQuestions);
    const quizAnswers = normalizeQuizAnswers(body?.quizAnswers);

    if (!moduleName) {
      return NextResponse.json(
        { message: "Please enter the module you are studying." },
        { status: 400 }
      );
    }

    if (!assessmentMarks.length) {
      return NextResponse.json(
        { message: "Please add at least one previous assessment mark." },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const anthropic = anthropicKey ? new Anthropic({ apiKey: anthropicKey }) : null;

    if (action === "generateQuiz") {
      const quiz = anthropic
        ? await generateQuizWithAnthropic({
          anthropic,
          moduleName,
          assessmentMarks,
          studyChallenges,
        }).catch((error) => {
          console.warn(
            `Anthropic quiz generation failed for model ${ANTHROPIC_MODEL}; using fallback quiz.`,
            error
          );
          return {
            provider: "heuristic",
            quizQuestions: buildFallbackQuiz(moduleName, studyChallenges),
          };
        })
        : {
          provider: "heuristic",
          quizQuestions: buildFallbackQuiz(moduleName, studyChallenges),
        };

      return NextResponse.json({
        moduleName,
        assessmentMarks,
        studyChallenges,
        ...quiz,
      });
    }

    if (!quizQuestions.length) {
      return NextResponse.json(
        { message: "Generate the quiz first before requesting a prediction." },
        { status: 400 }
      );
    }

    const fallbackPrediction = buildHeuristicPrediction({
      moduleName,
      assessmentMarks,
      quizQuestions,
      quizAnswers,
      studyChallenges,
    });

    const prediction = anthropic
      ? await generatePredictionWithAnthropic({
        anthropic,
        moduleName,
        assessmentMarks,
        quizQuestions,
        quizAnswers,
        studyChallenges,
        fallback: fallbackPrediction,
        sessionContext: {
          isLoggedIn: Boolean(session),
          userName: session?.user?.name || null,
          role: session?.user?.role || null,
        },
      }).catch((error) => {
        console.warn(
          `Anthropic prediction generation failed for model ${ANTHROPIC_MODEL}; using heuristic prediction.`,
          error
        );
        return fallbackPrediction;
      })
      : fallbackPrediction;

    await dbConnect();
    const recommendedTutors = await findRecommendedTutors(
      moduleName,
      prediction.tutorSearchKeywords
    );

    return NextResponse.json({
      moduleName,
      assessmentMarks,
      studyChallenges,
      quizQuestions,
      quizAnswers,
      prediction,
      recommendedTutors,
    });
  } catch (error) {
    console.error("Error generating early warning prediction:", error);
    return NextResponse.json(
      { message: "Error generating early warning prediction." },
      { status: 500 }
    );
  }
}
