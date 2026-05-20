"use client";
import React from "react";
import Link from "next/link";
import { GraduationCap, Globe, Users, Handshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { usePlatformContent } from "@/lib/usePlatformContent";

export default function AboutPage() {
  const { content } = usePlatformContent(["page.about"]);
  const about = content["page.about"] || {};
  const teamMembers = about.teamMembers || [];
  const iconComponents = [GraduationCap, Users, Globe, Handshake];
  const stats = (about.stats || []).map((stat, index) => ({
    ...stat,
    icon: React.createElement(iconComponents[index] || GraduationCap, { className: "w-8 h-8" }),
  }));

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10 animate-in fade-in zoom-in duration-700">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-heading tracking-tight">
            {about.hero?.title || "Building trust in university tutoring"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            {about.hero?.description}
          </p>
          <div className="flex justify-center gap-4">
            <Link href={about.hero?.ctaHref || "/signup"}>
              <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20 text-lg h-14 gap-2">
                {about.hero?.ctaLabel || "Join Our Mission"} <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-in slide-in-from-left-8 duration-700">
            <h2 className="text-3xl font-bold mb-6 text-primary font-heading">Our Story</h2>
            {(about.story?.paragraphs || []).map((paragraph) => (
              <p key={paragraph} className="text-muted-foreground mb-4 leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="relative animate-in slide-in-from-right-8 duration-700 delay-200">
            <div className="absolute -inset-4 bg-primary/20 rounded-2xl blur-xl"></div>
            <img
              src={about.story?.image}
              alt="Team working together"
              className="relative rounded-2xl shadow-2xl border border-border"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:border-primary/50 transition-colors group">
                <CardContent className="p-6">
                  <div className="text-primary mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2 font-heading">{stat.value}</div>
                  <div className="text-muted-foreground text-sm uppercase tracking-wider font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 font-heading">Meet The Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="hover:border-primary/30 transition-all group overflow-hidden">
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-primary rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover relative border-2 border-border group-hover:border-primary transition-colors duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1 font-heading">{member.name}</h3>
                  <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* University Partnerships */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground uppercase tracking-widest text-sm font-semibold mb-8">Trusted by students from</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {(about.universityPartners || []).map((item) => (
              <div key={item} className="text-2xl font-serif font-bold text-foreground">{item}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-primary/10 border-t border-primary/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-foreground font-heading">{about.cta?.title}</h2>
          <p className="text-xl text-muted-foreground mb-10">
            {about.cta?.description}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={about.cta?.studentHref || "/signup?role=student"}>
              <Button variant="secondary" size="lg" className="rounded-full px-8 text-lg h-14 shadow-lg">
                {about.cta?.studentLabel || "Start Learning"}
              </Button>
            </Link>
            <Link href={about.cta?.tutorHref || "/signup?role=tutor"}>
              <Button size="lg" className="rounded-full px-8 text-lg h-14 shadow-lg shadow-primary/20">
                {about.cta?.tutorLabel || "Become a Tutor"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
