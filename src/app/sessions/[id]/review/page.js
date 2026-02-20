"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Star, Quote, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function ReviewPage({ params }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock session data
  const session = {
    id: params.id,
    subject: "Advanced Calculus II",
    tutorName: "Dr. Sarah Mitchell",
    tutorAvatar: "https://i.pravatar.cc/150?u=sarah",
    date: "October 24, 2023",
    time: "2:00 PM - 3:30 PM",
    duration: "1.5 hours",
  };

  const qualityTags = [
    "Patient",
    "Punctual",
    "Knowledgeable",
    "Good Listener",
    "Well Prepared",
    "Clear Explanations",
    "Fun & Engaging",
    "Tech Savvy",
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmSubmit = () => {
    // API call would go here
    console.log({
      sessionId: session.id,
      rating,
      comment,
      tags: selectedTags,
    });
    setSubmitted(true);
    setShowConfirmation(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 px-4 flex items-center justify-center font-sans">
        <Card className="max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-500">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Review Submitted!</h2>
            <p className="text-muted-foreground mb-8">
              Thank you for your feedback. Your review helps us maintain a high-quality community.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard/student" className="w-full">
                <Button className="w-full">Return to Dashboard</Button>
              </Link>
              <Link href={`/tutors`} className="w-full">
                <Button variant="outline" className="w-full">Find Another Tutor</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center font-heading">Rate Your Session</h1>

        {/* Session Summary Card */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <img
              src={session.tutorAvatar}
              alt={session.tutorName}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/50"
            />
            <div>
              <h3 className="text-xl font-bold text-foreground font-heading">{session.subject}</h3>
              <p className="text-muted-foreground">
                with <span className="text-primary font-medium">{session.tutorName}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {session.date} • {session.time} ({session.duration})
              </p>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Star Rating */}
          <Card>
            <CardContent className="p-8 text-center">
              <label className="block text-foreground font-medium mb-4 text-lg">
                How would you rate this session?
              </label>
              <div className="flex justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="text-4xl transition-transform hover:scale-110 focus:outline-none"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={cn(
                        "w-10 h-10 transition-colors duration-200",
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400 drop-shadow-md"
                          : "fill-transparent text-muted-foreground"
                      )}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-primary font-medium h-5 transition-all duration-300">
                {rating === 5 && "Excellent!"}
                {rating === 4 && "Very Good"}
                {rating === 3 && "Good"}
                {rating === 2 && "Fair"}
                {rating === 1 && "Poor"}
              </p>
            </CardContent>
          </Card>

          {/* Quality Tags */}
          <Card>
            <CardContent className="p-8">
              <label className="block text-foreground font-medium mb-4 text-lg">
                What went well? (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-3">
                {qualityTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                      selectedTags.includes(tag)
                        ? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                        : "bg-muted border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comment */}
          <Card>
            <CardContent className="p-8">
              <label className="block text-foreground font-medium mb-4 text-lg">
                Share your experience (Optional)
              </label>
              <div className="relative">
                <Quote className="absolute top-4 left-4 text-muted-foreground/50 w-5 h-5" />
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us more about the session..."
                  className="pl-12 min-h-[120px] text-base"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/dashboard/student">
              <Button variant="ghost" className="px-6">Skip</Button>
            </Link>
            <Button
              type="submit"
              disabled={rating === 0}
              className="px-8 shadow-lg shadow-primary/20"
            >
              Submit Review
            </Button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4 text-foreground">
                <AlertCircle className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold font-heading">Submit Review?</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to submit this review? You won't be able to edit it later.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowConfirmation(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 shadow-lg shadow-primary/20" onClick={confirmSubmit}>
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
