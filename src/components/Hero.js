"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function Hero({ stats }) {
  const [placeholder, setPlaceholder] = useState("Calculus");
  const subjects = ["Calculus", "Python", "Physics", "Essay Writing", "Spanish", "Statistics"];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % subjects.length;
      setPlaceholder(subjects[i]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background -z-20" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl -z-10 rounded-full transform translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-emerald-500/5 blur-3xl -z-10 rounded-full transform -translate-x-1/4 translate-y-1/4" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-6 leading-tight font-heading">
            Master Any Subject with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
              Expert Student Tutors
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Connect with top-performing students from leading universities who've been in your shoes. Affordable, relatable, and effective peer learning.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <div className="relative bg-card border border-border rounded-full flex items-center p-2 shadow-2xl">
              <Search className="text-muted-foreground ml-4 w-5 h-5" />
              <input
                type="text"
                placeholder={`Try searching for "${placeholder}"...`}
                className="w-full bg-transparent border-none focus:ring-0 text-foreground placeholder-muted-foreground px-4 text-lg outline-none"
              />
              <Button size="lg" className="rounded-full px-8">
                Search
              </Button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="xl" className="rounded-full shadow-lg shadow-primary/10 text-lg font-bold px-8 py-6 h-auto">
              <Link href="/tutors">Find a Tutor</Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="rounded-full border-2 text-lg font-bold px-8 py-6 h-auto hover:bg-primary/5">
              <Link href="/jobs/post">Post a Job for Free</Link>
            </Button>
          </div>

          {/* Live Trust Stats (Beneath Buttons) */}
          {stats && (
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-muted-foreground">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-foreground">{stats.tutors}+</span>
                <span className="text-xs uppercase tracking-wide">Tutors Registered</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-foreground">{stats.sessions}+</span>
                <span className="text-xs uppercase tracking-wide">Sessions Completed</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-foreground">{stats.subjects}+</span>
                <span className="text-xs uppercase tracking-wide">Subjects Offered</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-foreground">{stats.avgRating?.toFixed(1) || "5.0"}</span>
                <span className="text-xs uppercase tracking-wide">Average Rating</span>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </section>
  );
}
