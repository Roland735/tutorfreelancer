"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Github, Mail, CheckCircle, Quote } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push(redirect);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    signIn(provider, { callbackUrl: redirect });
  };

  const handleFill = async (role) => {
    setDemoLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/demo-users?role=${role}`);
      const data = await res.json();
      if (res.ok && data?.email) {
        setEmail(data.email);
        setPassword("password123");
      } else {
        setError(data?.message || "No seeded user found");
      }
    } catch {
      setError("Unable to load seeded user");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">

      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative">
        <div className="absolute top-8 left-8 sm:left-12">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary font-heading">
            <GraduationCap size={32} />
            <span>TutorFreelance</span>
          </Link>
        </div>

        <div className="mt-24 sm:mt-0">
          <h1 className="text-3xl font-bold text-foreground mb-2 font-heading">Welcome Back</h1>
          <p className="text-muted-foreground mb-8">Please enter your details to sign in.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <Input
                type="email"
                required
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                <input type="checkbox" className="rounded border-border bg-input text-primary focus:ring-primary" />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-primary hover:text-primary/80 font-medium transition">
                Forgot Password?
              </Link>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle size={16} className="rotate-45" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4">
            <div className="text-sm text-muted-foreground mb-2">Quick fill seeded login</div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={demoLoading || loading}
                onClick={() => handleFill("student")}
              >
                Student
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={demoLoading || loading}
                onClick={() => handleFill("tutor")}
              >
                Tutor
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={demoLoading || loading}
                onClick={() => handleFill("admin")}
              >
                Admin
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2">Seed password is password123</div>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('google')}
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" /> Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('github')}
              className="w-full"
            >
              <Github className="mr-2 h-4 w-4" /> GitHub
            </Button>
          </div>

          <p className="text-center text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:text-primary/80 font-bold transition">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visuals */}
      <div className="hidden lg:flex w-1/2 bg-muted relative overflow-hidden items-center justify-center">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-900/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-lg p-12">
          <Card className="bg-card/50 backdrop-blur-xl border-primary/20 p-8 shadow-2xl">
            <CardContent className="p-0">
              <Quote className="text-4xl text-primary mb-6 opacity-50" />
              <p className="text-2xl font-medium text-foreground leading-relaxed mb-6 font-heading">
                "TutorFreelance helped me ace my Calculus finals. Finding a tutor who actually went to my university made all the difference!"
              </p>
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Sarah+J&background=10b981&color=fff" alt="Student" className="w-12 h-12 rounded-full border-2 border-primary/30" />
                <div>
                  <h4 className="font-bold text-foreground">Sarah Jenkins</h4>
                  <p className="text-sm text-muted-foreground">Computer Science Student, MIT</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6 mt-12">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-foreground mb-1">10k+</div>
                <div className="text-primary text-sm font-medium">Active Students</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-foreground mb-1">50k+</div>
                <div className="text-blue-400 text-sm font-medium">Sessions Completed</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-xl font-semibold animate-pulse">Loading login...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
