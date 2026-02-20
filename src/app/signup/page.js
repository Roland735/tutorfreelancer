"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, Users, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const router = useRouter();

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

    if (!name || !email || !password || !university || !major) {
      setError("All fields are necessary.");
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
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] py-10 px-4">
        <Card className="w-full max-w-md relative overflow-hidden">
          <CardContent className="p-8">
            {step === 2 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="absolute top-4 left-4 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={20} />
              </Button>
            )}

            <div className="text-center mb-8 mt-4">
              <h2 className="text-3xl font-bold text-primary mb-2 font-heading">
                {step === 1 ? "Choose your role" : "Create Account"}
              </h2>
              <p className="text-muted-foreground">
                {step === 1 ? "How do you want to use TutorFreelancer?" : `Signing up as ${role === 'both' ? 'Student & Tutor' : role.charAt(0).toUpperCase() + role.slice(1)}`}
              </p>
            </div>

            {step === 1 ? (
              <div className="flex flex-col gap-4">
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
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
                <Input
                  type="text"
                  placeholder="University"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full"
                />
                <Input
                  type="text"
                  placeholder="Major"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full"
                />
                
                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-2"
                >
                  Create Account
                </Button>

                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm py-2 px-3 rounded-md text-center border border-destructive/20">
                    {error}
                  </div>
                )}
              </form>
            )}

            <div className="mt-6 text-center border-t border-border pt-4">
              <Link className="text-sm text-muted-foreground hover:text-primary transition" href="/login">
                Already have an account? <span className="underline font-medium">Login</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
