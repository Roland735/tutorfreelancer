"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  BookOpenText,
  Building2,
  CheckCircle2,
  Circle,
  Github,
  Globe,
  GraduationCap,
  Languages,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  School,
  ShieldCheck,
  Sparkles,
  Ticket,
  Upload,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import RoleOptionCard from "@/components/auth/RoleOptionCard";
import FormSection from "@/components/auth/FormSection";
import {
  LANGUAGE_OPTIONS,
  PASSWORD_RULES,
  ROLE_OPTIONS,
  STUDENT_YEAR_OPTIONS,
  SUBJECT_OPTIONS,
  TUTOR_ACADEMIC_LEVEL_OPTIONS,
  TUTORING_MODE_OPTIONS,
  ZIMBABWE_CITIES,
  ZIMBABWE_UNIVERSITIES,
} from "@/lib/signup-data";

const ROLE_ICONS = {
  student: GraduationCap,
  tutor: BookOpenText,
};

const PHONE_REGEX = /^\+?[0-9()\-\s]{8,20}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const TRUST_POINTS = [
  "Role-based onboarding that keeps student and tutor journeys clear from the start.",
  "Zimbabwe-focused university, city, and language support for stronger local trust.",
  "Secure credential signup with backend validation preserved for future auth providers.",
];

const SOCIAL_OPTIONS = [
  { label: "Google", icon: Mail },
  { label: "GitHub", icon: Github },
];

const INITIAL_FORM = {
  role: "student",
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  university: "",
  city: "",
  languages: "English",
  phoneNumber: "",
  referralCode: "",
  acceptedTerms: false,
  courseOfStudy: "",
  yearOfStudy: "",
  subjectsNeeded: "",
  preferredTutoringMode: "Online",
  learningGoal: "",
  subjectsTaught: "",
  academicLevel: "",
  yearsOfExperience: "",
  tutoringMode: "Online",
  tutorBio: "",
  startingPrice: "",
  verificationDocumentName: "",
};

function parseList(value) {
  return [...new Set(
    String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  )];
}

function appendSuggestion(currentValue, nextValue) {
  const values = parseList(currentValue);
  if (values.includes(nextValue)) {
    return currentValue;
  }
  return [...values, nextValue].join(", ");
}

function getPasswordChecks(password) {
  return PASSWORD_RULES.map((rule) => {
    if (rule === "At least 8 characters") {
      return { rule, passed: password.length >= 8 };
    }
    if (rule === "At least 1 letter") {
      return { rule, passed: /[A-Za-z]/.test(password) };
    }
    return { rule, passed: /\d/.test(password) };
  });
}

function validateForm(form) {
  const fieldErrors = {};
  const languages = parseList(form.languages);
  const subjectsNeeded = parseList(form.subjectsNeeded);
  const subjectsTaught = parseList(form.subjectsTaught);

  if (!form.name.trim()) {
    fieldErrors.name = "Enter your full name.";
  }

  if (!form.email.trim()) {
    fieldErrors.email = "Enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (!form.password) {
    fieldErrors.password = "Create a password.";
  } else if (!PASSWORD_REGEX.test(form.password)) {
    fieldErrors.password = "Use at least 8 characters with at least 1 letter and 1 number.";
  }

  if (!form.confirmPassword) {
    fieldErrors.confirmPassword = "Confirm your password.";
  } else if (form.password !== form.confirmPassword) {
    fieldErrors.confirmPassword = "Passwords must match.";
  }

  if (!form.university.trim()) {
    fieldErrors.university = "Select or enter your university.";
  }

  if (!form.city.trim()) {
    fieldErrors.city = "Add your city.";
  }

  if (languages.length === 0) {
    fieldErrors.languages = "Add at least one language.";
  }

  if (form.phoneNumber.trim() && !PHONE_REGEX.test(form.phoneNumber.trim())) {
    fieldErrors.phoneNumber = "Enter a valid phone number or leave it blank.";
  }

  if (!form.acceptedTerms) {
    fieldErrors.acceptedTerms = "You must accept the terms and privacy policy.";
  }

  if (form.role === "student") {
    if (!form.courseOfStudy.trim()) {
      fieldErrors.courseOfStudy = "Add your course of study.";
    }
    if (!form.yearOfStudy) {
      fieldErrors.yearOfStudy = "Select your year of study.";
    }
    if (subjectsNeeded.length === 0) {
      fieldErrors.subjectsNeeded = "Add at least one subject you need help with.";
    }
    if (!form.preferredTutoringMode) {
      fieldErrors.preferredTutoringMode = "Choose your preferred tutoring mode.";
    }
    if (!form.learningGoal.trim()) {
      fieldErrors.learningGoal = "Add a short learning goal.";
    }
  }

  if (form.role === "tutor") {
    if (subjectsTaught.length === 0) {
      fieldErrors.subjectsTaught = "Add at least one subject you can teach.";
    }
    if (!form.academicLevel) {
      fieldErrors.academicLevel = "Select your academic level.";
    }
    if (form.yearsOfExperience === "" || Number(form.yearsOfExperience) < 0) {
      fieldErrors.yearsOfExperience = "Enter your years of experience.";
    }
    if (!form.tutoringMode) {
      fieldErrors.tutoringMode = "Choose how you tutor.";
    }
    if (!form.tutorBio.trim()) {
      fieldErrors.tutorBio = "Add a short tutor bio.";
    }
    if (form.startingPrice === "" || Number(form.startingPrice) < 5) {
      fieldErrors.startingPrice = "Set a starting price of at least 5.";
    }
  }

  return fieldErrors;
}

function FieldError({ id, message }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="flex items-start gap-2 text-sm text-sky-200">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

function FieldHint({ children }) {
  return <p className="text-xs leading-5 text-slate-400">{children}</p>;
}

function TextField({
  id,
  label,
  icon: Icon,
  error,
  hint,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-100">
        {Icon ? <Icon className="h-4 w-4 text-sky-300" /> : null}
        {label}
      </label>
      <Input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className="h-12 rounded-2xl border-white/12 bg-slate-950/35 px-4 text-slate-50 placeholder:text-slate-500 focus-visible:ring-primary"
        {...props}
      />
      {hint ? <div className="mt-2" id={`${id}-hint`}><FieldHint>{hint}</FieldHint></div> : null}
      <div className="mt-2">
        <FieldError id={`${id}-error`} message={error} />
      </div>
    </div>
  );
}

function SelectField({
  id,
  label,
  icon: Icon,
  error,
  hint,
  children,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-100">
        {Icon ? <Icon className="h-4 w-4 text-sky-300" /> : null}
        {label}
      </label>
      <Select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className="h-12 rounded-2xl border-white/12 bg-slate-950/35 px-4 text-slate-50 focus:ring-primary"
        {...props}
      >
        {children}
      </Select>
      {hint ? <div className="mt-2" id={`${id}-hint`}><FieldHint>{hint}</FieldHint></div> : null}
      <div className="mt-2">
        <FieldError id={`${id}-error`} message={error} />
      </div>
    </div>
  );
}

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedRole = ROLE_OPTIONS.find((option) => option.value === form.role) || ROLE_OPTIONS[0];
  const SelectedRoleIcon = ROLE_ICONS[form.role];
  const passwordChecks = useMemo(() => getPasswordChecks(form.password), [form.password]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  }

  function handleRoleContinue() {
    setStep(2);
    setFormError("");
    setFieldErrors((current) => ({ ...current, role: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const nextFieldErrors = validateForm(form);
    setFieldErrors(nextFieldErrors);
    setFormError("");

    if (Object.keys(nextFieldErrors).length > 0) {
      setFormError("Please review the highlighted fields before creating your account.");
      return;
    }

    const payload = {
      role: form.role,
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      university: form.university.trim(),
      city: form.city.trim(),
      languages: parseList(form.languages),
      phoneNumber: form.phoneNumber.trim(),
      referralCode: form.referralCode.trim(),
      acceptedTerms: form.acceptedTerms,
      country: "Zimbabwe",
      courseOfStudy: form.courseOfStudy.trim(),
      yearOfStudy: form.yearOfStudy,
      subjectsNeeded: parseList(form.subjectsNeeded),
      preferredTutoringMode: form.preferredTutoringMode,
      learningGoal: form.learningGoal.trim(),
      subjectsTaught: parseList(form.subjectsTaught),
      academicLevel: form.academicLevel,
      yearsOfExperience: form.yearsOfExperience,
      tutoringMode: form.tutoringMode,
      tutorBio: form.tutorBio.trim(),
      startingPrice: form.startingPrice,
      verificationDocumentName: form.verificationDocumentName.trim(),
    };

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.fieldErrors) {
          setFieldErrors((current) => ({ ...current, ...data.fieldErrors }));
        }
        setFormError(data.message || "We could not create your account right now.");
        setLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/login");
        return;
      }

      router.push(data.redirectTo || "/dashboard");
    } catch (error) {
      setFormError("Something went wrong while creating your account. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] flex-col lg:flex-row">
        <section className="flex w-full items-start justify-center px-4 py-8 sm:px-6 lg:w-[56%] lg:px-10 lg:py-10 xl:px-14">
          <div className="w-full max-w-3xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-white/90 shadow-[0_16px_40px_rgba(2,6,23,0.35)] backdrop-blur-xl transition hover:border-primary/50 hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-sky-400 to-emerald-300 text-slate-950 shadow-lg">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[0.7rem] uppercase tracking-[0.22em] text-white/55">Zimbabwe student marketplace</span>
                  <span className="block text-base font-semibold text-white">TutorFreelancer</span>
                </span>
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                Secure registration
              </div>
            </div>

            <Card className="overflow-hidden border border-white/12 bg-white/10 shadow-[0_24px_80px_rgba(2,6,23,0.55)] backdrop-blur-2xl">
              <div className="border-b border-white/10 bg-white/[0.03] px-6 py-6 sm:px-8 sm:py-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100/80">
                    <Sparkles className="h-3.5 w-3.5" />
                    {step === 1 ? "Step 1 of 2" : "Step 2 of 2"}
                  </div>
                  {step === 2 ? (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-300 transition hover:border-sky-400/35 hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Change role
                    </button>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {step === 1 ? "Choose how you want to start" : "Create your academic account"}
                  </h1>
                  <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                    {step === 1
                      ? "Pick the role that matches your intent today. This decision powers the rest of your onboarding and your future workspace navigation."
                      : "Finish a polished, student-friendly registration flow built for Zimbabwean universities, local trust, and smooth onboarding."}
                  </p>
                </div>

                {step === 2 ? (
                  <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-primary/20 bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(16,185,129,0.14))] px-4 py-3 text-sm text-slate-100">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950/60">
                      <SelectedRoleIcon className="h-5 w-5 text-sky-200" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Selected role</span>
                      <span className="block font-medium text-white">{selectedRole.title}</span>
                    </span>
                  </div>
                ) : null}
              </div>

              <CardContent className="px-6 py-6 sm:px-8 sm:py-8">
                {step === 1 ? (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      {ROLE_OPTIONS.map((option) => {
                        const Icon = ROLE_ICONS[option.value];
                        return (
                          <RoleOptionCard
                            key={option.value}
                            option={option}
                            icon={Icon}
                            selected={form.role === option.value}
                            onSelect={(nextRole) => updateField("role", nextRole)}
                          />
                        );
                      })}
                    </div>

                    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-5">
                      <div className="grid gap-3 sm:grid-cols-3">
                        {TRUST_POINTS.map((point) => (
                          <div key={point} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="lg"
                      onClick={handleRoleContinue}
                      className="h-14 w-full rounded-2xl bg-gradient-to-r from-primary via-sky-400 to-emerald-300 text-base font-semibold text-slate-950 shadow-[0_18px_45px_rgba(59,130,246,0.35)] transition duration-200 hover:scale-[1.01] hover:from-primary/95 hover:via-sky-300 hover:to-emerald-200"
                    >
                      Continue as {selectedRole.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <FormSection
                      eyebrow="Account"
                      title="Basic details"
                      description="Keep this fast and clean. We trim inputs, validate everything inline, and protect the flow against double submission."
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <TextField
                          id="name"
                          label="Full name"
                          icon={UserRound}
                          value={form.name}
                          onChange={(event) => updateField("name", event.target.value)}
                          placeholder="e.g. Rutendo Moyo"
                          autoComplete="name"
                          error={fieldErrors.name}
                        />
                        <TextField
                          id="email"
                          label="Email address"
                          icon={Mail}
                          value={form.email}
                          onChange={(event) => updateField("email", event.target.value)}
                          placeholder="student@university.ac.zw"
                          autoComplete="email"
                          error={fieldErrors.email}
                        />
                        <TextField
                          id="password"
                          label="Password"
                          icon={LockKeyhole}
                          type="password"
                          value={form.password}
                          onChange={(event) => updateField("password", event.target.value)}
                          placeholder="Create a strong password"
                          autoComplete="new-password"
                          error={fieldErrors.password}
                        />
                        <TextField
                          id="confirmPassword"
                          label="Confirm password"
                          icon={LockKeyhole}
                          type="password"
                          value={form.confirmPassword}
                          onChange={(event) => updateField("confirmPassword", event.target.value)}
                          placeholder="Re-enter your password"
                          autoComplete="new-password"
                          error={fieldErrors.confirmPassword}
                        />
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-100">
                          <ShieldCheck className="h-4 w-4 text-emerald-300" />
                          Password requirements
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                          {passwordChecks.map(({ rule, passed }) => (
                            <div
                              key={rule}
                              className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-slate-300"
                            >
                              {passed ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                              ) : (
                                <Circle className="h-4 w-4 text-slate-500" />
                              )}
                              <span>{rule}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FormSection>

                    <FormSection
                      eyebrow="Profile"
                      title="Campus identity"
                      description="Show enough local context to build trust quickly for Zimbabwean students and tutors."
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <TextField
                          id="university"
                          label="University"
                          icon={Building2}
                          value={form.university}
                          onChange={(event) => updateField("university", event.target.value)}
                          placeholder="Start typing your university"
                          list="signup-universities"
                          error={fieldErrors.university}
                          hint="Supports Zimbabwean universities naturally, with room to add more later."
                        />
                        <TextField
                          id="city"
                          label="City"
                          icon={MapPin}
                          value={form.city}
                          onChange={(event) => updateField("city", event.target.value)}
                          placeholder="e.g. Harare"
                          list="signup-cities"
                          error={fieldErrors.city}
                        />
                        <TextField
                          id="languages"
                          label="Languages"
                          icon={Languages}
                          value={form.languages}
                          onChange={(event) => updateField("languages", event.target.value)}
                          placeholder="English, Shona"
                          error={fieldErrors.languages}
                          hint="Separate multiple languages with commas."
                        />
                        <TextField
                          id="phoneNumber"
                          label="Phone number"
                          icon={Phone}
                          value={form.phoneNumber}
                          onChange={(event) => updateField("phoneNumber", event.target.value)}
                          placeholder="Optional, e.g. +263 77 123 4567"
                          autoComplete="tel"
                          error={fieldErrors.phoneNumber}
                        />
                        <TextField
                          id="referralCode"
                          label="Referral code"
                          icon={Ticket}
                          value={form.referralCode}
                          onChange={(event) => updateField("referralCode", event.target.value)}
                          placeholder="Optional referral code"
                          className="md:col-span-2"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {LANGUAGE_OPTIONS.map((language) => (
                          <button
                            key={language}
                            type="button"
                            onClick={() => updateField("languages", appendSuggestion(form.languages, language))}
                            className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-sky-400/35 hover:bg-sky-400/10 hover:text-sky-100"
                          >
                            {language}
                          </button>
                        ))}
                      </div>
                    </FormSection>

                    {form.role === "student" ? (
                      <FormSection
                        eyebrow="Student"
                        title="Learning preferences"
                        description="Keep the student journey specific enough to match with the right tutor without feeling overwhelming."
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <TextField
                            id="courseOfStudy"
                            label="Course of study"
                            icon={School}
                            value={form.courseOfStudy}
                            onChange={(event) => updateField("courseOfStudy", event.target.value)}
                            placeholder="e.g. BSc Computer Science"
                            error={fieldErrors.courseOfStudy}
                          />
                          <SelectField
                            id="yearOfStudy"
                            label="Year of study"
                            icon={GraduationCap}
                            value={form.yearOfStudy}
                            onChange={(event) => updateField("yearOfStudy", event.target.value)}
                            error={fieldErrors.yearOfStudy}
                          >
                            <option value="">Select your year</option>
                            {STUDENT_YEAR_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </SelectField>
                          <TextField
                            id="subjectsNeeded"
                            label="Subjects you need help with"
                            icon={BookOpenText}
                            value={form.subjectsNeeded}
                            onChange={(event) => updateField("subjectsNeeded", event.target.value)}
                            placeholder="e.g. Calculus, Programming"
                            className="md:col-span-2"
                            error={fieldErrors.subjectsNeeded}
                            hint="Separate subjects with commas."
                          />
                          <SelectField
                            id="preferredTutoringMode"
                            label="Preferred tutoring mode"
                            icon={Globe}
                            value={form.preferredTutoringMode}
                            onChange={(event) => updateField("preferredTutoringMode", event.target.value)}
                            error={fieldErrors.preferredTutoringMode}
                          >
                            {TUTORING_MODE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </SelectField>
                          <div className="md:col-span-2">
                            <label htmlFor="learningGoal" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-100">
                              <Sparkles className="h-4 w-4 text-sky-300" />
                              Short learning goal
                            </label>
                            <Textarea
                              id="learningGoal"
                              value={form.learningGoal}
                              onChange={(event) => updateField("learningGoal", event.target.value)}
                              aria-invalid={Boolean(fieldErrors.learningGoal)}
                              aria-describedby={fieldErrors.learningGoal ? "learningGoal-error" : "learningGoal-hint"}
                              placeholder="Tell tutors what you want to improve, pass, or understand better."
                              className="min-h-[132px] rounded-3xl border-white/12 bg-slate-950/35 px-4 py-3 text-slate-50 placeholder:text-slate-500 focus-visible:ring-primary"
                            />
                            <div className="mt-2" id="learningGoal-hint">
                              <FieldHint>This becomes the first signal tutors use to understand your needs.</FieldHint>
                            </div>
                            <div className="mt-2">
                              <FieldError id="learningGoal-error" message={fieldErrors.learningGoal} />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {SUBJECT_OPTIONS.map((subject) => (
                            <button
                              key={subject}
                              type="button"
                              onClick={() => updateField("subjectsNeeded", appendSuggestion(form.subjectsNeeded, subject))}
                              className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-sky-400/35 hover:bg-sky-400/10 hover:text-sky-100"
                            >
                              {subject}
                            </button>
                          ))}
                        </div>
                      </FormSection>
                    ) : (
                      <FormSection
                        eyebrow="Tutor"
                        title="Teaching profile"
                        description="Capture the core teaching signals needed for trust, conversion, and future tutor-focused navigation."
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <TextField
                            id="subjectsTaught"
                            label="Subjects taught"
                            icon={BookOpenText}
                            value={form.subjectsTaught}
                            onChange={(event) => updateField("subjectsTaught", event.target.value)}
                            placeholder="e.g. Statistics, Economics"
                            className="md:col-span-2"
                            error={fieldErrors.subjectsTaught}
                            hint="Separate subjects with commas."
                          />
                          <SelectField
                            id="academicLevel"
                            label="Academic level"
                            icon={School}
                            value={form.academicLevel}
                            onChange={(event) => updateField("academicLevel", event.target.value)}
                            error={fieldErrors.academicLevel}
                          >
                            <option value="">Select your academic level</option>
                            {TUTOR_ACADEMIC_LEVEL_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </SelectField>
                          <TextField
                            id="yearsOfExperience"
                            label="Years of experience"
                            icon={GraduationCap}
                            type="number"
                            min="0"
                            value={form.yearsOfExperience}
                            onChange={(event) => updateField("yearsOfExperience", event.target.value)}
                            placeholder="e.g. 2"
                            error={fieldErrors.yearsOfExperience}
                          />
                          <SelectField
                            id="tutoringMode"
                            label="Tutoring mode"
                            icon={Globe}
                            value={form.tutoringMode}
                            onChange={(event) => updateField("tutoringMode", event.target.value)}
                            error={fieldErrors.tutoringMode}
                          >
                            {TUTORING_MODE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </SelectField>
                          <TextField
                            id="startingPrice"
                            label="Hourly rate or starting price"
                            icon={BadgeDollarSign}
                            type="number"
                            min="5"
                            step="1"
                            value={form.startingPrice}
                            onChange={(event) => updateField("startingPrice", event.target.value)}
                            placeholder="USD starting from 5"
                            error={fieldErrors.startingPrice}
                          />
                          <div className="md:col-span-2">
                            <label htmlFor="tutorBio" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-100">
                              <Sparkles className="h-4 w-4 text-sky-300" />
                              Short tutor bio
                            </label>
                            <Textarea
                              id="tutorBio"
                              value={form.tutorBio}
                              onChange={(event) => updateField("tutorBio", event.target.value)}
                              aria-invalid={Boolean(fieldErrors.tutorBio)}
                              aria-describedby={fieldErrors.tutorBio ? "tutorBio-error" : "tutorBio-hint"}
                              placeholder="Summarize what you teach, how you explain concepts, and the learners you help best."
                              className="min-h-[140px] rounded-3xl border-white/12 bg-slate-950/35 px-4 py-3 text-slate-50 placeholder:text-slate-500 focus-visible:ring-primary"
                            />
                            <div className="mt-2" id="tutorBio-hint">
                              <FieldHint>Keep it concise, warm, and confidence-building.</FieldHint>
                            </div>
                            <div className="mt-2">
                              <FieldError id="tutorBio-error" message={fieldErrors.tutorBio} />
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <label htmlFor="verificationDocument" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-100">
                              <Upload className="h-4 w-4 text-sky-300" />
                              Verification placeholder
                            </label>
                            <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-slate-950/35 p-4">
                              <input
                                id="verificationDocument"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(event) =>
                                  updateField(
                                    "verificationDocumentName",
                                    event.target.files?.[0]?.name || ""
                                  )
                                }
                                className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-sky-400/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-sky-100 hover:file:bg-sky-400/20"
                              />
                              <p className="mt-3 text-xs leading-5 text-slate-400">
                                Placeholder for future university proof or student ID upload. The current flow stores the selected file name only.
                              </p>
                              {form.verificationDocumentName ? (
                                <p className="mt-2 text-sm text-emerald-200">
                                  Selected: {form.verificationDocumentName}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {SUBJECT_OPTIONS.map((subject) => (
                            <button
                              key={subject}
                              type="button"
                              onClick={() => updateField("subjectsTaught", appendSuggestion(form.subjectsTaught, subject))}
                              className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-sky-400/35 hover:bg-sky-400/10 hover:text-sky-100"
                            >
                              {subject}
                            </button>
                          ))}
                        </div>
                      </FormSection>
                    )}

                    <FormSection
                      eyebrow="Finish"
                      title="Create your account"
                      description="We keep the final step focused: legal confirmation, clear CTA, and a smooth handoff into onboarding."
                    >
                      <div className="space-y-4">
                        <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm leading-6 text-slate-300">
                          <input
                            type="checkbox"
                            checked={form.acceptedTerms}
                            onChange={(event) => updateField("acceptedTerms", event.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-950/60 text-primary focus:ring-2 focus:ring-primary"
                          />
                          <span>
                            I agree to the{" "}
                            <Link href="/terms" className="font-medium text-sky-200 transition hover:text-white">
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="font-medium text-sky-200 transition hover:text-white">
                              Privacy Policy
                            </Link>
                            .
                          </span>
                        </label>
                        <FieldError id="acceptedTerms-error" message={fieldErrors.acceptedTerms} />

                        {formError ? (
                          <div
                            role="alert"
                            aria-live="polite"
                            className="flex items-start gap-3 rounded-2xl border border-sky-400/25 bg-sky-400/10 px-4 py-3 text-sm text-sky-100"
                          >
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{formError}</span>
                          </div>
                        ) : null}

                        <Button
                          type="submit"
                          disabled={loading}
                          size="lg"
                          className="h-14 w-full rounded-2xl bg-gradient-to-r from-primary via-sky-400 to-emerald-300 text-base font-semibold text-slate-950 shadow-[0_18px_45px_rgba(59,130,246,0.35)] transition duration-200 hover:scale-[1.01] hover:from-primary/95 hover:via-sky-300 hover:to-emerald-200"
                        >
                          <span>{loading ? "Creating your workspace..." : `Create ${selectedRole.title} account`}</span>
                          {!loading ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
                        </Button>

                        <p className="text-center text-xs leading-5 text-slate-400">
                          Trusted academic onboarding for Zimbabwean universities. Your role, campus details, and profile metadata are saved for future student or tutor navigation.
                        </p>

                        <div className="relative pt-2">
                          <div className="absolute inset-0 top-1/2 flex items-center">
                            <div className="w-full border-t border-white/10" />
                          </div>
                          <div className="relative flex justify-center">
                            <span className="rounded-full border border-white/10 bg-slate-900 px-4 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                              Social signup
                            </span>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {SOCIAL_OPTIONS.map(({ label, icon: Icon }) => (
                            <Button
                              key={label}
                              type="button"
                              variant="outline"
                              disabled
                              className="h-12 rounded-2xl border-white/12 bg-white/5 text-sm font-medium text-slate-100 hover:bg-white/10"
                            >
                              <Icon className="mr-2 h-4 w-4 text-sky-200" />
                              Continue with {label}
                              <span className="ml-2 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-400">
                                Soon
                              </span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </FormSection>
                  </form>
                )}

                <datalist id="signup-universities">
                  {ZIMBABWE_UNIVERSITIES.map((university) => (
                    <option key={university} value={university} />
                  ))}
                </datalist>
                <datalist id="signup-cities">
                  {ZIMBABWE_CITIES.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>

                <p className="mt-8 text-center text-sm text-slate-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-sky-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  >
                    Sign in instead
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <aside className="relative hidden w-[44%] overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(14,165,233,0.18)_0%,rgba(15,23,42,0.6)_35%,rgba(2,6,23,0.15)_100%)]" />
          <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute bottom-12 right-8 h-80 w-80 rounded-full bg-emerald-300/14 blur-3xl" />
          <div className="absolute left-1/2 top-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.02]" />

          <div className="relative z-10 flex w-full flex-col justify-between px-10 py-12 xl:px-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200/80">
                Premium onboarding experience
              </p>
              <h2 className="mt-4 max-w-lg text-4xl font-semibold leading-tight text-white xl:text-5xl">
                A calmer, more trustworthy first step for student tutors across Zimbabwe.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                The registration experience is designed to feel modern, secure, and easy to complete on small screens while still capturing the profile data that improves matching and trust.
              </p>
            </div>

            <div className="mt-10 grid gap-6">
              <Card className="border border-white/12 bg-white/[0.08] shadow-[0_28px_80px_rgba(2,6,23,0.45)] backdrop-blur-2xl">
                <CardContent className="p-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-sky-400 to-emerald-300 text-slate-950">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm uppercase tracking-[0.18em] text-slate-400">Trust signals</div>
                      <div className="text-xl font-semibold text-white">Built into the flow</div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    {[
                      "University, city, and languages are captured up front for local credibility.",
                      "Role selection guides the rest of the form and later sidebar behavior.",
                      "Tutor metadata and student preferences are structured for future expansion.",
                    ].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm leading-6 text-slate-300">
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="border border-white/12 bg-white/[0.08] shadow-[0_24px_70px_rgba(2,6,23,0.38)] backdrop-blur-2xl">
                  <CardContent className="p-5">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Universities</div>
                    <div className="mt-3 text-3xl font-semibold text-white">{ZIMBABWE_UNIVERSITIES.length}+</div>
                    <div className="mt-2 text-sm text-slate-300">Zimbabwe-ready suggestions</div>
                  </CardContent>
                </Card>
                <Card className="border border-white/12 bg-white/[0.08] shadow-[0_24px_70px_rgba(2,6,23,0.38)] backdrop-blur-2xl">
                  <CardContent className="p-5">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Modes</div>
                    <div className="mt-3 text-3xl font-semibold text-white">3</div>
                    <div className="mt-2 text-sm text-slate-300">Online, in-person, or both</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-white/12 bg-white/[0.08] shadow-[0_24px_70px_rgba(2,6,23,0.38)] backdrop-blur-2xl">
                <CardContent className="p-7">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Why students trust it</div>
                  <p className="mt-4 text-2xl font-medium leading-10 text-white">
                    &ldquo;The onboarding already felt like a serious academic platform, not just another generic form.&rdquo;
                  </p>
                  <div className="mt-6">
                    <div className="text-base font-semibold text-white">Campus-ready experience</div>
                    <div className="text-sm text-slate-400">Designed for tutors and learners across Zimbabwean universities</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
