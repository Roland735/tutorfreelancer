"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowLeft, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { usePlatformContent } from "@/lib/usePlatformContent";

export default function PostJobPage() {
  const router = useRouter();
  const { content } = usePlatformContent(["lookups.marketplace", "page.jobPosting"]);
  const lookups = content["lookups.marketplace"] || {};
  const pageContent = content["page.jobPosting"] || {};
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subject: "",
    academicLevel: "Undergraduate",
    budgetType: "Hourly",
    minBudget: "",
    maxBudget: "",
    sessionType: "Online",
    duration: "",
    urgency: "Medium",
  });

  const categories = lookups.jobCategories || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        budget: {
          type: formData.budgetType,
          min: Number(formData.minBudget),
          max: formData.maxBudget ? Number(formData.maxBudget) : undefined,
        }
      };

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to post job");
      }
    } catch (error) {
      console.error("Error posting job:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6 pl-0 hover:pl-2 transition-all gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Button>

        <Card className="border-border shadow-xl">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-3xl font-heading">{pageContent.title || "Post a New Job"}</CardTitle>
            <CardDescription>{pageContent.description || "Tell us what you need help with."}</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Job Title</label>
                <Input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Need help with Calculus II Integration"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              {/* Category & Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <Select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Specific Subject</label>
                  <Input
                    type="text"
                    name="subject"
                    required
                    placeholder="e.g. Linear Algebra"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <Textarea
                  name="description"
                  required
                  rows={5}
                  placeholder="Describe your requirements in detail..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full resize-y"
                />
              </div>

              {/* Budget */}
              <div className="bg-muted/30 p-6 rounded-xl border border-border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 font-heading">
                  <DollarSign className="text-primary" size={20} /> Budget & Payment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Type</label>
                    <Select
                      name="budgetType"
                      value={formData.budgetType}
                      onChange={handleChange}
                      className="w-full"
                    >
                      <option value="Hourly">Hourly Rate</option>
                      <option value="Fixed">Fixed Price</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Min ($)</label>
                    <Input
                      type="number"
                      name="minBudget"
                      required
                      value={formData.minBudget}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Max ($)</label>
                    <Input
                      type="number"
                      name="maxBudget"
                      value={formData.maxBudget}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Session Type</label>
                  <div className="flex gap-4 pt-2">
                    {['Online', 'In-Person', 'Both'].map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="sessionType"
                          value={type}
                          checked={formData.sessionType === type}
                          onChange={handleChange}
                          className="accent-primary h-4 w-4"
                        />
                        <span className="text-sm group-hover:text-primary transition">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-foreground mb-2">Urgency</label>
                    <Select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      className="w-full"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </Select>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  size="lg"
                  className="w-full font-bold text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...
                    </>
                  ) : (
                    "Post Job Now"
                  )}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
