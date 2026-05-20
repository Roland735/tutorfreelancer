"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Gauge,
  LoaderCircle,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const initialMarks = [{ title: "Assessment 1", score: "" }];

const riskToneMap = {
  LOW: {
    chip: "border-emerald-400/25 bg-emerald-400/10 text-emerald-100",
    icon: TrendingUp,
  },
  MEDIUM: {
    chip: "border-amber-400/25 bg-amber-400/10 text-amber-100",
    icon: AlertTriangle,
  },
  HIGH: {
    chip: "border-rose-400/25 bg-rose-400/10 text-rose-100",
    icon: ShieldAlert,
  },
};

function getTutorSubjectLabel(subjects = []) {
  return subjects
    .map((subject) => subject?.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");
}

export default function EarlyWarningSystem({
  title = "AI Early Warning System",
  description = "Enter your module, previous marks, and a few short quiz answers to get a prediction, feedback, and tutor recommendations.",
  compact = false,
  className = "",
}) {
  const { data: session, status } = useSession();
  const [moduleName, setModuleName] = useState("");
  const [studyChallenges, setStudyChallenges] = useState("");
  const [assessmentMarks, setAssessmentMarks] = useState(initialMarks);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState("");

  const isLoggedIn = status === "authenticated";
  const tone = riskToneMap[result?.prediction?.riskLevel] || riskToneMap.MEDIUM;
  const RiskIcon = tone.icon;

  const canGenerateQuiz = useMemo(
    () =>
      moduleName.trim() &&
      assessmentMarks.some((mark) => String(mark.score).trim() !== ""),
    [assessmentMarks, moduleName]
  );

  const handleMarkChange = (index, key, value) => {
    setAssessmentMarks((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    );
  };

  const addAssessment = () => {
    setAssessmentMarks((current) => [
      ...current,
      { title: `Assessment ${current.length + 1}`, score: "" },
    ]);
  };

  const removeAssessment = (index) => {
    setAssessmentMarks((current) =>
      current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const buildPayload = () => ({
    moduleName,
    studyChallenges,
    assessmentMarks: assessmentMarks
      .map((mark) => ({
        title: mark.title,
        score: mark.score,
      }))
      .filter((mark) => String(mark.score).trim() !== ""),
  });

  const handleGenerateQuiz = async () => {
    setError("");
    setResult(null);
    setLoadingAction("quiz");

    try {
      const response = await fetch("/api/student/prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generateQuiz",
          ...buildPayload(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to generate quiz.");
      }

      const nextQuestions = Array.isArray(data.quizQuestions) ? data.quizQuestions : [];
      setQuizQuestions(nextQuestions);
      setQuizAnswers(nextQuestions.map((question) => ({ id: question.id, answer: "" })));
    } catch (requestError) {
      setError(requestError.message || "Unable to generate quiz.");
    } finally {
      setLoadingAction("");
    }
  };

  const handleAnswerChange = (id, value) => {
    setQuizAnswers((current) =>
      current.map((item) => (item.id === id ? { ...item, answer: value } : item))
    );
  };

  const handlePredict = async () => {
    setError("");
    setLoadingAction("predict");

    try {
      const response = await fetch("/api/student/prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "predict",
          ...buildPayload(),
          quizQuestions,
          quizAnswers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to generate prediction.");
      }

      setResult(data);
    } catch (requestError) {
      setError(requestError.message || "Unable to generate prediction.");
    } finally {
      setLoadingAction("");
    }
  };

  return (
    <section
      className={`rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.95)] sm:p-8 ${className}`}
    >
      <div
        className={`grid gap-8 ${
          compact ? "xl:grid-cols-[0.95fr_1.05fr]" : "xl:grid-cols-[0.9fr_1.1fr]"
        }`}
      >
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200">
            <Brain className="h-3.5 w-3.5" />
            Early Warning
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            {description}
          </p>

          <div className="mt-6 rounded-[24px] border border-white/8 bg-slate-950/70 p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">Student access</p>
                <p className="mt-1 text-sm text-slate-400">
                  {isLoggedIn
                    ? `Signed in as ${session?.user?.name || "student"}`
                    : "Available here for guests and inside the dashboard for logged-in students"}
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-slate-200">
                {isLoggedIn ? "Logged in" : "Guest mode"}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Module
                </label>
                <Input
                  value={moduleName}
                  onChange={(event) => setModuleName(event.target.value)}
                  placeholder="e.g. Calculus I, Organic Chemistry, Python Programming"
                  className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-slate-200">
                    Previous assessment marks
                  </label>
                  <button
                    type="button"
                    onClick={addAssessment}
                    className="text-sm font-medium text-emerald-200 transition hover:text-emerald-100"
                  >
                    Add mark
                  </button>
                </div>

                <div className="space-y-3">
                  {assessmentMarks.map((mark, index) => (
                    <div key={`mark-${index}`} className="grid gap-3 sm:grid-cols-[1fr_140px_auto]">
                      <Input
                        value={mark.title}
                        onChange={(event) =>
                          handleMarkChange(index, "title", event.target.value)
                        }
                        placeholder="Assessment name"
                        className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={mark.score}
                        onChange={(event) =>
                          handleMarkChange(index, "score", event.target.value)
                        }
                        placeholder="Score %"
                        className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeAssessment(index)}
                        className="h-12 rounded-2xl border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.08]"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Biggest challenge
                </label>
                <Textarea
                  value={studyChallenges}
                  onChange={(event) => setStudyChallenges(event.target.value)}
                  placeholder="e.g. I understand the basics but struggle with exam questions, formulas, or essay structure"
                  className="min-h-[110px] rounded-2xl border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={handleGenerateQuiz}
                disabled={!canGenerateQuiz || loadingAction === "quiz" || loadingAction === "predict"}
                className="h-12 rounded-2xl bg-emerald-400 px-6 text-slate-950 hover:bg-emerald-300"
              >
                {loadingAction === "quiz" ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Generating quiz
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI quiz
                  </>
                )}
              </Button>
              {!isLoggedIn && (
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-2xl border-white/10 bg-white/[0.03] text-slate-100 hover:bg-white/[0.08]"
                >
                  <Link href="/login">Log in for dashboard access</Link>
                </Button>
              )}
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[24px] border border-white/8 bg-slate-950/70 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">Step 2</p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  Short quiz
                </h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-slate-300">
                {quizQuestions.length ? `${quizQuestions.length} questions` : "Waiting"}
              </span>
            </div>

            {quizQuestions.length ? (
              <div className="mt-5 space-y-4">
                {quizQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                  >
                    <p className="text-sm font-semibold text-white">
                      {index + 1}. {question.question}
                    </p>
                    {question.whyItMatters && (
                      <p className="mt-2 text-xs leading-6 text-slate-400">
                        {question.whyItMatters}
                      </p>
                    )}
                    <Textarea
                      value={
                        quizAnswers.find((item) => item.id === question.id)?.answer || ""
                      }
                      onChange={(event) =>
                        handleAnswerChange(question.id, event.target.value)
                      }
                      placeholder="Type your answer here"
                      className="mt-3 min-h-[96px] rounded-2xl border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500"
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={handlePredict}
                  disabled={loadingAction === "predict"}
                  className="h-12 w-full rounded-2xl bg-white text-slate-950 hover:bg-emerald-300"
                >
                  {loadingAction === "predict" ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Generating prediction
                    </>
                  ) : (
                    <>
                      <Gauge className="mr-2 h-4 w-4" />
                      Get prediction and next steps
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-10 text-center">
                <p className="text-base font-medium text-white">
                  Generate the quiz to continue
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  The system creates a short AI quiz based on your module, marks, and learning challenge.
                </p>
              </div>
            )}
          </div>

          {result?.prediction && (
            <div className="rounded-[24px] border border-white/8 bg-slate-950/70 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Prediction result</p>
                  <h3 className="mt-1 text-xl font-semibold text-white">
                    {result.moduleName}
                  </h3>
                </div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${tone.chip}`}
                >
                  <RiskIcon className="h-4 w-4" />
                  {result.prediction.riskLevel} risk
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Success probability
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {result.prediction.successProbability}%
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Analysis source
                  </p>
                  <p className="mt-2 text-lg font-semibold capitalize text-white">
                    {result.prediction.provider}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-sm font-medium text-white">Overall comment</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {result.prediction.overallComment}
                </p>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-sm font-medium text-white">Strengths</p>
                  <div className="mt-3 space-y-3">
                    {(result.prediction.strengths || []).length ? (
                      result.prediction.strengths.map((item) => (
                        <div key={item} className="flex gap-3 text-sm text-slate-300">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" />
                          <span>{item}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">
                        More strengths appear as quiz responses become more detailed.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-sm font-medium text-white">Risk factors</p>
                  <div className="mt-3 space-y-3">
                    {(result.prediction.risks || []).length ? (
                      result.prediction.risks.map((item) => (
                        <div key={item} className="flex gap-3 text-sm text-slate-300">
                          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" />
                          <span>{item}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">
                        No major risks were flagged by the current inputs.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-sm font-medium text-white">Recommended actions</p>
                  <div className="mt-3 space-y-3">
                    {(result.prediction.recommendations || []).map((item) => (
                      <div key={item} className="flex gap-3 text-sm text-slate-300">
                        <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-300" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-[24px] border border-white/8 bg-slate-950/70 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">Tutor recommendations</p>
                <p className="mt-1 text-sm text-slate-400">
                  Suggested from tutors whose subjects align with the module and predicted support needs.
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-slate-300">
                {(result?.recommendedTutors || []).length} tutors
              </span>
            </div>

            {(result?.recommendedTutors || []).length ? (
              <div className="mt-5 space-y-3">
                {result.recommendedTutors.map((tutor) => (
                  <Link
                    key={tutor._id}
                    href={`/tutors/${tutor.user?._id}`}
                    className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition hover:border-emerald-300/20 hover:bg-white/[0.06] sm:flex-row sm:items-center"
                  >
                    <img
                      src={
                        tutor.user?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          tutor.user?.name || "Tutor"
                        )}&background=0f172a&color=ffffff`
                      }
                      alt={tutor.user?.name || "Tutor"}
                      className="h-14 w-14 rounded-2xl border border-white/10 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white">{tutor.user?.name}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {tutor.user?.university || "University tutor"} • {tutor.sessionType}
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        {getTutorSubjectLabel(tutor.subjects) || "Academic support"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                      <p className="text-sm font-medium text-white">
                        ${(tutor.hourlyRate || 0).toFixed(0)}/hr
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Rating {(tutor.stats?.rating || 0).toFixed(1)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-8">
                <p className="text-sm leading-6 text-slate-400">
                  Tutor matches appear after the prediction runs and the system can map your module to available expertise.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
