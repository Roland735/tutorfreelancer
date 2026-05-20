import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import Anthropic from "@anthropic-ai/sdk";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import TutorProfile from "@/models/TutorProfile";

const ALLOWED_ACTIONS = new Set(["generateQuiz", "predict"]);
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";
const QUIZ_LENGTH_OPTIONS = new Set([4, 10, 20]);
const QUIZ_TYPES = ["multiple_choice", "fill_in", "code_fill", "short_answer"];

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
  const topics =
    typeof entry?.topics === "string" && entry.topics.trim()
      ? entry.topics
        .split(/[,\n/;]+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 8)
      : [];

  if (!Number.isFinite(score)) {
    return null;
  }

  return {
    title: label,
    score: clamp(Math.round(score), 0, 100),
    topics,
  };
}

function extractAssessmentTopics(assessmentMarks = []) {
  return Array.from(
    new Set(
      assessmentMarks.flatMap((item) =>
        Array.isArray(item?.topics) ? item.topics.filter(Boolean) : []
      )
    )
  ).slice(0, 8);
}

function normalizeAssessmentLength(value) {
  const length = Number(value);
  return QUIZ_LENGTH_OPTIONS.has(length) ? length : 4;
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
      const type = QUIZ_TYPES.includes(item?.type) ? item.type : "short_answer";
      const options = Array.isArray(item?.options)
        ? item.options.filter((option) => typeof option === "string" && option.trim()).slice(0, 5)
        : [];
      const codeTemplate =
        typeof item?.codeTemplate === "string" && item.codeTemplate.trim()
          ? item.codeTemplate.trim()
          : "";
      const placeholder =
        typeof item?.placeholder === "string" && item.placeholder.trim()
          ? item.placeholder.trim()
          : "";
      const correctAnswer =
        typeof item?.correctAnswer === "string" && item.correctAnswer.trim()
          ? item.correctAnswer.trim()
          : "";

      if (!question) return null;

      return {
        id:
          typeof item?.id === "string" && item.id.trim()
            ? item.id.trim()
            : `q${index + 1}`,
        type,
        question,
        whyItMatters,
        options: type === "multiple_choice" ? options.slice(0, 4) : [],
        codeTemplate: type === "code_fill" ? codeTemplate : "",
        placeholder,
        correctAnswer,
      };
    })
    .filter(Boolean)
    .slice(0, 20);
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

function buildFallbackQuiz(moduleName, studyChallenges, assessmentMarks = [], assessmentLength = 4) {
  const context = studyChallenges
    ? ` especially around ${studyChallenges.toLowerCase()}`
    : "";
  const topicHints = extractAssessmentTopics(assessmentMarks);
  const topics = topicHints.length ? topicHints : [moduleName];
  const templates = [
    (topic, index) => ({
      id: `q${index + 1}`,
      type: "multiple_choice",
      question: `Which statement best describes your confidence with ${topic} in ${moduleName}?`,
      whyItMatters: "Shows current confidence and whether the topic needs urgent support.",
      options: [
        "I can solve it confidently on my own.",
        "I understand some parts but make errors.",
        "I often guess or get stuck.",
        "I have not understood it yet.",
      ],
      placeholder: "",
      codeTemplate: "",
      correctAnswer: "I understand some parts but make errors.",
    }),
    (topic, index) => ({
      id: `q${index + 1}`,
      type: "fill_in",
      question: `Fill in one key idea, formula, or term you connect with ${topic} in ${moduleName}.`,
      whyItMatters: "Checks recall of core concepts from previously assessed topics.",
      options: [],
      placeholder: `Type a key idea for ${topic}`,
      codeTemplate: "",
      correctAnswer: `A correct response should name a valid core idea, formula, or term related to ${topic}.`,
    }),
    (topic, index) => ({
      id: `q${index + 1}`,
      type: "code_fill",
      question: `Complete the missing line so this ${moduleName} example about ${topic} works.`,
      whyItMatters: "Tests whether the student can apply process steps instead of only describing them.",
      options: [],
      placeholder: "Type the missing code or working step",
      codeTemplate: `// ${moduleName}: ${topic}\nfunction solveStep(input) {\n  // TODO: add the missing line here\n  return input;\n}`,
      correctAnswer: "Add the missing line that correctly performs the required step before returning the result.",
    }),
    (topic, index) => ({
      id: `q${index + 1}`,
      type: "short_answer",
      question: `What usually causes you to lose marks on ${topic} in ${moduleName}${context}?`,
      whyItMatters: "Identifies misconceptions, revision gaps, or exam-technique issues.",
      options: [],
      placeholder: "Type your answer here",
      codeTemplate: "",
      correctAnswer: `A strong answer should clearly identify a real difficulty with ${topic}, such as misunderstanding concepts, missing steps, or exam-technique errors.`,
    }),
  ];

  return Array.from({ length: assessmentLength }, (_, index) => {
    const topic = topics[index % topics.length];
    const builder = templates[index % templates.length];
    return builder(topic, index);
  });
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
  const assessmentTopics = extractAssessmentTopics(assessmentMarks);
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
  if (assessmentTopics.length) {
    risks.push(`Your recent assessments covered ${assessmentTopics.slice(0, 3).join(", ")}, so weak spots in those areas need checking.`);
  }

  const recommendations = [
    `Break ${moduleName} into 2-3 specific subtopics and review one per study block this week.`,
    "Book a tutor for a diagnostic session focused on recent low-scoring assessments and misconceptions.",
    "Create a short weekly revision routine with timed practice and feedback on mistakes.",
  ];
  if (assessmentTopics.length) {
    recommendations.unshift(
      `Revisit the topics already assessed in ${moduleName}, especially ${assessmentTopics.slice(0, 3).join(", ")}.`
    );
  }

  const tutorSearchKeywords = [
    moduleName,
    ...assessmentTopics,
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
      ...(assessmentTopics.length
        ? [`Target assessed topics such as ${assessmentTopics.slice(0, 2).join(" and ")}`]
        : []),
      "Review past assessments and exam technique",
      "Build a weekly revision plan",
    ].slice(0, 4),
  };
}

function safeParseQuiz(rawText, moduleName, studyChallenges, assessmentMarks, assessmentLength) {
  try {
    const parsed = JSON.parse(cleanJsonBlock(rawText));
    const quizQuestions = normalizeQuizQuestions(parsed?.quizQuestions);

    if (quizQuestions.length) {
      return {
        provider: "anthropic",
        quizQuestions: quizQuestions.slice(0, assessmentLength),
      };
    }
  } catch (error) {
    console.warn("Unable to parse Anthropic quiz response, using fallback quiz.", error);
  }

  return {
    provider: "heuristic",
    quizQuestions: buildFallbackQuiz(moduleName, studyChallenges, assessmentMarks, assessmentLength),
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
  assessmentLength,
}) {
  const response = await anthropic.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: assessmentLength <= 4 ? 900 : assessmentLength <= 10 ? 1800 : 3200,
    temperature: 0.4,
    messages: [
      {
        role: "user",
        content: `
You are an academic early-warning assistant.
Generate ONLY valid JSON in this shape:
{"quizQuestions":[{"id":"q1","type":"multiple_choice|fill_in|code_fill|short_answer","question":"...","whyItMatters":"...","options":["..."],"codeTemplate":"...","placeholder":"...","correctAnswer":"..."}]}

Rules:
- Create exactly ${assessmentLength} questions.
- Questions must be specific to the module.
- Use a mix of question types across the assessment: multiple_choice, fill_in, code_fill, and short_answer.
- Include "options" only for multiple_choice questions and give exactly 4 options.
- Include "codeTemplate" only for code_fill questions.
- Include "placeholder" for fill_in, code_fill, or short_answer when useful.
- Include "correctAnswer" for every question.
- For multiple_choice, "correctAnswer" must exactly match one of the options.
- For fill_in, code_fill, and short_answer, "correctAnswer" should be a short model answer or marking guide.
- Questions must help estimate confidence, revision habits, misconceptions, and support needs.
- Use the previously assessed topics when they are provided.
- Keep each question under 170 characters.
- Keep each whyItMatters under 150 characters.

Module: ${moduleName}
Previous marks: ${JSON.stringify(assessmentMarks)}
Student challenge notes: ${studyChallenges || "None supplied"}
        `.trim(),
      },
    ],
  });

  return safeParseQuiz(
    extractTextFromAnthropic(response.content),
    moduleName,
    studyChallenges,
    assessmentMarks,
    assessmentLength
  );
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
- Use any provided assessment topics to identify likely weak areas and useful tutor focus.

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
    const assessmentLength = normalizeAssessmentLength(body?.assessmentLength);
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
          assessmentLength,
        }).catch((error) => {
          console.warn(
            `Anthropic quiz generation failed for model ${ANTHROPIC_MODEL}; using fallback quiz.`,
            error
          );
          return {
            provider: "heuristic",
            quizQuestions: buildFallbackQuiz(
              moduleName,
              studyChallenges,
              assessmentMarks,
              assessmentLength
            ),
          };
        })
        : {
          provider: "heuristic",
          quizQuestions: buildFallbackQuiz(
            moduleName,
            studyChallenges,
            assessmentMarks,
            assessmentLength
          ),
        };

      return NextResponse.json({
        moduleName,
        assessmentLength,
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
      assessmentLength,
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
