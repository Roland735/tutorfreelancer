"use client";
import React from "react";
import Link from "next/link";
import { GraduationCap, Globe, Users, Handshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Co-Founder & CEO",
      image: "https://i.pravatar.cc/150?u=alex",
      bio: "Former educator passionate about democratizing access to quality education.",
    },
    {
      name: "Maria Rodriguez",
      role: "CTO",
      image: "https://i.pravatar.cc/150?u=maria",
      bio: "Tech veteran with a background in ed-tech startups and AI.",
    },
    {
      name: "David Kim",
      role: "Head of Community",
      image: "https://i.pravatar.cc/150?u=david",
      bio: "Community builder focused on creating safe and engaging learning environments.",
    },
    {
      name: "Sarah Jenkins",
      role: "Lead Designer",
      image: "https://i.pravatar.cc/150?u=sarahj",
      bio: "UX expert dedicated to making learning intuitive and accessible for everyone.",
    },
  ];

  const stats = [
    { label: "Active Tutors", value: "5,000+", icon: <GraduationCap className="w-8 h-8" /> },
    { label: "Students Helped", value: "50,000+", icon: <Users className="w-8 h-8" /> },
    { label: "Countries", value: "120+", icon: <Globe className="w-8 h-8" /> },
    { label: "Sessions Completed", value: "250k+", icon: <Handshake className="w-8 h-8" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10 animate-in fade-in zoom-in duration-700">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-heading tracking-tight">
            Empowering <span className="text-primary">Global Learning</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            We're on a mission to connect curious minds with expert tutors, creating a world where quality education is accessible to everyone, everywhere.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20 text-lg h-14 gap-2">
                Join Our Mission <ArrowRight className="w-5 h-5" />
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
            <p className="text-muted-foreground mb-4 leading-relaxed text-lg">
              TutorFreelancer started in a university dorm room in 2023. We realized that while talent is universal, opportunity is not. Students were struggling to find help, and talented tutors were struggling to find students.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              What began as a simple bulletin board for campus tutoring has grown into a global community. We believe that peer-to-peer learning is the most effective way to master new skills, and we're building the infrastructure to make it happen seamlessly.
            </p>
          </div>
          <div className="relative animate-in slide-in-from-right-8 duration-700 delay-200">
            <div className="absolute -inset-4 bg-primary/20 rounded-2xl blur-xl"></div>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
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
            <div className="text-2xl font-serif font-bold text-foreground">Harvard</div>
            <div className="text-2xl font-serif font-bold text-foreground">Stanford</div>
            <div className="text-2xl font-serif font-bold text-foreground">MIT</div>
            <div className="text-2xl font-serif font-bold text-foreground">Oxford</div>
            <div className="text-2xl font-serif font-bold text-foreground">Cambridge</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-primary/10 border-t border-primary/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-foreground font-heading">Ready to join the future of learning?</h2>
          <p className="text-xl text-muted-foreground mb-10">
            Whether you want to learn something new or share your expertise, there's a place for you here.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup?role=student">
              <Button variant="secondary" size="lg" className="rounded-full px-8 text-lg h-14 shadow-lg">
                Start Learning
              </Button>
            </Link>
            <Link href="/signup?role=tutor">
              <Button size="lg" className="rounded-full px-8 text-lg h-14 shadow-lg shadow-primary/20">
                Become a Tutor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
