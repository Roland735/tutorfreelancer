"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GraduationCap, User, Globe, Languages } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";

export default function ProfileEditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [country, setCountry] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [subjects, setSubjects] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [languages, setLanguages] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  const countries = [
    { code: "ZW", name: "Zimbabwe" },
    { code: "ZA", name: "South Africa" },
  ];

  const universitiesByCountry = {
    ZW: [
      "University of Zimbabwe",
      "National University of Science and Technology",
      "Midlands State University",
      "Chinhoyi University of Technology",
      "Great Zimbabwe University",
      "Lupane State University",
    ],
    ZA: [
      "University of Cape Town",
      "University of the Witwatersrand",
      "Stellenbosch University",
      "University of Pretoria",
      "University of Johannesburg",
      "University of KwaZulu-Natal",
    ],
  };

  const majorsByCountry = {
    ZW: [
      "Accounting",
      "Business Management",
      "Computer Science",
      "Economics",
      "Engineering",
      "Law",
      "Medicine",
      "Psychology",
    ],
    ZA: [
      "Accounting",
      "Business Administration",
      "Computer Science",
      "Data Science",
      "Engineering",
      "Law",
      "Medicine",
      "Education",
    ],
  };

  const subjectOptions = [
    "Mathematics",
    "Calculus",
    "Algebra",
    "Computer Science",
    "Python",
    "JavaScript",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Economics",
  ];

  const availableUniversities = country ? universitiesByCountry[country] || [] : [];
  const availableMajors = country ? majorsByCountry[country] || [] : [];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/profile/edit");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setUniversity(data.university || "");
          setMajor(data.major || "");
          setCountry(data.location?.country || "");
          setHourlyRate(
            data.tutorProfile?.hourlyRate != null ? String(data.tutorProfile.hourlyRate) : ""
          );
          setSubjects(
            data.tutorProfile?.subjects
              ? data.tutorProfile.subjects.map((s) => s.name).join(", ")
              : ""
          );
          setSummary({
            name: data.name,
            email: data.email,
            role: data.role,
            university: data.university,
            major: data.major,
            country: data.location?.country,
            hourlyRate: data.tutorProfile?.hourlyRate,
            rating: data.tutorProfile?.stats?.rating,
            totalSessions: data.tutorProfile?.stats?.totalSessions,
            sessionType: data.tutorProfile?.sessionType,
            subjects: data.tutorProfile?.subjects || [],
            badges: data.tutorProfile?.badges || [],
          });
          setBio(data.bio || "");
          setCity(data.location?.city || "");
          setLanguages(data.languages?.join(", ") || "");
        }
      } catch (e) {
      } finally {
        setInitialLoading(false);
      }
    };
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!bio || !city || !languages) {
      setError("Please complete all profile fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          university,
          major,
          country,
          hourlyRate,
          subjects: subjects
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          bio,
          city,
          languages: languages.split(",").map((l) => l.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update profile.");
      }
    } catch (e) {
      setError("Something went wrong while saving your profile.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || initialLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <div className="text-primary text-lg font-semibold">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 text-primary p-3 rounded-full">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-heading">Edit your profile</h1>
            <p className="text-muted-foreground">
              Update your details so students and tutors see the latest information.
            </p>
          </div>
        </div>

        {summary && (
          <Card className="mb-6 border-border">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-6 justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Name</p>
                  <p className="font-semibold">{summary.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{summary.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Role</p>
                  <p className="font-semibold">
                    {summary.role === "both"
                      ? "Student & Tutor"
                      : summary.role
                        ? summary.role.charAt(0).toUpperCase() + summary.role.slice(1)
                        : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Academic</p>
                  <p className="font-semibold">{summary.university || "Not set"}</p>
                  <p className="text-xs text-muted-foreground mt-1">{summary.major || ""}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Country</p>
                  <p className="font-semibold">{summary.country || "Not set"}</p>
                </div>
              </div>

              {summary.role && summary.role !== "student" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Hourly Rate</p>
                    <p className="font-semibold">
                      {summary.hourlyRate ? `$${summary.hourlyRate}/hr` : "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Rating / Sessions</p>
                    <p className="font-semibold">
                      {summary.rating ? summary.rating.toFixed(1) : "No rating yet"}
                      {typeof summary.totalSessions === "number" && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({summary.totalSessions} sessions)
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Main Subjects</p>
                    <p className="font-semibold text-sm">
                      {summary.subjects && summary.subjects.length > 0
                        ? summary.subjects.slice(0, 3).map((s) => s.name).join(", ")
                        : "Not set"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg border-border">
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    University
                  </label>
                  <Select
                    value={country ? university : ""}
                    onChange={(e) => setUniversity(e.target.value)}
                    disabled={!country}
                  >
                    <option value="">
                      {country ? "Select your university" : "Select country first"}
                    </option>
                    {availableUniversities.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Major / Field
                  </label>
                  <Select
                    value={country ? major : ""}
                    onChange={(e) => setMajor(e.target.value)}
                    disabled={!country}
                  >
                    <option value="">
                      {country ? "Select your major" : "Select country first"}
                    </option>
                    {availableMajors.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Country
                  </label>
                  <Select
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setUniversity("");
                      setMajor("");
                    }}
                  >
                    <option value="">Select your country</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Hourly Rate (USD)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Main Subjects
                  </label>
                  <Select
                    value={subjects}
                    onChange={(e) => setSubjects(e.target.value)}
                  >
                    <option value="">Select your main subject</option>
                    {subjectOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Short Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Share your background, what you study or teach, and what you're looking for on TutorFreelance."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Globe size={16} /> City
                  </label>
                  <Input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Harare, Cape Town"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Languages size={16} /> Languages
                  </label>
                  <Input
                    type="text"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="e.g. English, Shona, isiZulu"
                    className="w-full"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm py-2 px-3 rounded-md text-center border border-destructive/20">
                  {error}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={loading || status !== "authenticated"}>
                {loading ? "Saving profile..." : "Save changes"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <GraduationCap size={14} /> These details appear on your public tutor and student views.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
