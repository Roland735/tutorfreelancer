"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, Users, ArrowLeft, Quote } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";

export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const router = useRouter();

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

  const availableUniversities = country ? universitiesByCountry[country] || [] : [];
  const availableMajors = country ? majorsByCountry[country] || [] : [];

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
    setError("");
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword || !country || !university || !major) {
      setError("All fields are necessary.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          country,
          university,
          major,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.message || "User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative">
        <div className="absolute top-8 left-8 sm:left-12">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary font-heading">
            <GraduationCap size={32} />
            <span>TutorFreelance</span>
          </Link>
        </div>

        <div className="mt-24 sm:mt-0">
          <div className="flex items-center gap-3 mb-6">
            {step === 2 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={20} />
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1 font-heading">
                {step === 1 ? "Create your account" : "Finish your profile"}
              </h1>
              <p className="text-muted-foreground">
                {step === 1
                  ? "Choose how you want to use TutorFreelance."
                  : `Signing up as ${role === "both" ? "Student & Tutor" : role.charAt(0).toUpperCase() + role.slice(1)}`}
              </p>
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelect("student")}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary hover:bg-muted/50 transition group text-left w-full"
              >
                <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition text-primary">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">Find a Tutor</h3>
                  <p className="text-sm text-muted-foreground">I want to find tutors for my studies.</p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect("tutor")}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary hover:bg-muted/50 transition group text-left w-full"
              >
                <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition text-primary">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">Become a Tutor</h3>
                  <p className="text-sm text-muted-foreground">I want to offer tutoring services.</p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect("both")}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary hover:bg-muted/50 transition group text-left w-full"
              >
                <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition text-primary">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">Both</h3>
                  <p className="text-sm text-muted-foreground">I want to both learn and teach.</p>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Country</label>
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
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">University</label>
                <Select
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  disabled={!country}
                >
                  <option value="">{country ? "Select your university" : "Select country first"}</option>
                  {availableUniversities.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Major</label>
                <Select
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  disabled={!country}
                >
                  <option value="">{country ? "Select your major" : "Select country first"}</option>
                  {availableMajors.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </Select>
              </div>

              <Button type="submit" size="lg" className="w-full mt-2">
                Create Account
              </Button>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm py-2 px-3 rounded-md text-center border border-destructive/20">
                  {error}
                </div>
              )}
            </form>
          )}

          <p className="text-center text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition">
              Login
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-muted relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-900/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-lg p-12">
          <Card className="bg-card/50 backdrop-blur-xl border-primary/20 p-8 shadow-2xl">
            <CardContent className="p-0">
              <Quote className="text-4xl text-primary mb-6 opacity-50" />
              <p className="text-2xl font-medium text-foreground leading-relaxed mb-6 font-heading">
                "Join thousands of students and tutors collaborating every day on TutorFreelance."
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://ui-avatars.com/api/?name=Alex+K&background=10b981&color=fff"
                  alt="Student"
                  className="w-12 h-12 rounded-full border-2 border-primary/30"
                />
                <div>
                  <h4 className="font-bold text-foreground">Alex Kim</h4>
                  <p className="text-sm text-muted-foreground">Economics Student, LSE</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6 mt-12">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-foreground mb-1">150+</div>
                <div className="text-primary text-sm font-medium">Subjects Covered</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-foreground mb-1">95%</div>
                <div className="text-blue-400 text-sm font-medium">Student Satisfaction</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
