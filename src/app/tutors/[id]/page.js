"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Star, GraduationCap, MapPin, CheckCircle, BookOpen, MessageSquare, 
  Calendar, Globe, Briefcase, Clock, Video, ArrowLeft, Loader2, Award 
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export default function TutorProfilePage() {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await fetch(`/api/tutors/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTutor(data);
        }
      } catch (error) {
        console.error("Error fetching tutor:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTutor();
  }, [id]);

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

  if (!tutor) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold font-heading mb-4">Tutor Not Found</h1>
            <Button asChild variant="link" className="text-primary text-lg">
              <Link href="/tutors">Browse All Tutors</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { user, stats, subjects, hourlyRate, reviews, portfolio, education, certifications, availability, sessionType } = tutor;
  const memberSinceDate = user?.createdAt ? new Date(user.createdAt) : null;
  const memberSince = memberSinceDate && !Number.isNaN(memberSinceDate.getTime()) ? format(memberSinceDate, "MMM yyyy") : "recently";
  const majorText = user?.major ? `${user.major} • ` : "";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-12 md:py-20">
        <Button variant="ghost" asChild className="mb-8 pl-0 hover:pl-2 transition-all gap-2 text-muted-foreground hover:text-foreground">
          <Link href="/tutors">
            <ArrowLeft size={16} /> Back to Tutors
          </Link>
        </Button>

        {/* Profile Header */}
        <Card className="border-border mb-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 to-blue-900/20 opacity-50 -z-10" />
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mt-12 md:mt-0">
              <div className="relative -mt-16 md:mt-0">
                <Avatar 
                  src={user.avatar} 
                  alt={user.name}
                  fallback={user.name?.charAt(0)}
                  className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-xl text-4xl"
                />
                <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground p-1.5 rounded-full border-4 border-background">
                  <CheckCircle size={20} />
                </div>
              </div>

              <div className="flex-grow text-center md:text-left w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">{user.name}</h1>
                    <p className="text-xl text-primary font-medium flex items-center justify-center md:justify-start gap-2">
                      <GraduationCap size={20} /> {user.university}
                    </p>
                    <p className="text-muted-foreground text-sm mt-1">{majorText}Member since {memberSince}</p>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 justify-center md:justify-end flex-wrap">
                    {tutor.badges?.map((badge, i) => (
                      <Badge key={i} variant="outline" className="text-yellow-500 border-yellow-500/50 bg-yellow-500/10 uppercase tracking-wider text-xs py-1">
                        <Award size={12} className="mr-1" /> {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-muted-foreground text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-primary" size={16} />
                    <span>{user.location?.city || "Remote"}, {user.location?.country || ""}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${user.isOnline ? "bg-green-500" : "bg-muted"}`} />
                    <span>{user.isOnline ? "Online Now" : "Offline"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="text-foreground font-bold">{stats.rating.toFixed(1)}</span>
                    <span>({stats.totalSessions} sessions)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="text-blue-400" size={16} />
                    <span>{user.languages?.join(", ") || "English"}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                   <Button size="lg" className="shadow-lg shadow-primary/20">Book a Session</Button>
                   <Button variant="outline" size="lg">Message</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="overview" className="gap-2"><BookOpen size={16} className="hidden sm:inline" /> Overview</TabsTrigger>
                <TabsTrigger value="portfolio" className="gap-2"><Briefcase size={16} className="hidden sm:inline" /> Portfolio</TabsTrigger>
                <TabsTrigger value="reviews" className="gap-2"><MessageSquare size={16} className="hidden sm:inline" /> Reviews</TabsTrigger>
                <TabsTrigger value="availability" className="gap-2"><Calendar size={16} className="hidden sm:inline" /> Availability</TabsTrigger>
              </TabsList>

              <Card className="min-h-[400px]">
                <CardContent className="p-8">
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-8 mt-0">
                    <div>
                      <h3 className="text-xl font-bold font-heading mb-4">About Me</h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {user.bio || "No bio provided yet."}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold font-heading mb-4">Subjects</h3>
                      <div className="flex flex-wrap gap-2">
                        {subjects.map((sub, i) => (
                          <Badge key={i} variant="secondary" className="px-3 py-1 text-sm font-normal">
                            {sub.name} <span className="text-muted-foreground ml-1 text-xs">• {sub.difficulty}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {education?.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold font-heading mb-4">Education</h3>
                        <div className="space-y-6">
                          {education.map((edu, i) => (
                            <div key={i} className="flex gap-4">
                              <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary h-fit">
                                <GraduationCap size={20} />
                              </div>
                              <div>
                                <h4 className="font-bold text-foreground">{edu.institution}</h4>
                                <p className="text-muted-foreground text-sm">{edu.degree} in {edu.field}</p>
                                <p className="text-muted-foreground text-xs mt-1">
                                  {edu.startDate ? new Date(edu.startDate).getFullYear() : ""} - {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Other tabs can be implemented similarly with TabsContent */}
                  <TabsContent value="portfolio" className="mt-0">
                    <p className="text-muted-foreground">Portfolio content coming soon...</p>
                  </TabsContent>
                   <TabsContent value="reviews" className="mt-0">
                    <p className="text-muted-foreground">Reviews content coming soon...</p>
                  </TabsContent>
                   <TabsContent value="availability" className="mt-0">
                    <p className="text-muted-foreground">Availability calendar coming soon...</p>
                  </TabsContent>

                </CardContent>
              </Card>
            </Tabs>
          </div>
          
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Hourly Rate</h3>
                    <span className="text-2xl font-bold text-primary">${hourlyRate}<span className="text-sm text-muted-foreground font-normal">/hr</span></span>
                 </div>
                 
                 <div className="space-y-4">
                    <Button className="w-full text-lg font-bold py-6 shadow-lg shadow-primary/20">Book a Session</Button>
                    <Button variant="outline" className="w-full">Contact Tutor</Button>
                 </div>
                 
                 <div className="mt-6 pt-6 border-t border-border space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                       <Clock size={16} />
                       <span>Response time: &lt; 2 hours</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                       <Video size={16} />
                       <span>Video calls via Zoom/Meet</span>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
