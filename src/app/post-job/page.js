"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, Check, Upload, DollarSign, Clock, AlertCircle, Loader2, Briefcase, GraduationCap, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { usePlatformContent } from "@/lib/usePlatformContent";

export default function PostJobPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { content } = usePlatformContent(["lookups.marketplace", "page.jobPosting"]);
  const lookups = content["lookups.marketplace"] || {};
  const pageContent = content["page.jobPosting"] || {};
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    academicLevel: "Undergraduate",
    attachments: [], // UI only for now
    budgetType: "Fixed",
    minBudget: "",
    maxBudget: "",
    sessionType: "Online",
    duration: "1-3 months",
    urgency: "Medium",
  });

  const categories = lookups.jobCategories || [];
  const academicLevels = lookups.jobAcademicLevels || [];
  const budgetTypes = lookups.budgetTypes || [];
  const sessionTypes = lookups.sessionTypes || [];
  const urgencies = lookups.urgencies || [];
  const durations = lookups.durations || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.title.trim()) { setError("Job title is required"); return false; }
      if (!formData.category) { setError("Category is required"); return false; }
    }
    if (step === 2) {
      if (!formData.description.trim()) { setError("Description is required"); return false; }
      if (formData.description.length < 50) { setError("Description must be at least 50 characters"); return false; }
    }
    if (step === 3) {
      if (!formData.minBudget) { setError("Budget amount is required"); return false; }
      if (formData.budgetType === "Hourly" && !formData.maxBudget) { setError("Max budget is required for hourly rates"); return false; }
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        academicLevel: formData.academicLevel,
        sessionType: formData.sessionType,
        urgency: formData.urgency,
        budget: {
          type: formData.budgetType,
          min: Number(formData.minBudget),
          max: formData.maxBudget ? Number(formData.maxBudget) : Number(formData.minBudget), // For fixed, min=max usually or just min
          currency: "USD"
        },
        duration: formData.duration,
      };

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/dashboard?posted=true");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to post job");
      }
    } catch (err) {
      console.error("Error posting job:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login?redirect=/post-job");
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold font-display mb-2">{pageContent.title || "Post a New Job"}</h1>
          <p className="text-muted-foreground">{pageContent.description || "Follow the steps to create your job listing and find the perfect tutor."}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 relative px-2">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-4 text-sm font-medium text-muted-foreground">
            <span className={cn("transition-colors duration-300", currentStep >= 1 ? "text-primary font-bold" : "")}>1. Title & Category</span>
            <span className={cn("transition-colors duration-300", currentStep >= 2 ? "text-primary font-bold" : "")}>2. Description</span>
            <span className={cn("transition-colors duration-300", currentStep >= 3 ? "text-primary font-bold" : "")}>3. Details</span>
            <span className={cn("transition-colors duration-300", currentStep >= 4 ? "text-primary font-bold" : "")}>4. Preview</span>
          </div>
        </div>

        <Card className="border-border shadow-lg">
          <CardContent className="p-8">
            {error && (
              <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}

            {/* Step 1: Basics */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Job Title</label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Need help with Calculus II Integration"
                    className="bg-background"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Category</label>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="bg-background"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Description */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Job Description</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={8}
                    placeholder="Describe your task in detail..."
                    className="bg-background resize-none min-h-[200px]"
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground text-right">{formData.description.length} characters</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Academic Level</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {academicLevels.map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, academicLevel: level }))}
                        className={cn(
                          "py-3 px-4 rounded-lg border text-sm font-medium transition-all duration-200",
                          formData.academicLevel === level
                            ? "bg-primary/10 border-primary text-primary shadow-sm"
                            : "bg-background border-input text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Attachments (Optional)</label>
                  <div className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:border-primary/50 hover:bg-muted/5 transition cursor-pointer bg-background group">
                    <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                    <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">Drag & drop files here or click to upload</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">

                {/* Budget */}
                <div className="space-y-4">
                  <label className="text-sm font-medium leading-none">Budget</label>
                  <div className="flex gap-4">
                    {budgetTypes.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, budgetType: type }))}
                        className={cn(
                          "flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2",
                          formData.budgetType === type
                            ? "bg-primary/10 border-primary text-primary shadow-sm"
                            : "bg-background border-input text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <DollarSign className="h-4 w-4" /> {type} Rate
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-xs text-muted-foreground block">Min ($)</label>
                      <Input
                        type="number"
                        name="minBudget"
                        value={formData.minBudget}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="bg-background"
                      />
                    </div>
                    {formData.budgetType === "Hourly" && (
                      <div className="flex-1 space-y-2">
                        <label className="text-xs text-muted-foreground block">Max ($)</label>
                        <Input
                          type="number"
                          name="maxBudget"
                          value={formData.maxBudget}
                          onChange={handleChange}
                          placeholder="0.00"
                          className="bg-background"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Session Type */}
                <div className="space-y-4">
                  <label className="text-sm font-medium leading-none">Session Type</label>
                  <div className="grid grid-cols-3 gap-4">
                    {sessionTypes.map(type => (
                      <label key={type} className="cursor-pointer relative group">
                        <input
                          type="radio"
                          name="sessionType"
                          value={type}
                          checked={formData.sessionType === type}
                          onChange={handleChange}
                          className="peer sr-only"
                        />
                        <div className="text-center py-3 px-4 rounded-lg border border-input bg-background text-muted-foreground peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-all duration-200 hover:border-primary/50">
                          {type}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Duration & Urgency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Duration</label>
                    <Select
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="bg-background"
                    >
                      {durations.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Urgency</label>
                    <Select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      className="bg-background"
                    >
                      {urgencies.map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Preview */}
            {currentStep === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold mb-2">{formData.title}</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                      {formData.category}
                    </Badge>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-500 bg-blue-500/5">
                      {formData.academicLevel}
                    </Badge>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-500 bg-purple-500/5">
                      {formData.sessionType}
                    </Badge>
                    <Badge variant="outline" className="border-red-500/30 text-red-500 bg-red-500/5">
                      {formData.urgency}
                    </Badge>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Description</h3>
                    <p className="text-foreground/90 whitespace-pre-line leading-relaxed text-sm">{formData.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">Budget</span>
                      <span className="text-foreground font-bold text-lg flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-primary" />
                        {formData.minBudget} {formData.budgetType === "Hourly" && `- ${formData.maxBudget}/hr`}
                        {formData.budgetType === "Fixed" && <span className="text-sm font-normal text-muted-foreground ml-1">(Fixed)</span>}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">Duration</span>
                      <span className="text-foreground font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4 text-primary" />
                        {formData.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between p-8 pt-0 bg-transparent">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            ) : (
              <div /> // Spacer
            )}

            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                Next Step <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 shadow-lg shadow-primary/20 min-w-[140px]"
              >
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Check className="h-4 w-4" />}
                {loading ? "Posting..." : "Post Job"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
