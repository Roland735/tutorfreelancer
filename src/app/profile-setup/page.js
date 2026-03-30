"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GraduationCap, User, Globe, Languages } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";

export default function ProfileSetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const redirect = "/dashboard";

  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [languages, setLanguages] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?redirect=/profile-setup`);
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setBio(data.bio || "");
          setCity(data.location?.city || "");
          setLanguages(data.languages?.join(", ") || "");
        }
      } catch (e) {
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
          bio,
          city,
          languages: languages.split(",").map((l) => l.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        router.push(redirect);
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

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/10 text-primary p-3 rounded-full">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-heading">Set up your profile</h1>
            <p className="text-muted-foreground">
              Tell students and tutors a bit more about yourself before you get started.
            </p>
          </div>
        </div>

        <Card className="shadow-lg border-border">
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                {loading ? "Saving profile..." : "Save profile and continue"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <GraduationCap size={14} /> You can update your profile details later from your dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
