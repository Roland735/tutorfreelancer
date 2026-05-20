"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  GraduationCap,
  Languages,
  MapPin,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { usePlatformContent } from "@/lib/usePlatformContent";

function parseLanguages(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function validateProfileForm(values) {
  const errors = {};
  const trimmedBio = values.bio.trim();
  const trimmedCity = values.city.trim();
  const trimmedLanguages = values.languages.trim();
  const trimmedUniversity = values.university.trim();
  const trimmedMajor = values.major.trim();

  if (!trimmedBio) {
    errors.bio = "Add a short bio so students can understand what you study and how you help.";
  }

  if (!trimmedCity) {
    errors.city = "Enter your city so nearby students can trust and find you more easily.";
  }

  if (!trimmedLanguages) {
    errors.languages = "Add at least one language you can use with students.";
  } else if (/[;/|]/.test(trimmedLanguages) && !trimmedLanguages.includes(",")) {
    errors.languages = "Use commas to separate languages, for example: English, Shona.";
  } else {
    const parsedLanguages = parseLanguages(trimmedLanguages);

    if (parsedLanguages.length === 0) {
      errors.languages = "Add at least one valid language.";
    } else if (parsedLanguages.some((language) => language.length < 2)) {
      errors.languages = "Each language should be written clearly, for example: English, Ndebele.";
    }
  }

  if (!trimmedUniversity) {
    errors.university = "Add your university so the marketplace can build trust around your academic identity.";
  }

  if (!trimmedMajor) {
    errors.major = "Add your degree or major so students understand your academic background.";
  }

  return errors;
}

export default function ProfileSetupPage() {
  const { status } = useSession();
  const router = useRouter();
  const redirect = "/dashboard";
  const { content } = usePlatformContent(["page.profileSetup"]);
  const pageContent = content["page.profileSetup"] || {};
  const CITY_SUGGESTIONS = pageContent.citySuggestions || [];
  const LANGUAGE_SUGGESTIONS = pageContent.languageSuggestions || [];
  const UNIVERSITY_SUGGESTIONS = pageContent.universitySuggestions || [];
  const YEAR_OPTIONS = pageContent.yearOptions || [];
  const TRUST_POINTS = pageContent.trustPoints || [];

  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [languages, setLanguages] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?redirect=/profile-setup`);
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      setFetchError("");
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setFetchError(data.message || "We could not load your saved details right now.");
          return;
        }

        const data = await res.json();
        setBio(data.bio || "");
        setCity(data.location?.city || "");
        setLanguages(data.languages?.join(", ") || "");
        setUniversity(data.university || "");
        setMajor(data.major || "");
        setYearOfStudy(data.yearOfStudy || "");
      } catch (e) {
        setFetchError("We could not load your saved details right now. You can still complete your profile.");
      } finally {
        setInitialLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchProfile();
    } else if (status !== "loading") {
      setInitialLoading(false);
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) {
      return;
    }

    setError("");
    const nextValues = {
      bio,
      city,
      languages,
      university,
      major,
    };
    const nextFieldErrors = validateProfileForm(nextValues);
    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      setError("Please check the highlighted fields and try again.");
      return;
    }

    const trimmedBio = bio.trim();
    const trimmedCity = city.trim();
    const trimmedLanguages = parseLanguages(languages.trim());
    const trimmedUniversity = university.trim();
    const trimmedMajor = major.trim();

    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bio: trimmedBio,
          city: trimmedCity,
          languages: trimmedLanguages,
          university: trimmedUniversity,
          major: trimmedMajor,
          yearOfStudy,
        }),
      });

      if (res.ok) {
        router.push(redirect);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Failed to update profile.");
      }
    } catch (e) {
      setError("Something went wrong while saving your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
    if (fieldErrors.bio) {
      setFieldErrors((current) => ({ ...current, bio: "" }));
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    if (fieldErrors.city) {
      setFieldErrors((current) => ({ ...current, city: "" }));
    }
  };

  const handleLanguagesChange = (e) => {
    setLanguages(e.target.value);
    if (fieldErrors.languages) {
      setFieldErrors((current) => ({ ...current, languages: "" }));
    }
  };

  const completedFields = [bio.trim(), city.trim(), languages.trim(), university.trim(), major.trim(), yearOfStudy].filter(Boolean).length;
  const completionPercentage = Math.round((completedFields / 6) * 100);

  if (status === "loading" || initialLoading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_32%),linear-gradient(180deg,_#020817_0%,_#03140f_52%,_#020817_100%)] text-foreground">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-border bg-card/90 shadow-xl shadow-black/25 backdrop-blur">
              <CardContent className="space-y-6 p-8">
                <div className="space-y-3">
                  <div className="h-5 w-28 animate-pulse rounded-full bg-muted/70" />
                  <div className="h-10 w-3/4 animate-pulse rounded-2xl bg-muted/70" />
                  <div className="h-4 w-full animate-pulse rounded-full bg-muted/60" />
                  <div className="h-4 w-5/6 animate-pulse rounded-full bg-muted/60" />
                </div>
                <div className="h-36 animate-pulse rounded-3xl bg-muted/60" />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="h-24 animate-pulse rounded-2xl bg-muted/60" />
                  <div className="h-24 animate-pulse rounded-2xl bg-muted/60" />
                </div>
                <div className="h-12 animate-pulse rounded-2xl bg-muted/70" />
              </CardContent>
            </Card>
            <Card className="border-primary/15 bg-secondary/70 text-foreground shadow-xl shadow-black/25">
              <CardContent className="space-y-5 p-8">
                <div className="h-5 w-32 animate-pulse rounded-full bg-white/10" />
                <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-white/10" />
                <div className="space-y-3">
                  {TRUST_POINTS.map((item) => (
                    <div key={item} className="h-12 animate-pulse rounded-2xl bg-white/5" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(5,150,105,0.12),_transparent_26%),linear-gradient(180deg,_#020817_0%,_#03140f_52%,_#020817_100%)] text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary shadow-sm shadow-primary/10 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Profile onboarding
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Complete your tutoring profile
              </h1>
              <p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                This helps students across Zimbabwe trust your profile, match with the right
                tutor or study partner, and quickly see your city and languages.
              </p>
            </div>
          </div>

          <div className="w-full rounded-3xl border border-border bg-card/85 p-4 shadow-lg shadow-black/25 backdrop-blur lg:max-w-sm">
            <div className="mb-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Profile progress
              </div>
              <span className="text-muted-foreground">{completionPercentage}% complete</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-300 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Add your academic identity now, then refine the rest later from your
              dashboard.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <Card className="overflow-hidden border-border bg-card/95 shadow-2xl shadow-black/25 backdrop-blur">
            <CardHeader className="space-y-4 border-b border-border bg-gradient-to-br from-card via-card to-secondary/35 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-sm shadow-primary/10">
                  <User className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-2xl text-foreground">Set up your profile</CardTitle>
                  <CardDescription className="max-w-xl text-sm leading-6 text-slate-300">
                    Keep it short and personal. A clear bio, university profile, city, and
                    languages make your profile feel real, local, and trustworthy.
                  </CardDescription>
                </div>
              </div>

              <div className="grid gap-3 rounded-3xl border border-primary/10 bg-secondary/30 p-4 text-sm text-slate-300 sm:grid-cols-4">
                <div className="flex items-start gap-3 rounded-2xl bg-background/60 p-3">
                  <MessageSquareQuote className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Tell your story</p>
                    <p className="text-xs leading-5">What you study, teach, and help with.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-background/60 p-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Show your location</p>
                    <p className="text-xs leading-5">Useful for city and campus-based trust.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-background/60 p-3">
                  <Languages className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Add your languages</p>
                    <p className="text-xs leading-5">Reflect the multilingual reality of Zimbabwe.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-background/60 p-3">
                  <GraduationCap className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Show academic credibility</p>
                    <p className="text-xs leading-5">University, degree, and year improve trust quickly.</p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {fetchError && (
                  <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                    {fetchError}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="bio"
                      className="flex items-center gap-2 text-sm font-semibold text-foreground"
                    >
                      <MessageSquareQuote className="h-4 w-4 text-primary" />
                      Short bio
                    </label>
                    <span className="text-xs text-muted-foreground">Most important</span>
                  </div>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={handleBioChange}
                    aria-invalid={Boolean(fieldErrors.bio)}
                    aria-describedby={fieldErrors.bio ? "bio-error" : "bio-help"}
                    placeholder="Example: I study Computer Science at UZ and help students with maths, coding, and assignment support. I enjoy explaining difficult concepts in simple steps."
                    className="min-h-[180px] rounded-3xl border-border bg-background/70 px-4 py-3 text-sm leading-6 shadow-inner shadow-black/10 transition focus-visible:border-primary"
                  />
                  <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
                    <p id="bio-help" className="text-muted-foreground">
                      Mention what you study, what you teach, and the kind of academic help you
                      offer or need.
                    </p>
                    <span className="text-muted-foreground">{bio.trim().length} characters</span>
                  </div>
                  {fieldErrors.bio && (
                    <p id="bio-error" className="text-sm text-destructive">
                      {fieldErrors.bio}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3 rounded-3xl border border-border bg-secondary/20 p-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      University
                    </label>
                    <Input
                      value={university}
                      onChange={(event) => {
                        setUniversity(event.target.value);
                        setFieldErrors((current) => ({ ...current, university: "" }));
                      }}
                      placeholder="e.g. University of Zimbabwe"
                      className="h-12 rounded-2xl border-border bg-background/70 shadow-sm"
                    />
                    <div className="flex flex-wrap gap-2">
                      {UNIVERSITY_SUGGESTIONS.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            setUniversity(suggestion);
                            setFieldErrors((current) => ({ ...current, university: "" }));
                          }}
                          className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs text-slate-300 transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                    {fieldErrors.university ? <p className="text-sm text-destructive">{fieldErrors.university}</p> : null}
                  </div>

                  <div className="space-y-3 rounded-3xl border border-border bg-secondary/20 p-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      Degree or major
                    </label>
                    <Input
                      value={major}
                      onChange={(event) => {
                        setMajor(event.target.value);
                        setFieldErrors((current) => ({ ...current, major: "" }));
                      }}
                      placeholder="e.g. Computer Science"
                      className="h-12 rounded-2xl border-border bg-background/70 shadow-sm"
                    />
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      Year of study
                    </label>
                    <Select
                      value={yearOfStudy}
                      onChange={(event) => setYearOfStudy(event.target.value)}
                      className="h-12 rounded-2xl border-border bg-background/70 shadow-sm"
                    >
                      <option value="">Select year</option>
                      {YEAR_OPTIONS.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Select>
                    {fieldErrors.major ? <p className="text-sm text-destructive">{fieldErrors.major}</p> : null}
                  </div>

                  <div className="space-y-3 rounded-3xl border border-border bg-secondary/20 p-4">
                    <label
                      htmlFor="city"
                      className="flex items-center gap-2 text-sm font-semibold text-foreground"
                    >
                      <Globe className="h-4 w-4 text-primary" />
                      City
                    </label>
                    <Input
                      id="city"
                      type="text"
                      value={city}
                      onChange={handleCityChange}
                      aria-invalid={Boolean(fieldErrors.city)}
                      aria-describedby={fieldErrors.city ? "city-error" : "city-help"}
                      placeholder="e.g. Harare, Bulawayo, Mutare"
                      className="h-12 rounded-2xl border-border bg-background/70 shadow-sm"
                    />
                    <p id="city-help" className="text-xs leading-5 text-muted-foreground">
                      Add the city where you usually study or tutor. This supports local matching
                      now and campus matching later.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {CITY_SUGGESTIONS.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            setCity(suggestion);
                            setFieldErrors((current) => ({ ...current, city: "" }));
                          }}
                          className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs text-slate-300 transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                    {fieldErrors.city && (
                      <p id="city-error" className="text-sm text-destructive">
                        {fieldErrors.city}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 rounded-3xl border border-border bg-secondary/20 p-4">
                    <label
                      htmlFor="languages"
                      className="flex items-center gap-2 text-sm font-semibold text-foreground"
                    >
                      <Languages className="h-4 w-4 text-primary" />
                      Languages
                    </label>
                    <Input
                      id="languages"
                      type="text"
                      value={languages}
                      onChange={handleLanguagesChange}
                      aria-invalid={Boolean(fieldErrors.languages)}
                      aria-describedby={fieldErrors.languages ? "languages-error" : "languages-help"}
                      placeholder="e.g. English, Shona, Ndebele"
                      className="h-12 rounded-2xl border-border bg-background/70 shadow-sm"
                    />
                    <p id="languages-help" className="text-xs leading-5 text-muted-foreground">
                      Use commas to separate each language. Example: English, Shona, Ndebele.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGE_SUGGESTIONS.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            const nextLanguages = parseLanguages(languages);
                            if (!nextLanguages.includes(suggestion)) {
                              const joined = [...nextLanguages, suggestion].join(", ");
                              setLanguages(joined);
                            }
                            setFieldErrors((current) => ({ ...current, languages: "" }));
                          }}
                          className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs text-slate-300 transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                    {fieldErrors.languages && (
                      <p id="languages-error" className="text-sm text-destructive">
                        {fieldErrors.languages}
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-3 rounded-3xl border border-border bg-secondary/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                    <GraduationCap className="mt-0.5 h-4 w-4 text-primary" />
                    You can update these details later from your dashboard as your tutoring profile
                    grows.
                  </p>
                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 rounded-2xl bg-gradient-to-r from-primary to-emerald-300 px-6 text-slate-950 shadow-lg shadow-primary/20"
                    disabled={loading || status !== "authenticated"}
                  >
                    {loading ? "Saving profile..." : "Save and continue"}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="overflow-hidden border-primary/15 bg-secondary/70 text-foreground shadow-2xl shadow-black/25">
              <CardContent className="p-6 sm:p-7">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-medium text-emerald-100">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Why this matters
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Build trust from the first glance
                  </h2>
                  <p className="text-sm leading-6 text-slate-300">
                    Students from UZ, NUST, HIT, MSU, GZU, CUT, Lupane, ZOU, BUSE, and other
                    universities need to know who they are learning with. A complete profile makes
                    that decision easier.
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  {TRUST_POINTS.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-background/35 p-4"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <p className="text-sm leading-6 text-slate-200">{point}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/95 shadow-xl shadow-black/20 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  Local profile examples
                </div>
                <div className="space-y-4 text-sm text-slate-300">
                  <div className="rounded-2xl border border-border bg-secondary/20 p-4">
                    <p className="font-medium text-foreground">City</p>
                    <p className="mt-1 leading-6">
                      Use a familiar student location such as Harare, Bulawayo, Gweru, Mutare, or
                      Masvingo.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-secondary/20 p-4">
                    <p className="font-medium text-foreground">Languages</p>
                    <p className="mt-1 leading-6">
                      Add the languages you can comfortably use in tutoring sessions, such as
                      English, Shona, and Ndebele.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
