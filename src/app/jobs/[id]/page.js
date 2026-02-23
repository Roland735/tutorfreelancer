"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  MapPin, DollarSign, Clock, Tag, Monitor, GraduationCap, ArrowLeft,
  CheckCircle, Loader2, Star, Briefcase, Calendar, X, Share2
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Avatar } from "@/components/ui/Avatar";

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Application State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    bidAmount: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data);
          // Set initial bid amount to min budget
          if (data.budget?.min) {
            setApplicationData(prev => ({ ...prev, bidAmount: data.budget.min }));
          }
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      router.push(`/login?redirect=/jobs/${id}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/jobs/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });

      if (res.ok) {
        setShowApplyModal(false);
        // Refresh job data to show applied status
        const jobRes = await fetch(`/api/jobs/${id}`);
        if (jobRes.ok) {
          setJob(await jobRes.json());
        }
        alert("Application submitted successfully!");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    const shareText = `
👋 *Contact for:* ${job.title}
🔢 *CODE:* ${job.subjectCode || "N/A"}
🆔 *Listing ID:* ${job._id}
📍 *Location:* ${job.sessionType}
💰 *Price:* $${job.budget?.min} - $${job.budget?.max} (${job.budget?.type})
👤 *Contact:* ${job.postedBy?.name || "Hidden"}

📝 *Description:*
${job.description?.substring(0, 150)}...

✨ *Features:*
• ${job.academicLevel}
• ${job.urgency} Urgency
• ${job.duration}

🔗 *Link:* ${window.location.href}
    `.trim();

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="animate-spin text-4xl text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold font-heading mb-4">Job Not Found</h1>
            <Button asChild variant="link" className="text-primary text-lg">
              <Link href="/jobs">Browse All Jobs</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isRemote = job.sessionType === "Online";
  const hasApplied = session?.user && job.applicants?.some(app => app.user._id === session.user.id || app.user === session.user.id);
  const isOwner = session?.user?.id === job.postedBy?._id;
  const isTutor = session?.user?.role === 'tutor' || session?.user?.role === 'both';

  return (
    <div className="min-h-screen bg-background text-foreground relative font-sans">
      <Navbar />

      {/* Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="max-w-lg w-full relative border-border shadow-2xl">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 rounded-full"
            >
              <X size={20} />
            </Button>

            <CardHeader>
              <CardTitle className="text-2xl font-heading">Apply for this Job</CardTitle>
              <CardDescription>Submit your proposal to the student.</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleApplySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Your Bid Amount ($)</label>
                  <Input
                    type="number"
                    required
                    min="1"
                    value={applicationData.bidAmount}
                    onChange={(e) => setApplicationData({ ...applicationData, bidAmount: e.target.value })}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Client's Budget: ${job.budget?.min} - ${job.budget?.max}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Cover Letter</label>
                  <Textarea
                    required
                    rows={6}
                    placeholder="Introduce yourself and explain why you're a good fit..."
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                    className="w-full resize-none"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowApplyModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      "Submit Proposal"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto px-4 py-12 md:py-20">
        <Button variant="ghost" asChild className="mb-8 pl-0 hover:pl-2 transition-all gap-2 text-muted-foreground hover:text-foreground">
          <Link href="/jobs">
            <ArrowLeft size={16} /> Back to Jobs
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <Badge variant="secondary" className="mb-3 text-primary border-primary/20 bg-primary/10">
                      {job.category}
                    </Badge>
                    {job.subjectCode && (
                      <Badge variant="outline" className="mb-3 ml-2 border-emerald-500/20 text-emerald-600 bg-emerald-500/5">
                        {job.subjectCode}
                      </Badge>
                    )}
                    <h1 className="text-3xl font-bold font-heading mb-2">{job.title}</h1>
                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                      Posted {job.createdAt ? formatDistanceToNow(new Date(job.createdAt)) : "recently"} ago
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                      {job.applicants?.length || 0} applicants
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" size="lg" onClick={handleShare} className="gap-2">
                      <Share2 size={18} /> Share
                    </Button>
                    {isTutor && !isOwner && !hasApplied && (
                      <Button
                        size="lg"
                        onClick={() => setShowApplyModal(true)}
                        className="shadow-lg shadow-primary/20"
                      >
                        Apply Now
                      </Button>
                    )}
                    {hasApplied && (
                      <Button size="lg" disabled variant="secondary" className="gap-2">
                        <CheckCircle size={18} /> Applied
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 py-6 border-y border-border mb-8">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="text-primary" size={18} />
                    <span className="font-medium text-foreground">${job.budget?.min} - ${job.budget?.max}</span>
                    <span className="text-xs">/{job.budget?.type || "hr"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Monitor className="text-blue-400" size={18} />
                    <span>{job.sessionType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="text-orange-400" size={18} />
                    <span>{job.duration || "1-3 months"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="text-purple-400" size={18} />
                    <span>{job.academicLevel}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold font-heading mb-3">Description</h3>
                    <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                      {job.description}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-heading mb-3">Specific Subject</h3>
                    <div className="flex items-center gap-2">
                      <Tag className="text-muted-foreground" size={16} />
                      <span>{job.subject || job.category}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About the Student</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar
                    src={job.postedBy?.image}
                    alt={job.postedBy?.name}
                    fallback={job.postedBy?.name?.charAt(0) || "U"}
                    className="h-12 w-12"
                  />
                  <div>
                    <h4 className="font-bold">{job.postedBy?.name || "Anonymous User"}</h4>
                    <p className="text-sm text-muted-foreground">
                      Member since {job.postedBy?.createdAt ? format(new Date(job.postedBy.createdAt), 'MMM yyyy') : "2024"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{job.postedBy?.location?.country || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Jobs Posted</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Hire Rate</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Verified Payment</span>
                    <span className="text-primary flex items-center gap-1"><CheckCircle size={14} /> Yes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <CheckCircle className="text-primary" size={20} /> Safety Tips
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>Keep all communications within the platform.</li>
                  <li>Do not share personal contact info before a contract starts.</li>
                  <li>Report any suspicious activity immediately.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
